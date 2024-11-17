import { NextResponse, NextRequest } from "next/server";
import retriveUser from "@/lib/retriveUser";
import { History } from "@/models/history";
import { Plan } from "@/models/plan";

export async function GET(req: NextRequest) {
  try {
    const userData = await retriveUser();

    if (!userData.userid) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    // todo
    const history: any = await History.find({ userId: userData.userid })
      .populate("planId")
      .lean();

    const flattenedHistory = history.map((record: any) => {
      const { planId, ...rest } = record;
      return {
        ...rest,
        highlights: planId?.highlights,
        name: planId?.name,
        price: planId?.price,
        startdate: planId?.startdate,
        enddate: planId?.enddate,
        destination: planId?.destination,
        duration: planId?.duration,
        description: planId?.description,
      };
    });
    // console.log(flattenedHistory)

    return NextResponse.json(
      { info: "Success", data: flattenedHistory },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
