import { NextResponse, NextRequest } from "next/server";
import retriveUser from "@/lib/retriveUser";
import { Plan } from "@/models/plan";

export async function GET(req: NextRequest) {
  try {
    const userData = await retriveUser();

    if (!userData.userid) {
      return NextResponse.json(
        { error: "Bad Request" },
        { status: 400 }
      );
    }
    // todo
    const plans = await Plan.find({});

    return NextResponse.json({ info: "Success", data: plans }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
