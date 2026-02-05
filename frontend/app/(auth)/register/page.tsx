"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Home,
  Sparkles,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background via-background to-muted">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Home className="absolute inset-0 m-auto h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-b from-primary/90 via-primary to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Home className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">RentEase</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Start your rental journey today
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Join thousands of users who have found their perfect home or
              listed their properties with RentEase.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 rounded-lg bg-white/20">
                <Users className="h-5 w-5" />
              </div>
              <span>Join 50,000+ happy users</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 rounded-lg bg-white/20">
                <Building2 className="h-5 w-5" />
              </div>
              <span>List or find properties in minutes</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 rounded-lg bg-white/20">
                <Shield className="h-5 w-5" />
              </div>
              <span>Verified listings & secure payments</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 rounded-lg bg-white/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span>Free for tenants, affordable for landlords</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          &copy; {new Date().getFullYear()} RentEase. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-linear-to-b from-background to-muted/30">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">RentEase</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Desktop Back Button */}
        <div className="hidden lg:block p-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 py-12">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-3 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Create your account
                </CardTitle>
                <CardDescription className="text-base">
                  Get started with RentEase in just a few steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RegisterForm />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Already a member?
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary font-semibold hover:underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-foreground"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
