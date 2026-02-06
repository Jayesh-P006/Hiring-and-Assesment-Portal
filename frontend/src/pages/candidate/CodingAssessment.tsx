import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import Webcam from "react-webcam";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { apiUrl } from "@/lib/api";
import { useProctoring } from "@/hooks/use-proctoring";

type AnalyzeResponse = {
  issues: string[];
  complexity: string;
  score: number;
  language: string;
  lines: number;
};

type Params = { id: string };

const LANGS = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];

export default function CodingAssessment() {
  const params = useParams<Params>();
  const assessmentId = Number(params.id);
  const [, setLocation] = useLocation();

  const pageRef = useRef<HTMLDivElement | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const [language, setLanguage] = useState(LANGS[0].value);
  const [code, setCode] = useState("// Write your solution here\n");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const browserLogs = useMemo(() => [], [] as Array<{ event: string; time: string }>);

  const { warnings, isFullscreen, requestFullscreen, blockers, logSnapshot } = useProctoring({
    assessmentId,
    onAutoSubmit: () => {
      void submitFinal();
    },
  });

  useEffect(() => {
    void requestFullscreen(pageRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const image = webcamRef.current?.getScreenshot();
      if (image) void logSnapshot(image);
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [logSnapshot]);

  async function runCode() {
    setStdout("");
    setStderr("");
    const res = await fetch(apiUrl("/code/execute"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ assessmentId, language, code }),
    });
    const data = await res.json();
    setStdout(data.stdout || "");
    setStderr(data.stderr || "");
  }

  async function analyzeCode() {
    setAnalysis(null);
    const res = await fetch(apiUrl("/code/analyze"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ assessmentId, language, code }),
    });
    const data = (await res.json()) as AnalyzeResponse;
    setAnalysis(data);
  }

  async function submitFinal() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await analyzeCode();
      const me = await fetch(apiUrl("/api/user/me"), { credentials: "include" });
      const meJson = await me.json();

      await fetch(apiUrl("/api/v1/generate-report"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          candidateId: meJson.id,
          assessmentId,
          codeSnapshot: code,
          browserLogs,
          audioTranscript: "",
        }),
      });

      setLocation("/dashboard/candidate");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-black p-6">
      {!isFullscreen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <CyberCard className="max-w-lg w-full">
            <h2 className="font-display text-xl text-primary mb-2">FULLSCREEN REQUIRED</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Return to fullscreen to continue.
            </p>
            <CyberButton onClick={() => requestFullscreen(pageRef.current)}>RETURN TO FULLSCREEN</CyberButton>
          </CyberCard>
        </div>
      )}

      <header className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-primary tracking-widest">LIVE CODING</h1>
          <p className="font-mono text-xs text-muted-foreground">Warnings: {warnings}/3</p>
        </div>
        <div className="flex gap-2">
          <CyberButton variant="outline" onClick={() => setLocation("/dashboard/candidate")}>EXIT</CyberButton>
          <CyberButton variant="secondary" onClick={submitFinal} disabled={submitting}>SUBMIT</CyberButton>
        </div>
      </header>

      <main className="grid lg:grid-cols-3 gap-6">
        <CyberCard className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">LANGUAGE</span>
              <select
                className="bg-black border border-white/10 rounded px-2 py-1 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <CyberButton variant="outline" onClick={() => setCode("// Write your solution here\n")}>RESET</CyberButton>
              <CyberButton variant="outline" onClick={runCode}>RUN CODE</CyberButton>
              <CyberButton onClick={analyzeCode}>ANALYZE</CyberButton>
            </div>
          </div>

          <div
            className="rounded border border-white/10 overflow-hidden"
            onContextMenu={blockers.onContextMenu as any}
            onCopy={blockers.onCopy as any}
            onCut={blockers.onCut as any}
            onPaste={blockers.onPaste as any}
          >
            <textarea
              className="w-full min-h-[420px] bg-black font-mono text-sm p-4 outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="border border-white/10 rounded p-3">
              <p className="font-mono text-xs text-muted-foreground mb-2">STDOUT</p>
              <pre className="font-mono text-xs whitespace-pre-wrap">{stdout || "(empty)"}</pre>
            </div>
            <div className="border border-white/10 rounded p-3">
              <p className="font-mono text-xs text-muted-foreground mb-2">STDERR</p>
              <pre className="font-mono text-xs whitespace-pre-wrap text-red-400">{stderr || "(empty)"}</pre>
            </div>
          </div>
        </CyberCard>

        <div className="space-y-6">
          <CyberCard>
            <p className="font-display text-lg mb-2">PROCTOR VIEW</p>
            <div className="relative aspect-video rounded overflow-hidden border border-white/10">
              <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-2">Snapshot every 30s.</p>
          </CyberCard>

          <CyberCard>
            <p className="font-display text-lg mb-2">ANALYSIS</p>
            {!analysis ? (
              <p className="text-sm text-muted-foreground">Run ANALYZE to see results.</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">SCORE</span>
                  <span className="text-primary">{analysis.score}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">LINES</span>
                  <span className="text-primary">{analysis.lines}</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">COMPLEXITY</span>
                  <span className="text-primary">{analysis.complexity}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="font-mono text-xs text-muted-foreground mb-1">ISSUES</p>
                  {analysis.issues.length === 0 ? (
                    <p className="text-sm">None</p>
                  ) : (
                    <ul className="text-sm list-disc pl-4">
                      {analysis.issues.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </CyberCard>
        </div>
      </main>
    </div>
  );
}
