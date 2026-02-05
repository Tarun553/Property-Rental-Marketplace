"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("landlord" | "tenant")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }

    if (!loading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard if wrong role
        router.push(`/dashboard/${user.role}`);
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
