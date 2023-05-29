import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  const data = await req.json();
  console.log(data.message);

  // const newMessage: Message = {
  //   id: Math.random().toString(), //TODO: get db to autogenerate this
  //   // content: data.content,
  //   content: "test content",
  //   // storyId: data.storyId,
  //   storyId: "testId",
  //   authorId: currentUserEmail,
  //   role: "user",
  // };

  const createdMessage = await prisma.message.create({
    data: data.message,
  });

  return NextResponse.json(createdMessage);
}
