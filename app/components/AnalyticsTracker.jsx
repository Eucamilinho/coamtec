"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

function getVisitorId() {
  if (typeof window === "undefined") return null;
  
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      const visitorId = getVisitorId();
      if (!visitorId) return;

      try {
        await supabase.from("analytics").insert({
          page: pathname,
          visitor_id: visitorId,
        });
      } catch (error) {
        // Silent fail - don't break the app if analytics fails
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
