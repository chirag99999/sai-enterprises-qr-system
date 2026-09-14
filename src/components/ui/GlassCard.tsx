import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  dark?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  elevated = false,
  dark = false,
  onClick,
}) => {
  const baseClass = dark
    ? "glass-dark"
    : elevated
    ? "glass-panel-elevated"
    : "glass-panel";

  return (
    <div
      onClick={onClick}
      className={`${baseClass} rounded-3xl transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
