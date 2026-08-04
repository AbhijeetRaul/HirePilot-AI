"use client";


import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Brain,
  FileText,
  Briefcase,
  ChevronRight,
  Star,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "@/components/sidebar";
import ScoreCircle from "@/components/scorecircle";

// ─── Animated ATS Score Ring ──────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const numericScore = parseInt(score as unknown as string, 10);
  const offset = circumference - (numericScore / 100) * circumference;

  const color =
    numericScore >= 80
      ? "#4ade80"
      : numericScore >= 60
      ? "#facc15"
      : "#f87171";

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 rotate-[-90deg]" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="10"
          />
          {/* Animated progress arc */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-4xl font-extrabold z-10"
          style={{ color }}
        >
          {numericScore}
        </motion.span>
      </div>
      <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase">
        ATS Score
      </span>
    </div>
  );
}
// ─── Skill Badge ──────────────────────────────────────────────────────────────
function SkillBadge({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      className="px-3 py-1.5 text-sm font-medium rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/25 hover:border-violet-400 transition-all duration-200 cursor-default"
    >
      {skill}
    </motion.span>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 overflow-hidden ${className}`}
    >
      {/* Subtle gradient glow in corner */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl" />
      {children}
    </motion.div>
  );
}

// ─── List Item ────────────────────────────────────────────────────────────────
function ListItem({
  text,
  index,
  variant,
}: {
  text: string;
  index: number;
  variant: "strength" | "improvement";
}) {
  const icon =
    variant === "strength" ? (
      <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
    ) : (
      <TrendingUp size={16} className="text-amber-400 mt-0.5 shrink-0" />
    );

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed"
    >
      {icon}
      <span>{text}</span>
    </motion.li>
  );
}

// ─── Match Score Bar ──────────────────────────────────────────────────────────
function MatchBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
          style={{ boxShadow: "0 0 10px rgba(167,139,250,0.5)" }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchData, setMatchData] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const analysis = data?.analysis || {};

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setDragActive(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: { "application/pdf": [".pdf"] },
  });

  const apiBase = 
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const uploadResume = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      setLoading(true);
      setData(null);
      setMatchData(null);
      const response = await axios.post(
        `${apiBase}/api/resume/upload`,
        formData
      );
      setData(response.data);
      const newItem = { fileName: file.name,
  score: response.data.analysis.atsScore,
  date: new Date().toLocaleDateString(),
};

const updatedHistory = [newItem, ...history];

setHistory(updatedHistory);

localStorage.setItem(
  "resumeHistory",
  JSON.stringify(updatedHistory)
);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const matchJob = async () => {
    if (!jobDescription.trim() || !data) return;
    try {
      setMatchLoading(true);
      const response = await axios.post(
        `${apiBase}/api/resume/match-job`,
        { resumeText: data.extractedText, jobDescription }
      );
      setMatchData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    
  <div className="flex bg-[#0a0a0f] text-white">

    <Sidebar />

    <main className="flex-1 min-h-screen overflow-x-hidden">
      {/* ── Ambient background blobs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-fuchsia-900/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-widest uppercase mb-6">
            <Sparkles size={12} />
            AI-Powered Resume Analysis
          </div>
          

          <h1 className="text-7xl md:text-8xl font-black tracking-tight bg-gradient-to-br from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent leading-none">
            HirePilot
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="mt-6 text-zinc-500 text-lg max-w-md mx-auto leading-relaxed">
            Upload your resume and get instant ATS insights, skill extraction,
            and job-match scoring.
          </p>
        </motion.div>

        {/* ── Upload Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 mb-8"
        >
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed p-14 text-center cursor-pointer transition-all duration-300 group ${
              dragActive
                ? "border-violet-400 bg-violet-500/10 scale-[1.01]"
                : "border-zinc-700 hover:border-zinc-500 hover:bg-white/5"
            }`}
          >
            <input {...getInputProps()} />

            {/* Animated icon */}
            <motion.div
              animate={dragActive ? { scale: 1.2, rotate: 8 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 flex items-center justify-center"
            >
              <UploadCloud
                size={30}
                className={`transition-colors ${
                  dragActive ? "text-violet-300" : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              />
            </motion.div>

            <p className="text-lg font-semibold text-zinc-200 mb-1">
              {dragActive ? "Release to upload" : "Drag & drop your resume here"}
            </p>
            <p className="text-zinc-500 text-sm">
              Supports PDF — or{" "}
              <span className="text-violet-400 underline underline-offset-2">
                click to browse
              </span>
            </p>

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-medium"
                >
                  <FileText size={14} />
                  {file.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Analyze button */}
          <motion.button
            onClick={uploadResume}
            disabled={loading || !file}
            whileHover={{ scale: file && !loading ? 1.01 : 1 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full mt-6 py-4 rounded-2xl font-bold text-base overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 opacity-0 hover:opacity-100 blur-xl transition-opacity duration-500" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Brain size={18} />
                  Analyze Resume
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
        {data?.extractedText && (
  <div className="mt-12">
    <h2 className="text-3xl font-bold mb-6">
      Resume Preview
    </h2>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-h-[600px] overflow-y-auto whitespace-pre-wrap text-zinc-300 leading-8">
      {data.extractedText}
    </div>
  </div>
)}

        {/* ── Results Grid ── */}
        <AnimatePresence>
          {data && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Row 1: Score + Skills */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ATS Score */}
                <GlassCard delay={0.1}>
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-2">
                    <ScoreCircle score={analysis.atsScore || 0} />
                    <p className="text-zinc-500 text-xs text-center max-w-[180px] leading-relaxed">
                      Based on formatting, keywords & structure
                    </p>
                  </div>
                </GlassCard>

                {/* Skills */}
                <GlassCard delay={0.15}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <Star size={15} className="text-violet-400" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-100">
                      Detected Skills
                    </h2>
                    <span className="ml-auto text-xs text-zinc-500 font-medium">
                      {analysis.skills?.length || 0} found
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills?.map((skill: string, i: number) => (
                      <SkillBadge key={i} skill={skill} index={i} />
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Row 2: Strengths + Improvements */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <GlassCard delay={0.2}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle2 size={15} className="text-green-400" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-100">
                      Strengths
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {analysis.strengths?.map((item: string, i: number) => (
                      <ListItem key={i} text={item} index={i} variant="strength" />
                    ))}
                  </ul>
                </GlassCard>

                {/* Improvements */}
                <GlassCard delay={0.25}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <TrendingUp size={15} className="text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-100">
                      Improvements
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {analysis.improvements?.map((item: string, i: number) => (
                      <ListItem key={i} text={item} index={i} variant="improvement" />
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {/* ── Job Match Section ── */}
              <GlassCard delay={0.3}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center">
                    <Briefcase size={15} className="text-fuchsia-400" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-100">
                    Job Match Analyzer
                  </h2>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a job description here to see how well your resume matches..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all duration-200"
                />

                <motion.button
                  onClick={matchJob}
                  disabled={matchLoading || !jobDescription.trim()}
                  whileHover={{ scale: jobDescription.trim() && !matchLoading ? 1.01 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-4 w-full py-3.5 rounded-2xl font-semibold text-sm overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-700 to-violet-700" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {matchLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Matching...
                      </>
                    ) : (
                      <>
                        Match Against Job
                        <ChevronRight size={15} />
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Match Results */}
                <AnimatePresence>
                  {matchData && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8 space-y-5"
                    >
                      <div className="h-px bg-white/10" />

                      <div className="grid md:grid-cols-3 gap-4 pt-2">
                        <MatchBar
                          label="Overall Match"
                          value={matchData.overallMatch ?? 0}
                        />
                        <MatchBar
                          label="Keyword Coverage"
                          value={matchData.keywordCoverage ?? 0}
                        />
                        <MatchBar
                          label="Skills Alignment"
                          value={matchData.skillsAlignment ?? 0}
                        />
                      </div>

                      {matchData.missingKeywords?.length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                            Missing Keywords
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {matchData.missingKeywords.map(
                              (kw: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-xs rounded-full border border-red-500/30 bg-red-500/10 text-red-300"
                                >
                                  {kw}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {matchData.suggestions?.length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                            Suggestions
                          </p>
                          <ul className="space-y-3">
                            {matchData.suggestions.map(
                              (s: string, i: number) => (
                                <ListItem
                                  key={i}
                                  text={s}
                                  index={i}
                                  variant="improvement"
                                />
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-zinc-700 text-xs mt-16"
        >
          HirePilot AI — Powered by AI · Built with Next.js & Tailwind CSS
        </motion.p>
      </div>
      <pre className="mt-10 text-xs overflow-auto bg-black p-4 rounded-xl">
  {JSON.stringify(analysis, null, 2)}
</pre>
    </main>
    </div>
    
  );
}
