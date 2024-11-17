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

interface Plan {
  id: number;
  operator: string;
  name: string;
  amount: number;
  validity: string;
  data: string;
  voice: string;
  sms: string;
  description: string;
}

export default function AdminDashboard() {
  const [plans, setPlans] = useState<Plan[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
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

  const handleAddPlan = async (newPlan: Omit<Plan, "id">) => {
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

  const handleEditPlan = async (updatedPlan: Plan) => {
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
              <TableHead>Operator</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Voice</TableHead>
              <TableHead>SMS</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.operator}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>₹{plan.amount}</TableCell>
                <TableCell>{plan.validity}</TableCell>
                <TableCell>{plan.data}</TableCell>
                <TableCell>{plan.voice}</TableCell>
                <TableCell>{plan.sms}</TableCell>
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
  initialData?: Plan;
  onSubmit: any;
  onCancel: () => void;
}

function PlanForm({ initialData, onSubmit, onCancel }: PlanFormProps) {
  const [formData, setFormData] = useState<Omit<Plan, "id">>(
    initialData || {
      operator: "",
      name: "",
      amount: 0,
      validity: "",
      data: "",
      voice: "",
      sms: "",
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
            : "Add a new tours and travels plan to the list."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="operator" className="text-right">
            Operator
          </Label>
          <Input
            id="operator"
            name="operator"
            value={formData.operator}
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
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="validity" className="text-right">
            Validity
          </Label>
          <Input
            id="validity"
            name="validity"
            value={formData.validity}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="data" className="text-right">
            Data
          </Label>
          <Input
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="voice" className="text-right">
            Voice
          </Label>
          <Input
            id="voice"
            name="voice"
            value={formData.voice}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sms" className="text-right">
            SMS
          </Label>
          <Input
            id="sms"
            name="sms"
            value={formData.sms}
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
            value={formData.description}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Add Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
