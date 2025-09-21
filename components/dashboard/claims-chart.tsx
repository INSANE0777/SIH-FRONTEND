"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const claimsData = [
  { month: "Jan", approved: 245, pending: 89, rejected: 34 },
  { month: "Feb", approved: 312, pending: 76, rejected: 28 },
  { month: "Mar", approved: 289, pending: 94, rejected: 41 },
  { month: "Apr", approved: 356, pending: 102, rejected: 38 },
  { month: "May", approved: 298, pending: 87, rejected: 29 },
  { month: "Jun", approved: 334, pending: 95, rejected: 45 },
]

const statusData = [
  { name: "Approved", value: 65.7, color: "#0280af" },
  { name: "Pending", value: 25.2, color: "#71c9cd" },
  { name: "Rejected", value: 9.1, color: "#84c5e2" },
]

export function ClaimsChart() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Claims Processing Trends</CardTitle>
          <CardDescription>Monthly breakdown of claim statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="approved" fill="#0280af" name="Approved" />
              <Bar dataKey="pending" fill="#71c9cd" name="Pending" />
              <Bar dataKey="rejected" fill="#84c5e2" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Status Distribution</CardTitle>
          <CardDescription>Current breakdown of all claims</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
