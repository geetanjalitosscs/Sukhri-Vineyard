"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceChartProps {
  present: number;
  absent: number;
  late?: number;
}

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

export function AttendanceChart({ present, absent, late = 0 }: AttendanceChartProps) {
  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    ...(late > 0 ? [{ name: "Late", value: late }] : []),
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Today&apos;s Attendance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

