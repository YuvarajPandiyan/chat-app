import { memo, useRef } from "react";

import { useScrollEnd } from "@/hooks/useScrollEnd";

import { MessageItem } from "../MessageItem";

const Messages = ({ conversations, isMultiTermStreaming }) => {
  const messageContainerRef = useRef();

  useScrollEnd({ elementRef: messageContainerRef.current });

  return (
    <div className="grid gap-2" ref={messageContainerRef}>
      {conversations.map((messageItem) => {
        return (
          <MessageItem messageItem={messageItem} key={messageItem.responseId} />
        );
      })}
      {isMultiTermStreaming && <span>Thinking....</span>}
    </div>
  );
};

export default memo(Messages);
