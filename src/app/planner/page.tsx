"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Settings, Sparkles, Volume2, X, Send, CheckCircle2, Copy, Share2 } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import ChatMessageContent from "@/components/ChatMessageContent";
import { inr } from "@/data/demo";
import {
  blankProfile,
  buildPlan,
  checkFeasibility,
  infeasibleMessage,
  matchDestination,
  nextQuestion,
  parseBudget,
  parseDays,
  parseTravellers,
  step,
  type ChatMsg,
  type TripPlan,
  type TripProfile,
} from "@/lib/planner/engine";

type Phase = "interview" | "guiding";

function planToHandoffText(plan: TripPlan, profile: TripProfile): string {
  return `Here's my confirmed plan, please guide me through booking it step by step: ${plan.title}. ${plan.summary} Estimated total ${inr(plan.estimate)}. Travellers: ${profile.travellers}${profile.budget ? `, budget ${inr(profile.budget)}` : ""}. Walk me through flights first, then stay, then package, with links.`;
}

function PlanCard({ plan, profile, onGuide, guided }: { plan: TripPlan; profile: TripProfile; onGuide?: () => void; guided?: boolean }) {
  const [openDays, setOpenDays] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(plan.id || null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const shown = openDays ? plan.days : plan.days.slice(0, 3);
  const meta = [
    profile.destination || "Flexible",
    profile.days ? `${profile.days} days` : `${plan.days.length} days`,
    `${profile.travellers} travellers`,
    profile.budget ? inr(profile.budget) : "Flexible budget",
  ].join(" · ");

  const handleSaveAndShare = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, profile }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        throw new Error(data?.error || "Save failed.");
      }
      setSavedId(data.id);
      plan.id = data.id;
      if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
        const fullUrl = `${window.location.origin}/planner/${data.id}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e: any) {
      setSaveError(e?.message || "Could not save plan.");
    } finally {
      setSaving(false);
    }
  };

  const copyShareLink = async () => {
    if (!savedId) return;
    if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
      try {
        const fullUrl = `${window.location.origin}/planner/${savedId}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        /* fallback */
      }
    }
  };

  return (
    <div className="mt-2 overflow-hidden rounded-2xl bg-white">
      <div className="bg-[#023341] px-5 py-4">
        <p className="font-display text-lg font-bold leading-snug text-white">{plan.title}</p>
        <p className="mt-1 text-sm text-teal-100">{meta}</p>
      </div>
      <div className="bg-white px-5 py-4">
        <p className="text-base leading-relaxed text-gray-900">{plan.summary}</p>

        <p className="mt-5 text-base font-bold text-gray-900">Day by day</p>
        <ol className="mt-2 space-y-3">
          {shown.map((d) => (
            <li key={d.day} className="flex gap-3">
              <span className="w-14 shrink-0 pt-0.5 text-sm font-bold tabular-nums text-[#023341]">
                Day {d.day}
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900">{d.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{d.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        {plan.days.length > 3 && (
          <button
            type="button"
            onClick={() => setOpenDays((v) => !v)}
            className="mt-3 rounded-full bg-[#efeeeb] px-4 py-1.5 text-[13px] font-bold text-[#023341] transition-colors hover:bg-[#023341] hover:text-white"
          >
            {openDays ? "Show fewer days" : `Show all ${plan.days.length} days`}
          </button>
        )}

        <div className="mt-5 space-y-2">
          <p className="text-base font-bold text-gray-900">Book this trip</p>
          {plan.packageSlug && (
            <a
              href={`/holidays/packages/${plan.packageSlug}`}
              className="flex items-baseline justify-between gap-3 rounded-xl bg-[#efeeeb] px-4 py-3 transition-colors hover:bg-[#e3e0d8]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-gray-900">{plan.packageTitle}</span>
                <span className="block text-sm text-gray-600">Package · {plan.packagePrice ? inr(plan.packagePrice) : "price on page"}</span>
              </span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-[#a83200]">View</span>
            </a>
          )}
          {plan.stay && (
            <a
              href={plan.stay.href}
              className="flex items-baseline justify-between gap-3 rounded-xl bg-[#efeeeb] px-4 py-3 transition-colors hover:bg-[#e3e0d8]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-gray-900">{plan.stay.name}</span>
                <span className="block text-sm text-gray-600">{plan.stay.city} · <span className="tabular-nums">{inr(plan.stay.price)} a night</span></span>
              </span>
              <span className="shrink-0 text-sm font-bold text-[#a83200]">View</span>
            </a>
          )}
          {plan.flightHref && (
            <a
              href={plan.flightHref}
              className="flex items-baseline justify-between gap-3 rounded-xl bg-[#efeeeb] px-4 py-3 transition-colors hover:bg-[#e3e0d8]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-gray-900">{plan.flightNote}</span>
                <span className="block text-sm text-gray-600">Live fares · one way</span>
              </span>
              <span className="shrink-0 text-sm font-bold text-[#a83200]">Search</span>
            </a>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between rounded-xl bg-[#efeeeb] px-4 py-3">
          <span className="text-sm text-gray-700">Estimated total</span>
          <span className="font-display text-2xl font-extrabold tabular-nums text-[#023341]">
            {inr(plan.estimate)}
          </span>
        </div>

        {onGuide && (
          <button
            type="button"
            onClick={onGuide}
            disabled={guided}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-base font-bold transition-colors ${
              guided
                ? "bg-[#e6f2e9] text-green-800"
                : "bg-[#d63f00] text-white hover:bg-[#b53a00]"
            }`}
          >
            {guided ? <><CheckCircle2 size={17} /> Agent is guiding you below. Just reply.</> : <><Send size={16} /> Guide me through booking</>}
          </button>
        )}

        {!savedId ? (
          <button
            type="button"
            onClick={handleSaveAndShare}
            disabled={saving}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#efeeeb] py-2.5 text-base font-bold text-[#023341] transition-colors hover:bg-[#023341] hover:text-white"
          >
            <Share2 size={16} />
            {saving ? "Saving plan…" : "Save & share plan"}
          </button>
        ) : (
          <div className="mt-2.5 rounded-xl bg-[#e6f2e9] p-3 text-green-900">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-green-950">
                Saved to /planner/{savedId}
              </span>
              <button
                type="button"
                onClick={copyShareLink}
                className="shrink-0 rounded-full bg-[#023341] px-3.5 py-1 text-[13px] font-bold text-white transition-colors hover:bg-[#003b53]"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <p className="mt-1 text-[13px] text-green-800">
              Anyone with this link can view this itinerary and continue chatting with Mauji.
            </p>
          </div>
        )}
        {saveError && <p className="mt-1 text-[13px] text-red-600">{saveError}</p>}

        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Built from this site's own packages, stays and fares. {profile.travellers} travellers
          {profile.budget ? `, budget ${inr(profile.budget)}` : ""}. Reply to adjust it, for example 5 days or budget 40k.
        </p>
      </div>
    </div>
  );
}

const AI_PRESETS = [
  { label: "OpenCode Local (this Mac)", baseUrl: "opencode-local", model: "deepseek-v4.1-flash-free" },
  { label: "Mauji AI (free)", baseUrl: "https://text.pollinations.ai/openai-fast", model: "openai-fast" },
  { label: "OpenAI", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  { label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini" },
  { label: "Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", model: "gemini-2.0-flash" },
  { label: "Custom", baseUrl: "", model: "" },
];

interface AiSettings {
  preset: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  ttsBase: string;
  ttsKey: string;
  voiceId: string;
}

const FREE_AI = { preset: "Mauji AI (free)", baseUrl: "https://text.pollinations.ai/openai-fast", model: "openai-fast", apiKey: "" };

const LEGACY_POLLI_BASE = "https://text.pollinations.ai/openai";

function loadAiSettings(): AiSettings {
  const base = { ...FREE_AI, ttsBase: "", ttsKey: "", voiceId: "" };
  try {
    const s = JSON.parse(localStorage.getItem("maujitrip-ai") || "{}");
    if (!s.baseUrl) return base;
    if (s.baseUrl === "https://text.pollinations.ai" || s.baseUrl === LEGACY_POLLI_BASE) {
      s.baseUrl = FREE_AI.baseUrl;
      if (!s.model || s.model === "openai") s.model = FREE_AI.model;
    }
    return {
      preset: s.preset || FREE_AI.preset,
      baseUrl: s.baseUrl,
      model: s.model || FREE_AI.model,
      apiKey: s.apiKey || "",
      ttsBase: s.ttsBase || "",
      ttsKey: s.ttsKey || "",
      voiceId: s.voiceId || "",
    };
  } catch {
    return base;
  }
}

function needsKey(s: AiSettings | null) {
  if (!s) return true;
  if (s.preset === "Mauji AI (free)") return false;
  if (s.baseUrl === "opencode-local") return false;
  return !s.apiKey;
}

function cleanForSpeech(t: string) {
  return t
    .replace(/https?:\/\/\S+/g, "link")
    .replace(/[*_#>`|]/g, "")
    .replace(/\n+/g, ". ")
    .slice(0, 900);
}

export default function PlannerPage() {
  const [profile, setProfile] = useState<TripProfile>(blankProfile);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [phase, setPhase] = useState<Phase>("interview");
  const [guided, setGuided] = useState(false);
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [draft, setDraft] = useState<AiSettings | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memory, setMemory] = useState("");
  const [newFact, setNewFact] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    setSettings(loadAiSettings());
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("planId") || params.get("resume");

    const restoreNormal = () => {
      try {
        const saved = localStorage.getItem("maujitrip-planner");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.msgs) && parsed.msgs.length) {
            setProfile(parsed.profile || blankProfile());
            setMsgs(parsed.msgs);
            if (parsed.phase === "guiding") setPhase("guiding");
            if (parsed.guided) setGuided(true);
            return;
          }
        }
      } catch {
        /* fresh start */
      }
      const q = nextQuestion(blankProfile());
      if (q) setMsgs([{ role: "ai", text: q.text, chips: q.chips }]);
      fetch("/api/ai/memory").then((x) => x.json()).then((j) => setMemory(j?.memory || "")).catch(() => {});
    };

    if (planId) {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch(`/api/plans/${encodeURIComponent(planId)}`);
          if (res.ok && !cancelled) {
            const data = await res.json();
            const loadedPlan: TripPlan = data.plan || data;
            const loadedProfile: TripProfile = data.profile || {
              ...blankProfile(),
              destination: loadedPlan.title.split(" ")[1] || null,
              days: loadedPlan.days?.length || 4,
            };
            setProfile(loadedProfile);
            setPhase("interview");
            setGuided(false);
            setMsgs([
              {
                role: "ai",
                text: `Loaded your saved plan: ${loadedPlan.title}. Estimated total ${inr(loadedPlan.estimate)} for ${loadedProfile.travellers} traveller${loadedProfile.travellers === 1 ? "" : "s"}. You can tweak it (e.g. 5 days or budget 40k), ask any questions, or guide your booking below.`,
                plan: { ...loadedPlan, id: planId },
                chips: ["Guide me through booking", "Just chat"],
              },
            ]);
            window.history.replaceState({}, "", "/planner");
            fetch("/api/ai/memory").then((x) => x.json()).then((j) => setMemory(j?.memory || "")).catch(() => {});
            return;
          }
        } catch {
          /* fallback */
        }
        if (!cancelled) restoreNormal();
      })();
      return () => {
        cancelled = true;
      };
    }

    restoreNormal();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    try {
      localStorage.setItem("maujitrip-planner", JSON.stringify({ profile, msgs, phase, guided }));
    } catch {
      /* ignore */
    }
  }, [msgs, profile, phase, guided]);

  useEffect(() => {
    if (settings) {
      try {
        localStorage.setItem("maujitrip-ai", JSON.stringify(settings));
      } catch {
        /* ignore */
      }
    }
  }, [settings]);

  const enrichPlan = async (plan: TripPlan, p: TripProfile) => {
    let ai = { baseUrl: FREE_AI.baseUrl, model: FREE_AI.model, apiKey: "" };
    try {
      const s = JSON.parse(localStorage.getItem("maujitrip-ai") || "{}");
      if (s.baseUrl && s.model) ai = { baseUrl: s.baseUrl, model: s.model, apiKey: s.apiKey || "" };
    } catch {
      /* free default */
    }
    setEnriching(true);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 70000);
      const r = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: p, plan, baseUrl: ai.baseUrl, model: ai.model, apiKey: ai.apiKey }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const j = await r.json();
      if (!r.ok || !j?.summary) return;
      const enriched: TripPlan = { ...plan, summary: j.summary, days: j.days || plan.days };
      setMsgs((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].plan && next[i].plan!.title === plan.title) {
            next[i] = {
              ...next[i],
              text: next[i].text.replace("I am refining the day details with AI now.", "The day details below are written by AI."),
              plan: enriched,
            };
            break;
          }
        }
        return next;
      });
    } catch {
      /* keep rule-based text on AI failure */
    } finally {
      setEnriching(false);
    }
  };

  const chatWithAgent = async (history: ChatMsg[]) => {
    const s = settings;
    if (!s?.baseUrl || !s?.model || needsKey(s)) {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "Add your model API key first. Tap Configure. Your key stays in this browser only." },
      ]);
      setSettingsOpen(true);
      return;
    }
    setThinking(true);
    busyRef.current = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 120000);
    try {
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: s.baseUrl,
          apiKey: s.apiKey,
          model: s.model,
          messages: history.map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        }),
        signal: ctrl.signal,
      });
      const j = await r.json();
      clearTimeout(timer);
      setMsgs((m) => [
        ...m,
        { role: "ai", text: j.reply || `Error: ${j.error || "unknown"}`, plan: j.plan || undefined },
      ]);
    } catch (e: any) {
      clearTimeout(timer);
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text:
            e?.name === "AbortError"
              ? "That took too long. The free model is slow right now. Tap send again to retry."
              : `The model could not be reached: ${String(e?.message || e).slice(0, 140)}`,
        },
      ]);
    } finally {
      setThinking(false);
      busyRef.current = false;
    }
  };

  const guideBooking = async (plan: TripPlan, p: TripProfile) => {
    if (guided) return;
    setGuided(true);
    setPhase("guiding");
    const ack: ChatMsg[] = [
      ...msgs,
      { role: "user" as const, text: `My plan: ${plan.title} (${inr(plan.estimate)} estimate). Guide me through booking it.` },
      { role: "ai" as const, text: `Locked in. ${plan.title}. I will walk you through booking step by step. Flights first, then stay, then package. Checking live options now.`, plan },
    ];
    setMsgs(ack);
    const s = settings || loadAiSettings();
    if (!s?.baseUrl || !s?.model || needsKey(s)) return;
    setThinking(true);
    busyRef.current = true;
    try {
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: s.baseUrl,
          apiKey: s.apiKey,
          model: s.model,
          messages: [
            ...ack.map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
            { role: "user", content: planToHandoffText(plan, p) },
          ],
        }),
      });
      const j = await r.json();
      setMsgs((m) => [
        ...m,
        { role: "ai", text: j.reply || `Error: ${j.error || "unknown"}`, plan: j.plan || undefined },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "I have your plan saved above. Tell me your travel date, like 19 Dec, and I will start with live flights, then stay and package." },
      ]);
    } finally {
      setThinking(false);
      busyRef.current = false;
    }
  };

  const generateNow = () => {
    if (thinking || busyRef.current) return;
    if (!profile.destination) {
      setMsgs((m) => [...m, { role: "ai", text: "Tell me a destination first, like Goa or Manali, and I will build the full plan." }]);
      return;
    }
    const prof: TripProfile = { ...profile, days: profile.days || 4, _askedTrav: true, _askedTheme: true, themes: profile.themes.length ? profile.themes : ["family"] };
    const f = checkFeasibility(prof);
    if (!f.feasible) {
      const msg = infeasibleMessage(prof, f);
      setProfile(prof);
      setMsgs((m) => [...m, { role: "ai", text: msg.text, chips: msg.chips }]);
      return;
    }
    const plan = buildPlan(prof);
    setProfile(prof);
    setMsgs((m) => [
      ...m,
      { role: "ai", text: `Done. ${plan.title}. Closest real package: ${plan.packageTitle || "none"} (${plan.packagePrice ? inr(plan.packagePrice) : "price on page"}). Estimate ${inr(plan.estimate)}. I am refining the day details with AI now.`, plan },
    ]);
    enrichPlan(plan, prof);
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t || thinking || busyRef.current) return;
    if (phase === "guiding") {
      const history: ChatMsg[] = [...msgs, { role: "user" as const, text: t }];
      setMsgs(history);
      setInput("");
      chatWithAgent(history);
      return;
    }
    if (/just chat|talk freely|chat freely|chat with me/i.test(t)) {
      const history: ChatMsg[] = [...msgs, { role: "user" as const, text: "I would rather just chat freely about my trip." }];
      setMsgs(history);
      setInput("");
      setPhase("guiding");
      chatWithAgent(history);
      return;
    }
    if (/\?\s*$/.test(t) || /^(what|when|where|how|why|who|which|is|are|can|could|do|does|tell me about)/i.test(t)) {
      if (!matchDestination(t) && !parseDays(t) && !parseBudget(t) && !parseTravellers(t)) {
        const history: ChatMsg[] = [...msgs, { role: "user" as const, text: t }];
        setMsgs(history);
        setInput("");
        setPhase("guiding");
        chatWithAgent(history);
        return;
      }
    }
    setThinking(true);
    const withUser: ChatMsg[] = [...msgs, { role: "user", text: t }];
    setMsgs(withUser);
    setInput("");
    setTimeout(() => {
      const res = step(profile, t);
      const { profile: p2, replies, done } = res;
      if (res.handoffToAgent) {
        // Human typing the rules cannot parse. The agent takes it from here.
        setProfile(p2);
        setThinking(false);
        setPhase("guiding");
        chatWithAgent(withUser);
        return;
      }
      setProfile(p2);
      setMsgs([...withUser, ...replies]);
      setThinking(false);
      const built = done ? replies.find((r) => r.plan)?.plan : undefined;
      if (built) enrichPlan(built, p2);
    }, 450);
  };

  const reset = () => {
    const p = blankProfile();
    setProfile(p);
    setPhase("interview");
    setGuided(false);
    const q = nextQuestion(p);
    setMsgs(q ? [{ role: "ai", text: q.text, chips: q.chips }] : []);
    try {
      localStorage.removeItem("maujitrip-planner");
    } catch {
      /* ignore */
    }
  };

  const speak = async (text: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      const clean = cleanForSpeech(text);
      if (settings?.ttsKey && settings?.ttsBase && settings?.voiceId) {
        const r = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baseUrl: settings.ttsBase,
            apiKey: settings.ttsKey,
            voiceId: settings.voiceId,
            text: clean,
          }),
        });
        if (!r.ok) throw new Error("voice upstream error");
        const blob = await r.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audioRef.current = audio;
        setSpeaking(true);
        audio.onended = () => setSpeaking(false);
        await audio.play();
        return;
      }
      const u = new SpeechSynthesisUtterance(clean);
      u.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis?.speak(u);
    } catch {
      setSpeaking(false);
    }
  };

  const listen = () => {
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: "Voice input is not supported in this browser. Chrome works best." },
      ]);
      return;
    }
    try {
      const rec = new SR();
      rec.lang = "en-IN";
      rec.interimResults = false;
      setListening(true);
      rec.onresult = (e: any) => {
        const txt = e.results?.[0]?.[0]?.transcript || "";
        setListening(false);
        if (txt) send(txt);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const saveFact = async () => {
    const f = newFact.trim();
    if (!f) return;
    try {
      const r = await fetch("/api/ai/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fact: f }),
      }).then((x) => x.json());
      if (r?.memory) setMemory(r.memory);
      setNewFact("");
    } catch {
      /* ignore */
    }
  };

  const tripLine = [profile.destination || "Anywhere", profile.days ? `${profile.days} days` : "dates open", `${profile.travellers} travellers`, profile.budget ? inr(profile.budget) : "budget open"].join(" · ");

  return (
    <SiteChrome active="planner" hideFooter>
      <div className="min-h-dvh pb-16 md:pb-0 bg-[#efeeeb]">
        <div className="section-pad pt-20 md:pt-24 pb-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#003b53]">
              Tell me your vibe, I will plan the trip
            </h1>
            <p className="mt-2 text-base leading-relaxed text-gray-900">
              {phase === "interview"
                ? "Answer a few questions, get a written plan, then booking guidance in the same chat."
                : "Booking guidance is on. Reply and I will handle flights, stay and package in order."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(settings);
                  setSettingsOpen(true);
                }}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#023341] hover:text-white"
              >
                {settings &&
                (settings.apiKey ||
                  settings.preset === "Mauji AI (free)" ||
                  settings.baseUrl === "opencode-local")
                  ? `AI model: ${settings.model || "custom"}`
                  : "Configure AI key"}
              </button>
              <button
                type="button"
                onClick={() => setMemoryOpen(true)}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#023341] hover:text-white"
              >
                Memory
              </button>
              {phase === "interview" && (
                <button
                  type="button"
                  onClick={generateNow}
                  className="rounded-full bg-[#d63f00] px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#b53a00]"
                >
                  Generate trip plan
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#023341] hover:text-white"
              >
                Restart
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-700">
              {phase === "interview" ? "Planning your trip." : "Guiding your booking."} {tripLine}.
            </p>

            <div className="mt-4 space-y-4 pb-2">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[92%] ${m.role === "user" ? "" : "w-full"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-base leading-relaxed ${
                        m.role === "user"
                          ? "bg-[#023341] text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <ChatMessageContent
                        content={m.text}
                        isUser={m.role === "user"}
                        onChipClick={(choice) => send(choice)}
                      />
                    </div>
                    {m.role === "ai" && !m.plan && (
                      <div className="mt-1.5">
                        <button
                          type="button"
                          aria-label={speaking ? "Stop speaking" : "Listen to reply"}
                          onClick={() => speak(m.text)}
                          className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#023341] hover:text-white"
                        >
                          {speaking ? "Stop" : "Listen"}
                        </button>
                      </div>
                    )}
                    {m.chips && phase === "interview" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.chips.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => send(c)}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#023341] transition-colors hover:bg-[#023341] hover:text-white"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    {m.plan && (
                      <PlanCard
                        plan={m.plan}
                        profile={profile}
                        onGuide={phase === "interview" ? () => guideBooking(m.plan!, profile) : undefined}
                        guided={guided}
                      />
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start" aria-label="Mauji is typing">
                  <div className="flex gap-1.5 rounded-2xl bg-white px-4 py-3.5">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 rounded-full bg-[#023341] motion-safe:animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              {enriching && (
                <p className="text-sm text-gray-700">Writing your day details.</p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Bottom spacer so message history scrolls fully above the fixed input bar */}
            <div className="h-36 md:h-32" />
          </div>
        </div>

        {/* Fixed bottom input container */}
        <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 bg-[#efeeeb] py-3 px-4"> {/* taste-skill-ignore: fixed bottom bar floats above content */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-3 border-2 border-[#023341]"
            >
              <button
                type="button"
                aria-label={listening ? "Stop listening" : "Speak"}
                onClick={listen}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                  listening ? "bg-red-600 text-white" : "bg-[#efeeeb] text-gray-700 hover:bg-[#023341] hover:text-white"
                }`}
              >
                <Mic size={18} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={phase === "interview" ? "Type your answer, like Goa, 5 days, 30k" : "Reply to your booking agent, like 19 Dec"}
                className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500 min-w-0"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d63f00] text-white transition-colors hover:bg-[#b53a00]"
              >
                <ArrowUp size={18} />
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-600 text-center">
              One chat from first idea to booked trip. Built on MaujiTrip packages, stays and live fares.
            </p>
          </div>
        </div>
      </div>

      {memoryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMemoryOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Memory"> {/* taste-skill-ignore: dialog floats above the page */}
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#003b53]">What Mauji remembers</h3>
              <button type="button" aria-label="Close" onClick={() => setMemoryOpen(false)} className="rounded-full bg-[#efeeeb] p-1.5 text-gray-700 transition-colors hover:bg-[#023341] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <pre className="mt-3 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[#efeeeb] p-3 text-sm text-gray-900">
              {memory || "Nothing saved yet."}
            </pre>
            <div className="mt-3 flex gap-2">
              <input
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveFact()}
                placeholder="Home city is Pune"
                className="flex-1 rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500 min-w-0"
              />
              <button
                type="button"
                onClick={saveFact}
                className="shrink-0 rounded-full bg-[#023341] px-5 text-sm font-bold text-white transition-colors hover:bg-[#034a5c]"
              >
                Save
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">The AI can also save facts itself while chatting.</p>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSettingsOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label="AI settings"> {/* taste-skill-ignore: dialog floats above the page */}
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#003b53]">Connect your AI model</h3>
              <button type="button" aria-label="Close" onClick={() => setSettingsOpen(false)} className="rounded-full bg-[#efeeeb] p-1.5 text-gray-700 transition-colors hover:bg-[#023341] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Free built-in model, or any OpenAI style API. Keys stay in this browser only.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AI_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({
                      preset: p.label,
                      baseUrl: p.baseUrl || d?.baseUrl || "",
                      model: p.model || d?.model || "",
                      apiKey: d?.apiKey || "",
                      ttsBase: d?.ttsBase || "",
                      ttsKey: d?.ttsKey || "",
                      voiceId: d?.voiceId || "",
                    }))
                  }
                  className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                    draft?.preset === p.label ? "bg-[#023341] text-white" : "bg-[#efeeeb] text-gray-700 hover:bg-[#023341] hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-semibold text-gray-900">
              API base URL
              <input
                value={draft?.baseUrl || ""}
                onChange={(e) => setDraft((d) => ({ ...(d as AiSettings), preset: "Custom", baseUrl: e.target.value }))}
                placeholder="https://api.openai.com/v1"
                className="mt-1 w-full rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500"
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-gray-900">
              Model
              <input
                value={draft?.model || ""}
                onChange={(e) => setDraft((d) => ({ ...(d as AiSettings), preset: "Custom", model: e.target.value }))}
                placeholder="gpt-4o-mini"
                className="mt-1 w-full rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500"
              />
            </label>
            <label className="mt-3 block text-sm font-semibold text-gray-900">
              API key
              <input
                type="password"
                value={draft?.apiKey || ""}
                onChange={(e) => setDraft((d) => ({ ...(d as AiSettings), apiKey: e.target.value }))}
                placeholder="Not needed for the free model"
                className="mt-1 w-full rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500"
              />
            </label>
            <p className="mt-4 text-sm font-bold text-gray-900">Voice, optional</p>
            <label className="mt-2 block text-sm font-semibold text-gray-900">
              Voice base URL
              <input
                value={draft?.ttsBase || ""}
                onChange={(e) => setDraft((d) => ({ ...(d as AiSettings), ttsBase: e.target.value }))}
                placeholder="https://api.elevenlabs.io/v1"
                className="mt-1 w-full rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500"
              />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="block text-sm font-semibold text-gray-900">
                Voice ID
                <input
                  value={draft?.voiceId || ""}
                  onChange={(e) => setDraft((d) => ({ ...(d as AiSettings), voiceId: e.target.value }))}
                  placeholder="Voice id"
                  className="mt-1 w-full rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500"
                />
              </label>
              <label className="block text-sm font-semibold text-gray-900">
                Voice key
                <input
                  type="password"
                  value={draft?.ttsKey || ""}
                  onChange={(e) => setDraft((d) => ({ ...(d as AiSettings), ttsKey: e.target.value }))}
                  placeholder="Voice key"
                  className="mt-1 w-full rounded-xl bg-[#efeeeb] px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-500"
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-600">Without a voice key, replies play through the built-in device voice.</p>
            <button
              type="button"
              onClick={() => {
                if (draft) setSettings(draft);
                setSettingsOpen(false);
              }}
              className="mt-4 w-full rounded-full bg-[#023341] py-2.5 text-base font-bold text-white transition-colors hover:bg-[#034a5c]"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </SiteChrome>
  );
}
