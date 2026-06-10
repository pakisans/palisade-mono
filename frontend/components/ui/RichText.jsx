import { Fragment } from "react";
import { cn } from "@/lib/utils";

function serializeText(node, i) {
  if (!node) return null;
  if (node.type !== "text") return null;
  let content = (node.text || "").replace(/\\r\\n|\\n|\\r/g, "\n");
  if (!content) return null;

  const isStrikethrough = node.format & 4;
  const isCode = node.format & 16;
  const isSub = node.format & 32;
  const isSup = node.format & 64;

  const renderContent = (value) => {
    const parts = String(value).split("\n");
    if (parts.length === 1) return value;

    return parts.flatMap((part, index) =>
      index === 0 ? [part] : [<br key={`br-${i}-${index}`} />, part],
    );
  };

  content = renderContent(content);

  if (node.format & 1) content = <strong key={i}>{content}</strong>;
  if (node.format & 2) content = <em key={i}>{content}</em>;
  if (node.format & 8) content = <u key={i}>{content}</u>;
  if (isStrikethrough) content = <s key={i}>{content}</s>;
  if (isCode) content = <code key={i}>{content}</code>;
  if (isSub) content = <sub key={i}>{content}</sub>;
  if (isSup) content = <sup key={i}>{content}</sup>;

  return <span key={i}>{content}</span>;
}

function serialize(nodes) {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((node, i) => {
    if (!node) return null;

    if (node.type === "text") return serializeText(node, i);

    const children = serialize(node.children);

    switch (node.type) {
      case "paragraph":
        if (!node.children?.some((c) => c.text)) return null;
        return <p key={i}>{children}</p>;
      case "heading":
        return <node.tag key={i}>{children}</node.tag>;
      case "list":
        return node.listType === "bullet" ? (
          <ul key={i}>{children}</ul>
        ) : (
          <ol key={i}>{children}</ol>
        );
      case "listitem":
        return <li key={i}>{children}</li>;
      case "link": {
        const href = node.fields?.url || node.url || "#";
        return (
          <a
            key={i}
            href={href}
            target={node.fields?.newTab ? "_blank" : undefined}
            rel={node.fields?.newTab ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      }
      case "quote":
        return <blockquote key={i}>{children}</blockquote>;
      default:
        if (children) return <Fragment key={i}>{children}</Fragment>;
        return null;
    }
  });
}

export default function RichText({ content, className }) {
  if (!content?.root?.children?.length) return null;
  return (
    <div className={cn("prose prose-gray max-w-none", className)}>
      {serialize(content.root.children)}
    </div>
  );
}

// Extracts plain text from Lexical content for meta/previews
export function extractText(content, maxLen = 160) {
  if (!content?.root?.children) return "";
  function walk(nodes) {
    return (nodes || []).flatMap((n) => {
      if (n.type === "text") return [n.text || ""];
      if (n.children) return walk(n.children);
      return [];
    });
  }
  const text = walk(content.root.children).join(" ").trim();
  return maxLen ? text.slice(0, maxLen) : text;
}
