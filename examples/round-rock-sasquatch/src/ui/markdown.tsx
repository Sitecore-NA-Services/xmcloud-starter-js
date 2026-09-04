// TODO: Replace this custom Markdown parser with the Content SDK RichText
// component. Change the Body field type on Article Page and Product Page
// templates from Multi-Line Text to Rich Text, then render with
// <RichText field={...} /> for inline editing and XSS sanitisation.

import { JSX, ReactNode } from 'react';
import { FootprintDivider } from 'src/ui/illustrations';

function FootprintDividerWrapper(): JSX.Element {
  return (
    <div className="article-section-divider">
      <FootprintDivider />
    </div>
  );
}

function renderInline(line: string, baseKey: number): ReactNode[] {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? <strong key={`${baseKey}-s-${idx}`}>{part}</strong> : part
  );
}

interface MarkdownContentProps {
  content: string;
  sectionDividers?: boolean;
}

export function MarkdownContent({ content, sectionDividers = false }: MarkdownContentProps): JSX.Element {
  // Sitecore multi-line text fields use CRLF line endings — normalize to LF.
  const lines = content.replace(/\r\n/g, "\n").trim().split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;
  let sectionCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      if (sectionDividers && sectionCount > 0) {
        elements.push(<FootprintDividerWrapper key={`fpd-${key++}`} />);
      }
      sectionCount++;
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
    } else if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
      if (match) {
        elements.push(
          <li key={key++}>
            <strong>{match[1]}</strong>
            {match[2] ? ` — ${match[2]}` : ""}
          </li>
        );
      } else {
        elements.push(<li key={key++}>{line.slice(2)}</li>);
      }
    } else if (line.startsWith("- ")) {
      elements.push(<li key={key++}>{line.slice(2)}</li>);
    } else if (/^\d+\. /.test(line)) {
      elements.push(<li key={key++}>{line.replace(/^\d+\. /, "")}</li>);
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(<p key={key++}>{renderInline(line, key)}</p>);
    }
  }

  const wrapped: JSX.Element[] = [];
  let listBuffer: JSX.Element[] = [];
  for (const el of elements) {
    if (el.type === "li") {
      listBuffer.push(el);
    } else {
      if (listBuffer.length) {
        wrapped.push(<ul key={key++}>{listBuffer}</ul>);
        listBuffer = [];
      }
      wrapped.push(el);
    }
  }
  if (listBuffer.length) wrapped.push(<ul key={key++}>{listBuffer}</ul>);

  return <>{wrapped}</>;
}
