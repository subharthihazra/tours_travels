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
  const [selectedRecharge, setSelectedRecharge] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState<any>([]);
  const [isloading, setisloading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchHist() {
      try {
        const { data } = await axios.get("/api/history", {
          withCredentials: true,
        });
        console.log(data);
        setRechargeHistory(
          data.data?.map((item: any) => ({ ...item, id: item._id }))
        );
      } catch (error: any) {
        console.log(error);
      }
      setisloading(false);
    }

    fetchHist();
  }, []);

  const openDialog = (recharge: any) => {
    setSelectedRecharge(recharge);
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

      {isloading && (
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
          </div>{" "}
          <div className="flex gap-3">
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
            <Skeleton className="w-1/4 h-[20px] rounded-full" />
          </div>
        </div>
      )}

      {!isloading && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rechargeHistory.map((recharge: any) => (
                <TableRow
                  key={recharge.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openDialog(recharge)}
                >
                  <TableCell className="py-3">{recharge.name}</TableCell>
                  <TableCell className="py-3">₹{recharge.amount}</TableCell>
                  <TableCell className="py-3">{recharge.phone}</TableCell>
                  <TableCell className="py-3">
                    {format(recharge.date, "dd MMM yyyy")}
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
        {selectedRecharge && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedRecharge?.name}</DialogTitle>
              <DialogDescription>Recharge details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Amount:</span>
                <span>₹{selectedRecharge?.amount}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Phone Number:</span>
                <span>{selectedRecharge?.phone}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Date:</span>
                <span>{format(selectedRecharge?.date, "dd MMM yyyy")}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Operator:</span>
                <span>{selectedRecharge?.operator}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Validity:</span>
                <span>{selectedRecharge?.validity}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Data:</span>
                <span>{selectedRecharge?.data}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Voice:</span>
                <span>{selectedRecharge?.voice}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">SMS:</span>
                <span>{selectedRecharge?.sms}</span>
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <span className="font-medium">Description</span>
                <span className="text-sm bg-slate-100 rounded-md p-3">
                  {selectedRecharge?.description}
                </span>
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
