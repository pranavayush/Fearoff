import { useState } from "react";
import { Link } from "react-router";
import { BookOpen, FileText, CheckCircle2, GraduationCap, Users, ArrowRight, Activity, Calendar, Star, Layout, Menu, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ModeToggle } from "@/app/components/mode-toggle";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-violet-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/20 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white">
                FearOff
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <ModeToggle />
              <div className="hidden sm:flex gap-3">
                <Button variant="ghost" asChild className="rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-white/10">
                  <Link to="/student-login">Student Login</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-xl font-medium border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10">
                  <Link to="/teacher-login">Teacher Login</Link>
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </motion.div>
          </div>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="sm:hidden flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/10"
            >
              <Button variant="ghost" asChild className="w-full justify-start rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-white/10">
                <Link to="/student-login" onClick={() => setIsMobileMenuOpen(false)}>Student Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start rounded-xl font-medium border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10">
                <Link to="/teacher-login" onClick={() => setIsMobileMenuOpen(false)}>Teacher Login</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4 sm:pt-24 sm:pb-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white">
              FearOff
            </h1>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-8 sm:pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">World-Class Features</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to manage education effortlessly.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              { icon: Layout, title: "Modern Dashboard", desc: "Intuitive glassmorphic interfaces that make navigation a breeze.", color: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" },
              { icon: Activity, title: "Real-time Tracking", desc: "Monitor student progress and submission statuses in real-time.", color: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" },
              { icon: CheckCircle2, title: "Secure Submissions", desc: "Safe, reliable, and organized upload system for all answer sheets.", color: "bg-green-100 dark:bg-emerald-500/20 text-green-600 dark:text-emerald-400" }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl border-slate-200/60 dark:border-white/5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all rounded-3xl h-full overflow-hidden group">
                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">FearOff</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            © 2026 FearOff Educational SaaS. Premium Grade.
          </p>
        </div>
      </footer>
    </div>
  );
}
