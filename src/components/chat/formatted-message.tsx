'use client';

import { useState, useEffect } from 'react';
import { formatRoleplayScript } from '@/ai/flows/format-roleplay-script';
import { Skeleton } from '@/components/ui/skeleton';

interface FormattedMessageProps {
  text: string;
}

// A simple parser assuming the AI wraps dialogue in asterisks (*dialogue*).
const parseFormattedText = (text: string): React.ReactNode => {
  if (!text.includes('*')) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  const parts = text.split(/(\*.*?\*)/g).filter(Boolean);

  const content = parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      // Italicized part (Dialogue/Inner Tone)
      return (
        <i key={index} className="text-muted-foreground">
          {part.slice(1, -1)}
        </i>
      );
    }
    // Normal part (Narration/Action)
    return <span key={index}>{part}</span>;
  });

  return <p className="whitespace-pre-wrap">{content}</p>;
};


export function FormattedMessage({ text }: FormattedMessageProps) {
  const [formattedContent, setFormattedContent] = useState<React.ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processText = async () => {
      setIsLoading(true);
      try {
        const result = await formatRoleplayScript({ text });
        const content = parseFormattedText(result.formattedText);
        setFormattedContent(content);
      } catch (error) {
        console.error('Failed to format message:', error);
        // Fallback to unformatted text on error
        setFormattedContent(<p className="whitespace-pre-wrap">{text}</p>);
      } finally {
        setIsLoading(false);
      }
    };

    processText();
  }, [text]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return formattedContent;
}
