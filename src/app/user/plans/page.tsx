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
import { ChevronLeft, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Adjusted interface for Travel Plan schema
interface IPlan {
  id: string;
  highlights: string;
  name: string;
  price: number;
  startdate: string;
  enddate: string;
  destination: string;
  duration: string;
  description?: string;
}

export default function Plans() {
  const [availablePlans, setAvailablePlans] = useState<IPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  const [currentPlan, setCurrentPlan] = useState<IPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

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

        const { data: userData } = await axios.get("/api/user", {
          withCredentials: true,
        });

        // Fetch current travel plan if user has one
        const currentPlan = data.data.find(
          (plan: IPlan) => plan.id === userData.currentPlan
        );
        setCurrentPlan(currentPlan || null);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPlans();
  }, []);

  async function handleBooking() {
    setBooking(true);
    try {
      if (!selectedPlan) {
        throw new Error("Please select a travel plan.");
      }
      const { data } = await axios.post(
        "/api/user",
        { curPlanId: selectedPlan.id },
        {
          withCredentials: true,
        }
      );
      router.push(`/user/paying?plan=${selectedPlan.name}`);
    } catch (error) {
      console.log(error);
      setBooking(false);
    }
  }

  function searchInObject(obj: any, query: string) {
    const searchString = query.toLowerCase();

    // Convert all values of the object to strings and search
    return Object.values(obj).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchString);
      }
      if (Array.isArray(value)) {
        return value.some((item) => item.toLowerCase().includes(searchString));
      }
      return false;
    });
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
            <h1 className="text-xl font-bold">Tour Travel Packages</h1>
          </div>
          <UserButton />
        </div>

        {/* Current Active Plan */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {/* Skeleton loading */}
            <div className="flex gap-3">
              <Skeleton className="w-1/4 h-[20px] rounded-full" />
              <Skeleton className="w-1/4 h-[20px] rounded-full" />
              <Skeleton className="w-1/4 h-[20px] rounded-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="w-1/4 h-[20px] rounded-full" />
              <Skeleton className="w-1/4 h-[20px] rounded-full" />
              <Skeleton className="w-1/4 h-[20px] rounded-full" />
            </div>
          </div>
        ) : (
          <>
            {currentPlan === null ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-red-800">
                    No Plan Booked Yet
                  </CardTitle>
                </CardHeader>
              </Card>
            ) : (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Destination
                    </p>
                    <p>{currentPlan?.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Plan Name
                    </p>
                    <p>{currentPlan?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Price</p>
                    <p>₹{currentPlan?.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Duration
                    </p>
                    <p>{currentPlan?.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Start Date
                    </p>
                    <p>{currentPlan?.startdate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      End Date
                    </p>
                    <p>{currentPlan?.enddate}</p>
                  </div>
                  {currentPlan?.description && (
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Description
                      </p>
                      <p>{currentPlan?.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div>
              <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md flex gap-4">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="flex-grow border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e: any) => setSearch(e.target.value)}
                />
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>

            {/* Available Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Available Travel Plans
                </CardTitle>
                <CardDescription>
                  Choose a travel plan to book your next adventure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {availablePlans
                      .filter((item: any) => searchInObject(item, search))
                      .map((plan) => (
                        <Card
                          key={plan.id}
                          className="hover:bg-blue-50 transition-colors"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <CardContent className="p-4 flex justify-between items-center">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-grow">
                              <div>
                                <p className="text-sm font-medium text-blue-600">
                                  Destination
                                </p>
                                <p>{plan.destination}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600">
                                  Plan Name
                                </p>
                                <p>{plan.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600">
                                  Price
                                </p>
                                <p>₹{plan.price}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600">
                                  Duration
                                </p>
                                <p>{plan.duration}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600">
                                  Start Date
                                </p>
                                <p>{plan.startdate}</p>
                              </div>
                              <div>
                                <Dialog>
                                  <DialogTrigger>
                                    <Button
                                      className="w-full"
                                      variant="outline"
                                    >
                                      Book Now
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        You are going to purchase ...
                                      </DialogTitle>
                                    </DialogHeader>

                                    <DialogFooter>
                                      <Button
                                        onClick={handleBooking}
                                        disabled={
                                          isLoading || !selectedPlan || booking
                                        }
                                      >
                                        Pay now
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
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
