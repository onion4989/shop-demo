// /home/takashi_ogawa/shop-demo/components/ui/external-link.tsx
"use client";

import * as React from "react";
import { Link as HeroLink } from "@heroui/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// 必要に応じてここに variant を追加していけます
const externalLinkVariants = cva(
  "text-primary underline hover:opacity-80 inline-flex items-center gap-1"
);

// ★ interface ではなく type + 交差型（&）にする
type ExternalLinkProps = React.ComponentPropsWithoutRef<typeof HeroLink> &
  VariantProps<typeof externalLinkVariants>;

export const ExternalLink = React.forwardRef<
  React.ElementRef<typeof HeroLink>,
  ExternalLinkProps
>(({ className, children, ...props }, ref) => {
  return (
    <HeroLink
      ref={ref}
      isExternal
      showAnchorIcon
      className={cn(externalLinkVariants(), className)}
      {...props}
    >
      {children}
    </HeroLink>
  );
});

ExternalLink.displayName = "ExternalLink";
