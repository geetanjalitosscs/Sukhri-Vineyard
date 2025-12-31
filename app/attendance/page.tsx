"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { AttendanceChart } from "@/components/charts/attendance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, CheckCircle, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { attendanceService, usersService } from "@/api";

export default function AttendancePage() {
  // All hooks must be called before any conditional returns
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  
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
        console.log('Attendance data fetched:', { 
          todayPresent: today?.present || 0, 
          recordsCount: records?.length || 0,
          usersCount: users?.length || 0 
        });
        // Ensure all data is properly structured
        setAttendanceData({ 
          today: today || { present: 0, absent: 0, late: 0, onLeave: 0, total: 0, biometric: 0, faceRecognition: 0, qrCode: 0 },
          weeklyStats: weeklyStats || {},
          records: Array.isArray(records) ? records : []
        });
        setUsersData(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
        setAttendanceData({ 
          today: { present: 0, absent: 0, late: 0, onLeave: 0, total: 0, biometric: 0, faceRecognition: 0, qrCode: 0 },
          weeklyStats: {},
          records: []
        });
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

  // Calculate actual staff count from users (excluding owner, admin, hr, gm, vendor)
  const staffUsers = usersData.filter((u: any) =>
    ["cleaner", "caretaker", "gas-filler", "staff"].includes(u.role)
  );
  const totalStaff = staffUsers.length;

  const weeklyData = Object.entries(weeklyStats).map(([day, stats]: [string, any]) => ({
    day: day.substring(0, 3),
    present: stats.present,
    absent: stats.absent,
  }));

  // Normalize method names: face and qr -> biometric
  const normalizeMethod = (method: string | null) => {
    if (!method) return null;
    if (method === "face" || method === "qr") return "biometric";
    return method;
  };

  // Determine gender based on name to show appropriate image
  const getImageForRecord = (name: string) => {
    const femaleNames = ["sarah", "emma", "mary", "jane", "lisa", "anna", "sophia", "olivia", "emily", "jessica"];
    const firstName = name.split(" ")[0].toLowerCase();
    return femaleNames.includes(firstName) ? "/P1.jpg" : "/P2.jpg";
  };

  const handleViewImage = (record: any) => {
    setSelectedRecord(record);
    setIsImageDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Staff & Attendance</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Track staff attendance and manage schedules
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Staff</p>
                  <p className="text-xl font-semibold">{totalStaff}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Present</p>
                  <p className="text-xl font-semibold">{today.present}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Absent</p>
                  <p className="text-xl font-semibold">{today.absent}</p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">On Leave</p>
                  <p className="text-xl font-semibold">{today.onLeave}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AttendanceChart present={today.present} absent={today.absent} late={today.late} />
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Weekly Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: '11px', 
                      padding: '8px', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }} 
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconSize={12}
                  />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} name="Present" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check In</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check Out</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record: any) => (
                    <tr key={record.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 text-xs font-medium text-foreground">{record.name}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">{record.role}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">{record.checkIn || "-"}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">{record.checkOut || "-"}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {record.method ? (
                            <Badge variant="outline" className="text-[10px] px-2 py-0">
                              {normalizeMethod(record.method)}
                            </Badge>
                          ) : (
                            "-"
                          )}
                          {record.method && record.checkIn && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-accent"
                              onClick={() => handleViewImage(record)}
                            >
                              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            record.status === "present"
                              ? "success"
                              : record.status === "late"
                              ? "warning"
                              : "destructive"
                          }
                          className="text-[10px] px-2 py-0.5"
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

        {/* Image View Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex flex-col max-h-[82vh] overflow-auto">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-sm font-semibold">
                  Check-in Verification
                </DialogTitle>
              </DialogHeader>
              {selectedRecord && (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground text-sm">
                      {selectedRecord.name} - {selectedRecord.role}
                    </p>
                    <p>
                      Check-in Time:{" "}
                      <span className="font-semibold text-foreground">
                        {selectedRecord.checkIn}
                      </span>
                    </p>
                    <p>
                      Method:{" "}
                      <span className="font-semibold text-foreground">
                        {normalizeMethod(selectedRecord.method)}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src={getImageForRecord(selectedRecord.name)}
                      alt={`Check-in verification for ${selectedRecord.name}`}
                      width={260}
                      height={260}
                      className="w-full h-auto max-w-[260px] max-h-[60vh] rounded-lg border border-border object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

