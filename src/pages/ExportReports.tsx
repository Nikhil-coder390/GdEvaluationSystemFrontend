
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PageContainer from "@/components/layout/PageContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Check } from "lucide-react";

const ExportReports = () => {
  const { toast } = useToast();
  
  const [exportOptions, setExportOptions] = useState({
    sessions: [] as string[],
    fields: {
      name: true,
      rollNumber: true,
      section: true,
      department: true,
      year: true,
      gd1Marks: true,
      gd2Marks: true,
      finalScore: true,
    },
    format: "excel",
  });
  
  // Mock GD sessions for export
  const availableSessions = [
    { id: "1", name: "Climate Change Solutions (G1)" },
    { id: "2", name: "Digital Privacy (G2)" },
    { id: "3", name: "Sustainable Energy (G3)" },
  ];
  
  const handleSessionToggle = (sessionId: string) => {
    setExportOptions(prev => {
      const isSelected = prev.sessions.includes(sessionId);
      return {
        ...prev,
        sessions: isSelected
          ? prev.sessions.filter(id => id !== sessionId)
          : [...prev.sessions, sessionId],
      };
    });
  };
  
  const handleFieldToggle = (field: keyof typeof exportOptions.fields) => {
    setExportOptions(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: !prev.fields[field],
      },
    }));
  };
  
  const handleSelectAll = () => {
    setExportOptions(prev => ({
      ...prev,
      sessions: prev.sessions.length === availableSessions.length
        ? []
        : availableSessions.map(s => s.id),
    }));
  };
  
  const handleExport = () => {
    if (exportOptions.sessions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one session to export",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would trigger the export functionality
    toast({
      title: "Export Initiated",
      description: `Exporting data for ${exportOptions.sessions.length} sessions`,
    });
  };

  return (
    <PageContainer title="Export Reports">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Export Reports" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Select Sessions</CardTitle>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {exportOptions.sessions.length === availableSessions.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableSessions.map(session => (
                <div key={session.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`session-${session.id}`}
                    checked={exportOptions.sessions.includes(session.id)}
                    onCheckedChange={() => handleSessionToggle(session.id)}
                  />
                  <Label htmlFor={`session-${session.id}`} className="flex-1 cursor-pointer">
                    {session.name}
                  </Label>
                </div>
              ))}
              
              {availableSessions.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No sessions available for export
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Include Fields</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(exportOptions.fields).map(([field, isChecked]) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field}`}
                        checked={isChecked}
                        onCheckedChange={() => handleFieldToggle(field as any)}
                      />
                      <Label htmlFor={`field-${field}`} className="capitalize cursor-pointer">
                        {field === "gd1Marks" ? "GD1 Marks" : 
                         field === "gd2Marks" ? "GD2 Marks" : 
                         field === "finalScore" ? "Final Score" : 
                         field === "rollNumber" ? "Roll Number" : field}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Export Format</Label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                className="w-full"
                onClick={handleExport}
                disabled={exportOptions.sessions.length === 0}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-primary" />
            Export Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The exported file will contain the following information for the selected sessions:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {exportOptions.fields.name && (
                    <th className="py-2 px-4 text-left">Student Name</th>
                  )}
                  {exportOptions.fields.rollNumber && (
                    <th className="py-2 px-4 text-left">Roll Number</th>
                  )}
                  {exportOptions.fields.section && (
                    <th className="py-2 px-4 text-left">Section</th>
                  )}
                  {exportOptions.fields.department && (
                    <th className="py-2 px-4 text-left">Department</th>
                  )}
                  {exportOptions.fields.year && (
                    <th className="py-2 px-4 text-left">Year</th>
                  )}
                  {exportOptions.fields.gd1Marks && (
                    <th className="py-2 px-4 text-left">GD1 Marks</th>
                  )}
                  {exportOptions.fields.gd2Marks && (
                    <th className="py-2 px-4 text-left">GD2 Marks</th>
                  )}
                  {exportOptions.fields.finalScore && (
                    <th className="py-2 px-4 text-left">Final Score</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="text-muted-foreground">
                  {exportOptions.fields.name && (
                    <td className="py-2 px-4">John Doe</td>
                  )}
                  {exportOptions.fields.rollNumber && (
                    <td className="py-2 px-4">CS2001</td>
                  )}
                  {exportOptions.fields.section && (
                    <td className="py-2 px-4">A</td>
                  )}
                  {exportOptions.fields.department && (
                    <td className="py-2 px-4">Computer Science</td>
                  )}
                  {exportOptions.fields.year && (
                    <td className="py-2 px-4">2</td>
                  )}
                  {exportOptions.fields.gd1Marks && (
                    <td className="py-2 px-4">8.5</td>
                  )}
                  {exportOptions.fields.gd2Marks && (
                    <td className="py-2 px-4">7.8</td>
                  )}
                  {exportOptions.fields.finalScore && (
                    <td className="py-2 px-4">8.2</td>
                  )}
                </tr>
                {/* Sample data row */}
                <tr className="text-muted-foreground">
                  {exportOptions.fields.name && (
                    <td className="py-2 px-4">Jane Smith</td>
                  )}
                  {exportOptions.fields.rollNumber && (
                    <td className="py-2 px-4">CS2002</td>
                  )}
                  {exportOptions.fields.section && (
                    <td className="py-2 px-4">A</td>
                  )}
                  {exportOptions.fields.department && (
                    <td className="py-2 px-4">Computer Science</td>
                  )}
                  {exportOptions.fields.year && (
                    <td className="py-2 px-4">2</td>
                  )}
                  {exportOptions.fields.gd1Marks && (
                    <td className="py-2 px-4">9.2</td>
                  )}
                  {exportOptions.fields.gd2Marks && (
                    <td className="py-2 px-4">8.9</td>
                  )}
                  {exportOptions.fields.finalScore && (
                    <td className="py-2 px-4">9.1</td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default ExportReports;
