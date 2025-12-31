"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, AlertTriangle, TrendingUp, Plus, Send } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { inventoryService } from "@/api";
import type { InventoryItem } from "@/types";

export default function InventoryPage() {
  // All hooks must be called before any conditional returns
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [autoPostedItems, setAutoPostedItems] = useState<Set<string>>(new Set());
  const hasCheckedRef = useRef(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getAll();
        console.log('Inventory data fetched:', { itemsCount: data?.items?.length || 0, totalItems: data?.totalItems || 0 });
        // Backend already returns { items, lowStockCount, totalItems, totalValue }
        // Ensure items is always an array
        const safeData = {
          items: Array.isArray(data?.items) ? data.items : [],
          lowStockCount: data?.lowStockCount || 0,
          totalItems: data?.totalItems || 0,
          totalValue: data?.totalValue || 0,
        };
        setInventoryData(safeData);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        // Fallback to empty state
        setInventoryData({ items: [], lowStockCount: 0, totalItems: 0, totalValue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate canPost before early return
  const canPost = user?.role && ["owner", "hr", "admin", "gm"].includes(user.role);

  // Auto-create posts when stock <= (minThreshold - 10)
  // This useEffect must be before early return
  useEffect(() => {
    if (!canPost || !inventoryData?.items || !Array.isArray(inventoryData.items)) return;
    
    // Check each item for auto-post trigger
    inventoryData.items.forEach((item: any) => {
      const threshold = item.minStock - 10;
      const isBelowThreshold = item.currentStock <= threshold;
      
      // Check if already posted using functional update
      setAutoPostedItems(prev => {
        const alreadyPosted = prev.has(item.id);
        
        if (isBelowThreshold && !alreadyPosted) {
          // Auto-create post
          const postTitle = `Urgent Requirement: ${item.name} Supply`;
          const postContent = `We require ${item.name} for our vineyard operations. Current stock: ${item.currentStock} ${item.unit}, Minimum threshold: ${item.minStock} ${item.unit}. Please provide your best quote with delivery timeline.`;
          
          // Show success notification
          setTimeout(() => {
            toast({
              variant: "success",
              title: "Email is sent to vendors",
              description: `Auto-post created for ${item.name} (Stock: ${item.currentStock} ${item.unit})`,
            });
          }, 100);
          
          // In real app, this would save to backend and send email
          console.log("Auto-post created:", { title: postTitle, content: postContent, itemId: item.id });
          
          // Mark as posted
          const newSet = new Set(prev);
          newSet.add(item.id);
          return newSet;
        }
        
        return prev;
      });
    });
  }, [inventoryData?.items, canPost, toast]);

  // Early return after all hooks
  if (loading || !inventoryData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { items = [], lowStockCount = 0, totalItems = 0, totalValue = 0 } = inventoryData || {};

  const chartData = items.map((item: InventoryItem) => ({
    name: item.name.split(" ")[0],
    current: item.currentStock,
    min: item.minStock,
  }));

  const handleCreatePostFromItem = (itemName: string) => {
    setNewPost({ 
      title: `Urgent Requirement: ${itemName} Supply`,
      content: `We require ${itemName} for our vineyard operations. Please provide your best quote with delivery timeline.`
    });
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Inventory</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Track inventory levels and manage stock
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Items</p>
                  <p className="text-xl font-semibold">{totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
                  <p className="text-xl font-semibold">{lowStockCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                  <p className="text-xl font-semibold">₹{(totalValue / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">In Stock</p>
                  <p className="text-xl font-semibold">{totalItems - lowStockCount}</p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Stock Levels</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
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
                <Bar dataKey="current" fill="#22c55e" name="Current Stock" />
                <Bar dataKey="min" fill="#ef4444" name="Min Threshold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Items Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Stock</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min Stock</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Supplier</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    {canPost && (
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: InventoryItem) => {
                    const threshold = item.minStock - 10;
                    const isBelowThreshold = item.currentStock <= threshold;
                    const hasAutoPosted = autoPostedItems.has(item.id);
                    return (
                    <tr 
                      key={item.id} 
                      className={`border-b border-border/30 hover:bg-accent/30 transition-colors ${
                        isBelowThreshold && hasAutoPosted ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-xs font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">{item.category}</td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {item.currentStock} {item.unit}
                          {item.currentStock <= (item.minStock - 10) && (
                            <span className="text-[10px] text-red-500" title="Below auto-post threshold">
                              ⚠️
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">{item.supplier}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={item.status === "low" ? "warning" : "success"}
                            className="text-[10px] px-2 py-0.5"
                          >
                            {item.status === "low" ? "Low Stock" : "OK"}
                          </Badge>
                          {item.currentStock <= (item.minStock - 10) && autoPostedItems.has(item.id) && (
                            <Badge
                              variant="success"
                              className="text-[10px] px-2 py-0.5 bg-green-500"
                            >
                              Email Sent
                            </Badge>
                          )}
                        </div>
                      </td>
                      {canPost && (
                        <td className="py-2.5 px-3">
                          <Button
                            onClick={() => handleCreatePostFromItem(item.name)}
                            size="sm"
                            className="h-7 text-xs bg-primary hover:bg-primary/90"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            New Post
                          </Button>
                        </td>
                      )}
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* New Post Dialog - Opens when New Post button is clicked */}
        {canPost && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Create New Post
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    Post Title
                  </label>
                  <input
                    type="text"
                    placeholder="Urgent Requirement: Organic Fertilizer Supply"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    Description
                  </label>
                  <textarea
                    placeholder="We require 500 kg of organic NPK fertilizer for our vineyard operations. The fertilizer should be certified organic and suitable for grape cultivation..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false);
                      setNewPost({ title: "", content: "" });
                    }}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In real app, this would save to backend
                      if (newPost.title && newPost.content) {
                        setIsDialogOpen(false);
                        setNewPost({ title: "", content: "" });
                        toast({
                          variant: "success",
                          title: "Email is sent to vendors",
                        });
                      } else {
                        toast({
                          variant: "destructive",
                          title: "Please fill all fields",
                          description: "Title and description are required.",
                        });
                      }
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}

