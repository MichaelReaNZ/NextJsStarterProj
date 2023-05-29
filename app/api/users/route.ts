import { NextResponse } from "next/server";
import { prisma } from "../../lib/Clients/prisma";

export async function GET(request: Request) {
  const users = await prisma.user.findMany();
  console.log(users);

  return NextResponse.json(users);
}
