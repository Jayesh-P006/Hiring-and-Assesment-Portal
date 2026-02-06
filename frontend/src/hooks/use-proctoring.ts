import { useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";

type ProctorEventType =
  | "TAB_SWITCH"
  | "COPY_ATTEMPT"
  | "CUT_ATTEMPT"
  | "PASTE_ATTEMPT"
  | "CONTEXT_MENU"
  | "FULLSCREEN_EXIT"
  | "WEBCAM_SNAPSHOT";

async function logProctorEvent(params: {
  type: ProctorEventType;
  assessmentId?: number;
  payload?: unknown;
}): Promise<void> {
  await fetch(apiUrl("/proctor/log"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  }).catch(() => {
    // Swallow errors: proctor logging must not block UX.
  });
}

export function useProctoring(options: {
  assessmentId?: number;
  maxWarnings?: number;
  onAutoSubmit?: () => void;
}) {
  const { assessmentId, maxWarnings = 3, onAutoSubmit } = options;

  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => !!document.fullscreenElement);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs) {
        void logProctorEvent({ type: "FULLSCREEN_EXIT", assessmentId });
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [assessmentId]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "hidden") return;

      void logProctorEvent({ type: "TAB_SWITCH", assessmentId });
      setWarnings((prev) => {
        const next = prev + 1;
        if (next >= maxWarnings && !autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          onAutoSubmit?.();
        }
        return next;
      });
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [assessmentId, maxWarnings, onAutoSubmit]);

  const blockers = useMemo(() => {
    const preventWith = (type: ProctorEventType) => (e: Event) => {
      e.preventDefault();
      void logProctorEvent({ type, assessmentId });
    };

    return {
      onContextMenu: preventWith("CONTEXT_MENU"),
      onCopy: preventWith("COPY_ATTEMPT"),
      onCut: preventWith("CUT_ATTEMPT"),
      onPaste: preventWith("PASTE_ATTEMPT"),
    };
  }, [assessmentId]);

  async function requestFullscreen(el?: HTMLElement | null) {
    const target = el ?? document.documentElement;
    if (!target.requestFullscreen) return;
    try {
      await target.requestFullscreen();
    } catch {
      // Ignore.
    }
  }

  async function logSnapshot(imageBase64: string) {
    await logProctorEvent({ type: "WEBCAM_SNAPSHOT", assessmentId, payload: { imageBase64 } });
  }

  return {
    warnings,
    isFullscreen,
    requestFullscreen,
    blockers,
    logSnapshot,
  };
}
