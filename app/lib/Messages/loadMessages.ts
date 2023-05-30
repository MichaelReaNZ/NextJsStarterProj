import { Message } from "@prisma/client";
import { prisma } from "../Clients/prisma";

export async function loadStoryMessages(
  storyID: string,
  howManyToLoad?: number
): Promise<Array<Message>> {
  try {
    //TODO: instead of loading a number have a token limit (an allowence for past messages, maybe do this elsewhere?)
    const messages = await prisma.message.findMany({
      where: {
        storyId: storyID,
      },
      take: howManyToLoad,
      orderBy: {
        // createdAt: "desc",
      },
    });

    return [];
  } catch (error) {
    console.error(`Error loading past messages: ${error}`);
    throw error;
  }
}
