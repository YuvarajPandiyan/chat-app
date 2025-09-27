import { CONVERSATION_HISTORY, MODAL, ROLES } from "@/constants/genai";
import { getChunkPart } from "@/components/Chat/helpers";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "@/lib/localStorage";
import { getUUID } from "@/lib/utils";

export const updateLocalStorageHistory = ({
  conversations,
  currentSelectedChatIdx,
}) => {
  const conversationHistory = getItemInLocalStorage(CONVERSATION_HISTORY, []);
  if (currentSelectedChatIdx === undefined) {
    currentSelectedChatIdx = conversationHistory?.length;
  }

  conversationHistory[currentSelectedChatIdx] = conversations;
  setItemInLocalStorage(CONVERSATION_HISTORY, conversationHistory);

  return {
    currentSelectedChatIdx,
    updatedConversationHistory: conversationHistory,
  };
};

export const getUserMessageUpdatedConversations = ({
  conversations,
  message,
}) => {
  const updatedConversations = [
    ...conversations,
    {
      text: message,
      role: ROLES.USER,
      modelVersion: MODAL,
      responseId: getUUID(),
    },
  ];

  return updatedConversations;
};

export const getUpdatedStreamConversations = ({
  chunk,
  conversations,
  indexToAddText,
  isStopSteamingConversation = false,
}) => {
  const conversationsCopy = [...conversations];
  const chunkText = getChunkPart(chunk)?.text || "";

  if (conversations[indexToAddText] === undefined) {
    // Add new conversation
    conversationsCopy.push({
      text: chunkText,
      role: ROLES.MODAL,
      responseId: chunk.responseId,
      modelVersion: chunk.modelVersion,
      isStopSteamingConversation,
    });
  } else {
    // Update existing conversation
    conversationsCopy[indexToAddText] = {
      ...conversationsCopy[indexToAddText],
      text: conversationsCopy[indexToAddText].text + chunkText,
      isStopSteamingConversation,
    };
  }

  return conversationsCopy;
};
