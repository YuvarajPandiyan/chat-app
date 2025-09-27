import { memo } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSideBar } from "../AppSideBar";
import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile.js";

const Layout = ({
  children,
  headerRef,
  chatHistory,
  conversations,
  isSideDrawerOpen,
  handleOnItemClick,
  handleCreateNewChat,
  currentSelectedChatIdx,
  onSideDrawerOpenChange,
}) => {
  const isMobile = useIsMobile();
  const onSideDrawerOpenChangeMobile = useCallback(() => {
    if (!isMobile) return;
    onSideDrawerOpenChange();
  }, []);
  return (
    <SidebarProvider
      open={isSideDrawerOpen}
      onOpenChange={onSideDrawerOpenChange}
    >
      <AppSideBar
        isOpen={isSideDrawerOpen}
        chatHistory={chatHistory}
        conversations={conversations}
        handleOnItemClick={handleOnItemClick}
        handleCreateNewChat={handleCreateNewChat}
        currentSelectedChatIdx={currentSelectedChatIdx}
      />
      <main className="w-full">
        <div ref={headerRef}>
          <SidebarTrigger onClick={onSideDrawerOpenChangeMobile} />
        </div>
        <div className="w-full flex justify-center">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default memo(Layout);
