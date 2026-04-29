"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Crown,
  Gem,
  MapPinned,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <BrainCircuit />,
    title: "AI Price Prediction",
    text: "Predict property prices using real comparable properties from your dataset.",
  },
  {
    icon: <TrendingUp />,
    title: "Investment Advisor",
    text: "Rank real opportunities by ROI, growth, budget fit, and risk.",
  },
  {
    icon: <BarChart3 />,
    title: "Live Dashboard",
    text: "Explore real analytics, distributions, scatter plots, and insights.",
  },
];

const stats = [
  { label: "Real Properties", value: "282K+" },
  { label: "AI Modules", value: "3" },
  { label: "Data Source", value: "Drive" },
  { label: "Experience", value: "Live" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url('/city.jpg')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-[#020617]/85 to-[#020617]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_50%_88%,rgba(16,185,129,0.16),transparent_32%)]" />
      <div className="fixed inset-0 opacity-[0.10] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:75px_75px]" />

      <motion.div
        animate={{ y: [0, -35, 0], x: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed left-10 top-32 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed right-10 top-48 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
      />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-24">
        <div className="grid w-full items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200 backdrop-blur-xl"
            >
              <Sparkles size={16} />
              Real Estate AI Platform Connected To Real Data
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black leading-[1.03] md:text-7xl"
            >
              Predict.
              <br />
              Analyze.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
                Invest Smarter.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              A premium AI-powered real estate platform for price prediction,
              investment recommendations, live dashboards, Google Maps insights,
              and real comparable property analysis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/predict"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-8 py-4 font-black text-black shadow-2xl shadow-cyan-500/25 transition hover:scale-105"
              >
                Start Prediction
                <ArrowRight className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/invest"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl transition hover:bg-white/20 hover:scale-105"
              >
                Explore Investment
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-10 grid gap-4 sm:grid-cols-4"
            >
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.1]"
                >
                  <div className="text-2xl font-black text-white">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-emerald-400/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Platform Status</p>
                  <h3 className="text-2xl font-black">AI Command Center</h3>
                </div>

                <div className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                  LIVE
                </div>
              </div>

              <div className="grid gap-4">
                <Metric
                  icon={<Building2 />}
                  label="Dataset Connected"
                  value="282,792"
                  accent="text-cyan-300"
                />
                <Metric
                  icon={<Gem />}
                  label="Prediction Engine"
                  value="Ready"
                  accent="text-emerald-300"
                />
                <Metric
                  icon={<ShieldCheck />}
                  label="Investment Ranking"
                  value="Active"
                  accent="text-purple-300"
                />
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="font-bold text-slate-200">Market Intelligence</p>
                  <BarChart3 className="text-cyan-300" />
                </div>

                <div className="flex h-44 items-end gap-3">
                  {[35, 48, 42, 65, 58, 78, 70, 88, 82, 96].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                      className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-500 to-emerald-300 shadow-lg shadow-cyan-500/20"
                    />
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-8 top-20 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
              >
                <p className="text-xs text-slate-300">AI Score</p>
                <p className="text-2xl font-black text-emerald-300">98%</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -right-8 bottom-24 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
              >
                <p className="text-xs text-slate-300">Map Signal</p>
                <p className="text-2xl font-black text-cyan-300">LIVE</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Core Modules
          </p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Built like a real product, not just a project.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300 transition group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black">{feature.title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6 flex items-center gap-3">
              <Radar className="text-cyan-300" />
              <h2 className="text-3xl font-black">Live Workflow</h2>
            </div>

            <div className="space-y-4">
              <Step
                number="01"
                title="Choose property profile"
                text="Select location, rooms, area, property type, and tenure."
              />
              <Step
                number="02"
                title="Run AI prediction"
                text="Compare against nearest real comparable properties."
              />
              <Step
                number="03"
                title="Analyze investment potential"
                text="Score opportunities by strategy, ROI, growth, and risk."
              />
              <Step
                number="04"
                title="Explore dashboard insights"
                text="Visualize market structure, prices, and distributions."
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-8 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.20),transparent_48%)]" />
            <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:44px_44px]" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/35"
            />

            <div className="relative z-10">
              <MapPinned className="text-cyan-300" size={34} />
              <h2 className="mt-4 text-4xl font-black">Interactive Market Radar</h2>
              <p className="mt-4 max-w-xl leading-8 text-slate-300">
                Animated market layer showing how prediction, investment, and
                dashboard modules work together as one AI real estate platform.
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <FloatingBadge icon={<Zap />} title="Prediction" value="Comparable AI" />
                <FloatingBadge icon={<Crown />} title="Investment" value="Deal Ranking" />
                <FloatingBadge icon={<BarChart3 />} title="Dashboard" value="Live Analytics" />
                <FloatingBadge icon={<CheckCircle2 />} title="Backend" value="FastAPI Ready" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28 text-center">
        <div className="rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-r from-cyan-300/10 via-purple-500/10 to-emerald-300/10 p-10 shadow-2xl backdrop-blur-2xl">
          <h2 className="text-4xl font-black md:text-5xl">
            Ready to explore the platform?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
            Start with prediction, move to investment opportunities, then inspect
            full market intelligence from the dashboard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/predict"
              className="rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-8 py-4 font-black text-black shadow-xl shadow-cyan-500/20 transition hover:scale-105"
            >
              Launch Prediction
            </Link>

            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 bg-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/20 hover:scale-105"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.06] p-5">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-white/10 p-3 text-cyan-300">{icon}</div>
        <p className="text-sm text-slate-300">{label}</p>
      </div>
      <p className={`text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      className="rounded-3xl border border-white/10 bg-black/30 p-5"
    >
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 font-black text-cyan-300">
          {number}
        </div>

        <div>
          <h3 className="text-xl font-black">{title}</h3>
          <p className="mt-2 leading-7 text-slate-300">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingBadge({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      className="rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl"
    >
      <div className="mb-3 text-cyan-300">{icon}</div>
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="text-xl font-black">{value}</h3>
    </motion.div>
  );
}