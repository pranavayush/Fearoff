import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { GraduationCap, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { validateLogin } from "@/app/utils/users";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { motion } from "motion/react";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = validateLogin(email, password, "teacher");
    setIsLoading(false);

    if (result.success && result.user) {
      localStorage.setItem("userType", "teacher");
      localStorage.setItem("username", result.user.username);
      localStorage.setItem("fullName", result.user.fullName);
      navigate("/teacher-dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-violet-600 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/30 blur-[100px] mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/30 blur-[100px] mix-blend-multiply" />
        </div>
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 border border-white/20">
              <GraduationCap className="w-12 h-12 text-violet-200" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Empower the next <br/>generation.</h1>
            <p className="text-xl text-violet-100 font-medium leading-relaxed">
              Upload assignments, review submissions, and manage your classroom with our premium educator tools.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Background Elements */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="w-full bg-white/70 dark:bg-[#111111]/70 backdrop-blur-2xl border-slate-200/60 dark:border-white/10 shadow-2xl dark:shadow-none rounded-3xl overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-violet-500 to-indigo-500"></div>
            <CardHeader className="pt-10 pb-6 px-8 text-center">
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Teacher Login</CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400">Sign in to manage your classes</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium ml-1">Email</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-violet-500 dark:text-white dark:placeholder:text-slate-500 transition-all text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus-visible:ring-violet-500 dark:text-white dark:placeholder:text-slate-500 transition-all text-base"
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-1">
                  <input type="checkbox" id="remember" className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 bg-slate-50 dark:bg-white/5 dark:border-white/10" />
                  <label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-400">Remember me for 30 days</label>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-200 dark:border-red-500/20 backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-medium rounded-2xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-xl shadow-violet-500/20 transition-all hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-slate-100 dark:border-white/5 py-6 gap-3">
              <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                &larr; Back to Home
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
