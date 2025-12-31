"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { vendorsService } from "@/api";
import type { PurchaseOrdersResponse, PurchaseOrder, PurchaseOrderItem } from "@/types";

export default function VendorDashboard() {
  const [vendorsData, setVendorsData] = useState<PurchaseOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const purchaseOrdersData = await vendorsService.getPurchaseOrders();
        setVendorsData(purchaseOrdersData);
      } catch (error) {
        console.error('Failed to fetch vendor dashboard data:', error);
        setVendorsData({ purchaseOrders: [], openPOs: 0, closedPOs: 0, activeVendors: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !vendorsData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { purchaseOrders } = vendorsData;

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6 w-full min-w-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Vendor Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Purchase orders and delivery management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-bold mt-1">
                    {vendorsData.openPOs}
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold mt-1">
                    {vendorsData.closedPOs}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">
                    {purchaseOrders.length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOrders.map((po: PurchaseOrder) => (
                <div
                  key={po.id}
                  className="p-4 rounded-lg border hover:bg-accent/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <p className="font-semibold">{po.id}</p>
                        <Badge
                          variant={
                            po.status === "delivered"
                              ? "success"
                              : po.status === "approved"
                              ? "default"
                              : "warning"
                          }
                        >
                          {po.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 break-words">
                        Items: {Array.isArray(po.items) ? po.items.map((i: PurchaseOrderItem) => i.name || 'Unknown').join(", ") : "No items"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span className="whitespace-nowrap">
                          Order Date: {po.orderDate ? format(new Date(po.orderDate), "MMM dd, yyyy") : "N/A"}
                        </span>
                        <span className="whitespace-nowrap">
                          Expected: {po.expectedDelivery ? format(new Date(po.expectedDelivery), "MMM dd, yyyy") : "N/A"}
                        </span>
                        {po.deliveryDate && (
                          <span className="whitespace-nowrap">
                            Delivered: {format(new Date(po.deliveryDate), "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
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

