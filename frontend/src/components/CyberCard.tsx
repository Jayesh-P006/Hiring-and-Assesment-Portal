import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "primary" | "secondary" | "accent" | "none";
}

export function CyberCard({ className, glow = "none", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-lg backdrop-blur-sm p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
