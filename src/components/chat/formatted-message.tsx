'use client';

import React from 'react';

interface FormattedMessageProps {
  text: string;
}

// A simple parser that splits the text by asterisks and applies styling.
// Example: "This is narration. *This is dialogue.* This is more narration."
const parseFormattedText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split by the regex, keeping the delimiters. Filter out empty strings.
  const parts = text.split(/(\*.*?\*)/g).filter(Boolean);

  const content = parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      // Italicized part (Dialogue/Inner Tone)
      return (
        <i key={index} className="text-slate-600 dark:text-slate-300 font-serif not-italic">
          {part.slice(1, -1)}
        </i>
      );
    }
    // Normal part (Narration/Action)
    return <span key={index}>{part}</span>;
  });

  return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
};


export function FormattedMessage({ text }: FormattedMessageProps) {
  const formattedContent = parseFormattedText(text);

  return <>{formattedContent}</>;
}
