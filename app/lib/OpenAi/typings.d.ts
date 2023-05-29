interface CompletionOptionsOverride {
  //If the field has a value then it will override the default value
  model?: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}
