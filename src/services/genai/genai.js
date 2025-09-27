import { MODAL } from "@/constants/genai/genai";
import { googleGenAI } from "@/singletons/genai";

// modals
export const generateContent = ({ prompts }) =>
  googleGenAI.models.generateContent({
    model: MODAL,
    contents: prompts,
  });

export const generateContentWithThinking = ({ prompts }) =>
  googleGenAI.models.generateContent({
    model: MODAL,
    contents: prompts,
    config: {
      thinkingConfig: {
        thinkingBudget: 1024,
      },
    },
  });

// multi-turn
export const multiTurnConversation = ({ chatHistory = [] }) =>
  googleGenAI.chats.create({
    model: MODAL,
    history: chatHistory,
  });
