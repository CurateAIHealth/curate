"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = new Set([
  "/",
  "/sign-in",
]);

export default function ReduxGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const users = useSelector((state: any) => state.AdminUsers);
  const fullInfo = useSelector((state: any) => state.AdminFullInfo);
  const deployment = useSelector((state: any) => state.AdminDeployment);

  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  const hasReduxData =
    users?.length > 0 &&
    fullInfo?.length > 0 &&
    deployment?.length > 0;

  useEffect(() => {
    // NEVER perform Redux/auth redirects on public pages
    if (isPublicRoute) {
      return;
    }

    const userId = localStorage.getItem("UserId");

    // No authenticated user
    if (!userId) {
      router.replace("/sign-in");
      return;
    }

    // Authenticated user but required Redux data isn't available
    if (!hasReduxData) {
      router.replace("/");
    }
  }, [isPublicRoute, hasReduxData, pathname, router]);

  return <>{children}</>;
}