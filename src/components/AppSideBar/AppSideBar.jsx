import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Pencil } from "lucide-react";
import { useDebounce } from "use-debounce";

import { EMPTY_STRING } from "@/constants/defaults";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const AppSideBar = ({
  isOpen,
  chatHistory,
  conversations,
  handleOnItemClick,
  handleCreateNewChat,
  currentSelectedChatIdx,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debounceSearchValue] = useDebounce(searchValue, 500); // in ms

  const searchRef = useRef();

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    } else {
      setSearchValue(EMPTY_STRING);
    }
  }, [isOpen, searchRef.current]);

  const handleOnItemClickCurry = useCallback(
    (idx, history) => () => {
      handleOnItemClick(idx, history);
    },
    [handleOnItemClick]
  );

  const handleOnValueChange = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const filteredChatHistory = useMemo(() => {
    return chatHistory?.filter((history) =>
      history?.[0]?.text?.includes(debounceSearchValue)
    );
  }, [chatHistory, debounceSearchValue]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
        <Label htmlFor="chatHistory">Search Chat History</Label>
        <Input
          id="chatHistory"
          autoFocus
          ref={searchRef}
          value={searchValue}
          onChange={handleOnValueChange}
        />

        <Button
          className={"cursor-pointer"}
          onClick={handleCreateNewChat}
          disabled={conversations?.length === 0}
        >
          New Chat <Pencil />
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {filteredChatHistory.map((history, idx) => (
            <SidebarMenuItem
              key={idx}
              className={cn({
                "bg-gray-200 rounded-2xl": idx === currentSelectedChatIdx,
              })}
            >
              <SidebarMenuButton
                asChild
                onClick={handleOnItemClickCurry(idx, history)}
              >
                <span>{history?.[0]?.text?.slice(0, 20)}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default memo(AppSideBar);
