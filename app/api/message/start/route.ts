import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/Clients/prisma";
import { Message } from "@prisma/client";
import openAiApiClient from "@/app/lib/Clients/openai-client";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { authOptions } from "../../auth/[...nextauth]/route";
import { parseJSONWithRetries } from "@/app/lib/PromptRetry/JsonUtils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  //kick out if not logged in
  if (!currentUserEmail) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const data = await req.json();

  const characterDetails = data.characterDetails;
  const worldDetails = data.worldDetails;

  const startGameMessage: Message = {
    id: Math.random().toString(),
    content: `I want play as ${characterDetails} in a ${worldDetails}}.`,
    storyId: data.storyId,
    authorId: currentUserEmail,
    role: "user",
    choiceA: null,
    choiceB: null,
    createdAt: new Date(),
  };

  // await prisma.message.create({
  //   data: startGameMessage,
  // });
  const giveJsonSytemPrompt = `
    I will respond ONLY in JSON and nothing else e.g:
    '{
      "storyText": "Text for story",
      "choiceA": "description of choice A",
      "choiceB": "description of choice B"
    }'`;

  const formattedPreCompletionMessages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        "I am Endless a text based Adventure for children age 8. I will start by telling a fantastical story and then give the option between A and B." +
        giveJsonSytemPrompt,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: startGameMessage.content,
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
      //now
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
