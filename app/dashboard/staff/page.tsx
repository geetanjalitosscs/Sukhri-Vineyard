"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ListChecks } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { tasksService, temperatureService } from "@/api";
import type { Task, TemperatureStats } from "@/types";

export default function StaffDashboard() {
  const { user } = useAuthStore();
  const role = user?.role || "staff";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgTemperature, setAvgTemperature] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const promises: Promise<Task[] | TemperatureStats>[] = [];
        
        if (user?.id) {
          promises.push(tasksService.getByUser(user.id));
        }
        
        // Fetch temperature for caretaker role
        if (role === 'caretaker') {
          promises.push(temperatureService.getStats());
        }
        
        const results = await Promise.all(promises);
        
        if (user?.id && results[0]) {
          setTasks(results[0] as Task[] || []);
        }
        
        if (role === 'caretaker' && results[results.length - 1]) {
          const stats = results[results.length - 1] as TemperatureStats;
          setAvgTemperature(stats?.average || null);
        }
      } catch (error) {
        console.error('Failed to fetch staff dashboard data:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, role]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your tasks and assignments
          </p>
        </div>

        {/* Role Badge */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="text-2xl font-bold mt-1 capitalize">
                  {role.replace("-", " ")}
                </p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                {user?.name}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5" />
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks assigned at the moment.
              </p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {task.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <p className="font-medium">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        task.status === "completed" ? "success" : "warning"
                      }
                    >
                      {task.status}
                    </Badge>
                    {task.status === "pending" && (
                      <Button size="sm">Mark Complete</Button>
                    )}
                  </div>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-specific content */}
        {role === "gas-filler" && (
          <Card>
            <CardHeader>
              <CardTitle>CO₂ Fill Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Check barrel capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Verify safety equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Record fill date and time</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Update system status</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {role === "caretaker" && (
          <Card>
            <CardHeader>
              <CardTitle>Temperature Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record temperature readings throughout the day. Current average:{" "}
                {avgTemperature !== null ? `${avgTemperature.toFixed(1)}°C` : "Loading..."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

