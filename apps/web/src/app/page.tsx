"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
export default function RootPage() {
  const { data: session, status } = useSession();
  React.useEffect(() => {
    const waitForSession = async () => {
      if (status === "unauthenticated") {
        redirect("/login");
      }
      if (status === "authenticated") {
        redirect("/sale");
      }
    };
    if (status === "loading") return;
    waitForSession();
  }, [session, status]);
}
