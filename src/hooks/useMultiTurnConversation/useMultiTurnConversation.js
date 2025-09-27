import { useCallback, useEffect, useRef, useState } from "react";

import { useChatStore } from "@/components/Chat/store/chatStore";
import { formateChatHistory } from "@/components/Chat/helpers";

import { EMPTY_ARRAY } from "@/constants/defaults";
import { CONVERSATION_HISTORY } from "@/constants/genai";

import { getItemInLocalStorage } from "@/lib/localStorage";

import { multiTurnConversation } from "@/services/genai/genai";

export const useMultiTurnConversation = () => {
  const {
    chatHistory,
    updateChatHistory,
    currentChatHistory,
    conversations,
    updateConversations,
    setUserConversation,
    updateIsMultiTermStreaming,
    createNewMultiTurnConversationInstance,
    updateCreateNewMultiTurnConversationInstance,
  } = useChatStore();
  const [isLocalStorageHistoryUpdated, setIsLocalStorageHistoryUpdated] =
    useState(false);

  const thisRef = useRef({
    ignoreLocalStorageUpdate: false,
    multiTurnConversationInstance: undefined,
  });

  // handle localstorage update and retrieval
  useEffect(() => {
    const conversationHistory = getItemInLocalStorage(
      CONVERSATION_HISTORY,
      EMPTY_ARRAY
    );
    updateChatHistory(conversationHistory);
    setIsLocalStorageHistoryUpdated(true);
  }, [updateChatHistory]);

  useEffect(() => {
    if (
      isLocalStorageHistoryUpdated &&
      !thisRef.current.multiTurnConversationInstance
    ) {
      try {
        // creating multi turn conversation SDK instance for further conversation.
        thisRef.current.multiTurnConversationInstance = multiTurnConversation({
          chatHistory: currentChatHistory,
        });
      } catch (error) {
        console.trace({ error });
        // creating multi turn conversation SDK instance for further conversation.
        thisRef.current.multiTurnConversationInstance = multiTurnConversation(
          {}
        );
      }
      return;
    }

    if (createNewMultiTurnConversationInstance) {
      try {
        // creating multi turn conversation SDK instance for further conversation.
        thisRef.current.multiTurnConversationInstance = multiTurnConversation({
          chatHistory: formateChatHistory(currentChatHistory),
        });
        updateCreateNewMultiTurnConversationInstance(false);
      } catch (error) {
        console.trace({ error });
        // creating multi turn conversation SDK instance for further conversation.
        thisRef.current.multiTurnConversationInstance = multiTurnConversation(
          {}
        );
        updateCreateNewMultiTurnConversationInstance(false);
      }
      return;
    }
  }, [
    createNewMultiTurnConversationInstance,
    currentChatHistory,
    isLocalStorageHistoryUpdated,
    updateCreateNewMultiTurnConversationInstance,
  ]);

  const handleUserSendMessage = useCallback(
    async ({ message }) => {
      setUserConversation(message);

      try {
        const responseStream =
          await thisRef.current.multiTurnConversationInstance.sendMessageStream(
            {
              message,
            }
          );
        updateConversations(responseStream);
      } catch (error) {
        updateIsMultiTermStreaming(false);
        console.trace({ error });
      }
    },
    [setUserConversation, updateConversations, updateIsMultiTermStreaming]
  );

  return {
    chatHistory,
    conversations,
    handleUserSendMessage,
  };
};
