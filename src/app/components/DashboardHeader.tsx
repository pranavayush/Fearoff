import { Search, Bell } from "lucide-react";
import { ModeToggle } from "@/app/components/mode-toggle";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  userName?: string;
  userType?: string;
  onLogout?: () => void;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 sticky top-0 z-30 transition-colors duration-300">
      <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
          {title}
        </h1>
        
        <div className="flex-1 max-w-xl mx-auto sm:ml-8 sm:mr-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Quick search..." 
              className="pl-10 h-10 w-full bg-white/60 dark:bg-white/5 border-slate-200/60 dark:border-white/10 rounded-xl focus-visible:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
