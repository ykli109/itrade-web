/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageContentProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessageContent({
  content,
  role,
}: ChatMessageContentProps) {
  if (role === "user") {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
