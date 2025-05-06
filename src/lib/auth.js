import { jwtVerify } from "jose";

export async function verifyAuth(token) {
  // console.log("token in verify", token)
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SOMETHING_JWT_SECRET)
    );
    // console.log("payload", payload)
    return {
      userId: payload.userId,
      email: payload.email,
      userName: payload.userName,
      type: payload.type,
    }
    // // };
    //   return {
    //   userId: "AI",
    //   email: "Amail",
    //   userName: "Amail",
    //   type: "Atype",
      
    // };

  } catch (e) {
    console.error(e, "Error fetching token");

    return null;
  }
}
