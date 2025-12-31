"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Video, Play, Pause, Download, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { attendanceService } from "@/api";
// Note: Devices API endpoint would need to be created in backend

export default function CamerasPage() {
  // All hooks must be called before any conditional returns
  const [devicesData, setDevicesData] = useState<any>({ cameras: [] });
  const [attendanceData, setAttendanceData] = useState<any>({ records: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { devicesService, attendanceService } = await import('@/api');
        const [devices, records] = await Promise.all([
          devicesService.getCameras(),
          attendanceService.getRecords(),
        ]);
        setDevicesData({ cameras: devices });
        setAttendanceData({ records });
      } catch (error) {
        console.error('Failed to fetch cameras data:', error);
        setDevicesData({ cameras: [] });
        setAttendanceData({ records: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { cameras } = devicesData;
  const { records } = attendanceData;

  const getStaffForCamera = (cameraId: string) => {
    const camera = cameras.find((c: any) => c.id === cameraId);
    if (!camera) return [];
    return records.filter((r: any) => camera.assignedStaff?.includes(r.name));
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Camera Monitoring</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Live and recorded camera feeds for staff accountability
          </p>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cameras.map((camera: any) => {
            const assignedStaff = getStaffForCamera(camera.id);
            const isSelected = selectedCamera === camera.id;

            return (
              <Card
                key={camera.id}
                className={`border-border/50 cursor-pointer transition-all ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base font-semibold">{camera.name}</CardTitle>
                    </div>
                    <Badge variant={camera.status === "active" ? "success" : "destructive"} className="text-[10px] px-2 py-0.5">
                      {camera.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{camera.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Zone</p>
                      <p className="text-sm font-medium">{camera.zone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Assigned Staff</p>
                      <div className="flex flex-wrap gap-1">
                        {assignedStaff.length > 0 ? (
                          assignedStaff.map((staff: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0">
                              {staff.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No staff assigned</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Last Sync</p>
                        <p className="text-xs font-medium">
                          {format(new Date(camera.lastSync), "MMM dd, HH:mm")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCamera(camera.id);
                            setIsLive(true);
                          }}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Live
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCamera(camera.id);
                            setIsLive(false);
                          }}
                        >
                          <Video className="w-3 h-3 mr-1" />
                          Recorded
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Camera Feed Viewer */}
        {selectedCamera && (
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    {cameras.find((c: any) => c.id === selectedCamera)?.name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isLive ? "destructive" : "default"} className="text-[10px] px-2 py-0.5">
                    {isLive ? "LIVE" : "RECORDED"}
                  </Badge>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                {isLive ? (
                  <div className="text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Live Feed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Camera feed would appear here in production
                    </p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Recorded Feed</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select a recording from the timeline below
                    </p>
                  </div>
                )}
              </div>
              {!isLive && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-foreground">Recent Recordings</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-secondary rounded p-2 cursor-pointer hover:bg-accent transition-colors"
                      >
                        <div className="aspect-video bg-muted rounded mb-1 flex items-center justify-center">
                          <Video className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(Date.now() - i * 3600000), "HH:mm")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">Staff Activity</p>
                </div>
                <div className="space-y-1">
                  {getStaffForCamera(selectedCamera).map((staff: any) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between text-xs p-2 rounded bg-accent/30"
                    >
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-muted-foreground">
                          Check-in: {staff.checkIn || "Not checked in"}
                        </p>
                      </div>
                      <Badge
                        variant={
                          staff.status === "present"
                            ? "success"
                            : staff.status === "late"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-[10px] px-2 py-0"
                      >
                        {staff.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

