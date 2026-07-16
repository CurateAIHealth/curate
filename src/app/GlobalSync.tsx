"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import {
  setUsers,
  setFullInfo,
  SetDeploymentInfo,
  UpdateUserFirstName,
} from "@/Redux/action";

export default function GlobalSync() {
  const dispatch = useDispatch();

  const mounted = useRef(false);
  const refreshing = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastClusterTime = useRef<string>("");

  useEffect(() => {
    mounted.current = true;

    const refreshDashboard = async () => {
      if (refreshing.current) {
        console.log("⏳ Refresh already running");
        return;
      }

      refreshing.current = true;

      try {
        console.log("🚀 Refreshing Dashboard...");

        const userId = localStorage.getItem("UserId");

        const { data } = await axios.post("/api/AdminPageInfo", {
          userId,
        });

        if (!mounted.current) return;

        dispatch(setUsers(data.data.registeredUsers));
        dispatch(setFullInfo(data.data.fullInfo));
        dispatch(SetDeploymentInfo(data.data.deployedLength));
        dispatch(UpdateUserFirstName(data.data.profile?.FirstName));

        console.log("✅ Redux Updated");
      } catch (err) {
        console.error("❌ Refresh Error", err);
      } finally {
        refreshing.current = false;
      }
    };

    console.log("📡 Opening Global SSE...");

    const eventSource = new EventSource("/api/payable-events");

    eventSource.onopen = () => {
      console.log("✅ Global SSE Connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (!message.refresh) return;

        console.log("📩 Mongo Event:", message);

        // Ignore duplicate Mongo events
        const clusterTime = JSON.stringify(message.clusterTime);

        if (clusterTime === lastClusterTime.current) {
          console.log("⏭ Duplicate Event Ignored");
          return;
        }

        lastClusterTime.current = clusterTime;

        // Debounce multiple updates
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
          refreshDashboard();
        }, 500);
      } catch (err) {
        console.error("❌ SSE Parse Error:", err);
      }
    };

 eventSource.onerror = () => {
  const states = ["CONNECTING", "OPEN", "CLOSED"];

  console.log(
    "SSE Error - State:",
    states[eventSource.readyState] ?? eventSource.readyState
  );

 
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log("SSE Connection Closed");
  } else if (eventSource.readyState === EventSource.CONNECTING) {
    console.log("SSE Reconnecting...");
  }
};

    return () => {
      mounted.current = false;

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      eventSource.close();

      console.log("❌ Global SSE Closed");
    };
  }, [dispatch]);

  return null;
}