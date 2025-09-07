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
    const metaPrompt = `As a world-class AI prompt engineer specializing in visual transformation, your mission is to craft a masterfully detailed and evocative prompt in English. This prompt will guide an image generation model to transform a user's photo according to a specific artistic style, while preserving the original photo's core subject and composition.

**Core Instructions:**
1.  **Style Application:** The primary goal is to apply the new style to the existing image content. The prompt must vividly describe the requested style: "${styleDescription}".
2.  **Artistic & Technical Detail:** Elaborate on the style with specific artistic and technical keywords. Mention details about:
    -   **Lighting:** (e.g., dramatic chiaroscuro, soft diffused light, neon glow, sun-drenched).
    -   **Color Palette:** (e.g., muted monochromatic tones, vibrant complementary colors, vintage sepia).
    -   **Texture & Brushwork:** (e.g., thick impasto brushstrokes, smooth digital finish, grainy film texture, watercolor bleed).
    -   **Atmosphere & Mood:** (e.g., ethereal and dreamlike, gritty and dystopian, nostalgic and serene).
3.  **Quality Enhancement:** Conclude the prompt with a string of powerful keywords to ensure the highest quality output, such as: "masterpiece, 8k resolution, photorealistic, intricate details, professional lighting, ultra-detailed".

**Output Rules:**
-   The output MUST be the prompt text ONLY.
-   Do NOT include any preambles, explanations, or quotation marks (e.g., no "Here is the prompt:").
-   The prompt must be a single, coherent paragraph.

**Example for "Epic Fantasy Film":**
Transform the image to look like a cinematic still from an epic fantasy film. The lighting should be magical and ethereal, with soft, glowing highlights and deep, dramatic shadows. The color palette should be rich and saturated, with deep greens, royal blues, and hints of gold. Infuse the atmosphere with a sense of wonder and ancient magic. Render with photorealistic quality, intricate details, professional cinematography, masterpiece, 8k resolution, ultra-detailed.

Now, generate the prompt for the requested style: "${styleDescription}"`;

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
        // Return a key for localization instead of a hardcoded string.
        text = "responseBlocked";
    }


    return { imageUrl, text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
};