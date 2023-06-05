import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionRequest,
} from "openai";
import openAiApiClient from "../Clients/openai-client";

interface StoryNode {
  storyText: string;
  choiceA: string;
  choiceB: string;
}

export async function parseJSONWithRetries(
  botResponseMessage: string, //ChatCompletionRequestMessage,
  preCompletionMessagesArray: Array<ChatCompletionRequestMessage>,
  maxRetries: number,
  completionOptionsOverride?: any
): Promise<StoryNode> {
  let currentAttempt = 0;
  let gptResponseText: string;
  let validContent = "";

  let jsonToReturn: StoryNode = JSON.parse("{}");

  while (currentAttempt < maxRetries) {
    if (currentAttempt > 0) {
      var completionRequest: CreateChatCompletionRequest = {
        model: "gpt-3.5-turbo",
        messages: preCompletionMessagesArray,
        temperature: 0.4,
        top_p: 1,
        max_tokens: 1000,
        stream: false,
        user: "Mike",
      };

      const completion = await openAiApiClient.createChatCompletion(
        completionRequest
      );

      const response: string = completion.data.choices[0].message!.content;

      botResponseMessage = response;
    }
    // * This is the format I expect to get back
    // {
    //   "storyText": "Text for story",
    //   "choiceA": "description of choice A",
    //   "choiceB": "description of choice B"
    // }

    try {
      //remove anything before the first { not including the {
      // botResponseMessage = botResponseMessage.substring(".*?{".length);
      botResponseMessage = botResponseMessage.substring(
        botResponseMessage.indexOf("{")
      );

      let jsonStoryNode: StoryNode = JSON.parse(botResponseMessage);

      //get the storyText from the json
      const storyText = jsonStoryNode["storyText"];

      //get the choices from the json
      const choiceA = jsonStoryNode["choiceA"];
      const choiceB = jsonStoryNode["choiceB"];

      jsonToReturn = jsonStoryNode;
      break;
    } catch (error) {
      currentAttempt++;
      const errorMessage =
        "Trying again: Could not parse GPT response as JSON format: " +
        error +
        " " +
        botResponseMessage;
      console.log(errorMessage);

      //add the error to the preCompletionMessagesArray so GPT can learn from it
      //botResponseMessage = errorMessage;

      preCompletionMessagesArray.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: errorMessage,
      });

      if (currentAttempt >= maxRetries) {
        throw new Error(
          "GPT_RESPONSE_PARSE_ERROR: Error parsing GPT response as JSON: " +
            error
        );
      }
    }
  }
  return jsonToReturn;
}
