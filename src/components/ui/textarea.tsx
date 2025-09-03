"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

    React.useLayoutEffect(() => {
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height
        const scrollHeight = textarea.scrollHeight;
        
        if (maxRows) {
            // Rough calculation for max height
            const computedStyle = window.getComputedStyle(textarea);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const paddingTop = parseFloat(computedStyle.paddingTop);
            const paddingBottom = parseFloat(computedStyle.paddingBottom);
            const borderTop = parseFloat(computedStyle.borderTopWidth);
            const borderBottom = parseFloat(computedStyle.borderBottomWidth);
            
            const maxHeight = (lineHeight * maxRows) + paddingTop + paddingBottom + borderTop + borderBottom;
            
            if (scrollHeight > maxHeight) {
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = 'auto';
            } else {
                textarea.style.height = `${scrollHeight}px`;
                textarea.style.overflowY = 'hidden';
            }
        } else {
            textarea.style.height = `${scrollHeight}px`;
        }
      }
    }, [props.value, maxRows]);

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-hidden",
          className
        )}
        ref={internalRef}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
