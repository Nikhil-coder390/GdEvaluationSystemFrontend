
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/PageContainer";
import { useAuth } from "@/context/AuthContext";
import { useGD } from "@/context/GDContext";
import { PlusCircle, UserCheck, Users } from "lucide-react";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user } = useAuth();
  const { getSessionsForUser } = useGD();
  const navigate = useNavigate();

  const { participatingSessions, evaluatingSessions } = getSessionsForUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer
      title={`Welcome, ${user.name}`}
      description={`Your ${user.role} dashboard`}
    >
      {user.role === "instructor" ? (
        <InstructorDashboard 
          evaluatingSessions={evaluatingSessions}
        />
      ) : (
        <StudentDashboard
          participatingSessions={participatingSessions}
          evaluatingSessions={evaluatingSessions}
        />
      )}
    </PageContainer>
  );
};

interface InstructorDashboardProps {
  evaluatingSessions: any[];
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  evaluatingSessions
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">GD Sessions</h2>
        <Button onClick={() => navigate("/create-session")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluatingSessions.length > 0 ? (
          evaluatingSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{session.topic}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Group:</span>
                    <span>{session.groupName} ({session.groupNumber})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{format(new Date(session.date), "PPP")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Participants:</span>
                    <span>{session.participants.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Evaluators:</span>
                    <span>{session.evaluators.length}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/session/${session.id}`)}>
                  View Details
                </Button>
                <Button onClick={() => navigate(`/session/${session.id}/evaluate`)}>
                  Evaluate
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Sessions Created</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating your first GD session.
            </p>
            <Button onClick={() => navigate("/create-session")} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create GD Session
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View comprehensive reports and analytics of student performance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/analytics")}>
                View Analytics
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Export student performance data in Excel format.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/export-reports")}>
                Export Reports
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Update your profile information and preferences.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
                Manage Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface StudentDashboardProps {
  participatingSessions: any[];
  evaluatingSessions: any[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  participatingSessions,
  evaluatingSessions
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Participate in GD</h2>
        {participatingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participatingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle>{session.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Group:</span>
                      <span>{session.groupName} ({session.groupNumber})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{format(new Date(session.date), "PPP")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate(`/session/${session.id}`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/40">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-medium">No Participation Sessions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You have not been assigned to participate in any GD sessions yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Evaluate GD</h2>
        {evaluatingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evaluatingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle>{session.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Group:</span>
                      <span>{session.groupName} ({session.groupNumber})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{format(new Date(session.date), "PPP")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/session/${session.id}/evaluate`)}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Evaluate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/40">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserCheck className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-medium">No Evaluation Sessions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You have not been assigned to evaluate any GD sessions yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Update your profile information and preferences.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
              Manage Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
