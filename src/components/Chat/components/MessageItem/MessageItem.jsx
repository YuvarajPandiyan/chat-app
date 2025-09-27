import { memo, useMemo, useRef, useCallback } from "react";

import { toast } from "sonner";
import { Copy } from "lucide-react";

import { capitalizeFirstLetter } from "@/lib/string";

import Markdown from "@/components/Markdown/Markdown/Markdown";
import { MARKDOWN_SECTION_TYPE } from "@/constants/markdown/markdown";
import MarkDownSyntaxHighlighter from "@/components/Markdown/MarkDownSyntaxHighlighter/MarkDownSyntaxHighlighter";

import { splitMarkdown } from "@/helpers/markdown/markdown";
import { clipboardWriteText } from "@/helpers/browser/keyboard/keyboard.helper";

import { MessageWrapper } from "./MessageWrapper";

const LINE_PROPS = { style: { flexWrap: "wrap" } };
const CUSTOM_STYLE = { borderRadius: "0 0 0.6rem 0.6rem" };

const MessageItem = ({ messageItem }) => {
  const thisRef = useRef({ parsedConversationTextArr: [] });
  const {
    role,
    responseId,
    text: messageText,
    isStopSteamingConversation = false,
  } = messageItem;
  const parsedConversationTextArr = useMemo(() => {
    const splitMarkdownArray = splitMarkdown(
      messageText,
      responseId,
      thisRef.current.parsedConversationTextArr
    );
    thisRef.current.parsedConversationTextArr = splitMarkdownArray;
    return splitMarkdownArray;
  }, [messageText, responseId]);

  const parsedConversationTextArrSize = parsedConversationTextArr?.length - 1;

  const curryHandleClipBoardCopy = useCallback(
    (content) => () => {
      clipboardWriteText(content);
      toast("copied");
    },
    []
  );
  return (
    <>
      {parsedConversationTextArr?.map(({ id, type, lang, content }, idx) => {
        if (!content || content?.length === 0) {
          return null;
        }
        switch (type) {
          case MARKDOWN_SECTION_TYPE.CODE:
            return (
              <MessageWrapper
                key={id}
                role={role}
                isStopSteamingConversation={
                  isStopSteamingConversation &&
                  idx === parsedConversationTextArrSize
                }
              >
                <div
                  className="flex justify-between w-full p-4 rounded-t-xl text-white"
                  style={{ backgroundColor: "rgb(40, 40, 40)" }}
                >
                  {capitalizeFirstLetter(lang)}
                  <Copy
                    className="cursor-pointer"
                    onClick={curryHandleClipBoardCopy(content)}
                  />
                </div>
                <MarkDownSyntaxHighlighter
                  style={{ wordWrap: "break-word" }}
                  lang={lang}
                  wrapLines={true}
                  content={content}
                  wrapLongLines={true}
                  lineProps={LINE_PROPS}
                  customStyle={CUSTOM_STYLE}
                />
              </MessageWrapper>
            );

          default:
            return (
              <MessageWrapper
                key={id}
                role={role}
                isStopSteamingConversation={
                  isStopSteamingConversation &&
                  idx === parsedConversationTextArrSize
                }
              >
                <Markdown key={id} content={content} />
              </MessageWrapper>
            );
        }
      })}
    </>
  );
};

export default memo(MessageItem);
