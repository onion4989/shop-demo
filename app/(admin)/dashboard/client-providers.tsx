// app/(admin)/dashboard/ClientProviders.tsx
"use client";

import React from "react";
import { SessionProvider } from "@/node_modules/next-auth/react";

type Props = { children: React.ReactNode };

export default function ClientProviders({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
