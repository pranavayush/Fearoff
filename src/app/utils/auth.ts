// Authentication utilities for the FearOff Portal

export const login = (userType: "student" | "teacher", username: string) => {
  localStorage.setItem("userType", userType);
  localStorage.setItem("username", username);
};

export const logout = () => {
  localStorage.removeItem("userType");
  localStorage.removeItem("username");
};

export const getCurrentUser = () => {
  return {
    userType: localStorage.getItem("userType"),
    username: localStorage.getItem("username"),
  };
};

export const isAuthenticated = (requiredType: "student" | "teacher") => {
  const { userType, username } = getCurrentUser();
  return userType === requiredType && username !== null;
};
