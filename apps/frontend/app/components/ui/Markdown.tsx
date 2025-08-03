"use client";

import React, { useCallback } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownProps {
  children: string;
  components?: Components; // components overrides the default components
  darkMode?: boolean;
}

export const Markdown = ({ children, components }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ children }) => (
          <p className="font-poppins text-base font-normal text-black">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold">
            {children}
          </strong>
        ),
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-black underline">
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
