import React, { createContext, useContext, useState, useEffect } from "react";
import { ProfileRow, UserRole } from "@/types/supabase";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  section?: string;
  year?: string;
  rollNumber?: string;
  designation?: string;
  createdAt: Date;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rollNumber?: string;
  department?: string;
  section?: string;
  year?: string;
  designation?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  rollNumber?: string;
  department?: string;
  section?: string;
  year?: string;
  designation?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileToUser = (profile: ProfileRow): User => {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      department: profile.department || undefined,
      section: profile.section || undefined,
      year: profile.year || undefined,
      rollNumber: profile.roll_number || undefined,
      designation: profile.designation || undefined,
      createdAt: new Date(profile.created_at),
    };
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/check-session`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(profileToUser(userData));
          } else {
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Session check error:", error);
          localStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const userData = await response.json();
      setUser(profileToUser(userData));
      localStorage.setItem("authToken", userData.token);
      console.log("Login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Registration failed");
      const userData = await response.json();
      setUser(profileToUser(userData));
      localStorage.setItem("authToken", userData.token);
      console.log("Registration successful");
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!user) throw new Error("No user is logged in");
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Profile update failed");
      const updatedUser = await response.json();
      setUser(profileToUser(updatedUser));
      console.log("Profile updated successfully");
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw new Error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("authToken");
      setUser(null);
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};