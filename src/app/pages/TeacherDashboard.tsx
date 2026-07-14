import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  FileText, Upload, Users, LogOut, LayoutDashboard, CheckCircle, CheckCircle2, Settings,
  BarChart, Download, Eye, Plus, Search, Filter, BookOpen, GraduationCap, Clock
} from "lucide-react";
import { getQuestionPapersByTeacher, saveQuestionPaper, getAnswerSheets, updateAnswerSheet } from "@/app/utils/storage";
import { QuestionPaper, AnswerSheet } from "@/app/utils/storage";
import DashboardHeader from "@/app/components/DashboardHeader";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { Textarea } from "@/app/components/ui/textarea";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [submissions, setSubmissions] = useState<AnswerSheet[]>([]);
  
  const [newPaper, setNewPaper] = useState({ title: "", description: "", subject: "" });
  const [file, setFile] = useState<File | null>(null);
  
  const [selectedSubmission, setSelectedSubmission] = useState<AnswerSheet | null>(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  useEffect(() => {
    const type = localStorage.getItem("userType");
    const uname = localStorage.getItem("username");
    const name = localStorage.getItem("fullName");

    if (type !== "teacher" || !uname) {
      navigate("/teacher-login");
      return;
    }

    setUsername(uname);
    setFullName(name || uname);
    loadData(uname);
  }, [navigate]);

  const loadData = (teacherUsername: string) => {
    const papers = getQuestionPapersByTeacher(teacherUsername);
    const sortedPapers = papers.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    setQuestionPapers(sortedPapers);
    
    const paperIds = papers.map(p => p.id);
    const allSubmissions = getAnswerSheets();
    const mySubmissions = allSubmissions.filter(s => paperIds.includes(s.questionPaperId));
    setSubmissions(mySubmissions.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
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

  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaper.title || !newPaper.subject || !file) {
      setMessage({ text: "Please fill all required fields and select a file", type: "error" });
      return;
    }
    setUploading(true);
    setMessage({ text: "", type: "" });

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await new Promise(resolve => setTimeout(resolve, 800));
        const paper: QuestionPaper = {
          id: `qp_${Date.now()}`,
          title: newPaper.title,
          description: newPaper.description,
          subject: newPaper.subject,
          uploadedBy: username,
          uploadDate: new Date().toLocaleString(),
          fileName: file.name,
          fileData: base64String
        };
        saveQuestionPaper(paper);
        setMessage({ text: "Question paper uploaded successfully!", type: "success" });
        setNewPaper({ title: "", description: "", subject: "" });
        setFile(null);
        loadData(username);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage({ text: "Failed to upload question paper.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleEvaluate = (submission: AnswerSheet) => {
    setSelectedSubmission(submission);
    setMarks(submission.marks?.toString() || "");
    setFeedback(submission.feedback || "");
    setIsEvaluationOpen(true);
  };

  const submitEvaluation = () => {
    if (selectedSubmission) {
      const updated = {
        ...selectedSubmission,
        status: "evaluated" as const,
        marks: Number(marks),
        feedback
      };
      updateAnswerSheet(updated);
      setIsEvaluationOpen(false);
      loadData(username);
    }
  };

  const handleDownload = (fileName: string, fileData: string) => {
    const link = document.createElement("a");
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingReviews = submissions.filter(s => s.status !== 'evaluated').length;

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'upload', icon: Plus, label: 'Create Assignment' },
    { id: 'papers', icon: FileText, label: 'My Papers', badge: questionPapers.length },
    { id: 'review', icon: CheckCircle, label: 'Review Submissions', badge: pendingReviews > 0 ? pendingReviews : undefined },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans selection:bg-violet-100 selection:text-violet-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-white/10 flex flex-col justify-between sticky top-0 h-auto md:h-screen z-40 transition-colors shadow-2xl shadow-violet-500/5 dark:shadow-none">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="bg-violet-600 p-1.5 rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">FearOff</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Educator Tools</p>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                      activeTab === item.id 
                        ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        activeTab === item.id 
                          ? 'bg-violet-200/50 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' 
                          : item.id === 'review' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Educator</p>
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
          title="Educator Portal" 
          userName={fullName} 
          userType="Teacher" 
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
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your classes, assignments, and student performance.</p>
                    </div>
                    <Button onClick={() => setActiveTab('upload')} className="hidden sm:flex bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/25 font-medium h-10 px-4">
                      <Plus className="w-4 h-4 mr-2" /> New Assignment
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{questionPapers.length}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Assignments Created</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{submissions.length}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Total Submissions</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Clock className="w-24 h-24 text-orange-500 -mr-8 -mt-8" />
                      </div>
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{pendingReviews}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Pending Reviews</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                          Action Required: Pending Reviews
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('review')} className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {submissions.filter(s => s.status !== 'evaluated').slice(0, 5).map((sub, idx) => (
                        <div key={sub.id} className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors gap-4 ${idx !== 0 ? 'border-t border-slate-100 dark:border-white/5' : ''}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                              {sub.submittedBy.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{sub.submittedBy}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub.questionPaperTitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto pl-14 sm:pl-0">
                            <span className="text-xs text-slate-400 font-mono">{sub.submissionDate.split(',')[0]}</span>
                            <Button size="sm" onClick={() => handleEvaluate(sub)} className="bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 dark:text-orange-400 rounded-lg shadow-none">
                              Evaluate
                            </Button>
                          </div>
                        </div>
                      ))}
                      {submissions.filter(s => s.status !== 'evaluated').length === 0 && (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
                          You're all caught up! No pending reviews.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border-slate-200/60 dark:border-white/10 shadow-2xl dark:shadow-none rounded-3xl max-w-3xl mx-auto overflow-hidden">
                    <div className="h-2 w-full bg-gradient-to-r from-violet-500 to-pink-500"></div>
                    <CardHeader className="pt-8 px-8 border-b border-slate-100 dark:border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-500/20 rounded-2xl flex items-center justify-center border border-violet-200/50 dark:border-violet-500/20">
                          <Plus className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold dark:text-white">Create New Assignment</CardTitle>
                          <CardDescription className="text-base dark:text-slate-400 mt-1">Upload a question paper and set details.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <form onSubmit={handleUploadPaper} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Assignment Title</Label>
                            <Input
                              id="title"
                              value={newPaper.title}
                              onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                              placeholder="e.g. Midterm Examination 2026"
                              className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-violet-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Subject</Label>
                            <Input
                              id="subject"
                              value={newPaper.subject}
                              onChange={(e) => setNewPaper({ ...newPaper, subject: e.target.value })}
                              placeholder="e.g. Computer Science"
                              className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-violet-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Description / Instructions (Optional)</Label>
                          <Textarea
                            id="description"
                            value={newPaper.description}
                            onChange={(e) => setNewPaper({ ...newPaper, description: e.target.value })}
                            placeholder="Provide any specific instructions for the students..."
                            className="min-h-[100px] rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-violet-500 resize-y"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-slate-700 dark:text-slate-300 font-medium ml-1">Question Paper Document</Label>
                          <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 text-center group cursor-pointer ${
                            file ? 'border-violet-400 bg-violet-50/50 dark:border-violet-500/50 dark:bg-violet-500/10' : 'border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-violet-300 dark:hover:border-white/30 bg-white/50 dark:bg-transparent'
                          }`}>
                            <Input
                              type="file"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {file ? (
                              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <FileText className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                                </div>
                                <p className="text-lg font-bold text-violet-700 dark:text-violet-300 mb-1">{file.name}</p>
                                <p className="text-sm text-violet-500/80 dark:text-violet-400/80">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </motion.div>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4 group-hover:text-violet-500 transition-colors group-hover:-translate-y-1 duration-300" />
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                  Drag & drop or click to browse
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Supports PDF, DOC, DOCX up to 10MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={uploading || !file || !newPaper.title || !newPaper.subject} 
                            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 h-12 px-8 text-base rounded-xl shadow-xl shadow-violet-500/25 transition-all text-white font-medium"
                          >
                            {uploading ? "Publishing..." : "Publish Assignment"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
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
                  <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Assignments</h2>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Manage papers you've uploaded.</p>
                    </div>
                  </div>
                  
                  {questionPapers.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 backdrop-blur-sm">
                      <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Papers Uploaded</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">You haven't created any assignments yet.</p>
                      <Button onClick={() => setActiveTab('upload')} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                        Create First Assignment
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {questionPapers.map((paper) => (
                        <Card key={paper.id} className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl flex flex-col overflow-hidden group">
                          <CardHeader className="pb-4">
                            <Badge className="w-fit mb-3 bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 border-none font-semibold px-2.5 py-0.5 rounded-lg">
                              {paper.subject}
                            </Badge>
                            <CardTitle className="text-xl font-bold leading-tight line-clamp-2 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{paper.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 flex-1">
                            <div className="space-y-3 my-2 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Uploaded</span>
                                <span className="text-slate-700 dark:text-slate-300 font-semibold">{paper.uploadDate.split(',')[0]}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">File</span>
                                <span className="text-slate-700 dark:text-slate-300 font-mono text-xs truncate max-w-[120px]">{paper.fileName}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-4 pb-6 px-6">
                            <Button 
                              onClick={() => handleDownload(paper.fileName, paper.fileData)}
                              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-xl font-medium shadow-none"
                            >
                              <Download className="w-4 h-4 mr-2" /> Download Document
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Submissions</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Evaluate and grade student answer sheets.</p>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                    {submissions.length === 0 ? (
                      <div className="text-center py-20 px-4">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Submissions</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Students haven't submitted any answers yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {submissions.map((sub) => (
                          <div key={sub.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center font-bold text-lg text-slate-700 dark:text-slate-300 shadow-sm shrink-0">
                                {sub.submittedBy.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                  {sub.submittedBy}
                                  {sub.status === 'evaluated' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                </h3>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{sub.questionPaperTitle}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {sub.submissionDate.split(',')[0]}</span>
                                  <span className="flex items-center gap-1 font-mono max-w-[150px] truncate"><FileText className="w-3.5 h-3.5" /> {sub.fileName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 w-full sm:w-auto">
                              {sub.status === 'evaluated' ? (
                                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-bold px-3 py-1.5 rounded-xl shadow-sm">
                                  Scored: {sub.marks}
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-none font-bold px-3 py-1.5 rounded-xl shadow-sm">
                                  Pending
                                </Badge>
                              )}
                              <Button 
                                onClick={() => handleEvaluate(sub)} 
                                className={`${sub.status === 'evaluated' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/20'} rounded-xl h-10 px-4`}
                              >
                                {sub.status === 'evaluated' ? 'Edit Evaluation' : 'Evaluate'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Evaluation Modal */}
      <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white/95 dark:bg-[#111]/95 backdrop-blur-2xl border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl">
          {selectedSubmission && (
            <>
              <div className="h-2 w-full bg-gradient-to-r from-violet-500 to-indigo-500"></div>
              <DialogHeader className="px-8 pt-8 pb-4 border-b border-slate-100 dark:border-white/5">
                <DialogTitle className="text-2xl font-bold dark:text-white">Evaluate Submission</DialogTitle>
                <div className="flex flex-wrap gap-4 mt-3">
                  <Badge variant="outline" className="bg-slate-50 dark:bg-white/5 px-3 py-1 text-sm rounded-lg border-slate-200 dark:border-white/10">
                    Student: <span className="font-bold ml-1">{selectedSubmission.submittedBy}</span>
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 dark:bg-white/5 px-3 py-1 text-sm rounded-lg border-slate-200 dark:border-white/10">
                    Assignment: <span className="font-bold ml-1">{selectedSubmission.questionPaperTitle}</span>
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="p-8 grid md:grid-cols-2 gap-8 bg-slate-50/50 dark:bg-black/20">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-500" /> Submitted Document
                  </h4>
                  <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                      <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="font-medium text-slate-900 dark:text-white text-sm mb-1">{selectedSubmission.fileName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{selectedSubmission.submissionDate}</p>
                      <Button 
                        onClick={() => handleDownload(selectedSubmission.fileName, selectedSubmission.fileData)}
                        variant="outline"
                        className="rounded-xl border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                      >
                        <Download className="w-4 h-4 mr-2" /> Download to View
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Evaluation details</h4>
                    <div className="space-y-2">
                      <Label htmlFor="marks" className="dark:text-slate-300">Marks / Grade</Label>
                      <Input
                        id="marks"
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        className="h-12 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-lg font-bold"
                        placeholder="e.g. 85"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback" className="dark:text-slate-300">Feedback (Optional)</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[120px] rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 resize-y"
                      placeholder="Great work, but focus on..."
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className="px-8 py-5 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#111]">
                <Button variant="outline" onClick={() => setIsEvaluationOpen(false)} className="rounded-xl border-slate-200 dark:border-white/10 h-11 px-6">Cancel</Button>
                <Button onClick={submitEvaluation} className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white h-11 px-8 shadow-lg shadow-violet-500/20 font-medium">Save Evaluation</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
