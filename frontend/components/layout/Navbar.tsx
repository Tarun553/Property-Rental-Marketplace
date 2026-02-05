"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Home,
  Building2,
  MessageSquare,
  Star,
} from "lucide-react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          <Building2 className="h-8 w-8" />
          <span>RentHub</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/properties"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Browse Properties
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/messages"
                className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>
              <Link
                href="/reviews"
                className="text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
              >
                <Star className="h-4 w-4" />
                Reviews
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.profile?.firstName || user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${user?.role}`}
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
