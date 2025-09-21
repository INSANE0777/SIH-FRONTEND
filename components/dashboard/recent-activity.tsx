"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileCheck, FileX, Upload, MapPin, Clock } from "lucide-react"

const recentActivities = [
  {
    id: 1,
    type: "approval",
    title: "Claim FRA-MP-1247 Approved",
    description: "Individual claim in Balaghat district approved by District Collector",
    time: "2 hours ago",
    icon: FileCheck,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    type: "upload",
    title: "New Documents Processed",
    description: "15 Form-A documents processed using OCR analysis",
    time: "4 hours ago",
    icon: Upload,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    type: "rejection",
    title: "Claim FRA-MP-1248 Rejected",
    description: "Community claim rejected due to insufficient documentation",
    time: "6 hours ago",
    icon: FileX,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 4,
    type: "mapping",
    title: "Spatial Analysis Completed",
    description: "Land use classification updated for Seoni district",
    time: "8 hours ago",
    icon: MapPin,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 5,
    type: "pending",
    title: "Claim FRA-MP-1249 Under Review",
    description: "Individual claim submitted for technical verification",
    time: "1 day ago",
    icon: Clock,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and actions in the FRA system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className={`h-10 w-10 ${activity.bgColor}`}>
                  <AvatarFallback className={`${activity.bgColor} ${activity.iconColor}`}>
                    <IconComponent className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
