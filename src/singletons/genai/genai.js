import { GoogleGenAI } from "@google/genai";

import { GEMENI_API_KEY } from "@/env";

export const googleGenAI = new GoogleGenAI({ apiKey: GEMENI_API_KEY });
