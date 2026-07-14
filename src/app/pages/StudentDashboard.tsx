import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  FileText, Upload, CheckCircle, Download, Clock, 
  BarChart, Calendar, Settings, Bell, LayoutDashboard,
  LogOut, ChevronRight, CheckCircle2, User, BookOpen
} from "lucide-react";
import { getQuestionPapers, getSubmissionsByStudent, saveAnswerSheet } from "@/app/utils/storage";
import { QuestionPaper, AnswerSheet } from "@/app/utils/storage";
import DashboardHeader from "@/app/components/DashboardHeader";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { motion, AnimatePresence } from "motion/react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [mySubmissions, setMySubmissions] = useState<AnswerSheet[]>([]);
  
  const [selectedPaper, setSelectedPaper] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const type = localStorage.getItem("userType");
    const uname = localStorage.getItem("username");
    const name = localStorage.getItem("fullName");

    if (type !== "student" || !uname) {
      navigate("/student-login");
      return;
    }

    setUsername(uname);
    setFullName(name || uname);
    
    loadData(uname);
  }, [navigate]);

  const loadData = (studentUsername: string) => {
    const papers = getQuestionPapers();
    const sortedPapers = papers.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    setQuestionPapers(sortedPapers);
    
    const submissions = getSubmissionsByStudent(studentUsername);
    setMySubmissions(submissions.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaper || !file) {
      setMessage({ text: "Please select a question paper and file", type: "error" });
      return;
    }

    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const paper = questionPapers.find(p => p.id === selectedPaper);
        
        if (!paper) throw new Error("Paper not found");

        await new Promise(resolve => setTimeout(resolve, 800));

        const newSubmission: AnswerSheet = {
          id: `ans_${Date.now()}`,
          questionPaperId: paper.id,
          questionPaperTitle: paper.title,
          submittedBy: username,
          fileName: file.name,
          fileData: base64String,
          submissionDate: new Date().toLocaleString()
        };

        saveAnswerSheet(newSubmission);
        
        setMessage({ text: "Answer sheet submitted successfully!", type: "success" });
        setFile(null);
        setSelectedPaper("");
        
        loadData(username);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage({ text: "Failed to submit answer sheet. Please try again.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (paper: QuestionPaper) => {
    const link = document.createElement("a");
    link.href = paper.fileData;
    link.download = paper.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isSubmitted = (paperId: string) => {
    return mySubmissions.some(sub => sub.questionPaperId === paperId);
  };

  const pendingAssignments = questionPapers.filter(p => !isSubmitted(p.id));
  const completedAssignments = mySubmissions.length;

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'papers', icon: FileText, label: 'Assignments', badge: pendingAssignments.length },
    { id: 'submit', icon: Upload, label: 'Upload Work' },
    { id: 'submissions', icon: CheckCircle2, label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-white/10 flex flex-col justify-between sticky top-0 h-auto md:h-screen z-40 transition-colors shadow-2xl shadow-indigo-500/5 dark:shadow-none">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">FearOff</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Menu</p>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                      activeTab === item.id 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        activeTab === item.id 
                          ? 'bg-indigo-200/50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' 
                          : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Student</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader 
          title="Student Portal" 
          userName={fullName} 
          userType="Student" 
          onLogout={handleLogout} 
        />

        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-2xl border text-sm font-medium backdrop-blur-md shadow-sm flex items-center gap-3 ${
                  message.type === 'success' 
                  ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
                  : 'bg-red-50/80 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400'
                }`}
              >
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                {message.text}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {fullName.split(' ')[0]}</h2>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your courses today.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{pendingAssignments.length}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Pending Assignments</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{completedAssignments}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Completed Tasks</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl">
                      <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-4">
                        <CardTitle className="text-lg font-bold">Recent Assignments</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {questionPapers.slice(0, 4).map((paper, idx) => (
                          <div key={paper.id} className={`p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${idx !== 0 ? 'border-t border-slate-100 dark:border-white/5' : ''}`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSubmitted(paper.id) ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'}`}>
                                {isSubmitted(paper.id) ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{paper.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{paper.subject} • Due in 2 days</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setActiveTab('papers') }} className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                              View
                            </Button>
                          </div>
                        ))}
                        {questionPapers.length === 0 && (
                          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No assignments available yet.</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === 'papers' && (
                <motion.div
                  key="papers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Download and view your assigned coursework.</p>
                  </div>
                  
                  {questionPapers.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 backdrop-blur-sm">
                      <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Assignments Yet</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-2">When teachers upload question papers, they will appear here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {questionPapers.map((paper) => {
                        const submitted = isSubmitted(paper.id);
                        return (
                          <Card key={paper.id} className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl flex flex-col overflow-hidden group">
                            <div className={`h-2 w-full ${submitted ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                            <CardHeader className="pb-4">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant={submitted ? "secondary" : "default"} className={`${submitted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'} border-none font-semibold px-2.5 py-0.5 rounded-lg`}>
                                  {paper.subject}
                                </Badge>
                                {submitted && (
                                  <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Done
                                  </span>
                                )}
                              </div>
                              <CardTitle className="text-xl font-bold leading-tight line-clamp-2 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{paper.title}</CardTitle>
                              <CardDescription className="text-sm mt-2 line-clamp-2 dark:text-slate-400">{paper.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="py-0 flex-1">
                              <div className="space-y-3 my-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 dark:text-slate-400 font-medium">Uploaded</span>
                                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{paper.uploadDate.split(',')[0]}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-500 dark:text-slate-400 font-medium">File</span>
                                  <span className="text-slate-700 dark:text-slate-300 font-mono text-xs truncate max-w-[120px] bg-white dark:bg-black/20 px-2 py-1 rounded border border-slate-200 dark:border-white/10">{paper.fileName}</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-4 pb-6 px-6">
                              <Button 
                                onClick={() => handleDownload(paper)}
                                className={`w-full h-12 rounded-xl font-medium shadow-md transition-all ${
                                  submitted 
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white shadow-none' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:shadow-lg hover:-translate-y-0.5'
                                }`}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Paper
                              </Button>
                            </CardFooter>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'submit' && (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border-slate-200/60 dark:border-white/10 shadow-2xl dark:shadow-none rounded-3xl max-w-2xl mx-auto overflow-hidden">
                    <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
                    <CardHeader className="pt-8 px-8">
                      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm">
                        <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <CardTitle className="text-2xl font-bold dark:text-white">Submit Work</CardTitle>
                      <CardDescription className="text-base dark:text-slate-400">Upload your completed answers for a specific assignment.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                      <form onSubmit={handleUploadAnswer} className="space-y-8">
                        <div className="space-y-3">
                          <Label htmlFor="question-paper" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Select Assignment</Label>
                          <Select value={selectedPaper} onValueChange={setSelectedPaper}>
                            <SelectTrigger id="question-paper" className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 dark:text-white focus:ring-indigo-500 transition-all text-base shadow-sm">
                              <SelectValue placeholder="-- Select Question Paper --" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border-slate-200 dark:border-white/10 rounded-2xl shadow-xl">
                              {questionPapers.map((paper) => (
                                <SelectItem key={paper.id} value={paper.id} disabled={isSubmitted(paper.id)} className="rounded-xl py-3 cursor-pointer dark:focus:bg-white/10">
                                  <span className="font-medium">{paper.title}</span> <span className="text-slate-500 mx-2">•</span> <span className="text-slate-500 text-xs bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">{paper.subject}</span>
                                  {isSubmitted(paper.id) && <span className="ml-2 text-emerald-500 text-xs font-bold">(Submitted)</span>}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="answer-upload" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Upload Document</Label>
                          <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 text-center group cursor-pointer ${
                            file ? 'border-indigo-400 bg-indigo-50/50 dark:border-indigo-500/50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-indigo-300 dark:hover:border-white/30 bg-white/50 dark:bg-transparent'
                          }`}>
                            <Input
                              type="file"
                              id="answer-upload"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {file ? (
                              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-1">{file.name}</p>
                                <p className="text-sm text-indigo-500/80 dark:text-indigo-400/80">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </motion.div>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4 group-hover:text-indigo-500 transition-colors group-hover:-translate-y-1 duration-300" />
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                  Drag & drop or click to browse
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Supports PDF, DOC, DOCX up to 5MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={uploading || !selectedPaper || !file} 
                          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 h-14 text-lg rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:-translate-y-0.5 text-white font-medium"
                        >
                          {uploading ? (
                            <span className="flex items-center gap-3">
                              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Uploading Securely...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Upload className="w-5 h-5" />
                              Submit Assignment
                            </span>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'submissions' && (
                <motion.div
                  key="submissions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Completed Work</h2>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Review the assignments you have already submitted.</p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 bg-white dark:bg-white/10 rounded-lg text-sm border-slate-200 dark:border-white/10 shadow-sm hidden sm:inline-flex">
                      Total: {mySubmissions.length}
                    </Badge>
                  </div>
                  
                  {mySubmissions.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 backdrop-blur-sm">
                      <CheckCircle2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Submissions Yet</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-2">Complete assignments to see them here.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {mySubmissions.map((sheet, index) => (
                        <motion.div 
                          key={sheet.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl hover:shadow-lg transition-all shadow-sm gap-4 group"
                        >
                          <div className="flex items-center gap-5 overflow-hidden w-full">
                            <div className="bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-500/20 shrink-0 group-hover:scale-110 transition-transform">
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1">{sheet.questionPaperTitle}</h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md"><Clock className="w-3.5 h-3.5" /> {sheet.submissionDate}</span>
                                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md font-mono text-xs truncate max-w-[200px]"><FileText className="w-3.5 h-3.5" /> {sheet.fileName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-white/5 mt-2 sm:mt-0">
                            {sheet.status === 'evaluated' ? (
                              <div className="flex flex-col items-end gap-1">
                                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none px-3 py-1 text-xs font-bold rounded-lg shadow-sm">
                                  SCORED: {sheet.marks}
                                </Badge>
                                {sheet.feedback && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate" title={sheet.feedback}>
                                    {sheet.feedback}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-none px-3 py-1 text-xs font-bold rounded-lg shadow-sm">
                                EVALUATION PENDING
                              </Badge>
                            )}
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl">
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
