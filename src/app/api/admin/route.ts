import { NextRequest, NextResponse } from "next/server";
import retriveUser from "@/lib/retriveUser";
import { Plan } from "@/models/plan";

export async function POST(req: NextRequest) {
  try {
    const userData = await retriveUser();

    if (!userData.userid && userData.role !== "admin") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    // todo
    const body = await req.json();

    const operation: string = body.operation;

    switch (operation) {
      case "add":
        await Plan.create(body.data);
        console.log(body.data);
        break;
      case "edit":
        console.log(body.data);
        await Plan.findByIdAndUpdate(body.data._id, body.data);
        break;
      case "del":
        console.log("id.",body.id)
        await Plan.findByIdAndDelete(body.id);
        break;
    }

    return NextResponse.json({ info: "Success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
