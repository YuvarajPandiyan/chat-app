import { MARKDOWN_SECTION_TYPE } from "@/constants/markdown/markdown";

import { getUUID } from "@/lib/utils";

export const splitMarkdown = (
  markdown,
  responseId,
  parsedConversationTextArr
) => {
  // guard
  if (typeof markdown !== "string") {
    return [];
  }

  const regexToSplitMarkdown = /```(\w+)?\n([\s\S]*?)(?:```|$)/g;
  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = regexToSplitMarkdown.exec(markdown)) !== null) {
    // capture text before code block
    if (match.index > lastIndex) {
      const indexToBePushed = result.length;
      const parsedConversationTextArrElement =
        parsedConversationTextArr[indexToBePushed];
      const prevId = parsedConversationTextArrElement?.id;
      const prevContent = parsedConversationTextArrElement?.id;
      const currentContent = markdown.slice(lastIndex, match.index).trim();
      result.push({
        // to prevent rerendering
        id:
          (prevContent?.length || 0) !== currentContent?.length
            ? getUUID()
            : prevId,
        type: MARKDOWN_SECTION_TYPE.TEXT,
        content: currentContent,
      });
    }

    // capture code block
    const indexToBePushed = result.length;
    const parsedConversationTextArrElement =
      parsedConversationTextArr[indexToBePushed];
    const prevId = parsedConversationTextArrElement?.id;
    const prevContent = parsedConversationTextArrElement?.id;
    const currentContent = match[2].trim();
    result.push({
      // to prevent rerendering
      id:
        (prevContent?.length || 0) !== currentContent?.length
          ? getUUID()
          : prevId,
      type: MARKDOWN_SECTION_TYPE.CODE,
      lang: match[1] || MARKDOWN_SECTION_TYPE.TEXT,
      content: currentContent,
    });

    lastIndex = regexToSplitMarkdown.lastIndex;
  }

  // capture remaining text after last code block
  if (lastIndex < markdown.length) {
    result.push({
      id: responseId,
      type: "text",
      content: markdown.slice(lastIndex).trim(),
    });
  }

  return result.filter((block) => block.content.length > 0);
};
