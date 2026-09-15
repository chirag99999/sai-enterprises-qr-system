"use client";

import React from "react";
import { Delete } from "lucide-react";

interface TouchKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export const TouchKeypad: React.FC<TouchKeypadProps> = ({
  onDigit,
  onBackspace,
  onClear,
  disabled = false,
}) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["CLEAR", "0", "DEL"],
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[280px] sm:max-w-xs mx-auto select-none">
      {keys.flat().map((key, idx) => {
        if (key === "CLEAR") {
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={onClear}
              className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-neutral-200/80 hover:bg-neutral-300 active:bg-neutral-400 active:scale-95 text-[11px] sm:text-xs font-extrabold tracking-wider text-neutral-700 transition-all flex items-center justify-center border border-neutral-300/60 shadow-xs tap-feedback animate-keypad-tap"
            >
              CLEAR
            </button>
          );
        }

        if (key === "DEL") {
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={onBackspace}
              className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-neutral-200/80 hover:bg-neutral-300 active:bg-neutral-400 active:scale-95 text-neutral-700 transition-all flex items-center justify-center border border-neutral-300/60 shadow-xs tap-feedback animate-keypad-tap"
            >
              <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          );
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onDigit(key)}
            className="h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white hover:bg-neutral-50 active:bg-amber-100/80 text-xl sm:text-3xl font-extrabold text-neutral-900 transition-all flex items-center justify-center border border-neutral-200/80 shadow-xs tap-feedback animate-keypad-tap cursor-pointer"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};
