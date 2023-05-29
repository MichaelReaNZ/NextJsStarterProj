import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/Clients/prisma";
import { Message } from "@prisma/client";
import openAiApiClient from "@/app/lib/Clients/openai-client";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

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

  //Array<ChatCompletionRequestMessage>
  const formattedPreCompletionMessages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: "You are a helpful assistant.",
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: data.message.content,
    },
  ];

  var completionRequest: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: formattedPreCompletionMessages,
    temperature: 0.7,
    top_p: 1,
    max_tokens: 500,
    stream: false,
    user: "Mike",
  };

  try {
    const completion = await openAiApiClient.createChatCompletion(
      completionRequest
    );

    const response: string = completion.data.choices[0].message!.content;

    const aiCreatedMessage = prisma.message.create({
      //DO we need to await here?
      data: {
        id: Math.random().toString(), //TODO: get db to autogenerate this
        content: response,
        storyId: data.storyId,
        authorId: "AiBot33",
        role: "Bot",
      },
    });

    return NextResponse.json({ aiReplyMessage: aiCreatedMessage });
  } catch (error) {
    console.error(error);
    throw Error("Error querying GPT: " + error);
  }
}
