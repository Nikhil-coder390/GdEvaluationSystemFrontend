
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useGD } from "@/context/GDContext";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Search } from "lucide-react";

interface FilterCriteria {
  section: string;
  department: string;
  year: string;
  minScore: string;
}

const Analytics = () => {
  const { sessions, evaluations } = useGD();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterCriteria>({
    section: "",
    department: "",
    year: "",
    minScore: "",
  });
  
  // Mock student data for analytics
  const students = [
    { id: "1", name: "John Doe", rollNumber: "CS2001", section: "A", department: "Computer Science", year: "2", gd1Score: 8.5, gd2Score: 7.8 },
    { id: "2", name: "Jane Smith", rollNumber: "CS2002", section: "A", department: "Computer Science", year: "2", gd1Score: 9.2, gd2Score: 8.9 },
    { id: "3", name: "Robert Johnson", rollNumber: "CS2003", section: "B", department: "Computer Science", year: "2", gd1Score: 7.5, gd2Score: 8.1 },
    { id: "4", name: "Emily Davis", rollNumber: "EE3001", section: "A", department: "Electrical Engineering", year: "3", gd1Score: 8.0, gd2Score: 8.3 },
    { id: "5", name: "Michael Wilson", rollNumber: "EE3002", section: "B", department: "Electrical Engineering", year: "3", gd1Score: 7.8, gd2Score: 7.5 },
  ];
  
  const handleFilterChange = (key: keyof FilterCriteria, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const filteredStudents = students.filter(student => {
    if (filters.section && student.section !== filters.section) return false;
    if (filters.department && student.department !== filters.department) return false;
    if (filters.year && student.year !== filters.year) return false;
    
    const avgScore = (student.gd1Score + student.gd2Score) / 2;
    if (filters.minScore && avgScore < parseFloat(filters.minScore)) return false;
    
    return true;
  });
  
  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "This will export analytics data to Excel in the full implementation",
    });
  };
  
  // Get unique values for filter options
  const sections = [...new Set(students.map(s => s.section))];
  const departments = [...new Set(students.map(s => s.department))];
  const years = [...new Set(students.map(s => s.year))];

  return (
    <PageContainer title="Analytics Dashboard">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Analytics" },
        ]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={filters.section}
                  onValueChange={(value) => handleFilterChange("section", value)}
                >
                  <SelectTrigger id="section">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-sections">All Sections</SelectItem>
                    {sections.map(section => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => handleFilterChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-departments">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange("year", value)}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-years">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minScore">Min Average Score</Label>
                <Input
                  id="minScore"
                  type="number"
                  placeholder="Minimum score"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.minScore}
                  onChange={(e) => handleFilterChange("minScore", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Student Results</h2>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>GD1 Score</TableHead>
                    <TableHead>GD2 Score</TableHead>
                    <TableHead>Final Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.gd1Score.toFixed(1)}</TableCell>
                        <TableCell>{student.gd2Score.toFixed(1)}</TableCell>
                        <TableCell className="font-semibold">
                          {((student.gd1Score + student.gd2Score) / 2).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No students match the filter criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Analytics;
