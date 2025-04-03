import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useGD } from "@/context/GDContext";
import { useAuth } from "@/context/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Save } from "lucide-react";
import { format } from "date-fns";
import { GDSession, EvaluationCriteria } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const criteriaDescriptions = {
  articulation: "Clarity of speech, confidence, and delivery",
  relevance: "How relevant and valuable the contributions are to the discussion",
  leadership: "Initiative taken, guiding the discussion, and encouraging others",
  nonVerbalCommunication: "Body language, gestures, and eye contact",
  impression: "Overall impact and effectiveness in the group discussion",
};

const criteriaLabels = {
  articulation: "Articulation",
  relevance: "Relevance",
  leadership: "Leadership",
  nonVerbalCommunication: "Non-verbal Communication",
  impression: "Overall Impression",
};

const EvaluateSession = () => {
  const { id } = useParams<{ id: string }>();
  const { getSessionById, submitEvaluation } = useGD();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<GDSession | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    articulation: 5,
    relevance: 5,
    leadership: 5,
    nonVerbalCommunication: 5,
    impression: 5,
  });
  
  useEffect(() => {
    if (id) {
      const foundSession = getSessionById(id);
      if (foundSession) {
        setSession(foundSession);
        // Set first participant as default selected student
        if (foundSession.participants.length > 0) {
          setSelectedStudent(foundSession.participants[0]);
        }
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
  
  if (isLoading || !session || !user) {
    return <div>Loading...</div>;
  }

  // Check if user is allowed to evaluate
  const isInstructor = user.role === "instructor";
  const isEvaluator = user.role === "student" && 
    session.evaluators.includes(user.rollNumber || "");
  
  if (!isInstructor && !isEvaluator) {
    navigate("/dashboard");
    return null;
  }

  const handleCriteriaChange = (criteriaKey: keyof EvaluationCriteria, value: number) => {
    setCriteria(prev => ({
      ...prev,
      [criteriaKey]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student to evaluate",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitEvaluation(
        session.id,
        selectedStudent,
        criteria
      );
      
      toast({
        title: "Success",
        description: "Evaluation submitted successfully",
      });
      
      // Reset criteria to default values
      setCriteria({
        articulation: 5,
        relevance: 5,
        leadership: 5,
        nonVerbalCommunication: 5,
        impression: 5,
      });
      
      // Keep the same student selected or select the next one
      const currentIndex = session.participants.indexOf(selectedStudent);
      if (currentIndex < session.participants.length - 1) {
        setSelectedStudent(session.participants[currentIndex + 1]);
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="Evaluate GD Session">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: session.topic, href: `/session/${session.id}` },
          { label: "Evaluate" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="student">Select Student to Evaluate</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {session.participants.map((rollNumber) => (
                        <SelectItem key={rollNumber} value={rollNumber}>
                          {rollNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-6">
                  {Object.entries(criteriaLabels).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={key}>{label}</Label>
                        <span className="text-sm font-medium">
                          {criteria[key as keyof EvaluationCriteria]}
                        </span>
                      </div>
                      <Slider
                        id={key}
                        min={1}
                        max={10}
                        step={1}
                        value={[criteria[key as keyof EvaluationCriteria]]}
                        onValueChange={(values) => 
                          handleCriteriaChange(key as keyof EvaluationCriteria, values[0])
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        {criteriaDescriptions[key as keyof typeof criteriaDescriptions]}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Submit Evaluation
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Topic</Label>
                <p className="font-medium">{session.topic}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Date</Label>
                <p className="font-medium">{format(new Date(session.date), "PPP")}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Group</Label>
                <p className="font-medium">{session.groupName} ({session.groupNumber})</p>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/session/${session.id}`)}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Back to Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default EvaluateSession;
