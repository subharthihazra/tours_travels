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
    <div className="min-h-screen mx-auto p-6 bg-gray-800 text-white w-full">
      <div className="flex flex-row justify-between mb-6 bg-gray-900 p-6 rounded-xl">
        <h1 className="text-xl font-bold px-2 text-green-500">Tours Travels Admin Dashboard</h1>
        <div className="flex justify-center">
          <UserButton />
        </div>
      </div>
      <div className="mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800">
            <PlanForm
              onSubmit={handleAddPlan}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table className="bg-gray-900 text-white rounded-lg">
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
              <TableRow key={plan.id} className="hover:bg-gray-700">
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
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
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
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
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
                          <AlertDialogCancel className="bg-gray-600 text-white">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlan(plan.id)}
                            className="bg-red-600 text-white"
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
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle className="text-green-500">{initialData ? "Edit Plan" : "Add New Plan"}</DialogTitle>
        <DialogDescription className="text-white">
          {initialData
            ? "Edit the details of the existing plan."
            : "Add a new tour and travel plan to the list."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="highlights" className="text-right text-white">
            Highlights
          </Label>
          <Input
            type="text"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-white">
            Plan Name
          </Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right text-white">
            Price
          </Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startdate" className="text-right text-white">
            Start Date
          </Label>
          <Input
            type="date"
            name="startdate"
            value={formData.startdate}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="enddate" className="text-right text-white">
            End Date
          </Label>
          <Input
            type="date"
            name="enddate"
            value={formData.enddate}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="destination" className="text-right text-white">
            Destination
          </Label>
          <Input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="duration" className="text-right text-white">
            Duration
          </Label>
          <Input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right text-white">
            Description
          </Label>
          <Textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="col-span-3 text-white"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="text-gray-500">
          Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
          {initialData ? "Update Plan" : "Add Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
