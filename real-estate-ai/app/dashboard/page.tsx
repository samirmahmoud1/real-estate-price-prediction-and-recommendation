"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Building2,
  Flame,
  MapPinned,
  PieChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type DashboardData = {
  overview: {
    totalProperties: number;
    averagePrice: number;
    averageROI: number;
    averageGrowth: number;
  };
  propertyTypes: Record<string, number>;
  tenure: Record<string, number>;
  priceVsArea: {
    floorAreaSqM: number;
    saleEstimate_currentPrice: number;
  }[];
  mapPoints: {
    latitude: number;
    longitude: number;
    saleEstimate_currentPrice: number;
    ROI?: number;
    growth_rate?: number;
    floorAreaSqM?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    tenure?: string;
  }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeInsight, setActiveInsight] = useState(
    "Hover over any visualization to reveal real insights from your dataset."
  );

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const propertyTypes = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.propertyTypes).map(([label, value]) => ({
      label,
      value,
    }));
  }, [data]);

  const tenure = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.tenure).map(([label, value]) => ({
      label,
      value,
    }));
  }, [data]);

  const priceSample = useMemo(() => {
    if (!data) return [];
    return data.priceVsArea.slice(0, 80);
  }, [data]);

  const scatterSample = useMemo(() => {
    if (!data) return [];
    return data.priceVsArea
      .filter((x) => x.floorAreaSqM && x.saleEstimate_currentPrice)
      .slice(0, 140);
  }, [data]);

  if (!data) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_30%)]" />

        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="relative rounded-[2rem] border border-cyan-300/20 bg-white/[0.06] px-10 py-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <BrainCircuit className="mx-auto mb-4 text-cyan-300" size={46} />
          <h1 className="text-2xl font-black">
            Loading Real Estate Intelligence...
          </h1>
          <p className="mt-2 text-slate-400">
            Connecting to your Google Drive dataset
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-6 pb-24 pt-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_50%_88%,rgba(16,185,129,0.14),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:75px_75px]" />

      <section className="relative z-10 mx-auto max-w-7xl">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
            <BrainCircuit size={16} />
            Real Dataset Connected
          </div>

          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
            Market Intelligence
            <span className="block bg-gradient-to-r from-cyan-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
              Command Center.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Live analytics powered by your Google Drive dataset:{" "}
            <span className="font-black text-cyan-300">
              {data.overview.totalProperties.toLocaleString()}
            </span>{" "}
            real estate records.
          </p>
        </motion.div>

        {/* KPIS */}
        <div className="grid gap-5 md:grid-cols-4">
          <KpiCard
            label="Total Properties"
            value={data.overview.totalProperties.toLocaleString()}
            icon={<Building2 />}
            insight={`Your dataset contains ${data.overview.totalProperties.toLocaleString()} property records.`}
            setActiveInsight={setActiveInsight}
          />

          <KpiCard
            label="Average Price"
            value={`£${Math.round(data.overview.averagePrice).toLocaleString()}`}
            icon={<BarChart3 />}
            insight={`Average estimated property price is £${Math.round(
              data.overview.averagePrice
            ).toLocaleString()}.`}
            setActiveInsight={setActiveInsight}
          />

          <KpiCard
            label="Average ROI"
            value={`${data.overview.averageROI}`}
            icon={<TrendingUp />}
            insight={`Average ROI signal is ${data.overview.averageROI}.`}
            setActiveInsight={setActiveInsight}
          />

          <KpiCard
            label="Average Growth"
            value={`+${data.overview.averageGrowth}%`}
            icon={<Activity />}
            insight={`Average growth signal is +${data.overview.averageGrowth}%.`}
            setActiveInsight={setActiveInsight}
          />
        </div>

        {/* TOP ANALYTICS LAYOUT */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel
            title="Top Property Types"
            subtitle="Distribution from your real dataset"
            icon={<PieChart />}
          >
            <div className="space-y-5">
              {propertyTypes.slice(0, 10).map((item, index) => (
                <BarRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={Math.max(...propertyTypes.map((x) => x.value), 1)}
                  delay={index * 0.04}
                  onHover={() =>
                    setActiveInsight(
                      `${item.label} appears ${item.value.toLocaleString()} times in your dataset.`
                    )
                  }
                />
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.05] to-purple-500/10 p-7 shadow-2xl backdrop-blur-2xl"
            >
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="text-cyan-300" />
                <h2 className="text-3xl font-black">Live AI Insight</h2>
              </div>

              <p className="min-h-24 text-lg leading-8 text-slate-200">
                {activeInsight}
              </p>
            </motion.div>

            <div className="relative h-[405px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-6 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.20),transparent_48%)]" />
              <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:42px_42px]" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/40"
              />

              <div className="relative z-10">
                <MapPinned className="text-cyan-300" />
                <h3 className="mt-4 text-3xl font-black">Market Heat Radar</h3>
                <p className="mt-3 text-slate-300">
                  Hover floating price points to inspect real samples.
                </p>
              </div>

              {data.mapPoints.slice(0, 9).map((point, index) => (
                <motion.div
                  key={index}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onMouseEnter={() =>
                    setActiveInsight(
                      `Sample: £${Math.round(
                        point.saleEstimate_currentPrice
                      ).toLocaleString()} • ${point.floorAreaSqM ?? "N/A"} sqm • ${
                        point.bedrooms ?? "N/A"
                      } beds • ${point.bathrooms ?? "N/A"} baths.`
                    )
                  }
                  className="absolute rounded-full border border-white/10 bg-cyan-300/20 px-3 py-2 text-xs font-bold backdrop-blur-xl hover:bg-cyan-300/35"
                  style={{
                    left: `${14 + (index % 5) * 17}%`,
                    top: `${52 + (index % 3) * 12}%`,
                  }}
                >
                  £{Math.round(point.saleEstimate_currentPrice / 1000)}k
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* VISUALIZATION CENTER */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <Panel
            title="Animated Price Distribution"
            subtitle="Real prices sampled from your dataset"
            icon={<BarChart3 />}
          >
            <AnimatedPriceBars
              items={priceSample}
              setActiveInsight={setActiveInsight}
            />
          </Panel>

          <Panel
            title="Price vs Floor Area"
            subtitle="Visible animated scatter plot"
            icon={<Activity />}
          >
            <ScatterPlot
              items={scatterSample}
              setActiveInsight={setActiveInsight}
            />
          </Panel>
        </div>

        {/* SECOND ANALYTICS */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel
            title="Tenure Distribution"
            subtitle="Ownership patterns from the dataset"
            icon={<Building2 />}
          >
            <div className="space-y-5">
              {tenure.slice(0, 8).map((item, index) => (
                <BarRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={Math.max(...tenure.map((x) => x.value), 1)}
                  delay={index * 0.05}
                  onHover={() =>
                    setActiveInsight(
                      `${item.label} tenure count is ${item.value.toLocaleString()}.`
                    )
                  }
                />
              ))}
            </div>
          </Panel>

          <Panel
            title="Premium Market Samples"
            subtitle="High-value property points from map data"
            icon={<Flame />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {data.mapPoints.slice(0, 6).map((point, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onMouseEnter={() =>
                    setActiveInsight(
                      `Property: £${Math.round(
                        point.saleEstimate_currentPrice
                      ).toLocaleString()} • ${point.propertyType ?? "Unknown"} • ${
                        point.tenure ?? "Unknown tenure"
                      }`
                    )
                  }
                  className="rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:bg-white/[0.08]"
                >
                  <p className="text-sm text-slate-400">
                    {point.propertyType ?? "Property"}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-cyan-300">
                    £{Math.round(point.saleEstimate_currentPrice).toLocaleString()}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">
                    {point.floorAreaSqM ?? "N/A"} sqm • {point.bedrooms ?? "N/A"} beds •{" "}
                    {point.bathrooms ?? "N/A"} baths
                  </p>
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>

        {/* INSIGHTS */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <InsightCard
            icon={<Flame />}
            title="Dominant Type"
            value={propertyTypes[0]?.label ?? "N/A"}
            text={`Most frequent property type: ${
              propertyTypes[0]?.label ?? "N/A"
            } with ${propertyTypes[0]?.value?.toLocaleString() ?? 0} records.`}
            setActiveInsight={setActiveInsight}
          />

          <InsightCard
            icon={<TrendingUp />}
            title="Market Scale"
            value={`${Math.round(data.overview.totalProperties / 1000)}K+`}
            text="The dataset is large enough to support market-level analysis and recommendation logic."
            setActiveInsight={setActiveInsight}
          />

          <InsightCard
            icon={<Sparkles />}
            title="AI Readiness"
            value="Ready"
            text="The API is connected and ready for prediction, investment recommendation, and map-based analysis."
            setActiveInsight={setActiveInsight}
          />
        </div>
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  icon,
  insight,
  setActiveInsight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  insight: string;
  setActiveInsight: (text: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={() => setActiveInsight(insight)}
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-2 text-3xl font-black">{value}</h3>
    </motion.div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl"
    >
      <div className="mb-8 flex items-center justify-between gap-5">
        <div>
          <p className="text-sm text-slate-400">{subtitle}</p>
          <h2 className="text-3xl font-black">{title}</h2>
        </div>

        <div className="text-cyan-300">{icon}</div>
      </div>

      {children}
    </motion.div>
  );
}

function BarRow({
  label,
  value,
  max,
  delay,
  onHover,
}: {
  label: string;
  value: number;
  max: number;
  delay: number;
  onHover: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      className="rounded-3xl border border-white/10 bg-black/30 p-4 transition hover:bg-white/[0.08]"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="truncate font-bold">{label}</p>
        <p className="font-black text-cyan-300">{value.toLocaleString()}</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ delay }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
        />
      </div>
    </div>
  );
}

function AnimatedPriceBars({
  items,
  setActiveInsight,
}: {
  items: { floorAreaSqM: number; saleEstimate_currentPrice: number }[];
  setActiveInsight: (text: string) => void;
}) {
  const maxPrice = Math.max(...items.map((x) => x.saleEstimate_currentPrice), 1);

  return (
    <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 flex h-full items-end gap-1.5">
        {items.slice(0, 55).map((item, index) => {
          const height = Math.max(
            7,
            (item.saleEstimate_currentPrice / maxPrice) * 100
          );

          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.01, duration: 0.45 }}
              onMouseEnter={() =>
                setActiveInsight(
                  `Price sample: £${Math.round(
                    item.saleEstimate_currentPrice
                  ).toLocaleString()} • ${item.floorAreaSqM} sqm.`
                )
              }
              className="flex-1 cursor-pointer rounded-t-xl bg-gradient-to-t from-cyan-500 via-cyan-300 to-emerald-300 shadow-lg shadow-cyan-500/20 transition hover:scale-y-110"
            />
          );
        })}
      </div>

      <div className="absolute bottom-4 left-5 text-xs text-slate-400">
        Property samples →
      </div>

      <div className="absolute left-5 top-4 text-xs text-slate-400">
        Price height ↑
      </div>
    </div>
  );
}

function ScatterPlot({
  items,
  setActiveInsight,
}: {
  items: { floorAreaSqM: number; saleEstimate_currentPrice: number }[];
  setActiveInsight: (text: string) => void;
}) {
  const maxArea = Math.max(...items.map((x) => x.floorAreaSqM), 1);
  const maxPrice = Math.max(...items.map((x) => x.saleEstimate_currentPrice), 1);

  return (
    <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:45px_45px]" />

      <div className="absolute bottom-5 left-8 right-6 h-[1px] bg-white/20" />
      <div className="absolute bottom-5 left-8 top-6 w-[1px] bg-white/20" />

      {items.map((item, index) => {
        const x = 8 + (item.floorAreaSqM / maxArea) * 86;
        const y = 88 - (item.saleEstimate_currentPrice / maxPrice) * 78;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.9, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.004, duration: 0.25 }}
            onMouseEnter={() =>
              setActiveInsight(
                `${item.floorAreaSqM} sqm property estimated at £${Math.round(
                  item.saleEstimate_currentPrice
                ).toLocaleString()}.`
              )
            }
            className="absolute h-3 w-3 cursor-pointer rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.75)] transition hover:h-5 hover:w-5 hover:bg-emerald-300"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          />
        );
      })}

      <div className="absolute bottom-2 left-10 text-xs text-slate-400">
        Floor Area →
      </div>

      <div className="absolute left-4 top-4 text-xs text-slate-400">
        Price ↑
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
  text,
  setActiveInsight,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
  setActiveInsight: (text: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onMouseEnter={() => setActiveInsight(text)}
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-black">{value}</h3>
      <p className="mt-4 leading-7 text-slate-300">{text}</p>
    </motion.div>
  );
}