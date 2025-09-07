import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a professional, detailed prompt for image generation based on a style description.
 * @param styleDescription A short description of the desired style.
 * @returns A promise that resolves to a detailed, professionally engineered prompt string.
 */
export const generatePromptForStyle = async (styleDescription: string): Promise<string> => {
  try {
    const metaPrompt = `You are an expert prompt engineer for a generative AI model that edits images. Your task is to create a highly detailed and effective prompt in English to transform a user's image based on a requested style. The prompt must be descriptive, artistic, and specify technical details like lighting, color palette, mood, and composition to achieve a stunning, high-quality result. Generate ONLY the prompt itself, without any introductory text, explanation, or quotation marks. The final output must be just the prompt text.

Requested style: "${styleDescription}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
    });

    // Directly use the .text property for cleaner access
    const text = response.text.trim();
    if (!text) {
        throw new Error("Received an empty prompt from the API.");
    }
    return text;

  } catch (error) {
    console.error("Gemini Prompt Generation Error:", error);
    throw new Error("Failed to generate prompt with Gemini API.");
  }
};


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the 'data:mime/type;base64,' prefix, which we need to remove.
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Or handle error appropriately
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const applyImageEffect = async (imageFile: File, prompt: string): Promise<{ imageUrl: string | null; text: string | null }> => {
  const imagePart = await fileToGenerativePart(imageFile);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;
    
    // Check for safety ratings and blocked responses
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType: string = part.inlineData.mimeType;
                imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
                text = part.text;
            }
        }
    } else {
        // This case handles when the response is blocked entirely.
        text = "تم حظر الاستجابة بسبب إعدادات السلامة.";
    }


    return { imageUrl, text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
};
