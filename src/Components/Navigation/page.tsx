"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  Update_Main_Filter_Status,
  UpdateUserType,
} from "@/Redux/action";

import {
  NavigationCallbacks,
  ROUTE_MAP,
  TAB_ACCESS_CONTROL,
} from "@/Lib/Content";

export function useDashboardNavigation(
  callbacks?: NavigationCallbacks
) {
  const router = useRouter();
  const dispatch = useDispatch();

  const loggedInEmail = useSelector(
    (state: any) => state.LoggedInEmail
  );

  const [isNavigating, setIsNavigating] = useState(false);

  // Prevent duplicate clicks only while a navigation is being started.
  const navigationStarted = useRef(false);

  const canAccessTab = useCallback(
    (tab: string) => {
      if (!loggedInEmail) return false;

      if (TAB_ACCESS_CONTROL.ALL?.includes(loggedInEmail))
        return true;

      return TAB_ACCESS_CONTROL[tab]?.includes(loggedInEmail);
    },
    [loggedInEmail]
  );

  const navigate = useCallback(
    (tab: string) => {
      // Ignore duplicate clicks.
      if (navigationStarted.current) {
        return {
          success: false,
          reason: "NAVIGATION_IN_PROGRESS",
        };
      }

      if (!loggedInEmail) {
        callbacks?.onLoginRequired?.();

        return {
          success: false,
          reason: "LOGIN_REQUIRED",
        };
      }

      if (!canAccessTab(tab)) {
        callbacks?.onPermissionDenied?.();

        return {
          success: false,
          reason: "PERMISSION_DENIED",
        };
      }

      const route =
        ROUTE_MAP[tab as keyof typeof ROUTE_MAP];

      if (!route) {
        console.warn(`Unknown Dashboard Route: ${tab}`);

        return {
          success: false,
          reason: "UNKNOWN_ROUTE",
        };
      }

      navigationStarted.current = true;
      setIsNavigating(true);

      // Start navigation IMMEDIATELY.
      router.push(route.path);

      // Redux updates are secondary.
      queueMicrotask(() => {
        if ("filter" in route && route.filter) {
          dispatch(Update_Main_Filter_Status(route.filter));
        }

        if ("userType" in route && route.userType) {
          dispatch(UpdateUserType(route.userType));
        }
      });

      return { success: true };
    },
    [
      callbacks,
      canAccessTab,
      dispatch,
      loggedInEmail,
      router,
    ]
  );

  return {
    navigate,
    isNavigating,
  };
}