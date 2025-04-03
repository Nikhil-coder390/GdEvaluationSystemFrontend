
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 hero-gradient">
          Group Discussion Evaluation System
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
          A comprehensive platform for conducting and evaluating group discussions.
          Real-time feedback, analytics, and seamless collaboration for students and instructors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Role-based Access</CardTitle>
                <CardDescription>
                  Separate interfaces for students and instructors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Students can participate in discussions and evaluate peers.
                  Instructors can create sessions, evaluate students, and access analytics.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Evaluation</CardTitle>
                <CardDescription>
                  Structured criteria for fair assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Evaluate based on articulation, relevance, leadership, non-verbal
                  communication, and overall impression.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Instant synchronization of data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  All evaluations and session updates are immediately available to
                  relevant users across the platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">For Instructors</h3>
                <p className="text-muted-foreground">
                  Create GD sessions, assign participants and evaluators, conduct
                  evaluations, and access comprehensive analytics.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">For Students</h3>
                <p className="text-muted-foreground">
                  Participate in assigned GD sessions, evaluate peers when assigned
                  as an evaluator, and access personalized feedback.
                </p>
              </div>
              
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link to={user ? "/dashboard" : "/register"}>
                    {user ? "Go to Dashboard" : "Get Started Now"}
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Session Creation</h4>
                    <p className="text-sm text-muted-foreground">
                      Instructors create GD sessions with topics and assign participants
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Participation</h4>
                    <p className="text-sm text-muted-foreground">
                      Students participate in discussions based on assigned roles
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Evaluation Process</h4>
                    <p className="text-sm text-muted-foreground">
                      Both peers and instructors evaluate participants based on criteria
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Results & Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive reports and analytics for performance improvement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
