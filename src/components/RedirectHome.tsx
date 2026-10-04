"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectHome() {
  const router = useRouter();
  useEffect(() => router.replace("/"), [router]);
  return null;
}
