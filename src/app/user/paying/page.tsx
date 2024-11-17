"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Component() {
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    function goback() {
      router.push("/user/plans");
    }
    function success() {
      setSuccess(true);
    }
    setTimeout(success, 1000);
    setTimeout(goback, 2000);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
      {success ? (
        <Card className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Payment Success!
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Processing Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
            <p className="text-lg text-center text-gray-300">
              Please wait while we process your payment. This may take a few
              moments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Paying() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <Component />
    </Suspense>
  );
}
