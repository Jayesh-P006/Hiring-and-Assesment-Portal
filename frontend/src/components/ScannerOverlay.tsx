import { motion } from "framer-motion";

interface ScannerOverlayProps {
  scanning: boolean;
  status?: "idle" | "scanning" | "success" | "error";
  message?: string;
}

export function ScannerOverlay({ scanning, status = "idle", message }: ScannerOverlayProps) {
  const colors = {
    idle: "hsl(var(--muted-foreground))",
    scanning: "hsl(var(--primary))",
    success: "hsl(var(--accent))",
    error: "hsl(var(--destructive))",
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="relative w-64 h-64 rounded-2xl border-2 border-dashed opacity-20" style={{ borderColor: colors[status] }} />
      
      {scanning && (
        <div className="scan-sweep" />
      )}

      {message && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-white bg-black/40 backdrop-blur-md inline-block px-3 py-1 rounded-full"
            style={{ color: status === 'scanning' ? 'white' : colors[status] }}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
