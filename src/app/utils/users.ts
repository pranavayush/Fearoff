// User management utilities

export interface User {
  username: string;
  password: string;
  email: string;
  fullName: string;
  userType: "student" | "teacher";
  createdAt: string;
}

// Get all users
export const getAllUsers = (): User[] => {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : [];
};

// Register new user
export const registerUser = (user: Omit<User, "createdAt">): { success: boolean; message: string } => {
  const users = getAllUsers();
  
  // Check if email already exists
  if (users.some(u => u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())) {
    return { success: false, message: "Email already exists" };
  }
  
  const newUser: User = {
    ...user,
    email: user.email ? user.email.trim().toLowerCase() : "",
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  
  return { success: true, message: "Account created successfully" };
};

// Validate login credentials
export const validateLogin = (
  email: string, 
  password: string, 
  userType: "student" | "teacher"
): { success: boolean; message: string; user?: User } => {
  const users = getAllUsers();
  const trimmedEmail = email.trim().toLowerCase();

  if (
    userType === "teacher" &&
    trimmedEmail === "pranavayush8@gmail.com" &&
    password === "admin1234"
  ) {
    const defaultTeacherUser: User = {
      username: "admin",
      password: "admin1234",
      email: "pranavayush8@gmail.com",
      fullName: "Admin",
      userType: "teacher",
      createdAt: new Date().toISOString(),
    };

    return { success: true, message: "Login successful", user: defaultTeacherUser };
  }
  
  const user = users.find(u => u.email && u.email.toLowerCase() === trimmedEmail && u.userType === userType);
  
  if (!user) {
    return { success: false, message: "Account not found" };
  }
  
  if (user.password !== password) {
    return { success: false, message: "Invalid email or password" };
  }
  
  return { success: true, message: "Login successful", user };
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true, message: "Password is valid" };
};
