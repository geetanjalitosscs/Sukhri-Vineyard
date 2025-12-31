"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { KPICard } from "@/components/cards/kpi-card";
import { TemperatureChart } from "@/components/charts/temperature-chart";
import { AttendanceChart } from "@/components/charts/attendance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Thermometer,
  Wind,
  Users,
  Package,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { temperatureService, co2Service, attendanceService, inventoryService, vendorsService } from "@/api";
import type { TemperatureData, TemperatureStats, Co2Barrel, Co2Data } from "@/types";

export default function OwnerDashboard() {
  const [temperatureData, setTemperatureData] = useState<TemperatureData | null>(null);
  const [co2Data, setCo2Data] = useState<Co2Data & { weeklyCompletion: number } | null>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [vendorsData, setVendorsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tempReadings, tempStats, barrels, overdue, completion, today, weeklyStats, records, inventory, vendors, purchaseOrders] = await Promise.all([
          temperatureService.getReadings(),
          temperatureService.getStats(),
          co2Service.getBarrels(),
          co2Service.getOverdue(),
          co2Service.getWeeklyCompletion(),
          attendanceService.getToday(),
          attendanceService.getWeekly(),
          attendanceService.getRecords(),
          inventoryService.getAll(),
          vendorsService.getAll(),
          vendorsService.getPurchaseOrders(),
        ]);

        const typedStats: TemperatureStats = tempStats;
        setTemperatureData({ readings: tempReadings, ...typedStats });
        setCo2Data({
          barrels,
          overdue: overdue.count,
          dueThisWeek: barrels.filter((b: Co2Barrel) => {
            const nextDue = b.nextDue ? new Date(b.nextDue) : null;
            if (!nextDue) return false;
            const today = new Date();
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return nextDue <= weekFromNow && b.status !== 'overdue';
          }).length,
          weeklyCompletion: completion,
        });
        setAttendanceData({ today, weeklyStats, records });
        // Ensure inventory has correct structure
        const inventoryData = (inventory && inventory.items) 
          ? inventory 
          : { items: [], lowStockCount: 0, totalItems: 0, totalValue: 0 };
        setInventoryData(inventoryData);
        
        // Ensure vendors data has correct structure
        const vendorsDataWithDefaults = {
          vendors: vendors || [],
          purchaseOrders: purchaseOrders?.purchaseOrders || purchaseOrders || [],
          activeVendors: purchaseOrders?.activeVendors || 0,
          openPOs: purchaseOrders?.openPOs || 0,
          closedPOs: purchaseOrders?.closedPOs || 0,
          pendingApprovals: purchaseOrders?.pendingApprovals || 0,
        };
        setVendorsData(vendorsDataWithDefaults);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        // DEMO MODE: Use fallback demo data when API fails
        const { 
          DEMO_TEMPERATURE_READINGS, 
          DEMO_TEMPERATURE_STATS, 
          DEMO_CO2_BARRELS,
          DEMO_ATTENDANCE_TODAY,
          DEMO_ATTENDANCE_RECORDS,
          DEMO_INVENTORY_ITEMS,
          DEMO_VENDORS,
          DEMO_PURCHASE_ORDERS
        } = await import('@/utils/demo-data');
        
        const demoStats: TemperatureStats = DEMO_TEMPERATURE_STATS;
        setTemperatureData({ 
          readings: DEMO_TEMPERATURE_READINGS, 
          ...demoStats 
        });
        setCo2Data({ 
          barrels: DEMO_CO2_BARRELS, 
          overdue: DEMO_CO2_BARRELS.filter(b => b.status === 'overdue').length,
          dueThisWeek: DEMO_CO2_BARRELS.filter(b => {
            const nextDue = new Date(b.nextDue);
            const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            return nextDue <= weekFromNow && b.status !== 'overdue';
          }).length,
          weeklyCompletion: 75,
        });
        setAttendanceData({ 
          today: DEMO_ATTENDANCE_TODAY, 
          weeklyStats: {}, 
          records: DEMO_ATTENDANCE_RECORDS 
        });
        setInventoryData({ 
          items: DEMO_INVENTORY_ITEMS, 
          lowStockCount: DEMO_INVENTORY_ITEMS.filter(i => i.status === 'low').length, 
          totalItems: DEMO_INVENTORY_ITEMS.length, 
          totalValue: 0 
        });
        setVendorsData({ 
          vendors: DEMO_VENDORS, 
          purchaseOrders: DEMO_PURCHASE_ORDERS, 
          activeVendors: DEMO_VENDORS.length, 
          openPOs: 1, 
          closedPOs: 0, 
          pendingApprovals: 1 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !temperatureData || !co2Data || !attendanceData || !inventoryData || !vendorsData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { today } = attendanceData;
  const avgTemp = temperatureData.average.toFixed(1);
  const co2Due = co2Data.dueThisWeek;
  const staffPresent = today.present;
  const lowStock = inventoryData.lowStockCount;
  const activeVendors = vendorsData.activeVendors;
  const criticalAlerts = co2Data.overdue + temperatureData.alerts;

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-5 w-full min-w-0">
        {/* Header */}
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Owner Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Complete overview of Sukhri Vineyard operations
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <KPICard
            title="Avg Vineyard Temperature"
            value={`${avgTemp}°C`}
            icon={Thermometer}
            trend={{ value: 2.3, isPositive: false }}
          />
          <KPICard
            title="CO₂ Barrels Due This Week"
            value={co2Due}
            icon={Wind}
            trend={{ value: 15, isPositive: false }}
          />
          <KPICard
            title="Staff Present Today"
            value={staffPresent}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="Low Stock Items"
            value={lowStock}
            icon={Package}
            trend={{ value: 10, isPositive: false }}
          />
          <KPICard
            title="Active Vendors"
            value={activeVendors}
            icon={Building2}
          />
          <KPICard
            title="Critical Alerts"
            value={criticalAlerts}
            icon={AlertTriangle}
            className="border-destructive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TemperatureChart data={temperatureData.readings} />
          <AttendanceChart present={today.present} absent={today.absent} late={today.late} />
        </div>

        {/* CO₂ Management Panel */}
        <Card className="border-border/50 w-full min-w-0">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base font-semibold truncate">CO₂ Management</CardTitle>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap hidden sm:inline">
                  Weekly Completion:
                </span>
                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap sm:hidden">
                  Completion:
                </span>
                <div className="w-20 sm:w-28 h-1.5 bg-secondary rounded-full overflow-hidden flex-shrink-0">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${co2Data.weeklyCompletion}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground min-w-[35px] flex-shrink-0">
                  {co2Data.weeklyCompletion}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
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
                  {co2Data.barrels.map((barrel: any) => (
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
                              style={{ width: `${barrel.capacity}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground min-w-[35px]">{barrel.capacity}%</span>
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

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Attendance Summary */}
          <Card className="border-border/50 w-full min-w-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Today&apos;s Attendance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {attendanceData.records.slice(0, 5).map((record: any) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">{record.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {record.role}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-xs font-medium text-foreground">
                        {record.checkIn || "Not checked in"}
                      </p>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "success"
                            : record.status === "late"
                            ? "warning"
                            : "destructive"
                        }
                        className="mt-1 text-[10px] px-1.5 py-0"
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <Card className="border-border/50 w-full min-w-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {(inventoryData?.items || [])
                  .filter((item: any) => item.status === "low")
                  .map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 px-3 rounded-md border border-yellow-500/20 bg-yellow-500/5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="text-xs font-medium text-foreground">
                          {item.currentStock} {item.unit}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Min: {item.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor & Procurement with Purchase Approvals */}
        <Card className="border-border/50 w-full min-w-0">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-base font-semibold">Vendor & Procurement</CardTitle>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                <span className="text-muted-foreground whitespace-nowrap">
                  Pending: <strong className="text-foreground font-semibold text-yellow-600">{vendorsData.pendingApprovals || 0}</strong>
                </span>
                <span className="text-muted-foreground whitespace-nowrap">
                  Open POs: <strong className="text-foreground font-semibold">{vendorsData.openPOs}</strong>
                </span>
                <span className="text-muted-foreground whitespace-nowrap">
                  Closed POs: <strong className="text-foreground font-semibold">{vendorsData.closedPOs}</strong>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {(vendorsData?.purchaseOrders || []).map((po: any) => (
                <div
                  key={po.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 px-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-medium text-foreground">{po.id}</p>
                      <Badge
                        variant={
                          po.status === "delivered"
                            ? "success"
                            : po.status === "approved"
                            ? "default"
                            : po.status === "pending_approval"
                            ? "warning"
                            : "warning"
                        }
                        className="text-[10px] px-2 py-0.5"
                      >
                        {po.status === "pending_approval" ? "Pending Approval" : po.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-words">
                      {po.vendor} • {Array.isArray(po.items) ? po.items.map((i: any) => typeof i === 'string' ? i : (i.name || i.itemName || 'Unknown')).join(", ") : (po.items || []).join(", ")}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 break-words">
                      {po.requestedBy && `Requested by: ${po.requestedByName || po.requestedBy}`}
                      {po.expectedDelivery && ` • Expected: ${format(new Date(po.expectedDelivery), "MMM dd, yyyy")}`}
                    </p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0 mt-2 sm:mt-0">
                    {po.status === "pending_approval" && (
                      <div className="flex flex-col sm:flex-row gap-1">
                        <Button size="sm" variant="default" className="text-[10px] h-6 px-2 whitespace-nowrap">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 whitespace-nowrap">
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

