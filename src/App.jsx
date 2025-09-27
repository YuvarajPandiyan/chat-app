import { useRef, useCallback } from "react";

import { Chat } from "@/components/Chat";
import { useChatStore } from "@/components/Chat/store/chatStore";
import { Layout } from "@/components/Layout";

import { cn } from "@/lib/utils";

import "./App.css";

function App() {
  const headerRef = useRef();
  const chatContainerRef = useRef();
  const {
    isSideDrawerOpen,
    onChatContainerFocus,
    onSideDrawerOpenChange,
    chatHistory,
    conversations,
    handleCreateNewChat,
    currentSelectedChatIdx,
    handleOnSelectChatHistory,
  } = useChatStore();

  const handleOnChatContainerFocus = useCallback(() => {
    onChatContainerFocus();
  }, []);

  return (
    <Layout
      headerRef={headerRef}
      chatHistory={chatHistory}
      conversations={conversations}
      isSideDrawerOpen={isSideDrawerOpen}
      onSideDrawerOpenChange={onSideDrawerOpenChange}
      handleCreateNewChat={handleCreateNewChat}
      handleOnItemClick={handleOnSelectChatHistory}
      currentSelectedChatIdx={currentSelectedChatIdx}
    >
      <div
        ref={chatContainerRef}
        onMouseDown={handleOnChatContainerFocus}
        className={cn("flex flex-col items-center justify-center border-0")}
      >
        <Chat headerRef={headerRef} />
      </div>
    </Layout>
  );
}

export default App;
