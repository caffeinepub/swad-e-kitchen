import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  LogOut,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdmin } from "../context/AdminContext";
import type { Order } from "../context/AdminContext";
import type { LocalFoodItem } from "../data/foodData";
import { CATEGORIES } from "../data/foodData";

type MenuFormData = Omit<LocalFoodItem, "id">;

const emptyForm: MenuFormData = {
  name: "",
  description: "",
  price: 0,
  category: "Paneer",
  rating: 4.0,
  imageUrl: "",
};

function statusBadge(status: Order["status"]) {
  if (status === "Pending")
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  if (status === "Preparing")
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100">
        Preparing
      </Badge>
    );
  return (
    <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">
      Delivered
    </Badge>
  );
}

export default function AdminPage() {
  const {
    isLoggedIn,
    logout,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    orders,
    updateOrderStatus,
  } = useAdmin();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LocalFoodItem | null>(null);
  const [form, setForm] = useState<MenuFormData>(emptyForm);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/admin" });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin" });
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (item: LocalFoodItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      rating: item.rating,
      imageUrl: item.imageUrl,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Name aur Price required hai");
      return;
    }
    if (editingItem) {
      updateMenuItem({ ...form, id: editingItem.id });
      toast.success("Item update ho gaya!");
    } else {
      addMenuItem(form);
      toast.success("Naya item add ho gaya!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    deleteMenuItem(id);
    toast.success(`"${name}" delete ho gaya`);
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 font-display">
              Swad-E-Kitchen Admin
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              data-ocid="admin.tab"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              data-ocid="admin.tab"
            >
              Menu
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
              data-ocid="admin.tab"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div data-ocid="admin.dashboard.panel">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Menu Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold text-gray-900">
                        {menuItems.length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                      <span className="text-2xl font-bold text-gray-900">
                        {orders.length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Pending Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900">
                        {pendingOrders}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Delivered Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-2xl font-bold text-gray-900">
                        {deliveredOrders}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">
                  👋 Welcome back! Aaj ke pending orders dekhen aur menu manage
                  karein.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Menu Items ({menuItems.length})
              </h2>
              <Button
                onClick={openAddDialog}
                className="bg-primary hover:bg-primary/90 text-white"
                data-ocid="admin.menu.add_button"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Item
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <Table data-ocid="admin.menu.table">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Price
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Rating
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      data-ocid={`admin.menu.item.${index + 1}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">
                                🍽️
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        ₹{item.price}
                      </TableCell>
                      <TableCell>
                        <span className="text-yellow-500">★</span>{" "}
                        <span className="text-sm text-gray-700">
                          {item.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/10"
                            data-ocid={`admin.menu.edit_button.${index + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            data-ocid={`admin.menu.delete_button.${index + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Orders ({orders.length})
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <Table data-ocid="admin.orders.table">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Order ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Customer
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Items
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Total
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      data-ocid={`admin.orders.item.${index + 1}`}
                    >
                      <TableCell className="font-mono text-sm font-medium text-gray-800">
                        {order.id}
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {order.customerName}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-600 max-w-[150px]">
                          {order.items.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        ₹{order.total}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {statusBadge(order.status)}
                          <Select
                            value={order.status}
                            onValueChange={(val) =>
                              updateOrderStatus(
                                order.id,
                                val as Order["status"],
                              )
                            }
                          >
                            <SelectTrigger
                              className="h-7 text-xs w-28 border-gray-200"
                              data-ocid={`admin.orders.status.select.${index + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Preparing">
                                Preparing
                              </SelectItem>
                              <SelectItem value="Delivered">
                                Delivered
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Menu Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" data-ocid="admin.menu.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Item Edit Karein" : "Naya Item Add Karein"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-sm">Item Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Paneer Tikka"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-sm">Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Short description"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Price (₹) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: Number(e.target.value) }))
                  }
                  placeholder="150"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Rating (0–5)</Label>
                <Input
                  type="number"
                  value={form.rating}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rating: Number(e.target.value) }))
                  }
                  placeholder="4.5"
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-sm">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) =>
                    setForm((p) => ({ ...p, category: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-sm">Image URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.menu.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white"
              data-ocid="admin.menu.save_button"
            >
              {editingItem ? "Update Karein" : "Add Karein"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
