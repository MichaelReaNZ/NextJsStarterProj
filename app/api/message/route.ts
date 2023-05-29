import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { Message } from "@prisma/client";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  //kick out if not logged in
  if (!currentUserEmail) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const data = await req.json();

  // const newMessage: Message = {
  //   id: Math.random().toString(), //TODO: get db to autogenerate this
  // content: data.content,
  // storyId: data.storyId,
  //   authorId: currentUserEmail,
  //   role: "user",
  // };

  const createdMessage = await prisma.message.create({
    data: data.message,
  });

  const aiCreatedMessage = await prisma.message.create({
    data: {
      id: Math.random().toString(), //TODO: get db to autogenerate this
      content: "Hello world! " + Math.random().toString(),
      storyId: data.storyId,
      authorId: "AiBot33",
      role: "Bot",
    },
  });

  return NextResponse.json({ aiReplyMessage: aiCreatedMessage });
}
