"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Truck, Package, Star, CheckCircle, MessageSquare, Plus, Send } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { vendorsService } from "@/api";
import type { Vendor, PurchaseOrder, PurchaseOrderItem } from "@/types";

export default function VendorsPage() {
  // All hooks must be called before any conditional returns
  const [vendorsData, setVendorsData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [application, setApplication] = useState({ offer: "", amount: "", details: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vendors, purchaseOrdersData] = await Promise.all([
          vendorsService.getAll(),
          vendorsService.getPurchaseOrders(),
        ]);
        setVendorsData({
          vendors,
          ...purchaseOrdersData,
        });
        // Fetch posts from API
        try {
          const { postsService } = await import('@/api');
          const postsData = await postsService.getAll();
          setPosts(postsData || []);
        } catch (error) {
          console.error('Failed to fetch posts:', error);
          setPosts([]);
        }
      } catch (error) {
        console.error('Failed to fetch vendors data:', error);
        setVendorsData({ vendors: [], purchaseOrders: [], activeVendors: 0, openPOs: 0, closedPOs: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Early return after all hooks
  if (loading || !vendorsData) {
    return (
      <MainLayout>
        <LoadingSpinner size="md" />
      </MainLayout>
    );
  }

  const { vendors, purchaseOrders, activeVendors, openPOs, closedPOs } = vendorsData;
  const canPost = user?.role && ["owner", "hr", "admin", "gm"].includes(user.role);
  const isVendor = user?.role === "vendor";

  const handleApply = (postId: string) => {
    setSelectedPost(postId);
    setIsDialogOpen(true);
  };

  const handleSubmitApplication = (postId: string) => {
    // In real app, this would submit to backend
    if (application.offer && application.amount) {
      setIsDialogOpen(false);
      setSelectedPost(null);
      setApplication({ offer: "", amount: "", details: "" });
      toast({
        variant: "success",
        title: "Email is sent to owner",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Please fill all required fields",
        description: "Offer and quote amount are required.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Vendors & Procurement</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            {isVendor ? "View active requests and apply" : "Manage vendors and track purchase orders"}
          </p>
        </div>

        {/* Vendor Role - Active Requests in Horizontal Cards */}
        {isVendor ? (
          <>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Active Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {posts.map((post: any) => (
                    <Card key={post.id} className="border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-semibold text-foreground">{post.title}</p>
                              <Badge variant="outline" className="text-[10px] px-2 py-0">
                                {post.status}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Posted by {post.postedBy} ({post.role}) • {format(new Date(post.postedAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-foreground mb-3 leading-relaxed">{post.content}</p>
                        <div className="mb-3">
                          <p className="text-[10px] font-medium text-muted-foreground mb-1">Requirements:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {post.requirements.map((req: string, idx: number) => (
                              <li key={idx} className="text-[10px] text-muted-foreground">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleApply(post.id);
                            }}
                            className="bg-primary hover:bg-primary/90 text-xs h-8 px-4"
                            size="sm"
                          >
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Form Dialog - Opens when Apply is clicked */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Application
                  </DialogTitle>
                </DialogHeader>
                {selectedPost && (
                  <div className="space-y-4">
                    {/* Selected Post Details */}
                    <div className="p-3 rounded-md border border-border/30 bg-muted/30">
                      <p className="text-xs font-semibold text-foreground mb-1">
                        {posts.find((p: any) => p.id === selectedPost)?.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Posted by {posts.find((p: any) => p.id === selectedPost)?.postedBy} ({posts.find((p: any) => p.id === selectedPost)?.role})
                      </p>
                    </div>

                    {/* Application Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">
                          What can you provide?
                        </label>
                        <textarea
                          placeholder="I can provide organic NPK fertilizer, certified organic, suitable for grape cultivation..."
                          value={application.offer}
                          onChange={(e) => setApplication({ ...application, offer: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">
                          Your Quote Amount
                        </label>
                        <input
                          type="text"
                          placeholder="₹45,000"
                          value={application.amount}
                          onChange={(e) => setApplication({ ...application, amount: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-foreground mb-1 block">
                          Additional Details
                        </label>
                        <textarea
                          placeholder="I have 500 kg available in stock. I can deliver within 1 week. I have all necessary certifications..."
                          value={application.details}
                          onChange={(e) => setApplication({ ...application, details: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => {
                            setIsDialogOpen(false);
                            setSelectedPost(null);
                            setApplication({ offer: "", amount: "", details: "" });
                          }}
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSubmitApplication(selectedPost || "")}
                          className="flex-1 bg-primary hover:bg-primary/90"
                          size="sm"
                        >
                          <Send className="w-3 h-3 mr-2" />
                          Submit Application
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            {/* Stats Cards - Only for non-vendor roles */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Active Vendors</p>
                      <p className="text-xl font-semibold">{activeVendors}</p>
                    </div>
                    <Truck className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Open POs</p>
                      <p className="text-xl font-semibold">{openPOs}</p>
                    </div>
                    <Package className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Closed POs</p>
                      <p className="text-xl font-semibold">{closedPOs}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                      <p className="text-xl font-semibold">{purchaseOrders.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendors List */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Vendors</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {vendors.map((vendor: Vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <p className="text-xs font-medium text-foreground">{vendor.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{vendor.rating}</span>
                          </div>
                          <Badge
                            variant={vendor.status === "active" ? "success" : "outline"}
                            className="text-[10px] px-2 py-0"
                          >
                            {vendor.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {vendor.contact} • {vendor.phone}
                        </p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <p className="text-xs font-medium text-foreground">{vendor.totalOrders} orders</p>
                        <p className="text-[10px] text-muted-foreground">{vendor.activeOrders} active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Purchase Orders */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {purchaseOrders.map((po: PurchaseOrder) => (
                    <div
                      key={po.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-md border border-border/30 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <p className="text-xs font-medium text-foreground">{po.id}</p>
                          <Badge
                            variant={
                              po.status === "delivered"
                                ? "success"
                                : po.status === "approved"
                                ? "default"
                                : "warning"
                            }
                            className="text-[10px] px-2 py-0.5"
                          >
                            {po.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {po.vendor} • {Array.isArray(po.items) ? po.items.map((i: PurchaseOrderItem) => i.name || 'Unknown').join(", ") : "No items"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Expected: {po.expectedDelivery ? format(new Date(po.expectedDelivery), "MMM dd, yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Posts/Requests Section - Only for admin/hr/gm/owner */}
        {canPost && (
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Requests & Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {showPostForm && (
                <div className="mb-4 p-3 rounded-md border border-border/30 bg-muted/30">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Post Title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background"
                    />
                    <textarea
                      placeholder="Describe your requirements..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setShowPostForm(false);
                          setNewPost({ title: "", content: "" });
                        }}
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // In real app, this would save to backend
                          if (newPost.title && newPost.content) {
                            setShowPostForm(false);
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
                        size="sm"
                        className="h-7 text-xs"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {posts.map((post: any) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-md border border-border/30 bg-background hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-foreground">{post.title}</p>
                          <Badge variant="outline" className="text-[10px] px-2 py-0">
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Posted by {post.postedBy} ({post.role}) • {format(new Date(post.postedAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-foreground mb-2 leading-relaxed">{post.content}</p>
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">Requirements:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {post.requirements.map((req: string, idx: number) => (
                          <li key={idx} className="text-[10px] text-muted-foreground">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

