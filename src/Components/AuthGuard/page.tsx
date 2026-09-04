"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_ROUTES = new Set([
  "/sign-in",
]);

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const redirecting = useRef(false);

  useEffect(() => {
    if (PUBLIC_ROUTES.has(pathname)) {
      redirecting.current = false;
      return;
    }

    const checkAuth = () => {
   

      const userId = localStorage.getItem("UserId");

      if (!userId) {
    
        router.replace("/");
      }
    };

    checkAuth();

    const interval = window.setInterval(checkAuth, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [pathname, router]);

  return <>{children}</>;
}