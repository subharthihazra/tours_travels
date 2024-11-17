import { auth } from "@clerk/nextjs/server";
import User from "@/models/user";
import { connectToDatabase } from "./mongo";

export default async function retriveUser() {
  try {
    const sessionData = (await auth())?.sessionClaims;

    if (!sessionData) {
      return {};
    }

    await connectToDatabase();

    const {
      sub: clerkUserId,
      em: email,
      emv: isEmailVerified,
      fn: firstName,
      ln: lastName,
      mda,
    }: any = sessionData;

    let role = "user";

    if (mda?.role === "admin") role = "admin";

    if (!isEmailVerified) return {};

    let userid = null;

    const user = await User.findOne({ clerkUserId });

    // If user doesn't exist, create a new one
    if (!user) {
      const result = await User.create({
        clerkUserId,
        email,
        firstName,
        lastName,
        role,
      });
      userid = result._id;
    } else {
      userid = user._id;

      if (role !== user.role) {
        await User.findByIdAndUpdate(userid, { role });
      }
    }

    console.log("user->", {
      email,
      firstName,
      lastName,
      clerkUserId,
      role,
      isEmailVerified,
      userid,
    });

    return {
      email,
      firstName,
      lastName,
      clerkUserId,
      role,
      isEmailVerified,
      userid,
    };
  } catch (error) {
    console.log(error);

    return {};
  }
}
