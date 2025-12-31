"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useMemo } from "react";

export default function MyApplicationsPage() {
  // Dummy applied applications data
  const appliedApplications = useMemo(() => [
    {
      id: "APP-001",
      postId: "POST-001",
      postTitle: "Urgent Requirement: Organic Fertilizer Supply",
      appliedAt: new Date(),
      status: "pending",
      offer: "I can provide 500 kg of certified organic NPK fertilizer suitable for grape cultivation. I have all necessary certifications and can deliver within 1 week.",
      quote: "₹47,000",
      postedBy: "Rajesh Kumar",
      postedByRole: "owner"
    },
    {
      id: "APP-002",
      postId: "POST-003",
      postTitle: "CO₂ Refilling Service Required",
      appliedAt: new Date(Date.now() - 86400000 * 2),
      status: "accepted",
      offer: "I can provide monthly CO₂ refilling services for 10 barrels. I have all safety certifications and 5 years of experience in bulk refilling operations.",
      quote: "₹9,000 per month",
      postedBy: "Amit Patel",
      postedByRole: "gm"
    },
    {
      id: "APP-003",
      postId: "POST-002",
      postTitle: "Equipment Maintenance Services Needed",
      appliedAt: new Date(Date.now() - 86400000 * 5),
      status: "rejected",
      offer: "We provide comprehensive maintenance services for vineyard equipment. Our team has 10+ years of experience and we offer 24/7 emergency support.",
      quote: "₹18,000 per month",
      postedBy: "Priya Sharma",
      postedByRole: "hr"
    }
  ], []);

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">My Applications</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            View all your submitted applications
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Applied Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {appliedApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-4 rounded-md border border-border/30 bg-background hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold text-foreground">{application.postTitle}</p>
                        <Badge
                          variant={
                            application.status === "accepted"
                              ? "success"
                              : application.status === "rejected"
                              ? "destructive"
                              : "default"
                          }
                          className="text-[10px] px-2 py-0"
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2">
                        Posted by {application.postedBy} ({application.postedByRole}) • Applied on {format(application.appliedAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">My Offer:</p>
                      <p className="text-xs text-foreground leading-relaxed">{application.offer}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">My Quote:</p>
                      <p className="text-xs font-medium text-primary">{application.quote}</p>
                    </div>
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

