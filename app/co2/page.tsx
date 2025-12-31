"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wind, AlertTriangle, CheckCircle, QrCode, Camera, Scan } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { co2Service } from "@/api";
import type { Co2Barrel, Co2Data, RefillForm } from "@/types";

export default function CO2Page() {
  // All hooks must be called before any conditional returns
  const [co2Data, setCo2Data] = useState<Co2Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyCompletion, setWeeklyCompletion] = useState(0);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [scannedQR, setScannedQR] = useState("");
  const [selectedBarrel, setSelectedBarrel] = useState<Co2Barrel | null>(null);
  const [refillForm, setRefillForm] = useState<RefillForm>({ quantity: "", sensorReading: "", notes: "" });
  const [isRefillDialogOpen, setIsRefillDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [barrels, overdue, completion] = await Promise.all([
          co2Service.getBarrels(),
          co2Service.getOverdue(),
          co2Service.getWeeklyCompletion(),
        ]);
        
        console.log('CO2 data fetched:', { barrelsCount: barrels?.length || 0, overdueCount: overdue?.count || 0 });
        // Ensure barrels is always an array
        const safeBarrels = Array.isArray(barrels) ? barrels : [];
        setCo2Data({
          barrels: safeBarrels,
          overdue: overdue?.count || 0,
          dueThisWeek: safeBarrels.filter((b: Co2Barrel) => {
            const nextDue = b.nextDue ? new Date(b.nextDue) : null;
            if (!nextDue) return false;
            const today = new Date();
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return nextDue <= weekFromNow && b.status !== 'overdue';
          }).length,
        });
        setWeeklyCompletion(completion || 0);
      } catch (error) {
        console.error('Failed to fetch CO2 data:', error);
        setCo2Data({ barrels: [], overdue: 0, dueThisWeek: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Early return after all hooks
  if (loading || !co2Data) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { barrels, dueThisWeek, overdue } = co2Data;
  const isGasFiller = user?.role === "gas-filler";

  const handleQRScan = (qrCode: string) => {
    const barrel = barrels.find((b: Co2Barrel) => b.qrCode === qrCode);
    if (barrel) {
      setSelectedBarrel(barrel);
      setScannedQR(qrCode);
      setIsQRScannerOpen(false);
      setIsRefillDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid QR Code",
        description: "This QR code does not match any CO₂ barrel.",
      });
    }
  };

  const handleManualQR = () => {
    if (scannedQR) {
      handleQRScan(scannedQR);
    }
  };

  const handleRefillSubmit = () => {
    if (!refillForm.quantity) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter the quantity filled.",
      });
      return;
    }

    // In real app, this would update the backend
    toast({
      variant: "success",
      title: "Refill Recorded",
      description: `CO₂ barrel ${selectedBarrel?.id} has been successfully refilled.`,
    });

    setIsRefillDialogOpen(false);
    setRefillForm({ quantity: "", sensorReading: "", notes: "" });
    setSelectedBarrel(null);
    setScannedQR("");
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">CO₂ Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Monitor and manage CO₂ barrel status and refilling schedules
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Barrels</p>
                  <p className="text-xl font-semibold">{barrels.length}</p>
                </div>
                <Wind className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due This Week</p>
                  <p className="text-xl font-semibold">{dueThisWeek}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Overdue</p>
                  <p className="text-xl font-semibold">{overdue}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Weekly Completion</p>
                  <p className="text-xl font-semibold">{weeklyCompletion}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Scanner Button for Gas Filler */}
        {isGasFiller && (
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Scan QR Code to Refill Barrel</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use your device camera or enter QR code manually
                  </p>
                </div>
                <Button onClick={() => setIsQRScannerOpen(true)} className="gap-2">
                  <QrCode className="w-4 h-4" />
                  Scan QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CO₂ Barrels Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">CO₂ Barrels</CardTitle>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground font-medium">
                  Weekly Completion:
                </span>
                <div className="w-28 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${weeklyCompletion}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground min-w-[35px]">
                  {weeklyCompletion}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Barrel ID</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Filled</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Due</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capacity</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {barrels.map((barrel: Co2Barrel) => (
                    <tr key={barrel.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 text-xs font-medium text-foreground">{barrel.id}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">
                        {barrel.lastFilled ? format(new Date(barrel.lastFilled), "MMM dd, yyyy") : "N/A"}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">
                        {barrel.nextDue ? format(new Date(barrel.nextDue), "MMM dd, yyyy") : "N/A"}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${barrel.capacity || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground min-w-[35px]">{barrel.capacity || 0}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">
                        {barrel.location}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            barrel.status === "ok" ? "success" : "critical"
                          }
                          className="text-[10px] px-2 py-0.5"
                        >
                          {barrel.status === "ok" ? "OK" : "Overdue"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* QR Scanner Dialog */}
        <Dialog open={isQRScannerOpen} onOpenChange={setIsQRScannerOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </DialogTitle>
              <DialogDescription>
                Scan the QR code on the CO₂ barrel or enter it manually
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">QR Code</label>
                <input
                  type="text"
                  value={scannedQR}
                  onChange={(e) => setScannedQR(e.target.value)}
                  placeholder="QR-CO2-001-ABC123"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleManualQR} className="flex-1">
                  <Scan className="w-4 h-4 mr-2" />
                  Process QR Code
                </Button>
                <Button variant="outline" onClick={() => setIsQRScannerOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Refill Form Dialog */}
        <Dialog open={isRefillDialogOpen} onOpenChange={setIsRefillDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record CO₂ Refill</DialogTitle>
              <DialogDescription>
                Barrel: {selectedBarrel?.id} - {selectedBarrel?.location}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity Filled (Liters)</label>
                <input
                  type="number"
                  value={refillForm.quantity}
                  onChange={(e) => setRefillForm({ ...refillForm, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sensor Reading (ppm) - Optional</label>
                <input
                  type="number"
                  value={refillForm.sensorReading}
                  onChange={(e) => setRefillForm({ ...refillForm, sensorReading: e.target.value })}
                  placeholder="e.g., 4200"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes - Optional</label>
                <textarea
                  value={refillForm.notes}
                  onChange={(e) => setRefillForm({ ...refillForm, notes: e.target.value })}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleRefillSubmit} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Record Refill
                </Button>
                <Button variant="outline" onClick={() => setIsRefillDialogOpen(false)}>
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

