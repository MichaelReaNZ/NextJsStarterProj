// //TODO: look at using langchain

// import {
//   ChatCompletionRequestMessageRoleEnum,
//   CreateChatCompletionRequest,
// } from "openai";
// import openAiApiClient from "../Clients/openai-client";
// import { Message } from "@prisma/client";

// async function queryChatGPT(
//   preCompletionMessages: Array<Message>,
//   userID: string,
//   completionOptions?: CompletionOptionsOverride
// ): Promise<string> {
//   //TODO: Implement credits and token counter
//   //TODO: Save every message to and from GPT for future training purposes

//   if (completionOptions?.model) {
//     //and it's not gpt-3.5-turbo
//     if (completionOptions?.model !== "gpt-3.5-turbo") {
//       //throw not implemented error
//       throw new Error(
//         "Only gpt-3.5-turbo is supported for chat at this point: NOT_IMPLEMENTED"
//       );
//     }
//   }

//   //convert preCompletionMessages into ChatCompletionRequestMessage
//   const formattedPreCompletionMessages = preCompletionMessages.map(
//     (message) => ({
//       role: <ChatCompletionRequestMessageRoleEnum>message.role,
//       content: message.content,
//     })
//   );

//   // Set defaults
//   var completionRequest: CreateChatCompletionRequest = {
//     model: "gpt-3.5-turbo",
//     messages: formattedPreCompletionMessages,
//     temperature: 0.7,
//     top_p: 1,
//     max_tokens: 500,
//     stream: false,
//     user: userID,
//   };

//   //if there is any value in completionOptions then override the defaults
//   if (completionOptions) {
//     //if the model is provided
//     if (completionOptions.model) {
//       completionRequest.model = completionOptions.model;
//     }
//     //if the temperature is provided
//     if (completionOptions.temperature) {
//       completionRequest.temperature = completionOptions.temperature;
//     }
//     //if the top_p is provided
//     if (completionOptions.top_p) {
//       completionRequest.top_p = completionOptions.top_p;
//     }
//     //if the max_tokens is provided
//     if (completionOptions.max_tokens) {
//       completionRequest.max_tokens = completionOptions.max_tokens;
//     }
//     //if the stream is provided
//     if (completionOptions.stream) {
//       completionRequest.stream = completionOptions.stream;
//     }
//   }

//   try {
//     const completion = await openAiApiClient.createChatCompletion(
//       completionRequest
//     );

//     const response: string = completion.data.choices[0].message!.content;

//     return response;
//   } catch (error) {
//     console.error(error);
//     throw Error("Error querying GPT: " + error);
//   }
// }

// export default queryChatGPT;

// export async function queryChatGPTAsUser(
//   prompt: string,
//   userID: string,
//   preCompletionMessages?: Array<Message>,
//   completionOptions?: CompletionOptionsOverride
// ): Promise<string> {
//   let preCompletionMessagesRequest: Array<Message> = [];
//   //can take in one or more messages may need to filter them
//   //only do this if not null // preCompletionMessagesRequest.push(...preCompletionMessages!);

//   const userMessage: Message = {
//     role: ChatCompletionRequestMessageRoleEnum.User,
//     content: prompt,
//     authorID: "userID",
//     storyID: "",
//     userID: userID,
//     // createdAt: admin.firestore.Timestamp.now().seconds,
//   };

//   preCompletionMessagesRequest.push(userMessage);

//   return await queryChatGPT(
//     preCompletionMessagesRequest,
//     userID,
//     completionOptions
//   );
// }
