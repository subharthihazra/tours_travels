"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wifi, Phone, MessageSquare, Info, ChevronLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for the current plan and available plans

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

export default function Plans() {
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [offer, setOffer] = useState<boolean>(false);
  const [isloading, setisloading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data } = await axios.get("/api/plans", {
          withCredentials: true,
        });
        setAvailablePlans(
          data.data?.map((item: any) => ({ ...item, id: item._id }))
        );

        const { data: data2 } = await axios.get("/api/user", {
          withCredentials: true,
        });
        console.log(data2);
        console.log(data.data);
        const curPlan = data.data?.filter(
          (item: any) => item._id === data2.data.curPlan
        );
        if (data2.offer) {
          setOffer(true);
        }
        console.log(curPlan);
        setCurrentPlan(curPlan.length === 1 ? curPlan?.[0] : null);
        setisloading(false);
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchPlans();
  }, []);

  async function handlePay() {
    try {
      if (!phone) {
        throw new Error("Enter Phone No.");
      }
      const { data } = await axios.post(
        "/api/user",
        { curPlanId: selectedPlan?.id, phone },
        {
          withCredentials: true,
        }
      );
      router.push(
        `/user/paying?amount=${currentPlan?.amount}${offer && "&offer=true"}`
      );
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-row justify-between mb-4 bg-zinc-200 p-4 rounded-full align-middle">
          <div className="flex gap-2 px-2">
            <ChevronLeft
              onClick={() => {
                router.push("/user/dashboard");
              }}
            />
            <h1 className="text-xl font-bold">Tours Travels Plans</h1>
          </div>
          <UserButton />
        </div>
        {/* Current Active Plan */}

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
          <>
            {currentPlan === null ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-red-800">
                    No Plan Bought Before
                  </CardTitle>
                </CardHeader>
              </Card>
            ) : (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">
                    Last Bought Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Operator
                    </p>
                    <p>{currentPlan?.operator}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Plan Name
                    </p>
                    <p>{currentPlan?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Amount</p>
                    <p>₹{currentPlan?.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Validity
                    </p>
                    <p>{currentPlan?.validity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Data</p>
                    <p>{currentPlan?.data}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Voice</p>
                    <p>{currentPlan?.voice}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">SMS</p>
                    <p>{currentPlan?.sms}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {offer && (
              <div className="w-full mx-auto">
                <div className="text-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-lg py-3">
                  <div className="text-xl font-bold">
                    {`You've Got an Offer by Referral!`}
                  </div>
                  <div className="text-white">
                    Claim it by selecting a pack below for FREE!
                  </div>
                </div>
              </div>
            )}

            {/* Available Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Available Plans</CardTitle>
                <CardDescription>
                  Choose from our selection of plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {availablePlans.map((plan, index) => (
                      <Card
                        key={index}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-grow">
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                Operator
                              </p>
                              <p>{plan.operator}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                Plan Name
                              </p>
                              <p>{plan.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                Amount
                              </p>
                              <p>₹{plan.amount}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                Validity
                              </p>
                              <p>{plan.validity}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                Data
                              </p>
                              <p>{plan.data}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                Voice
                              </p>
                              <p>{plan.voice}</p>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="ml-4"
                                onClick={() => setSelectedPlan(plan)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="text-blue-800">
                                  {plan.name} Details
                                </DialogTitle>
                                <DialogDescription>
                                  Comprehensive information about the selected
                                  plan
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    Operator
                                  </p>
                                  <p>{plan.operator}</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    Plan Name
                                  </p>
                                  <p>{plan.name}</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    Amount
                                  </p>
                                  <p>₹{plan.amount}</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    Validity
                                  </p>
                                  <p>{plan.validity}</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    Data
                                  </p>
                                  <p className="flex items-center">
                                    <Wifi className="w-4 h-4 mr-2" />
                                    {plan.data}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    Voice
                                  </p>
                                  <p className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {plan.voice}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <p className="text-sm font-medium text-blue-600">
                                    SMS
                                  </p>
                                  <p className="flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    {plan.sms}
                                  </p>
                                </div>
                                {plan.description && (
                                  <div className="col-span-2">
                                    <p className="text-sm font-medium text-blue-600">
                                      Description
                                    </p>
                                    <p className="flex items-start mt-1">
                                      <Info className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                                      {plan.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <div className="flex gap-2 flex-grow">
                                  <Input
                                    type="text"
                                    value={phone || ""}
                                    placeholder="Enter Mobile Number to Recharge"
                                    onChange={(e) =>
                                      setPhone(
                                        e.target.value.replace(/[^0-9+]/g, "")
                                      )
                                    }
                                  />
                                  <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={handlePay}
                                  >
                                    {offer
                                      ? "Claim for Free"
                                      : "Proceed to Pay"}
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
