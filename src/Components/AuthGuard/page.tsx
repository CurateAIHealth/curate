"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_ROUTES = new Set([
  "/",
  "/sign-in",
]);

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    // Public pages don't need authentication checking
    if (PUBLIC_ROUTES.has(pathname)) {
      return;
    }

    const userId = localStorage.getItem("UserId");

    if (!userId) {
      router.replace("/sign-in");
    }
  }, [pathname, router]);

  return <>{children}</>;
}