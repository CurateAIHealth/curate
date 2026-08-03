"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import {
  setUsers,
  setFullInfo,
  SetDeploymentInfo,
} from "@/Redux/action";

const dashboardCache = {
  data: null as any,
  promise: null as Promise<any> | null,
};

const RECONNECT_DELAY = 3000;
const REFRESH_DEBOUNCE = 250;

export default function GlobalSync() {
  const dispatch = useDispatch();

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
 
  const mounted = useRef(true);
const refreshMap: Record<string, string[]> = {
  Registration: ["registeredUsers"],
  CompliteRegistrationInformation: ["fullInfo"],
  Deployment: ["deployment"],
};

  useEffect(() => {
    mounted.current = true;

    const cleanup = () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;

      

      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

const applyData = (data: any) => {
  if (!mounted.current) return;

  dispatch(setUsers(data.registeredUsers));
  dispatch(setFullInfo(data.fullInfo));
  dispatch(SetDeploymentInfo(data.deployedLength));
};

const refreshCollection = async (forceRefresh = false,collection?: string) => {
  const userId = localStorage.getItem("UserId");

  if (!userId) return;

  try {
    // ✅ Use client cache
    if (!forceRefresh && dashboardCache.data) {
      console.log("📦 Using Dashboard Cache");
      applyData(dashboardCache.data);
      return;
    }

    // ✅ Wait for existing request
    if (!forceRefresh && dashboardCache.promise) {
      console.log("⏳ Waiting for existing dashboard request...");

      const data = await dashboardCache.promise;

      applyData(data);
      return;
    }
const refreshType =
  refreshMap[collection || ""] || undefined;
    console.log("🌐 Fetching Fresh Dashboard Data...");

    dashboardCache.promise = axios
      .post("/api/AdminPageInfo", {
        userId,
        refreshType: refreshType 
      })
      .then((res) => res.data.data);

    try {
      const data = await dashboardCache.promise;

      dashboardCache.data = data;

      applyData(data);

      console.log("✅ Dashboard Cache Updated");
    } finally {
      dashboardCache.promise = null;
    }
  } catch (error) {
    dashboardCache.promise = null;
    console.error("❌ Dashboard Refresh Error:", error);
  }
};

    const connect = () => {
      if (!mounted.current) return;

      const userId = localStorage.getItem("UserId");

      if (!userId) {
        reconnectTimer.current = setTimeout(connect, 1000);
        return;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const es = new EventSource("/api/payable-events");
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log("✅ GlobalSync Connected");
      };

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (!payload.refresh || !payload.collection) return;

          if (refreshTimer.current) {
            clearTimeout(refreshTimer.current);
          }

          refreshTimer.current = setTimeout(() => {
    
          
             console.log("Refreshing collection:", payload.collection);
         dashboardCache.data = null;

refreshCollection(true, payload.collection);
          }, REFRESH_DEBOUNCE);
        } catch (err) {
          console.error("Invalid SSE payload:", err);
        }
      };

      es.onerror = () => {
        es.close();

        if (!mounted.current) return;

        reconnectTimer.current = setTimeout(() => {
          connect();
        }, RECONNECT_DELAY);
      };
    };

    refreshCollection();

connect();

    return () => {
      mounted.current = false;
      cleanup();
    };
  }, [dispatch]);

  return null;
}