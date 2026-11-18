'use client';

import { useEffect, useRef, useState } from 'react';

export default function ProductDetailsPreview({ details }: { details: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(container).lineHeight);
      setLines(Math.max(1, Math.floor(container.clientHeight / lineHeight)));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();
    return () => observer.disconnect();
  }, []);

  const text = details.split('\n').map(item => item.trim()).filter(Boolean)
    .map(item => `• ${item}`).join('\n');

  return (
    <div ref={containerRef} className="min-h-0 flex-1 overflow-hidden text-xs font-extralight leading-5 text-shadow-black md:text-sm md:leading-6">
      <div
        className="whitespace-pre-line break-words"
        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: lines, overflow: 'hidden' }}
      >
        {text}
      </div>
    </div>
  );
}
