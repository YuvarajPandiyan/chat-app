import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { EMPTY_STRING } from "@/constants/defaults";
import { FINISH_RESPONSE_ENUMS } from "@/constants/genai";

import {
  getUpdatedStreamConversations,
  getUserMessageUpdatedConversations,
  updateLocalStorageHistory,
} from "@/hooks/useMultiTurnConversation/helpers";

import { getCandidate } from "../../helpers";

export const useChatStore = create(
  immer((set) => ({
    isSideDrawerOpen: false,
    chatHistory: [],
    conversations: [],
    currentChatHistory: [],
    isMultiTermStreaming: false,
    chatInputValue: EMPTY_STRING,
    currentSelectedChatIdx: undefined,
    isStopSteamingConversation: false,
    createNewMultiTurnConversationInstance: false,
    updateCreateNewMultiTurnConversationInstance: (
      createNewMultiTurnConversationInstance
    ) => {
      set(() => ({
        createNewMultiTurnConversationInstance,
      }));
    },
    updateStopConversationStream: (isStopSteamingConversation = false) =>
      set(() => {
        return { isStopSteamingConversation };
      }),
    updateIsMultiTermStreaming: (isMultiTermStreaming = false) =>
      set(() => ({
        isMultiTermStreaming,
      })),
    updateChatInputValue: (chatInputValue) => set({ chatInputValue }),
    updateChatHistory: (updatedChatHistory) =>
      set(() => ({ chatHistory: updatedChatHistory })),
    setUserConversation: (message) => {
      set(({ conversations, currentSelectedChatIdx }) => {
        const updatedConversations = getUserMessageUpdatedConversations({
          conversations,
          message,
        });
        const {
          currentSelectedChatIdx: _currentSelectedChatIdx,
          updatedConversationHistory,
        } = updateLocalStorageHistory({
          currentSelectedChatIdx,
          conversations: updatedConversations,
        });
        return {
          conversations: updatedConversations,
          chatHistory: updatedConversationHistory,
          currentChatHistory: updatedConversationHistory,
          currentSelectedChatIdx: _currentSelectedChatIdx,
        };
      });
    },
    updateConversations: async (responseStream) => {
      let indexToAddText; // by this will not recreate this function when the conversations state changes
      let isStreamCancelled = false; // doing this to ignore already existing call backs in the macro task queue.
      for await (const chunk of responseStream) {
        set((state) => {
          if (isStreamCancelled) {
            return {};
          }
          const {
            currentSelectedChatIdx,
            conversations,
            isStopSteamingConversation,
            skipStopConversation,
          } = state;
          if (indexToAddText === undefined) {
            indexToAddText = conversations.length;
          }

          const updatedConversations = getUpdatedStreamConversations({
            chunk,
            conversations,
            indexToAddText,
            isStopSteamingConversation,
          });
          updateLocalStorageHistory({
            currentSelectedChatIdx,
            conversations: updatedConversations,
          });

          if (isStopSteamingConversation || skipStopConversation) {
            // exit early from set updater if streaming is stopped (user send a message while streaming / click stop button)
            isStreamCancelled = true; // doing this to ignore already existing call backs in the macro task queue.
            return {
              isMultiTermStreaming: false,
              skipStopConversation: false,
              isStopSteamingConversation: false,
              conversations: updatedConversations,
            };
          }

          const valueToUpdate = { conversations: updatedConversations };
          const isLastStream =
            getCandidate(chunk)?.finishReason === FINISH_RESPONSE_ENUMS.STOP;
          if (isLastStream) {
            valueToUpdate.isMultiTermStreaming = false;
          }

          return valueToUpdate;
        });
      }
    },
    updateCurrentSelectedChatIdx: (currentSelectedChatIdx) => {
      set(() => ({ currentSelectedChatIdx }));
    },
    handleOnMessageSend: ({ handleUserSendMessage }) => {
      set(({ chatInputValue, isMultiTermStreaming }) => {
        // in case user clicks enter when the conversation is already streaming.
        if (isMultiTermStreaming) {
          return {
            isStopSteamingConversation: true,
          };
        }

        handleUserSendMessage({ message: chatInputValue });
        return { isMultiTermStreaming: true, chatInputValue: EMPTY_STRING };
      });
    },
    handleOnSelectChatHistory: (selectedIdx, selectedHistory) => {
      set(() => {
        return {
          isSideDrawerOpen: false,
          conversations: selectedHistory,
          isStopSteamingConversation: true,
          skipStopConversation: true,
          currentSelectedChatIdx: selectedIdx,
          currentChatHistory: selectedHistory,
          createNewMultiTurnConversationInstance: true,
        };
      });
    },
    handleCreateNewChat: () => {
      set(({ conversations, chatHistory }) => {
        if (conversations?.length > 0) {
          return {
            conversations: [],
            isSideDrawerOpen: false,
            currentSelectedChatIdx: chatHistory?.length,
            createNewMultiTurnConversationInstance: true,
          };
        }
      });
    },
    onSideDrawerOpenChange: () =>
      set(({ isSideDrawerOpen }) => ({ isSideDrawerOpen: !isSideDrawerOpen })),
    onChatContainerFocus: () => set({ isSideDrawerOpen: false }),
  }))
);
