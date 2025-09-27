import { memo, useCallback, useRef, useEffect } from "react";
import { SendIcon, Square } from "lucide-react";

import { KEY_CODES } from "@/constants/browser/browser";

import { Input } from "../ui/input";

const MessageInput = ({
  value,
  isStreaming = false,
  onInputChangeHandler,
  handleOnMessageSend,
  isSideDrawerOpen = false,
  handleStopConversationStream,
}) => {
  const chatInputRef = useRef();

  // to focus the chat input element
  useEffect(() => {
    if (!isSideDrawerOpen) {
      chatInputRef.current?.focus();
    }
  }, [isSideDrawerOpen]);

  const handleOnChange = useCallback(
    (event) => {
      onInputChangeHandler(event.target.value);
    },
    [onInputChangeHandler]
  );

  const handleOnEnterClick = useCallback(() => {
    if (event.keyCode === KEY_CODES.ENTER) {
      handleOnMessageSend();
      event?.stopPropagation();
    }
  }, [handleOnMessageSend]);
  return (
    <div className="rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
      <Input
        ref={chatInputRef}
        className="border-0 shadow-none focus-visible:[box-shadow:none] focus:[box-shadow:none] focus:border-0"
        value={value}
        onChange={handleOnChange}
        placeholder="Ask genAI"
        onKeyDown={handleOnEnterClick}
      />
      <div className="flex justify-end p-2">
        {isStreaming ? (
          <div className="rounded-4xl border-6 border-red-300 bg-red-300">
            <Square
              size={12}
              fill="black"
              strokeWidth={0}
              onClick={handleStopConversationStream}
              className="cursor-pointer border-none border-0"
            />
          </div>
        ) : (
          <SendIcon className="cursor-pointer" onClick={handleOnMessageSend} />
        )}
      </div>
    </div>
  );
};

export default memo(MessageInput);
