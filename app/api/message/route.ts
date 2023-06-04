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
import { parseJSONWithRetries } from "@/app/lib/PromptRetry/JsonUtils";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  //kick out if not logged in
  if (!currentUserEmail) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const data = await req.json();

  // await prisma.message.create({
  //   data: data.message,
  // });

  const giveJsonSytemPrompt = `
  Continue the story, Give a choice between A & B.
  Do not include the choices in the story and
    Respond ONLY in JSON and nothing else e.g:
    {
      "storyText": "Text for story",
      "choiceA": "description of choice A",
      "choiceB": "description of choice B"
    }`;

  var formattedPreCompletionMessages = [];

  //load the last 3 messages from the database
  const lastThreeMessages = await prisma.message.findMany({
    where: { storyId: data.storyId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  //push each message into the formattedPreCompletionMessages array in reverse order
  for (let i = lastThreeMessages.length - 1; i >= 0; i--) {
    const message = lastThreeMessages[i];
    //turn into JSON format for examples of formatting
    const jsonFormatMessage = `
  {
    "storyText": "${message.content}",
    "choiceA": "${message.choiceA}",
    "choiceB": "${message.choiceB}"
  }`;
    formattedPreCompletionMessages.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: jsonFormatMessage, //message.content,
    });
  }

  let outcome = "";
  //it's a 25% chance of a negative outcome / consequence
  if (Math.random() < 0.25) {
    outcome = "negative / bad";
  } else if (Math.random() > 0.75) {
    outcome = "neutral / neither good nor bad";
  } else {
    outcome = "positive / beneficial";
  }

  console.log("outcome: ", outcome);

  formattedPreCompletionMessages.push(
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        "I am Endless a text based Adventure for children age 8. I am telling a fantastical story." +
        giveJsonSytemPrompt,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: giveJsonSytemPrompt,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content:
        data.message.content + ` the outcome of this choice is ${outcome}.`,
    }
  );

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

    let jsonStoryNode = await parseJSONWithRetries(
      response,
      formattedPreCompletionMessages,
      3
    );

    const aiReplyMessage: Message = {
      id: Math.random().toString(),
      content: jsonStoryNode.storyText,
      storyId: data.storyId,
      authorId: "AiBot33",
      role: "Bot",
      choiceA: jsonStoryNode.choiceA,
      choiceB: jsonStoryNode.choiceB,
      createdAt: new Date(),
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
