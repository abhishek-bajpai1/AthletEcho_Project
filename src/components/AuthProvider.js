"use client";

import { AuthContextProvider } from "@/contexts/AuthContext";

export default function AuthProvider({ children }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
