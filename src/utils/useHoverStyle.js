import { useState, useCallback } from 'react';

export function useHoverStyle(base, hover) {
  const [hovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);
  const style = hovered && hover ? { ...base, ...hover } : base;
  return { style, onMouseEnter, onMouseLeave };
}
