
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Student fields
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [section, setSection] = useState(user?.section || "");
  const [year, setYear] = useState(user?.year || "");
  
  // Instructor fields
  const [designation, setDesignation] = useState(user?.designation || "");
  
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    
    try {
      const userData = {
        name,
        email,
        ...(user.role === "student" 
          ? { rollNumber, department, section, year } 
          : { designation }),
      };
      
      await updateProfile(userData);
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageContainer title="Profile Settings">
      <Breadcrumb items={[{ label: "Profile" }]} />
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Tabs value={user.role} className="w-full">
                <TabsContent value="student" className="space-y-4 mt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        placeholder="CS2001"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        placeholder="A"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Input
                        id="year"
                        placeholder="2"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructor" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      placeholder="Assistant Professor"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required={user.role === "instructor"}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Profile;
