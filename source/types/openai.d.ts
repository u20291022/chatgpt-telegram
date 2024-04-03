import { ImageGenerator } from "../openai/image-generator"
import { TextGenerator } from "../openai/text-generator"

export interface TextModelInfo {
  model: "gpt-3.5-turbo",
  maxTokens: number,
  maxHistory: number,
  rules: string
}

export interface Models {
  textGenerator: TextGenerator,
  imageGenerator: ImageGenerator
}