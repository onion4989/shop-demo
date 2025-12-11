// /features/admin/components/shared/RegistrationPopupCard.tsx
"use client";

import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Line = {
  label: string;
  value: string;
};

type RegistrationPopupCardProps = {
  title: string;
  lines: Line[];
  timestamp?: string;
  timestampLabel?: string;
  icon?: ReactNode;
};

export function RegistrationPopupCard({
  title,
  lines,
  timestamp,
  timestampLabel = "登録日時",
  icon,
}: RegistrationPopupCardProps) {
  return (
    <div className="fixed right-4 top-4 z-50">
      <Card
        className="
          shadow-lg border border-primary/40 
          bg-background/95 backdrop-blur-sm
          animate-in fade-in slide-in-from-top-4 
          duration-300
        "
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            {icon ?? <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            <CardTitle className="text-sm font-semibold">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          {lines.map((line) => (
            <p key={line.label}>
              <span className="font-semibold">{line.label}：</span>
              {line.value}
            </p>
          ))}
          {timestamp && (
            <p className="text-[10px] text-muted-foreground">
              {timestampLabel}：{timestamp}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
