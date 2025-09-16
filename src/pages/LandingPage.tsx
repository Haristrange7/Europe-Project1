import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Users, MapPin, Shield } from "lucide-react";
import gsap from "gsap";

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate hero section
    tl.fromTo(
      ".hero-title",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        ".hero-subtitle",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(
        ".hero-buttons",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    // Animate cards
    gsap.fromTo(
      ".feature-card",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5,
      }
    );
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          <div className="hero-title mb-6">
            <Truck className="h-20 w-20 mx-auto mb-6 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
              DriveVault Recruit
            </h1>
          </div>

          <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Connecting skilled truck drivers with opportunities across Europe.
            Your journey to professional driving excellence starts here.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link to="/admin/login">
                <Shield className="h-5 w-5 mr-2" />
                Admin Login
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4"
            >
              <Link to="/candidate/auth">
                <Users className="h-5 w-5 mr-2" />
                Driver Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={cardsRef} className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Europe Truck Project?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive support and opportunities for
              professional truck drivers looking to advance their careers in
              Europe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="feature-card border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">
                  European Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Access to truck driving opportunities across multiple European
                  countries with verified employers and competitive
                  compensation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Verified Process</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Complete verification process including skills assessment,
                  document validation, and employer background checks for your
                  safety.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Complete Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  From application to employment, we provide accommodation
                  assistance, work contracts, and ongoing support throughout
                  your journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Sholas Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
