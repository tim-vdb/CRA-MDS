"use client";

import { useState, useRef } from "react";

interface EditableDayInputProps {
  initialValue: number | null;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

export function EditableDayInput({ initialValue, onCommit, onCancel }: EditableDayInputProps) {
  const initialString = initialValue !== null ? String(initialValue) : "";
  const [value, setValue] = useState<string>(initialString);
  const committedRef = useRef(false);

  function commit() {
    if (committedRef.current) return;
    committedRef.current = true;
    if (value.trim() === initialString) {
      onCancel();
      return;
    }
    onCommit(value);
  }

  return (
    <input
      autoFocus
      type="number"
      step="0.25"
      min="0.25"
      max="1"
      value={value}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          committedRef.current = true;
          onCancel();
        }
      }}
      onBlur={commit}
      className="w-full text-center bg-primary/15 text-primary text-xs font-bold outline-none border-0 py-1.5"
    />
  );
}
