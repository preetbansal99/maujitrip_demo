"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

interface ChatMessageContentProps {
  content: string;
  onChipClick?: (text: string) => void;
  isUser?: boolean;
}

// Clean markdown text of emojis and em-dashes without breaking table rows
function sanitizeText(str: string): string {
  return str
    .replace(/[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}]/gu, "")
    .replace(/—/g, " - ")
    .replace(/–/g, "-");
}

function renderFormattedInline(text: string): React.ReactNode {
  // Split on <br> tags if present
  const lines = text.split(/<br\s*\/?>/gi);
  if (lines.length > 1) {
    return (
      <>
        {lines.map((l, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {renderFormattedInline(l)}
          </React.Fragment>
        ))}
      </>
    );
  }

  // Strip wrapping backticks if any
  const clean = text.replace(/^`([^`]+)`$/, "$1");

  // Bold matching: **text**
  const parts = clean.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Link matching: [Label](url)
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <Link
          key={idx}
          href={url}
          className="font-semibold text-[#d63f00] underline underline-offset-2 hover:text-[#b53a00]"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

function renderCellContent(text: string): React.ReactNode {
  const parts = text.split(/<br\s*\/?>/gi);
  if (parts.length === 1) {
    return renderFormattedInline(text);
  }
  return (
    <div className="space-y-1">
      {parts.map((p, idx) => {
        const trimmed = p.trim();
        if (!trimmed) return null;
        if (/^[-*•]\s*/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start gap-1.5 text-sm leading-snug">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d63f00]" />
              <span>{renderFormattedInline(trimmed.replace(/^[-*•]\s*/, ""))}</span>
            </div>
          );
        }
        return (
          <div key={idx} className="text-sm leading-snug">
            {renderFormattedInline(trimmed)}
          </div>
        );
      })}
    </div>
  );
}

interface TableData {
  headers: string[];
  rows: string[][];
}

function parseMarkdownTable(lines: string[]): TableData | null {
  const tableLines = lines.filter((l) => l.trim().startsWith("|") && l.trim().endsWith("|"));
  if (tableLines.length < 2) return null;

  const parseCells = (line: string) =>
    line
      .trim()
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());

  const headers = parseCells(tableLines[0]);
  const rows: string[][] = [];

  for (let i = 1; i < tableLines.length; i++) {
    const raw = tableLines[i];
    // Skip separator line (|---|---|)
    if (/^\|(\s*[-:]+\s*\|)+$/.test(raw.trim())) continue;
    rows.push(parseCells(raw));
  }

  if (headers.length === 0 || rows.length === 0) return null;
  return { headers, rows };
}

export default function ChatMessageContent({
  content,
  onChipClick,
  isUser = false,
}: ChatMessageContentProps) {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  const cleaned = sanitizeText(content);
  const rawLines = cleaned.split("\n");

  // Extract quick action chips from numbered "Next Steps" or numbered options
  const actionChips: string[] = [];
  const renderedBlocks: React.ReactNode[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    // Check for Markdown table start
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|") && rawLines[i].trim().endsWith("|")) {
        tableLines.push(rawLines[i]);
        i++;
      }
      const table = parseMarkdownTable(tableLines);
      if (table) {
        renderedBlocks.push(
          <div key={`table-${i}`} className="my-3 overflow-hidden rounded-xl bg-[#efeeeb]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-900 border-collapse">
                <thead>
                  <tr className="bg-[#023341] text-white">
                    {table.headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-3.5 py-2.5 font-bold text-sm text-teal-100">
                        {renderFormattedInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-[#f5f4f0]"}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2.5 text-sm leading-relaxed align-top">
                          {renderCellContent(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        continue;
      }
    }

    // Skip horizontal divider rules
    if (/^---+$|^===+$/.test(line)) {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      renderedBlocks.push(
        <h4 key={`h4-${i}`} className="mt-3 mb-1 text-base font-bold text-[#023341]">
          {renderFormattedInline(line.replace(/^###\s+/, ""))}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      renderedBlocks.push(
        <h3 key={`h3-${i}`} className="mt-4 mb-1.5 text-lg font-bold text-[#023341]">
          {renderFormattedInline(line.replace(/^##\s+/, ""))}
        </h3>
      );
      i++;
      continue;
    }

    // Direct booking or site link line (e.g. "**Book now** /holidays/packages/..." or "`...`")
    const siteUrlMatch = line.match(/(\/(?:holidays|hotels|flights|bus|planner)[^\s)`]+)/i);
    if (siteUrlMatch && siteUrlMatch[1]) {
      const url = siteUrlMatch[1].replace(/[`"')]/g, "");
      const linkLabel = url.includes("packages/")
        ? "View holiday package"
        : url.includes("flights")
        ? "Search live flights"
        : url.includes("hotels")
        ? "Browse partner stays"
        : "View on MaujiTrip";

      renderedBlocks.push(
        <div key={`cta-${i}`} className="my-2.5">
          <Link
            href={url}
            className="inline-flex items-center gap-2 rounded-xl bg-[#023341] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#034a5c]"
          >
            <Compass size={16} className="text-teal-300" />
            <span>{linkLabel}</span>
            <ArrowRight size={14} className="text-teal-300" />
          </Link>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list items
    if (/^[-*•]\s+/.test(line)) {
      renderedBlocks.push(
        <div key={`bullet-${i}`} className="my-1 flex items-start gap-2 text-sm text-gray-900 leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d63f00]" />
          <span className="flex-1">{renderFormattedInline(line.replace(/^[-*•]\s+/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered lists / Next steps
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      const [, num, textContent] = numMatch;
      // Extract a short chip label if it looks like an actionable option (e.g. "Confirm the package")
      const chipLabel = textContent.split(/[-–—:]/)[0].replace(/\*\*/g, "").trim();
      if (chipLabel.length > 2 && chipLabel.length < 35 && onChipClick) {
        if (!actionChips.includes(chipLabel)) actionChips.push(chipLabel);
      }

      renderedBlocks.push(
        <div key={`num-${i}`} className="my-1.5 flex items-start gap-2.5 text-sm text-gray-900 leading-relaxed">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#023341] text-xs font-bold text-white">
            {num}
          </span>
          <span className="flex-1">{renderFormattedInline(textContent)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph line
    if (line.length > 0) {
      renderedBlocks.push(
        <p key={`p-${i}`} className="my-1.5 text-sm md:text-base leading-relaxed text-gray-900">
          {renderFormattedInline(line)}
        </p>
      );
    }

    i++;
  }

  return (
    <div className="space-y-1">
      {renderedBlocks}

      {actionChips.length > 0 && onChipClick && (
        <div className="mt-3 flex flex-wrap gap-2 pt-1">
          {actionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChipClick(chip)}
              className="rounded-full bg-[#efeeeb] px-3.5 py-1.5 text-xs md:text-sm font-semibold text-[#023341] transition-colors hover:bg-[#023341] hover:text-white"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
