"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import {
  Search,
  Shield,
  MessageSquare,
  FileText,
  Home,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect
          <span className="text-blue-600"> Rental Home</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with landlords and discover your next home. Simple, secure,
          and hassle-free.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/properties">
            <Button size="lg" className="text-lg px-8">
              <Search className="mr-2 h-5 w-5" />
              Browse Properties
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose RentHub?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find properties with advanced filters and real-time availability
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Verified listings and secure digital lease agreements
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Messaging</h3>
              <p className="text-gray-600">
                Chat with landlords in real-time and schedule viewings
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-2">Browse Listings</h3>
              <p className="text-sm text-gray-600">
                Search through verified properties
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-2">Contact Landlord</h3>
              <p className="text-sm text-gray-600">
                Message directly and schedule tours
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-2">Submit Application</h3>
              <p className="text-sm text-gray-600">
                Apply online with documents
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-2">Move In</h3>
              <p className="text-sm text-gray-600">
                Sign lease and get your keys
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Find Your Next Home?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of renters and landlords using RentHub
        </p>
        <Link href="/properties">
          <Button size="lg" className="text-lg px-12">
            Start Searching Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 RentHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
