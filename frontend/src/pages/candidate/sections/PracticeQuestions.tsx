import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, PencilLine } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";

type PracticeQuestion = {
  id: string;
  title: string;
  prompt: string;
};

const QUESTIONS: PracticeQuestion[] = [
  {
    id: "js-closures",
    title: "JavaScript Closures",
    prompt: "Explain what a closure is in JavaScript. Provide a small example and one real-world use-case.",
  },
  {
    id: "react-state",
    title: "React State",
    prompt: "What are common causes of unnecessary re-renders in React, and how would you reduce them?",
  },
  {
    id: "sql-index",
    title: "SQL Indexing",
    prompt: "When would you add an index to a table? What trade-offs does indexing introduce?",
  },
];

export default function CandidatePracticeSection() {
  const [selectedId, setSelectedId] = useState(QUESTIONS[0].id);
  const [answer, setAnswer] = useState("");
  const selected = useMemo(() => QUESTIONS.find((q) => q.id === selectedId)!, [selectedId]);

  return (
    <PortalLayout
      title="CANDIDATE PORTAL"
      subtitle="PRACTICE QUESTIONS // WARM-UP"
      roleLabel="CANDIDATE"
      nav={[
        { label: "PROFILE", href: "/dashboard/candidate/profile", icon: <BookOpen className="w-4 h-4" /> },
        { label: "JOB POSTS", href: "/dashboard/candidate/jobs", icon: <BookOpen className="w-4 h-4" /> },
        { label: "AI INTERVIEW", href: "/dashboard/candidate/ai-interview", icon: <BookOpen className="w-4 h-4" /> },
        { label: "PRACTICE", href: "/dashboard/candidate/practice", icon: <BookOpen className="w-4 h-4" /> },
        { label: "TRACK", href: "/dashboard/candidate/track", icon: <BookOpen className="w-4 h-4" /> },
      ]}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <CyberCard className="lg:col-span-1" glow="accent">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">QUESTION SET</h2>
            <BookOpen className="text-accent" />
          </div>
          <div className="space-y-2">
            {QUESTIONS.map((q) => {
              const active = q.id === selectedId;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedId(q.id);
                    setAnswer("");
                  }}
                  className={
                    "w-full text-left border rounded p-3 " +
                    (active ? "border-primary/50 bg-primary/10" : "border-white/10 hover:border-white/20")
                  }
                >
                  <p className="font-display text-sm text-primary">{q.title}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">ID: {q.id}</p>
                </button>
              );
            })}
          </div>
        </CyberCard>

        <CyberCard className="lg:col-span-2" glow="primary">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg">ANSWER</h2>
            <PencilLine className="text-primary" />
          </div>
          <div className="border border-white/10 rounded p-4">
            <p className="font-display text-base text-primary">{selected.title}</p>
            <p className="text-sm text-muted-foreground mt-2">{selected.prompt}</p>
          </div>

          <div className="mt-4">
            <textarea
              className="w-full bg-black border border-white/10 rounded px-3 py-2 min-h-[220px] font-mono text-sm"
              placeholder="Write your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <CyberButton
                className="gap-2"
                variant="outline"
                onClick={() => {
                  // Local-only practice; no backend write.
                  setAnswer("");
                }}
              >
                <CheckCircle2 className="w-4 h-4" /> CLEAR
              </CyberButton>
            </div>
          </div>
        </CyberCard>
      </div>
    </PortalLayout>
  );
}
