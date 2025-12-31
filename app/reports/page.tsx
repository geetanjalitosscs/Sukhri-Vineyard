"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ReportsPage() {
  const reports = [
    {
      id: "RPT-001",
      name: "Monthly Operations Report",
      type: "Operations",
      date: "2024-01-15",
      status: "Generated",
    },
    {
      id: "RPT-002",
      name: "CO₂ Management Summary",
      type: "CO₂",
      date: "2024-01-14",
      status: "Generated",
    },
    {
      id: "RPT-003",
      name: "Inventory Analysis",
      type: "Inventory",
      date: "2024-01-13",
      status: "Generated",
    },
    {
      id: "RPT-004",
      name: "Attendance Report",
      type: "HR",
      date: "2024-01-12",
      status: "Generated",
    },
    {
      id: "RPT-005",
      name: "Vendor Performance",
      type: "Procurement",
      date: "2024-01-11",
      status: "Generated",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            View and download system reports
          </p>
        </div>

        {/* Reports List */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Available Reports</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{report.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground">{report.id}</span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <span className="text-[10px] text-muted-foreground">{report.type}</span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(report.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7"
                    onClick={() => {
                      // Create a downloadable file
                      const reportContent = `Report: ${report.name}\nID: ${report.id}\nType: ${report.type}\nDate: ${report.date}\nStatus: ${report.status}\n\nThis is a generated report from Sukri Vineyard ERP System.`;
                      const blob = new Blob([reportContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${report.name.replace(/\s+/g, '_')}_${report.id}.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-3 h-3 mr-1.5" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

