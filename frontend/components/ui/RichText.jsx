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

const CELL_ALIGN = ["center", "right", "justify"];

function serialize(nodes, inCell = false) {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((node, i) => {
    if (!node) return null;

    if (node.type === "text") return serializeText(node, i);

    const children = serialize(
      node.children,
      inCell || node.type === "tablecell",
    );

    switch (node.type) {
      case "paragraph":
        if (!node.children?.some((c) => c.text)) return null;
        return (
          <p
            key={i}
            style={
              inCell && CELL_ALIGN.includes(node.format)
                ? { textAlign: node.format }
                : undefined
            }
          >
            {children}
          </p>
        );
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
      case "linebreak":
        return <br key={i} />;
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
      case "table":
        return (
          <div key={i} className="my-6 overflow-x-auto">
            <table className="my-0 w-full border-collapse text-sm">
              <tbody>{children}</tbody>
            </table>
          </div>
        );
      case "tablerow":
        return <tr key={i}>{children}</tr>;
      case "tablecell": {
        const isHeader = node.headerState > 0;
        const Cell = isHeader ? "th" : "td";
        return (
          <Cell
            key={i}
            colSpan={node.colSpan > 1 ? node.colSpan : undefined}
            rowSpan={node.rowSpan > 1 ? node.rowSpan : undefined}
            style={
              node.backgroundColor
                ? { backgroundColor: node.backgroundColor }
                : undefined
            }
            className={cn(
              "border border-gray-200 px-3 py-2 text-left align-top [&_p]:!m-0 [&_p]:!text-sm",
              isHeader && "bg-gray-50 font-semibold text-gray-950",
            )}
          >
            {children}
          </Cell>
        );
      }
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
