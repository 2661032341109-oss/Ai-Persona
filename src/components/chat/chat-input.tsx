'use client';

import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isLoading,
}: ChatInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      <Textarea
        placeholder="Type your message... (Shift+Enter for new line)"
        className="w-full pr-16 py-3 text-base resize-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rows={1}
        maxRows={5}
      />
      <Button
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleSendMessage}
        disabled={isLoading || !input.trim()}
        aria-label="Send message"
      >
        <SendHorizontal />
      </Button>
    </div>
  );
}
