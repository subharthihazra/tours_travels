import { NextRequest, NextResponse } from "next/server";
import retriveUser from "@/lib/retriveUser";
import { Plan } from "@/models/plan";
import User from "@/models/user";
import sendEmail from "@/lib/sendEmail";
import { History } from "@/models/history";
import { Referral } from "@/models/referral";

export async function GET(req: NextRequest) {
  try {
    const userData = await retriveUser();

    if (!userData.userid) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    // todo
    const userDBData = await User.findById(userData.userid);

    const referralOffer = await Referral.find({
      referredUserId: userData.userid,
      usedup: false,
    });

    return NextResponse.json(
      { info: "Success", data: userDBData, offer: referralOffer?.length !== 0 },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userData = await retriveUser();

    if (!userData.userid) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    // todo
    const body = await req.json();

    // await User.findByIdAndUpdate(userData.userid, {
    //   curPlan: body.curPlanId,
    // });

    console.log("hj", body)

    await History.create({
      userId: userData.userid,
      planId: body.curPlanId,
      phone: body.phone,
    });

    await User.findByIdAndUpdate(userData.userid, {
      curPlan: body.curPlanId,
    });

    await Referral.findOneAndUpdate(
      { referredUserId: userData.userid, usedup: false },
      { usedup: true }
    );

    const curPlan = await Plan.findById(body.curPlanId);

    console.log(curPlan);

    await sendEmail({
      price: curPlan?.price,
      plan: curPlan?.name,
      email: userData?.email,
      name: `${userData?.firstName} ${userData?.lastName}`,
    });

    return NextResponse.json({ info: "Success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
