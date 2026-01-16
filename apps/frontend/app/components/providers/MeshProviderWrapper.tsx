"use client";

import { MeshProvider } from "@meshsdk/react";

export function MeshProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MeshProvider>{children}</MeshProvider>;
}
