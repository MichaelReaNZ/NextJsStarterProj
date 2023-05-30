import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/Clients/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;
  // const { infoPassedIn } = await req.json();

  const currentUserId = await prisma.user
    .findUnique({ where: { email: currentUserEmail } })
    .then((user) => user?.id!);

  const record = await prisma.story.create({
    data: {
      userId: currentUserId,
      name: "New Story " + Math.floor(Math.random() * 1000),
      id: Math.floor(Math.random() * 1000).toString(),
    },
  });

  return NextResponse.json(record);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;
  // const targetUserId = req.nextUrl.searchParams.get("targetUserId");

  const currentUserId = await prisma.user
    .findUnique({ where: { email: currentUserEmail } })
    .then((user) => user?.id!);

  const record = await prisma.story.delete({
    where: {
      id: req.nextUrl.searchParams.get("storyId")!,
    },
  });

  return NextResponse.json(record);
}
