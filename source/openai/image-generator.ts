import OpenAI from "openai";
import { APIPromise } from "openai/core";

export class ImageGenerator {
  private openai: OpenAI;
  private model: "dall-e-2" = "dall-e-2";

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  public async generate(prompt: string): Promise<string> {
    try {
      const response = await this.sendRequest(prompt);
      const generatedImageData = response.data[0].url;
      if (generatedImageData) return generatedImageData;
      else return "";
    }
    catch(error) {
      throw error;
    }
  }

  private sendRequest(prompt: string): APIPromise<OpenAI.Images.ImagesResponse> {
    return this.openai.images.generate({
      "model": this.model,
      "prompt": prompt,
      "response_format": "url",
      "style": "vivid"
    })
  }
}