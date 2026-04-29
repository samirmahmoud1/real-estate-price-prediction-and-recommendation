"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  BrainCircuit,
  Building2,
  Flame,
  Gem,
  Loader2,
  MapPin,
  Maximize2,
  Radar,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

const API_BASE =
  "https://real-estate-price-prediction-and-recommendation-production.up.railway.app";

type Strategy = "Safe" | "Balanced" | "Aggressive";

type Property = {
  saleEstimate_currentPrice: number;
  ROI?: number | string;
  growth_rate?: number | string;
  floorAreaSqM?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  propertyType?: string;
  tenure?: string;
};

type Deal = Property & {
  id: string;
  score: number;
  roiPercent: number;
  growthPercent: number;
  price: number;
  size: number;
  beds: number;
  baths: number;
  risk: "Low" | "Medium" | "High";
  demand: "Emerging" | "Stable" | "High" | "Explosive";
  label: "Elite Deal" | "Strong Deal" | "Good Deal" | "Watchlist";
};

export default function InvestmentPage() {
  const [budget, setBudget] = useState(700000);
  const [minBedrooms, setMinBedrooms] = useState(2);
  const [minBathrooms, setMinBathrooms] = useState(1);
  const [minArea, setMinArea] = useState(60);
  const [strategy, setStrategy] = useState<Strategy>("Balanced");

  const [rawResults, setRawResults] = useState<Property[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState(
    "Choose your filters, run the investment engine, then compare real opportunities from your live API."
  );

  const deals = useMemo(() => {
    return rawResults
      .map((item, index) => scoreDeal(item, index, strategy, budget))
      .sort((a, b) => b.score - a.score);
  }, [rawResults, strategy, budget]);

  const selectedDeal = useMemo(() => {
    return deals.find((deal) => deal.id === selectedId) || deals[0] || null;
  }, [deals, selectedId]);

  async function runInvestmentSearch() {
    setLoading(true);
    setActiveInsight("Analyzing real properties from the live API...");

    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          budget,
          minBedrooms,
          minBathrooms,
          minArea,
        }),
      });

      const data = await res.json();
      const properties: Property[] = Array.isArray(data.properties)
        ? data.properties
        : [];

      if (!res.ok || data.error) {
        setRawResults([]);
        setSelectedId("");
        setActiveInsight(data.error || "Investment search failed.");
        return;
      }

      setRawResults(properties);

      if (properties.length === 0) {
        setSelectedId("");
        setActiveInsight(
          "No deals matched your filters. Try increasing budget or lowering bedrooms, bathrooms, or area."
        );
        return;
      }

      const firstDeal = scoreDeal(properties[0], 0, strategy, budget);
      setSelectedId(firstDeal.id);
      setActiveInsight(
        `Found ${properties.length} matching properties from the live API. Top opportunities are ranked using ${strategy} strategy.`
      );
    } catch (error) {
      console.error(error);
      setActiveInsight(
        "Backend connection failed. Make sure the Railway API is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-6 pb-24 pt-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(168,85,247,0.20),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(16,185,129,0.14),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:75px_75px]" />

      <section className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-200">
            <Sparkles size={16} />
            Live Real Dataset Investment Engine
          </div>

          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
            Investment
            <span className="block bg-gradient-to-r from-cyan-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
              Deal Finder.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            A clean, technical, real-data investment screen. Every result comes
            from your live Railway API, then gets ranked by strategy, ROI,
            growth, budget fit, risk, and area quality.
          </p>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <ControlPanel
              budget={budget}
              setBudget={setBudget}
              minBedrooms={minBedrooms}
              setMinBedrooms={setMinBedrooms}
              minBathrooms={minBathrooms}
              setMinBathrooms={setMinBathrooms}
              minArea={minArea}
              setMinArea={setMinArea}
              strategy={strategy}
              setStrategy={setStrategy}
              loading={loading}
              onRun={runInvestmentSearch}
            />

            <InsightPanel text={activeInsight} />

            <div className="space-y-4">
              {deals.length === 0 ? (
                <EmptyState />
              ) : (
                deals.slice(0, 12).map((deal, index) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    index={index}
                    active={selectedDeal?.id === deal.id}
                    onSelect={() => {
                      setSelectedId(deal.id);
                      setActiveInsight(
                        `${deal.label}: ${formatCurrency(
                          deal.price
                        )}, ${deal.size} sqm, ${deal.beds} beds, ${formatPercent(
                          deal.roiPercent
                        )} ROI, score ${deal.score}.`
                      );
                    }}
                    onHover={() =>
                      setActiveInsight(
                        `${deal.propertyType || "Property"} | ${
                          deal.tenure || "Unknown tenure"
                        } | Risk ${deal.risk} | Demand ${deal.demand}.`
                      )
                    }
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <SelectedDeal deal={selectedDeal} strategy={strategy} />

            <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
              <GoogleMapCard deal={selectedDeal} />
              <RadarAndVerdict deal={selectedDeal} strategy={strategy} />
            </div>

            <RankingBoard deals={deals} setActiveInsight={setActiveInsight} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ControlPanel({
  budget,
  setBudget,
  minBedrooms,
  setMinBedrooms,
  minBathrooms,
  setMinBathrooms,
  minArea,
  setMinArea,
  strategy,
  setStrategy,
  loading,
  onRun,
}: {
  budget: number;
  setBudget: (value: number) => void;
  minBedrooms: number;
  setMinBedrooms: (value: number) => void;
  minBathrooms: number;
  setMinBathrooms: (value: number) => void;
  minArea: number;
  setMinArea: (value: number) => void;
  strategy: Strategy;
  setStrategy: (value: Strategy) => void;
  loading: boolean;
  onRun: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -35 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Investor Control Panel</p>
          <h2 className="text-3xl font-black">Smart Filters</h2>
        </div>
        <SlidersHorizontal className="text-cyan-300" />
      </div>

      <div className="space-y-5">
        <RangeControl
          label="Maximum Budget"
          value={budget}
          min={200000}
          max={1500000}
          step={10000}
          prefix="£"
          onChange={setBudget}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <SmallNumber
            label="Bedrooms"
            value={minBedrooms}
            min={0}
            max={8}
            onChange={setMinBedrooms}
          />
          <SmallNumber
            label="Bathrooms"
            value={minBathrooms}
            min={0}
            max={8}
            onChange={setMinBathrooms}
          />
          <SmallNumber
            label="Min Area"
            value={minArea}
            min={20}
            max={300}
            step={5}
            suffix="sqm"
            onChange={setMinArea}
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-slate-300">
            Investment Strategy
          </p>

          <div className="grid grid-cols-3 gap-3">
            {(["Safe", "Balanced", "Aggressive"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setStrategy(item)}
                className={`rounded-2xl border px-4 py-3 font-bold transition hover:-translate-y-1 ${
                  strategy === item
                    ? "border-cyan-300 bg-cyan-300/15 text-cyan-200 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-black/30 text-slate-300 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-300">
            {strategy === "Safe" &&
              "Safe mode prioritizes budget comfort, lower risk, and stable property signals."}
            {strategy === "Balanced" &&
              "Balanced mode combines ROI, growth, price fit, and size into one practical ranking."}
            {strategy === "Aggressive" &&
              "Aggressive mode prioritizes high ROI and growth momentum, even with higher risk."}
          </p>
        </div>

        <button
          onClick={onRun}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-8 py-4 font-black text-black shadow-xl shadow-cyan-500/20 transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Analyzing Live Data...
            </>
          ) : (
            <>
              <Search />
              Run Investment Engine
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function InsightPanel({ text }: { text: string }) {
  return (
    <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.05] to-purple-500/10 p-7 shadow-2xl backdrop-blur-2xl">
      <div className="mb-5 flex items-center gap-3">
        <Sparkles className="text-cyan-300" />
        <h2 className="text-3xl font-black">Live AI Insight</h2>
      </div>
      <p className="min-h-20 text-lg leading-8 text-slate-200">{text}</p>
    </div>
  );
}

function DealCard({
  deal,
  index,
  active,
  onSelect,
  onHover,
}: {
  deal: Deal;
  index: number;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045 }}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`group relative w-full overflow-hidden rounded-[1.8rem] border p-5 text-left transition hover:-translate-y-1 ${
        active
          ? "border-cyan-300 bg-cyan-300/15 shadow-xl shadow-cyan-500/10"
          : "border-white/10 bg-white/[0.05] hover:bg-white/[0.09]"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-purple-400 to-emerald-300" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Building2 className="text-cyan-300" size={20} />
            <h3 className="text-xl font-black">
              {deal.propertyType || "Investment Property"}
            </h3>
          </div>

          <p className="text-sm text-slate-400">
            {deal.tenure || "Unknown tenure"}
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <MapPin size={16} />
            {hasCoords(deal) ? (
              <>
                {Number(deal.latitude).toFixed(4)},{" "}
                {Number(deal.longitude).toFixed(4)}
              </>
            ) : (
              "Location unavailable"
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black">{formatCurrency(deal.price)}</p>
          <p className="text-xs text-slate-400">Market Price</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        <MiniMetric label="Score" value={`${deal.score}`} />
        <MiniMetric label="ROI" value={formatPercent(deal.roiPercent)} />
        <MiniMetric label="Growth" value={formatPercent(deal.growthPercent)} />
        <MiniMetric label="Risk" value={deal.risk} />
      </div>

      <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-44 group-hover:opacity-100">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl md:grid-cols-4">
          <Detail icon={<BedDouble size={17} />} label="Beds" value={deal.beds} />
          <Detail icon={<Bath size={17} />} label="Baths" value={deal.baths} />
          <Detail
            icon={<Maximize2 size={17} />}
            label="Size"
            value={`${deal.size} sqm`}
          />
          <Detail icon={<Gem size={17} />} label="Deal" value={deal.label} />
        </div>
      </div>
    </motion.button>
  );
}

function SelectedDeal({
  deal,
  strategy,
}: {
  deal: Deal | null;
  strategy: Strategy;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.05] to-purple-500/10 p-7 shadow-2xl backdrop-blur-2xl">
      <div className="absolute right-6 top-6 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-300">
        {deal ? deal.label : "NO DEAL"}
      </div>

      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
        Selected Opportunity
      </p>

      <h2 className="mt-4 max-w-2xl text-4xl font-black">
        {deal?.propertyType || "Run Analysis First"}
      </h2>

      <p className="mt-2 text-slate-300">
        {deal
          ? `${deal.tenure || "Unknown tenure"} • ${deal.size} sqm • ${strategy} strategy`
          : "Choose filters and run the investment engine."}
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        <Insight icon={<Gem />} title="AI Score" value={deal ? `${deal.score}` : "--"} />
        <Insight
          icon={<TrendingUp />}
          title="ROI"
          value={deal ? formatPercent(deal.roiPercent) : "--"}
        />
        <Insight
          icon={<Zap />}
          title="Growth"
          value={deal ? formatPercent(deal.growthPercent) : "--"}
        />
        <Insight icon={<ShieldCheck />} title="Risk" value={deal?.risk ?? "--"} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <DetailCard title="Bedrooms" value={deal?.beds ?? "--"} />
        <DetailCard title="Bathrooms" value={deal?.baths ?? "--"} />
        <DetailCard title="Size" value={deal ? `${deal.size} sqm` : "--"} />
        <DetailCard title="Demand" value={deal?.demand ?? "--"} />
      </div>
    </div>
  );
}

function GoogleMapCard({ deal }: { deal: Deal | null }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-sm text-slate-400">Google Maps Intelligence</p>
          <h3 className="text-xl font-black">
            {deal && hasCoords(deal)
              ? `${Number(deal.latitude).toFixed(4)}, ${Number(
                  deal.longitude
                ).toFixed(4)}`
              : "Waiting for property"}
          </h3>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-orange-400/10 px-4 py-2 text-sm font-bold text-orange-300">
          <Flame size={16} />
          Hot Zone
        </div>
      </div>

      {deal && hasCoords(deal) ? (
        <iframe
          key={`${deal.latitude}-${deal.longitude}`}
          title="Google Map"
          className="h-[560px] w-full grayscale-[10%] invert-[88%] hue-rotate-180"
          loading="lazy"
          src={`https://www.google.com/maps?q=${deal.latitude},${deal.longitude}&z=14&output=embed`}
        />
      ) : (
        <div className="flex h-[560px] items-center justify-center bg-[#07111f] text-slate-400">
          Run analysis to preview property location.
        </div>
      )}
    </div>
  );
}

function RadarAndVerdict({
  deal,
  strategy,
}: {
  deal: Deal | null;
  strategy: Strategy;
}) {
  return (
    <div className="space-y-6">
      <div className="relative h-[270px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_48%)]" />

        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.05, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-300/40"
        />

        <div className="relative z-10">
          <Radar className="text-cyan-300" />
          <h3 className="mt-4 text-2xl font-black">Deal Radar</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Ranking signal based on budget fit, ROI, growth, size, and strategy.
          </p>
        </div>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-black/40 p-4 backdrop-blur-xl">
          <p className="text-xs text-slate-400">Demand Level</p>
          <p className="text-2xl font-black text-emerald-300">
            {deal?.demand ?? "Waiting"}
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex items-center gap-3">
          <Target className="text-purple-300" />
          <h3 className="text-2xl font-black">Deal Verdict</h3>
        </div>

        <p className="leading-7 text-slate-300">
          {deal ? (
            <>
              Under the{" "}
              <span className="font-bold text-cyan-300">{strategy}</span>{" "}
              strategy, this deal scores{" "}
              <span className="font-bold text-emerald-300">{deal.score}</span>.
              It has {formatPercent(deal.roiPercent)} ROI,{" "}
              {formatPercent(deal.growthPercent)} growth, and{" "}
              {deal.risk.toLowerCase()} risk.
            </>
          ) : (
            "Run the engine to generate a clean investment verdict."
          )}
        </p>

        {deal && hasCoords(deal) && (
          <a
            href={`https://www.google.com/maps?q=${deal.latitude},${deal.longitude}`}
            target="_blank"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-6 py-4 font-black text-black shadow-xl shadow-cyan-500/20 transition hover:scale-[1.02]"
          >
            Open in Google Maps
            <ArrowUpRight size={20} />
          </a>
        )}
      </div>
    </div>
  );
}

function RankingBoard({
  deals,
  setActiveInsight,
}: {
  deals: Deal[];
  setActiveInsight: (text: string) => void;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Technical Ranking</p>
          <h2 className="text-3xl font-black">Top Deal Scores</h2>
        </div>
        <BrainCircuit className="text-cyan-300" />
      </div>

      {deals.length === 0 ? (
        <p className="text-slate-400">Run analysis to generate rankings.</p>
      ) : (
        <div className="space-y-4">
          {deals.slice(0, 7).map((deal, index) => (
            <div
              key={deal.id}
              onMouseEnter={() =>
                setActiveInsight(
                  `${deal.propertyType || "Property"} is ranked #${
                    index + 1
                  } with score ${deal.score}.`
                )
              }
              className="rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="truncate font-bold">
                  {index + 1}. {deal.propertyType || "Property"}
                </p>
                <p className="font-black text-cyan-300">{deal.score}</p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${deal.score}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
      <Building2 className="mx-auto mb-4 text-cyan-300" size={42} />
      <h3 className="text-2xl font-black text-white">No analysis yet</h3>
      <p className="mt-2">
        Set your filters and run the engine to load real investment properties.
      </p>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  prefix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-bold text-slate-200">{label}</span>
        <span className="rounded-full bg-emerald-300/10 px-4 py-1 font-black text-emerald-300">
          {prefix}
          {value.toLocaleString()}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-300"
      />
    </div>
  );
}

function SmallNumber({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <p className="mb-3 text-sm font-bold text-slate-300">{label}</p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="h-10 w-10 rounded-xl bg-white/10 font-black hover:bg-white/20"
        >
          -
        </button>

        <div className="flex-1 text-center">
          <p className="text-2xl font-black text-cyan-300">{value}</p>
          {suffix && <p className="text-xs text-slate-500">{suffix}</p>}
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="h-10 w-10 rounded-xl bg-white/10 font-black hover:bg-white/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 truncate font-black text-white">{value}</p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.06] p-3">
      <div className="mb-2 text-cyan-300">{icon}</div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-black text-white">{value}</p>
    </div>
  );
}

function DetailCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function Insight({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
      <div className="mb-3 text-cyan-300">{icon}</div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-1 truncate text-2xl font-black">{value}</p>
    </div>
  );
}

function scoreDeal(
  item: Property,
  index: number,
  strategy: Strategy,
  budget: number
): Deal {
  const price = safeNumber(item.saleEstimate_currentPrice);
  const roiPercent = normalizePercent(item.ROI);
  const growthPercent = normalizePercent(item.growth_rate);
  const size = safeNumber(item.floorAreaSqM);
  const beds = safeNumber(item.bedrooms);
  const baths = safeNumber(item.bathrooms);

  const budgetFit = price > 0 ? Math.max(0, 1 - price / budget) * 100 : 0;
  const sizeScore = Math.min(size / 2, 60);

  let rawScore =
    roiPercent * 5 + growthPercent * 2 + budgetFit * 0.35 + sizeScore * 0.25;

  if (strategy === "Safe") {
    rawScore =
      roiPercent * 3 +
      growthPercent * 1.2 +
      budgetFit * 0.65 +
      sizeScore * 0.35;
  }

  if (strategy === "Aggressive") {
    rawScore =
      roiPercent * 7 +
      growthPercent * 3.4 +
      budgetFit * 0.18 +
      sizeScore * 0.12;
  }

  const score = Math.max(45, Math.min(98, Math.round(rawScore)));

  const risk: Deal["risk"] =
    price > budget * 0.92 ? "High" : price > budget * 0.78 ? "Medium" : "Low";

  const demand: Deal["demand"] =
    growthPercent >= 17
      ? "Explosive"
      : growthPercent >= 12
      ? "High"
      : growthPercent >= 7
      ? "Stable"
      : "Emerging";

  const label: Deal["label"] =
    score >= 90
      ? "Elite Deal"
      : score >= 80
      ? "Strong Deal"
      : score >= 70
      ? "Good Deal"
      : "Watchlist";

  return {
    ...item,
    id: `${index}-${price}-${size}-${item.latitude}-${item.longitude}`,
    score,
    roiPercent,
    growthPercent,
    price,
    size,
    beds,
    baths,
    risk,
    demand,
    label,
  };
}

function normalizePercent(value: unknown) {
  const num = safeNumber(value);
  if (!Number.isFinite(num)) return 0;
  if (Math.abs(num) <= 1) return num * 100;
  return num;
}

function safeNumber(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "N/A";
  return `£${Math.round(value).toLocaleString()}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "N/A";
  return `${value.toFixed(2)}%`;
}

function hasCoords(deal: Deal) {
  return (
    Number.isFinite(Number(deal.latitude)) &&
    Number.isFinite(Number(deal.longitude))
  );
}
