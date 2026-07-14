import { createBrowserRouter } from "react-router";
import Home from "@/app/pages/Home";
import StudentLogin from "@/app/pages/StudentLogin";
import TeacherLogin from "@/app/pages/TeacherLogin";
import StudentRegister from "@/app/pages/StudentRegister";
import TeacherRegister from "@/app/pages/TeacherRegister";
import StudentDashboard from "@/app/pages/StudentDashboard";
import TeacherDashboard from "@/app/pages/TeacherDashboard";
import NotFound from "@/app/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/student-login",
    Component: StudentLogin,
  },
  {
    path: "/teacher-login",
    Component: TeacherLogin,
  },
  {
    path: "/student-register",
    Component: StudentRegister,
  },
  {
    path: "/teacher-register",
    Component: TeacherRegister,
  },
  {
    path: "/student-dashboard",
    Component: StudentDashboard,
  },
  {
    path: "/teacher-dashboard",
    Component: TeacherDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);