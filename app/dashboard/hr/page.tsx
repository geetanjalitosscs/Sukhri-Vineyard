"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceChart } from "@/components/charts/attendance-chart";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, FileText, DollarSign, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { attendanceService, usersService } from "@/api";
import type { WeeklyStatsResponse, AttendanceRecord, User } from "@/types";

export default function HRDashboard() {
  // All hooks must be called before any conditional returns
  const [attendanceData, setAttendanceData] = useState<{
    today: any;
    weeklyStats: WeeklyStatsResponse;
    records: AttendanceRecord[];
  } | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [salaryData, setSalaryData] = useState({
    baseSalary: "",
    allowances: "",
    deductions: "",
    month: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [today, weeklyStats, records, users] = await Promise.all([
          attendanceService.getToday(),
          attendanceService.getWeekly(),
          attendanceService.getRecords(),
          usersService.getAll(),
        ]);
        setAttendanceData({ today, weeklyStats, records });
        setUsersData(users);
      } catch (error) {
        console.error('Failed to fetch HR dashboard data:', error);
        setAttendanceData({ today: { present: 0, absent: 0, late: 0, onLeave: 0 }, weeklyStats: {}, records: [] });
        setUsersData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Early return after all hooks
  if (loading || !attendanceData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { today, records, weeklyStats } = attendanceData;

  const staffUsers = usersData.filter((u: User) =>
    ["cleaner", "caretaker", "gas-filler", "staff"].includes(u.role)
  );

  const handleSalarySubmit = () => {
    if (!salaryData.baseSalary || !selectedStaff) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields.",
      });
      return;
    }

    toast({
      variant: "success",
      title: "Salary Recorded",
      description: `Salary for ${selectedStaff.name} has been successfully recorded.`,
    });

    setIsSalaryDialogOpen(false);
    setSelectedStaff(null);
    setSalaryData({
      baseSalary: "",
      allowances: "",
      deductions: "",
      month: new Date().toISOString().slice(0, 7),
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-5 w-full min-w-0">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">HR Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Staff management and attendance overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold mt-1">{staffUsers.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                  <p className="text-2xl font-bold mt-1">{today.present}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Absent Today</p>
                  <p className="text-2xl font-bold mt-1">{today.absent}</p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                  <p className="text-2xl font-bold mt-1">{today.onLeave}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart present={today.present} absent={today.absent} late={today.late} />
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(weeklyStats).map(([day, stats]: [string, { present: number; absent: number }]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{day}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${
                              (stats.present / (stats.present + stats.absent)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-20 text-right">
                        {stats.present}/{stats.present + stats.absent}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium">Name</th>
                    <th className="text-left p-3 text-sm font-medium">Role</th>
                    <th className="text-left p-3 text-sm font-medium">Check In</th>
                    <th className="text-left p-3 text-sm font-medium">Check Out</th>
                    <th className="text-left p-3 text-sm font-medium">Method</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-accent/50">
                      <td className="p-3 font-medium">{record.name}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {record.role}
                      </td>
                      <td className="p-3">{record.checkIn || "-"}</td>
                      <td className="p-3">{record.checkOut || "-"}</td>
                      <td className="p-3">
                        {record.method ? (
                          <Badge variant="outline">{record.method}</Badge>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            record.status === "present"
                              ? "success"
                              : record.status === "late"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Salary Management */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base font-semibold">Salary Management</CardTitle>
              <Button onClick={() => setIsSalaryDialogOpen(true)} className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Record Salary
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {staffUsers.slice(0, 5).map((staff: User) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{staff.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      Pending
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStaff(staff);
                        setIsSalaryDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Salary Input Dialog */}
        <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Record Salary
              </DialogTitle>
              <DialogDescription>
                {selectedStaff
                  ? `Enter salary details for ${selectedStaff.name}`
                  : "Select a staff member and enter salary details"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!selectedStaff && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Staff Member</label>
                  <select
                    onChange={(e) => {
                      const staff = staffUsers.find((u: User) => u.id === e.target.value);
                      setSelectedStaff(staff || null);
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select staff member</option>
                    {staffUsers.map((staff: User) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedStaff && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Month</label>
                    <input
                      type="month"
                      value={salaryData.month}
                      onChange={(e) => setSalaryData({ ...salaryData, month: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Base Salary (₹)</label>
                    <input
                      type="number"
                      value={salaryData.baseSalary}
                      onChange={(e) => setSalaryData({ ...salaryData, baseSalary: e.target.value })}
                      placeholder="Enter base salary"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Allowances (₹) - Optional</label>
                    <input
                      type="number"
                      value={salaryData.allowances}
                      onChange={(e) => setSalaryData({ ...salaryData, allowances: e.target.value })}
                      placeholder="Enter allowances"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deductions (₹) - Optional</label>
                    <input
                      type="number"
                      value={salaryData.deductions}
                      onChange={(e) => setSalaryData({ ...salaryData, deductions: e.target.value })}
                      placeholder="Enter deductions"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="p-3 rounded-md bg-accent/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Net Salary:</span>
                      <span className="text-lg font-bold">
                        ₹
                        {(
                          Number(salaryData.baseSalary || 0) +
                          Number(salaryData.allowances || 0) -
                          Number(salaryData.deductions || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSalarySubmit} className="flex-1" disabled={!selectedStaff}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Record Salary
                </Button>
                <Button variant="outline" onClick={() => setIsSalaryDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

