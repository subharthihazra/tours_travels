"use client";

import { History, Share2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function MobileRechargeDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center rounded-xl shadow-lg mx-4 mt-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Tours and Travels Dashboard</h1>
        </div>
        <UserButton />
      </header>

      <main className="flex-grow p-4 md:p-6 space-y-6 mx-14 mt-4">
        <Card
          className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-green-600"
          onClick={() => {
            router.push("/user/plans");
          }}
        >
          <CardContent className="flex items-center p-6">
            <div>
              <h2 className="text-2xl font-bold text-green-400">
                View plans and purchase
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-green-600"
          onClick={() => {
            router.push("/user/history");
          }}
        >
          <CardContent className="flex items-center p-6">
            <div>
              <h2 className="text-2xl font-bold text-green-400">
                History of booking
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-green-600"
          onClick={() => {
            router.push("/user/referral");
          }}
        >
          <CardContent className="flex items-center p-6">
            <div>
              <h2 className="text-2xl font-bold text-green-400">
                Referral Program
              </h2>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
