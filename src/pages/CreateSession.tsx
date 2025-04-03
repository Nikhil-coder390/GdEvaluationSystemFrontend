
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGD } from "@/context/GDContext";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PlusCircle, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CreateSession = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const [participantsText, setParticipantsText] = useState("");
  const [evaluatorsText, setEvaluatorsText] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createSession } = useGD();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic || !details || !groupName || !groupNumber || !date || !participantsText || !evaluatorsText) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process participants and evaluators from text to arrays
      const participants = participantsText
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      
      const evaluators = evaluatorsText
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      
      const newSession = await createSession({
        topic,
        details,
        groupName,
        groupNumber,
        date,
        participants,
        evaluators,
      });
      
      toast({
        title: "Success",
        description: "GD Session created successfully",
      });
      
      navigate(`/session/${newSession.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportParticipants = () => {
    // This would be replaced with actual file upload and parsing logic
    toast({
      title: "File Upload",
      description: "This feature will allow importing participants from Excel",
    });
  };

  const handleImportEvaluators = () => {
    // This would be replaced with actual file upload and parsing logic
    toast({
      title: "File Upload",
      description: "This feature will allow importing evaluators from Excel",
    });
  };

  return (
    <PageContainer title="Create GD Session">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Session" },
        ]}
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Session Details</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic Name</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Climate Change Solutions"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Session Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details">Details about the Topic</Label>
                <Textarea
                  id="details"
                  placeholder="Provide details about the topic for discussion..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Tech Innovators"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="groupNumber">Group Number</Label>
                  <Input
                    id="groupNumber"
                    placeholder="e.g., G1"
                    value={groupNumber}
                    onChange={(e) => setGroupNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Participants & Evaluators</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="participants">Participating Students (Roll Numbers)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImportParticipants}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import from Excel
                  </Button>
                </div>
                <Textarea
                  id="participants"
                  placeholder="Enter roll numbers separated by commas (e.g., CS2001, CS2002, CS2003)"
                  value={participantsText}
                  onChange={(e) => setParticipantsText(e.target.value)}
                  rows={3}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the roll numbers of students who will participate in this GD session.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="evaluators">Evaluator Students (Roll Numbers)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImportEvaluators}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import from Excel
                  </Button>
                </div>
                <Textarea
                  id="evaluators"
                  placeholder="Enter roll numbers separated by commas (e.g., CS2004, CS2005)"
                  value={evaluatorsText}
                  onChange={(e) => setEvaluatorsText(e.target.value)}
                  rows={3}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the roll numbers of students who will evaluate this GD session.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Creating Session..."
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Session
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default CreateSession;
