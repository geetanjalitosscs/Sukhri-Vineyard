"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemperatureReading } from "@/types";

interface TemperatureChartProps {
  data: TemperatureReading[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  // Map data to handle null humidity values
  const chartData = data.map((reading) => ({
    ...reading,
    humidity: reading.humidity ?? 0,
  }));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Temperature & Humidity (7 AM - 10 PM)</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              yAxisId="left" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
              label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft", style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' } }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#e5e7eb' }}
              label={{ value: "Humidity (%)", angle: 90, position: "insideRight", style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' } }} 
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke="#22c55e"
              strokeWidth={2}
              name="Temperature (°C)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Humidity (%)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

