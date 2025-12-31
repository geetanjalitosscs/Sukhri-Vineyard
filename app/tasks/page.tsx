"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListChecks, Plus, User, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { usersService, co2Service } from "@/api";
// Note: Tasks API endpoint would need to be created in backend

export default function TasksPage() {
  // All hooks must be called before any conditional returns
  const [tasksData, setTasksData] = useState<any>({ tasks: [], pendingTasks: 0, inProgressTasks: 0, completedToday: 0 });
  const [usersData, setUsersData] = useState<any[]>([]);
  const [co2Data, setCo2Data] = useState<any>({ barrels: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "cleaning",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    location: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { usersService, co2Service, tasksService } = await import('@/api');
        const [users, barrels, tasks] = await Promise.all([
          usersService.getAll(),
          co2Service.getBarrels(),
          tasksService.getAll(),
        ]);
        setUsersData(users);
        setCo2Data({ barrels });
        setTasksData(tasks);
      } catch (error) {
        console.error('Failed to fetch tasks data:', error);
        setTasksData({ tasks: [], pendingTasks: 0, inProgressTasks: 0, completedToday: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { tasks, pendingTasks, inProgressTasks, completedToday } = tasksData;

  const isGM = user?.role === "gm" || user?.role === "owner" || user?.role === "admin";
  const staffUsers = usersData.filter((u: any) => ["cleaner", "caretaker", "gas-filler"].includes(u.role));

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields.",
      });
      return;
    }

    try {
      // Find the assigned user by name
      const assignedUser = staffUsers.find((u: any) => u.name === newTask.assignedTo);
      if (!assignedUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Selected staff member not found.",
        });
        return;
      }

      // Find barrel ID if it's a CO2 refill task
      let barrelId = undefined;
      if (newTask.type === "co2_refill" && newTask.location) {
        const barrel = co2Data.barrels.find((b: any) => b.location === newTask.location);
        if (barrel) {
          barrelId = barrel.id;
        }
      }

      const { tasksService } = await import('@/api');
      await tasksService.create({
        title: newTask.title,
        type: newTask.type,
        assignedToUserId: assignedUser.id,
        assignedToName: assignedUser.name,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        barrelId: barrelId,
        location: newTask.location || undefined,
        createdByUserId: user?.id,
      });

      // Refresh tasks list
      const tasks = await tasksService.getAll();
      setTasksData(tasks);

      setIsCreateDialogOpen(false);
      setNewTask({
        title: "",
        type: "cleaning",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
        location: "",
      });

      toast({
        variant: "success",
        title: "Task Created",
        description: `Task "${newTask.title}" has been assigned successfully.`,
      });
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create task. Please try again.",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Task Management</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
              Assign and track tasks for staff members
            </p>
          </div>
          {isGM && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pending Tasks</p>
                  <p className="text-xl font-semibold">{pendingTasks}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                  <p className="text-xl font-semibold">{inProgressTasks}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completed Today</p>
                  <p className="text-xl font-semibold">{completedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Tasks</p>
                  <p className="text-xl font-semibold">{tasks.length}</p>
                </div>
                <ListChecks className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">All Tasks</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {tasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <Badge variant={getPriorityColor(task.priority)} className="text-[10px] px-2 py-0">
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          {task.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                        </div>
                        {task.location && (
                          <span className="text-[10px]">📍 {task.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.status === "completed"
                        ? "success"
                        : task.status === "in_progress"
                        ? "warning"
                        : "destructive"
                    }
                    className="text-[10px] px-2 py-0.5"
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create Task Dialog */}
        {isGM && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Assign a task to a staff member</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Clean Block A - Row 1-5"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="cleaning">Cleaning</option>
                    <option value="co2_refill">CO₂ Refill</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select staff member</option>
                    {staffUsers.map((staff: any) => (
                      <option key={staff.id} value={staff.name}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                {newTask.type === "co2_refill" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Barrel Location</label>
                    <select
                      value={newTask.location}
                      onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select barrel</option>
                      {co2Data.barrels.map((barrel: any) => (
                        <option key={barrel.id} value={barrel.location}>
                          {barrel.id} - {barrel.location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleCreateTask} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}

