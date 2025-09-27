import { memo } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark as syntaxTheme } from "react-syntax-highlighter/dist/esm/styles/hljs";

const MarkDownSyntaxHighlighter = ({
  lang,
  content,
  lineProps,
  customStyle,
  wrapLines = false,
  wrapLongLines = false,
  showLineNumbers = false,
}) => {
  return (
    <SyntaxHighlighter
      language={lang}
      lineProps={lineProps}
      style={syntaxTheme}
      wrapLines={wrapLines}
      wrapLongLines={wrapLongLines}
      showLineNumbers={showLineNumbers}
      customStyle={customStyle}
    >
      {content}
    </SyntaxHighlighter>
  );
};

export default memo(MarkDownSyntaxHighlighter);
