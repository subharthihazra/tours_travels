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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {success ? (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Payment Success!
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Processing Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <p className="text-lg text-center text-gray-600">
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
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
