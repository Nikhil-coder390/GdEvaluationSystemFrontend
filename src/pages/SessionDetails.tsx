
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGD } from "@/context/GDContext";
import { useAuth } from "@/context/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, User, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { GDSession } from "@/types";

const SessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getSessionById } = useGD();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<GDSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const foundSession = getSessionById(id);
      if (foundSession) {
        setSession(foundSession);
      } else {
        toast({
          title: "Error",
          description: "Session not found",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
    setIsLoading(false);
  }, [id, getSessionById, toast, navigate]);
  
  if (isLoading || !session) {
    return <div>Loading...</div>;
  }

  const isInstructor = user?.role === "instructor";
  const isParticipant = user?.role === "student" && 
    session.participants.includes(user?.rollNumber || "");
  const isEvaluator = (user?.role === "student" && 
    session.evaluators.includes(user?.rollNumber || "")) || isInstructor;

  return (
    <PageContainer title={session.topic}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Session Details" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {isParticipant && (
                  <Badge variant="outline" className="bg-primary/10">
                    You are a Participant
                  </Badge>
                )}
                {isEvaluator && (
                  <Badge variant="outline" className="bg-secondary/10">
                    You are an Evaluator
                  </Badge>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.date), "PPP")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Group</p>
                    <p className="text-sm text-muted-foreground">
                      {session.groupName} ({session.groupNumber})
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {session.details}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {session.participants.map((rollNumber) => (
                  <Badge key={rollNumber} variant="secondary">
                    {rollNumber}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {isInstructor && (
            <Card>
              <CardHeader>
                <CardTitle>Evaluators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {session.evaluators.map((rollNumber) => (
                    <Badge key={rollNumber} variant="outline">
                      {rollNumber}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEvaluator && (
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/session/${session.id}/evaluate`)}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Evaluate Session
                </Button>
              )}
              
              {isInstructor && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/session/${session.id}/results`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Results
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default SessionDetails;
