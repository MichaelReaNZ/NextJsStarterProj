import { NextRequest, NextResponse } from "next/server";
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

// Langchain stuff
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  //kick out if not logged in
  if (!currentUserEmail) {
    return NextResponse.redirect("/api/auth/signin");
  }

  // Langchain stuff

  const model = new OpenAI({ temperature: 0.9 });
  const template = "What is a good name for a company that makes {product}?";
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["product"],
  });

  const chain = new LLMChain({ llm: model, prompt: prompt });
  const res = await chain.call({ product: "ghost hats" });
  console.log(res);
  //

  const data = await req.json();

  await prisma.message.create({
    data: data.message,
  });

  const formattedPreCompletionMessages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: "You are a Ai named XO, you give short responses.",
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

    const aiReplyMessage: Message = {
      id: Math.random().toString(),
      content: response,
      storyId: data.storyId,
      authorId: "AiBot33",
      role: "Bot",
    };

    const aiCreatedMessage = await prisma.message.create({
      data: aiReplyMessage,
    });

    return NextResponse.json({ aiReplyMessage: aiCreatedMessage });
  } catch (error) {
    console.error(error);
    throw Error("Error querying GPT: " + error);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;
  const messageId = req.nextUrl.searchParams.get("messageId");

  const currentUserId = await prisma.user
    .findUnique({ where: { email: currentUserEmail } })
    .then((user) => user?.id!);

  const record = await prisma.message.delete({
    where: {
      id: messageId!,
    },
  });

  return NextResponse.json(record);
}
