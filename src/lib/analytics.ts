import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import { analyticsPromise } from "@/lib/firebase";

export const logEvent = async (
  name: string,
  params?: Record<string, string | number | boolean>,
) => {
  const analytics = await analyticsPromise;
  if (!analytics) return;
  firebaseLogEvent(analytics, name, params);
};

export const reportWebVitals = () => {
  const report = (metric: { name: string; value: number }) =>
    logEvent("web_vitals", { metric: metric.name, value: Math.round(metric.value) });

  onCLS(report);
  onFCP(report);
  onINP(report);
  onLCP(report);
  onTTFB(report);
};
