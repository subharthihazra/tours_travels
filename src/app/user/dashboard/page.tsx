"use client";

import { History, Share2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function MobileRechargeDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-b-3xl shadow-lg">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Zappy Recharge</h1>
        </div>
        <UserButton />
      </header>

      <main className="flex-grow p-4 md:p-6 space-y-6 mx-14">
        <Card
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-yellow-100"
          onClick={() => {
            router.push("/user/plans");
          }}
        >
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-500 text-white p-4 rounded-full mr-6">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-600">
                Plans & Recharge
              </h2>
              <p className="text-gray-600">
                See plans & do Quick and easy mobile recharge
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-yellow-100"
          onClick={() => {
            router.push("/user/history");
          }}
        >
          <CardContent className="flex items-center p-6">
            <div className="bg-green-500 text-white p-4 rounded-full mr-6">
              <History className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600">History</h2>
              <p className="text-gray-600">View your recharge history</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-yellow-100"
          onClick={() => {
            router.push("/user/referral");
          }}
        >
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-500 text-white p-4 rounded-full mr-6">
              <Share2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-600">Referral</h2>
              <p className="text-gray-600">Share and earn rewards</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
