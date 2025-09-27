import { memo, useCallback, useRef } from "react";

import { cn } from "@/lib/utils";

import { useMultiTurnConversation } from "@/hooks/useMultiTurnConversation/useMultiTurnConversation";

import { MessageInput } from "../MessageInput";

import { WIDTH } from "./constants";
import { Messages } from "./components/Messages";
import { useChatStore } from "./store/chatStore/chatStore";

const Chat = ({ headerRef }) => {
  const messageTypeSectionRef = useRef();
  const {
    chatInputValue,
    isSideDrawerOpen,
    updateChatInputValue,
    isMultiTermStreaming,
    handleOnMessageSend,
    updateStopConversationStream,
  } = useChatStore();
  const { conversations, handleUserSendMessage } = useMultiTurnConversation({});

  const _handleOnMessageSend = useCallback(() => {
    handleOnMessageSend({ handleUserSendMessage });
  }, [handleOnMessageSend, handleUserSendMessage]);

  const handleStopConversationStream = useCallback(() => {
    updateStopConversationStream(true);
  }, [updateStopConversationStream]);

  const messageTypeSectionTop =
    messageTypeSectionRef.current?.getBoundingClientRect()?.top -
    headerRef.current?.getBoundingClientRect()?.height;

  return (
    <div
      className={cn("relative overflow-y-scroll overflow-x-hidden", WIDTH)}
      style={{
        scrollbarWidth: "none",
        height: `${messageTypeSectionTop}px`,
      }}
    >
      <Messages
        conversations={conversations}
        isMultiTermStreaming={isMultiTermStreaming}
      />

      <div
        ref={messageTypeSectionRef}
        className={cn("fixed bottom-5 pt-1", WIDTH)}
      >
        <MessageInput
          value={chatInputValue}
          isStreaming={isMultiTermStreaming}
          isSideDrawerOpen={isSideDrawerOpen}
          handleOnMessageSend={_handleOnMessageSend}
          onInputChangeHandler={updateChatInputValue}
          handleStopConversationStream={handleStopConversationStream}
        />
      </div>
    </div>
  );
};

export default memo(Chat);
