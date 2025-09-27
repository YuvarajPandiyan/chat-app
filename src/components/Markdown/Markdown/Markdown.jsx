import { memo } from "react";

import ReactMarkdown from "react-markdown";

const Markdown = ({ content }) => {
  return (
    <div className="gemini-response break-words whitespace-normal">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default memo(Markdown);
