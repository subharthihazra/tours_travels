"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function History() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [planHistory, setPlanHistory] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await axios.get("/api/history", {
          withCredentials: true,
        });

        console.log(data);

        setPlanHistory(
          data.data?.map((item: any) => ({ ...item, id: item._id }))
        );
      } catch (error: any) {
        console.log(error);
      }

      setIsLoading(false);
    }

    fetchHistory();
  }, []);

  const openDialog = (plan: any) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between mb-4 bg-blue-200 p-4 rounded-full align-middle">
        <div className="flex gap-2 px-2">
          <ChevronLeft
            onClick={() => {
              router.push("/user/dashboard");
            }}
          />
          <h1 className="text-xl font-bold">Recharge History</h1>
        </div>
        <UserButton />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planHistory.map((plan: any) => (
                <TableRow
                  key={plan.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openDialog(plan)}
                >
                  <TableCell className="py-3">{plan.name}</TableCell>
                  <TableCell className="py-3">₹{plan.price}</TableCell>
                  <TableCell className="py-3">{plan.destination}</TableCell>
                  <TableCell className="py-3">
                    {format(new Date(plan.startdate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="py-3">
                    <ChevronRight className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedPlan && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedPlan?.name}</DialogTitle>
              <DialogDescription>Purchase details</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Price:</span>
                <span>₹{selectedPlan?.price}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Destination:</span>
                <span>{selectedPlan?.destination}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Start Date:</span>
                <span>{format(new Date(selectedPlan?.startdate), "dd MMM yyyy")}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">End Date:</span>
                <span>{format(new Date(selectedPlan?.enddate), "dd MMM yyyy")}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Duration:</span>
                <span>{selectedPlan?.duration} days</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Description:</span>
                <span>{selectedPlan?.description}</span>
              </div>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
