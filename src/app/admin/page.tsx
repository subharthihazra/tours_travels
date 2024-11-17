"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";

interface TourPlan {
  id: number;
  highlights: string;
  name: string;
  price: number;
  startdate: string;
  enddate: string;
  destination: string;
  duration: string;
  description?: string;
}

export default function AdminDashboard() {
  const [plans, setPlans] = useState<TourPlan[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TourPlan | null>(null);
  
  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data } = await axios.get("/api/plans", {
          withCredentials: true,
        });
        setPlans(data.data.map((item: any) => ({ ...item, id: item._id })));
      } catch (error: any) {
        console.log(error);
      }
    }
    fetchPlans();
  }, []);

  const handleAddPlan = async (newPlan: Omit<TourPlan, "id">) => {
    try {
      await axios.post(
        "/api/admin",
        { operation: "add", data: newPlan },
        {
          withCredentials: true,
        }
      );
      setPlans([...plans, { ...newPlan, id: plans.length + 1 }]);
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleEditPlan = async (updatedPlan: TourPlan) => {
    try {
      await axios.post(
        "/api/admin",
        { operation: "edit", data: updatedPlan },
        {
          withCredentials: true,
        }
      );
      setPlans(
        plans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
      );
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await axios.post(
        "/api/admin",
        { operation: "del", id },
        {
          withCredentials: true,
        }
      );
      setPlans(plans.filter((plan) => plan.id !== id));
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between mb-4 bg-indigo-100 p-4 rounded-full align-middle">
        <h1 className="text-xl font-bold px-2">Tours Travels Admin Dashboard</h1>
        <div className="flex justify-center">
          <UserButton />
        </div>
      </div>
      <div className="mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <PlanForm
              onSubmit={handleAddPlan}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Highlights</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.highlights}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>₹{plan.price}</TableCell>
                <TableCell>{plan.startdate}</TableCell>
                <TableCell>{plan.enddate}</TableCell>
                <TableCell>{plan.destination}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPlan(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {currentPlan && (
                          <PlanForm
                            initialData={currentPlan}
                            onSubmit={handleEditPlan}
                            onCancel={() => setIsEditDialogOpen(false)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the plan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface PlanFormProps {
  initialData?: TourPlan;
  onSubmit: any;
  onCancel: () => void;
}

function PlanForm({ initialData, onSubmit, onCancel }: PlanFormProps) {
  const [formData, setFormData] = useState<Omit<TourPlan, "id">>(
    initialData || {
      highlights: "",
      name: "",
      price: 0,
      startdate: "",
      enddate: "",
      destination: "",
      duration: "",
      description: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Plan" : "Add New Plan"}</DialogTitle>
        <DialogDescription>
          {initialData
            ? "Edit the details of the existing plan."
            : "Add a new tour and travel plan to the list."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="highlights" className="text-right">
            Highlights
          </Label>
          <Input
            id="highlights"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Plan Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startdate" className="text-right">
            Start Date
          </Label>
          <Input
            id="startdate"
            name="startdate"
            type="date"
            value={formData.startdate}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="enddate" className="text-right">
            End Date
          </Label>
          <Input
            id="enddate"
            name="enddate"
            type="date"
            value={formData.enddate}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="destination" className="text-right">
            Destination
          </Label>
          <Input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="duration" className="text-right">
            Duration
          </Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Save" : "Add Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
