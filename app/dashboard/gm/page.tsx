"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { KPICard } from "@/components/cards/kpi-card";
import { TemperatureChart } from "@/components/charts/temperature-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Wind, Package, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { temperatureService, co2Service, inventoryService } from "@/api";
import type { TemperatureData, TemperatureStats, Co2Barrel, Co2Data } from "@/types";

export default function GMDashboard() {
  const [temperatureData, setTemperatureData] = useState<TemperatureData | null>(null);
  const [co2Data, setCo2Data] = useState<Co2Data | null>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tempReadings, tempStats, barrels, overdue, inventory] = await Promise.all([
          temperatureService.getReadings(),
          temperatureService.getStats(),
          co2Service.getBarrels(),
          co2Service.getOverdue(),
          inventoryService.getAll(),
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
        });
        setInventoryData(inventory);
      } catch (error) {
        console.error('Failed to fetch GM dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !temperatureData || !co2Data || !inventoryData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const avgTemp = temperatureData.average.toFixed(1);
  const co2Due = co2Data.dueThisWeek;
  const lowStock = inventoryData.lowStockCount;
  const criticalAlerts = co2Data.overdue + temperatureData.alerts;

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-5 w-full min-w-0">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">General Manager Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Operations overview and management
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Avg Temperature"
            value={`${avgTemp}°C`}
            icon={Thermometer}
          />
          <KPICard
            title="CO₂ Due This Week"
            value={co2Due}
            icon={Wind}
          />
          <KPICard
            title="Low Stock Items"
            value={lowStock}
            icon={Package}
          />
          <KPICard
            title="Critical Alerts"
            value={criticalAlerts}
            icon={AlertTriangle}
            className="border-destructive"
          />
        </div>

        {/* Temperature Chart */}
        <TemperatureChart data={temperatureData.readings} />

        {/* CO₂ Management */}
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Management - Priority Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {co2Data.barrels
                .filter((b: any) => b.status === "overdue")
                .map((barrel: any) => (
                  <div
                    key={barrel.id}
                    className="p-4 rounded-lg border border-destructive/20 bg-destructive/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{barrel.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {barrel.location} • Due:{" "}
                          {format(new Date(barrel.nextDue), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <Badge variant="critical">Overdue</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryData.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.status === "low"
                      ? "border-destructive/20 bg-destructive/5"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {item.currentStock} {item.unit}
                    </p>
                    <Badge
                      variant={item.status === "low" ? "destructive" : "success"}
                      className="mt-1"
                    >
                      {item.status === "low" ? "Low Stock" : "OK"}
                    </Badge>
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

