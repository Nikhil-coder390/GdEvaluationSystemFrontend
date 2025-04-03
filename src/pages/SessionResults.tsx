
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGD } from "@/context/GDContext";
import { useAuth } from "@/context/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { GDSession, Evaluation, EvaluationCriteria } from "@/types";

const criteriaLabels = {
  articulation: "Articulation",
  relevance: "Relevance",
  leadership: "Leadership",
  nonVerbalCommunication: "Non-verbal",
  impression: "Impression",
};

const SessionResults = () => {
  const { id } = useParams<{ id: string }>();
  const { getSessionById, getEvaluationsForSession, calculateScores } = useGD();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<GDSession | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const foundSession = getSessionById(id);
      if (foundSession) {
        setSession(foundSession);
        setEvaluations(getEvaluationsForSession(id));
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
  }, [id, getSessionById, getEvaluationsForSession, toast, navigate]);
  
  if (isLoading || !session || !user || user.role !== "instructor") {
    if (!isLoading && user?.role !== "instructor") {
      toast({
        title: "Access Denied",
        description: "Only instructors can view session results",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
    return <div>Loading...</div>;
  }

  const exportToExcel = () => {
    toast({
      title: "Export Feature",
      description: "This will export results to Excel in the full implementation",
    });
  };

  return (
    <PageContainer title="Session Results">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: session.topic, href: `/session/${session.id}` },
          { label: "Results" },
        ]}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{session.topic} - Evaluation Results</h2>
          <Button variant="outline" onClick={exportToExcel}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Participant Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    {Object.values(criteriaLabels).map((label) => (
                      <TableHead key={label}>{label}</TableHead>
                    ))}
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {session.participants.map((rollNumber) => {
                    const { peerAverage, instructorScores, finalScores } = calculateScores(
                      session.id,
                      rollNumber
                    );
                    
                    const finalAvg =
                      Object.values(finalScores).reduce((sum, score) => sum + score, 0) / 5;
                    
                    return (
                      <TableRow key={rollNumber}>
                        <TableCell className="font-medium">{rollNumber}</TableCell>
                        {Object.keys(criteriaLabels).map((key) => (
                          <TableCell key={key}>
                            {finalScores[key as keyof EvaluationCriteria].toFixed(1)}
                          </TableCell>
                        ))}
                        <TableCell className="font-semibold">
                          {finalAvg.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {session.participants.map((rollNumber) => {
                const { peerAverage, instructorScores, finalScores } = calculateScores(
                  session.id,
                  rollNumber
                );
                
                return (
                  <div key={rollNumber} className="space-y-3">
                    <h3 className="text-lg font-medium">Student: {rollNumber}</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Source</TableHead>
                            {Object.values(criteriaLabels).map((label) => (
                              <TableHead key={label}>{label}</TableHead>
                            ))}
                            <TableHead>Average</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Peer Average</TableCell>
                            {Object.keys(criteriaLabels).map((key) => (
                              <TableCell key={key}>
                                {peerAverage[key as keyof EvaluationCriteria].toFixed(1)}
                              </TableCell>
                            ))}
                            <TableCell>
                              {(
                                Object.values(peerAverage).reduce((sum, score) => sum + score, 0) / 5
                              ).toFixed(1)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Instructor</TableCell>
                            {Object.keys(criteriaLabels).map((key) => (
                              <TableCell key={key}>
                                {instructorScores[key as keyof EvaluationCriteria].toFixed(1)}
                              </TableCell>
                            ))}
                            <TableCell>
                              {(
                                Object.values(instructorScores).reduce((sum, score) => sum + score, 0) / 5
                              ).toFixed(1)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Final Score</TableCell>
                            {Object.keys(criteriaLabels).map((key) => (
                              <TableCell key={key} className="font-semibold">
                                {finalScores[key as keyof EvaluationCriteria].toFixed(1)}
                              </TableCell>
                            ))}
                            <TableCell className="font-bold">
                              {(
                                Object.values(finalScores).reduce((sum, score) => sum + score, 0) / 5
                              ).toFixed(1)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SessionResults;
