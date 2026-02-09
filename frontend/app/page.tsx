"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import {
  Search,
  Shield,
  MessageSquare,
  FileText,
  Home,
  
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  
  Star,
  TrendingUp,
  Zap,
  Heart,
} from "lucide-react";

const stats = [
  { value: "10K+", label: "Active Listings" },
  { value: "50K+", label: "Happy Tenants" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support" },
];

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description:
      "AI-powered filters and map-based search to find your perfect match instantly.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Verified & Secure",
    description:
      "Every listing is verified. Digital leases and secure document handling.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "Instant Connect",
    description:
      "Real-time messaging with landlords. Schedule viewings with one click.",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Zap,
    title: "Fast Applications",
    description:
      "Apply to multiple properties with a single profile. Get responses within 24 hours.",
    color: "bg-amber-500/10 text-amber-600",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Browse thousands of verified listings with detailed photos and virtual tours.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Connect",
    description:
      "Chat with landlords, ask questions, and schedule property viewings.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Apply",
    description:
      "Submit your application online with all required documents in minutes.",
  },
  {
    number: "04",
    icon: Home,
    title: "Move In",
    description: "Sign your digital lease and get the keys to your new home.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Trusted by 50,000+ renters
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Your Perfect
              <span className="block mt-2 gradient-text">Rental Home</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified landlords and discover your next home.
              Simple applications, secure leases, and hassle-free moving.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 h-12 rounded-full gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Search className="h-5 w-5" />
                  Browse Properties
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 h-12 rounded-full"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 pt-16 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Why Choose RentHub?
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to find, apply, and move into your next home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              From search to keys in hand - we make renting simple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative text-center group">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-linear-to-r from-primary/50 to-transparent" />
                  )}

                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-16 h-16 bg-linear-to-b from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {step.number.slice(1)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card rounded-3xl p-8 md:p-12 shadow-xl border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                  &ldquo;RentHub made finding our new apartment incredibly easy.
                  The verification process gave us peace of mind, and we signed
                  our lease digitally within days!&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      SM
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Mitchell</div>
                    <div className="text-sm text-muted-foreground">
                      Verified Tenant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-3xl" />

            <div className="relative bg-card border rounded-3xl p-8 md:p-16 shadow-xl">
              <Badge variant="secondary" className="mb-6">
                <TrendingUp className="h-3.5 w-3.5 mr-2" />
                Join 50,000+ users
              </Badge>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Ready to Find Your
                <span className="block gradient-text">Dream Home?</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Join thousands of happy renters who found their perfect home
                through RentHub.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/properties">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base px-10 h-12 rounded-full gap-2 shadow-lg shadow-primary/25"
                  >
                    Start Searching
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register?role=landlord">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base px-10 h-12 rounded-full gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    List Your Property
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-10 border-t">
                {[
                  "Free to use",
                  "No hidden fees",
                  "Verified listings",
                  "24/7 support",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">RentHub</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Making rental housing simple, transparent, and accessible for
                everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Tenants</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/properties"
                    className="hover:text-foreground transition-colors"
                  >
                    Browse Listings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Tenant Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Landlords</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/properties/create"
                    className="hover:text-foreground transition-colors"
                  >
                    List Property
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register?role=landlord"
                    className="hover:text-foreground transition-colors"
                  >
                    Landlord Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Landlord Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} RentHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
