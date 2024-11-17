"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { ChevronLeft, ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Component() {
  const [referralCode, setReferralCode] = useState("");
  const [claimCode, setClaimCode] = useState("");
  const [isloading, setisloading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const generateReferralCode = async () => {
    setisloading(true);
    try {
      const { data } = await axios.post(
        "/api/referral",
        {
          operation: "gen",
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);

      setReferralCode(data.code);
    } catch (error: any) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const claimReferralCode = async () => {
    setisloading(true);
    try {
      const { data } = await axios.post(
        "/api/referral",
        {
          operation: "claim",
          givenCode: claimCode,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data?.info === "Success") {
        toast({
          title: "Claimed!",
          description: `Referral code ${claimCode} has been claimed. You will get free benifits!`,
        });
        setClaimCode("");
      } else {
        toast({
          title: "Failed!",
          description: `Referral code ${claimCode} can't be claimed!`,
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };

  return (
    <div>
      <div className="fixed left-4 right-4 top-4 flex flex-row justify-between mb-4 bg-[#2f4f4f] p-4 rounded-xl align-middle">
        <div className="flex gap-2 px-2">
          <ChevronLeft className="text-white"
            onClick={() => {
              router.push("/user/dashboard");
            }}
          />
          <h1 className="text-xl font-bold text-white">Referral Program</h1>
        </div>
        <div className="flex justify-center">
          <UserButton />
        </div>
      </div>
      <div className="h-screen flex place-items-center bg-[#1e3d3d]">
        <Card className="w-full max-w-md mx-auto h-fit bg-[#2f4f4f] border-2 border-[#4c6b6b] rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Referral Program</CardTitle>
            <CardDescription className="text-gray-200">Generate or claim a referral code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="referral-code" className="text-white">Your Referral Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="referral-code"
                  value={referralCode}
                  readOnly
                  placeholder="Generate a code"
                  className="bg-[#4c6b6b] text-white"
                />
                <Button
                  onClick={generateReferralCode}
                  className="bg-[#3e7a7a] text-white"
                  disabled={isloading}
                >
                  Generate
                </Button>
              </div>
              <Button
                onClick={copyReferralCode}
                disabled={!referralCode}
                variant="outline"
                className="w-full border-[#4c6b6b] text-white"
              >
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>
            <div className="space-y-4">
              <Label htmlFor="claim-code" className="text-white">Claim a Referral Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="claim-code"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="bg-[#4c6b6b] text-white"
                />
                <Button
                  onClick={claimReferralCode}
                  disabled={!claimCode || isloading}
                  className="bg-[#3e7a7a] text-white"
                >
                  Claim
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  );
}
