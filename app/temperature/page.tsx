"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { TemperatureChart } from "@/components/charts/temperature-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { temperatureService } from "@/api";
import type { TemperatureData, TemperatureReading, TemperatureStats } from "@/types";

export default function TemperaturePage() {
  const [temperatureData, setTemperatureData] = useState<TemperatureData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [readings, stats] = await Promise.all([
          temperatureService.getReadings(),
          temperatureService.getStats(),
        ]);
        console.log('Temperature data fetched:', { readingsCount: readings?.length || 0, stats });
        // Ensure readings is always an array
        const safeReadings = Array.isArray(readings) ? readings : [];
        const typedStats: TemperatureStats = stats;
        setTemperatureData({ readings: safeReadings, ...typedStats });
      } catch (error) {
        console.error('Failed to fetch temperature data:', error);
        // Fallback to empty state if API fails
        setTemperatureData({ readings: [], average: 0, max: 0, min: 0, alerts: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !temperatureData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { readings = [], average = 0, max = 0, min = 0, alerts = 0 } = temperatureData || {};

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Temperature & Weather</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Real-time temperature and humidity monitoring
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Average Temperature</p>
                  <p className="text-xl font-semibold">{average.toFixed(1)}°C</p>
                </div>
                <Thermometer className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Max Temperature</p>
                  <p className="text-xl font-semibold">{max}°C</p>
                </div>
                <Thermometer className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Min Temperature</p>
                  <p className="text-xl font-semibold">{min}°C</p>
                </div>
                <Thermometer className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Alerts</p>
                  <p className="text-xl font-semibold">{alerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        {readings.length > 0 ? (
        <TemperatureChart data={readings} />
        ) : (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No temperature data available</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Readings Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Readings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Temperature</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Humidity</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.length > 0 ? (
                    readings.slice(-10).reverse().map((reading: TemperatureReading, index: number) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 text-xs font-medium text-foreground">{reading.time}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">{reading.temperature}°C</td>
                        <td className="py-2.5 px-3 text-xs text-muted-foreground">{reading.humidity || 'N/A'}%</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            reading.status === "normal"
                              ? "success"
                              : reading.status === "warning"
                              ? "warning"
                              : "critical"
                          }
                          className="text-[10px] px-2 py-0.5"
                        >
                          {reading.status}
                        </Badge>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        No temperature readings available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

