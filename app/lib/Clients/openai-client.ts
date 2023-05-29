import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAiApiClient = new OpenAIApi(configuration);

export default openAiApiClient;
