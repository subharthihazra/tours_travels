import { NextRequest, NextResponse } from "next/server";
import retriveUser from "@/lib/retriveUser";
import { Referral } from "@/models/referral";

export async function POST(req: NextRequest) {
  try {
    const userData = await retriveUser();

    if (!userData.userid) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    // todo
    const body: any = await req.json();

    if (body?.operation === "gen") {
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      await Referral.create({
        referrerId: userData.userid,
        referralCode: newCode,
        usedup: false,
      });

      return NextResponse.json(
        { info: "Success", code: newCode },
        { status: 201 }
      );
    } else if (body?.operation === "claim") {
      const referral = await Referral.find({ referralCode: body?.givenCode });
      //   console.log(referral, referral?.[0]?.referrerId , userData.userid);
      if (referral && referral.length !== 0) {
        if (
          !referral[0].referredUserId &&
          !userData.userid.equals(referral?.[0]?.referrerId)
        ) {
          await Referral.findOneAndUpdate(
            { referralCode: body?.givenCode },
            { referredUserId: userData?.userid }
          );

          return NextResponse.json({ info: "Success" }, { status: 201 });
        } else {
          return NextResponse.json({ info: "Failure" }, { status: 201 });
        }
      } else {
        return NextResponse.json({ info: "Failure" }, { status: 201 });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
