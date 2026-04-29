"use client";

import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Gem,
  Home,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_BASE =
  "https://real-estate-price-prediction-and-recommendation-production.up.railway.app";

type Options = {
  propertyTypes: string[];
  tenures: string[];
};

type Comparable = {
  saleEstimate_currentPrice: number;
  floorAreaSqM: number;
  bedrooms: number;
  bathrooms: number;
  latitude: number;
  longitude: number;
  propertyType?: string;
  tenure?: string;
};

type PredictionResult = {
  predictedPrice: number;
  medianComparablePrice: number;
  comparablesUsed: number;
  marketStatus: string;
  comparables: Comparable[];
};

const locations = [
  { name: "Central London", lat: 51.5074, lng: -0.1278 },
  { name: "Canary Wharf", lat: 51.5054, lng: -0.0235 },
  { name: "King's Cross", lat: 51.5308, lng: -0.1238 },
  { name: "Shoreditch", lat: 51.5255, lng: -0.0785 },
  { name: "Richmond", lat: 51.4613, lng: -0.3037 },
];

export default function PredictPage() {
  const [options, setOptions] = useState<Options>({
    propertyTypes: [],
    tenures: [],
  });

  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [livingRooms, setLivingRooms] = useState(1);
  const [area, setArea] = useState(85);
  const [location, setLocation] = useState(locations[0]);
  const [propertyType, setPropertyType] = useState("");
  const [tenure, setTenure] = useState("");
  const [confidence, setConfidence] = useState<"LOW" | "MEDIUM" | "HIGH">(
    "MEDIUM"
  );

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState(
    "Choose the property details, then run the prediction engine to compare against real properties from your live API."
  );

  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch(`${API_BASE}/options`, {
          cache: "no-store",
        });

        const data: Options = await res.json();

        setOptions(data);
        setPropertyType(data.propertyTypes?.[0] || "");
        setTenure(data.tenures?.[0] || "");
      } catch (error) {
        console.error(error);
        setActiveInsight(
          "Could not load options from the live API. Check Railway backend."
        );
      }
    }

    loadOptions();
  }, []);

  async function runPrediction() {
    setLoading(true);
    setActiveInsight("Searching nearest comparable properties from live API...");

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          bedrooms,
          bathrooms,
          livingRooms,
          floorAreaSqM: area,
          latitude: location.lat,
          longitude: location.lng,
          propertyType,
          tenure,
          confidence,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setResult(null);
        setActiveInsight(data.error || "Prediction failed. Try again.");
        return;
      }

      setResult(data);
      setActiveInsight(
        `Prediction completed using ${data.comparablesUsed} real comparable properties. Market status: ${data.marketStatus}.`
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

  const delta = useMemo(() => {
    if (!result) return 0;
    return result.predictedPrice - result.medianComparablePrice;
  }, [result]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-6 pb-24 pt-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_88%_14%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_50%_88%,rgba(16,185,129,0.14),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:75px_75px]" />

      <section className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
            <BrainCircuit size={16} />
            Live Comparable Pricing Engine
          </div>

          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
            Predict Property
            <span className="block bg-gradient-to-r from-cyan-300 via-purple-400 to-emerald-300 bg-clip-text text-transparent">
              Price Precisely.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Connected to your live Railway API. Select property details,
            location, type, and confidence level to generate a real
            comparable-based valuation.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <SummaryCard
            icon={<Gem />}
            title="Predicted Price"
            value={result ? formatCurrency(result.predictedPrice) : "--"}
          />
          <SummaryCard
            icon={<TrendingUp />}
            title="Median Comparable"
            value={result ? formatCurrency(result.medianComparablePrice) : "--"}
          />
          <SummaryCard
            icon={<ShieldCheck />}
            title="Comparable Count"
            value={result ? `${result.comparablesUsed}` : "--"}
          />
          <SummaryCard
            icon={<CheckCircle2 />}
            title="Market Delta"
            value={result ? formatCurrency(delta) : "--"}
          />
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Prediction Control Panel
                </p>
                <h2 className="text-3xl font-black">Property Inputs</h2>
              </div>
              <SlidersHorizontal className="text-cyan-300" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-bold text-slate-300">
                  Location
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {locations.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setLocation(item)}
                      className={`min-h-24 rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                        location.name === item.name
                          ? "border-cyan-300 bg-cyan-300/15 shadow-lg shadow-cyan-500/10"
                          : "border-white/10 bg-black/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black">
                        <MapPin size={16} />
                        <span className="line-clamp-1">{item.name}</span>
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SelectBox
                  label="Property Type"
                  value={propertyType}
                  options={options.propertyTypes}
                  onChange={setPropertyType}
                />

                <SelectBox
                  label="Tenure"
                  value={tenure}
                  options={options.tenures}
                  onChange={setTenure}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <SmallNumber
                  icon={<BedDouble size={17} />}
                  label="Bedrooms"
                  value={bedrooms}
                  min={0}
                  max={8}
                  onChange={setBedrooms}
                />
                <SmallNumber
                  icon={<Bath size={17} />}
                  label="Bathrooms"
                  value={bathrooms}
                  min={0}
                  max={8}
                  onChange={setBathrooms}
                />
                <SmallNumber
                  icon={<Home size={17} />}
                  label="Living Rooms"
                  value={livingRooms}
                  min={0}
                  max={5}
                  onChange={setLivingRooms}
                />
              </div>

              <RangeControl
                label="Floor Area"
                value={area}
                min={25}
                max={320}
                step={5}
                suffix="sqm"
                onChange={setArea}
              />

              <div>
                <p className="mb-3 text-sm font-bold text-slate-300">
                  Confidence Mode
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setConfidence(item)}
                      className={`rounded-2xl border px-4 py-3 font-bold transition hover:-translate-y-1 ${
                        confidence === item
                          ? "border-emerald-300 bg-emerald-300/15 text-emerald-200"
                          : "border-white/10 bg-black/30 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={runPrediction}
                disabled={loading || !propertyType || !tenure}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-8 py-4 font-black text-black shadow-xl shadow-cyan-500/20 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Running Prediction...
                  </>
                ) : (
                  <>
                    <Search />
                    Predict Market Price
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.05] to-purple-500/10 p-7 shadow-2xl backdrop-blur-2xl">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="text-cyan-300" />
                <h2 className="text-3xl font-black">Live AI Insight</h2>
              </div>

              <p className="min-h-20 text-lg leading-8 text-slate-200">
                {activeInsight}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                  <div>
                    <p className="text-sm text-slate-400">
                      Google Maps Preview
                    </p>
                    <h3 className="text-xl font-black">{location.name}</h3>
                  </div>

                  <div className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                    Target Area
                  </div>
                </div>

                <iframe
                  key={location.name}
                  title="Google Map"
                  className="h-[520px] w-full grayscale-[10%] invert-[88%] hue-rotate-180"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`}
                />
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <Building2 className="text-purple-300" />
                    <h3 className="text-2xl font-black">Model Verdict</h3>
                  </div>

                  <p className="leading-7 text-slate-300">
                    {result ? (
                      <>
                        Status:{" "}
                        <span className="font-black text-cyan-300">
                          {result.marketStatus}
                        </span>
                        . Median comparable price is{" "}
                        <span className="font-black text-emerald-300">
                          {formatCurrency(result.medianComparablePrice)}
                        </span>
                        .
                      </>
                    ) : (
                      "Run prediction to generate a clean pricing verdict."
                    )}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-[#07111f] p-6 shadow-2xl">
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                    Current Profile
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    {propertyType || "Property"}
                  </h3>

                  <div className="mt-5 grid gap-3">
                    <MiniLine label="Location" value={location.name} />
                    <MiniLine label="Tenure" value={tenure || "--"} />
                    <MiniLine label="Area" value={`${area} sqm`} />
                    <MiniLine
                      label="Rooms"
                      value={`${bedrooms} beds • ${bathrooms} baths • ${livingRooms} living`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Nearest Comparable Properties
              </p>
              <h2 className="text-3xl font-black">Comparable Set</h2>
            </div>

            <BrainCircuit className="text-cyan-300" />
          </div>

          {!result ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center text-slate-400">
              Run prediction to load comparable properties.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {result.comparables.slice(0, 8).map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onMouseEnter={() =>
                    setActiveInsight(
                      `Comparable ${index + 1}: ${formatCurrency(
                        item.saleEstimate_currentPrice
                      )}, ${item.floorAreaSqM} sqm, ${item.bedrooms} beds.`
                    )
                  }
                  className="rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:bg-white/[0.08]"
                >
                  <p className="truncate text-sm text-slate-400">
                    {item.propertyType || "Comparable"}
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-cyan-300">
                    {formatCurrency(item.saleEstimate_currentPrice)}
                  </h3>

                  <p className="mt-3 text-sm text-slate-300">
                    {item.floorAreaSqM} sqm • {item.bedrooms} beds •{" "}
                    {item.bathrooms} baths
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {Number(item.latitude).toFixed(4)},{" "}
                    {Number(item.longitude).toFixed(4)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
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
      whileHover={{ y: -6, scale: 1.02 }}
      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl"
    >
      <div className="mb-4 text-cyan-300">{icon}</div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 truncate text-3xl font-black">{value}</p>
    </motion.div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-slate-300">{label}</p>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-cyan-300"
      >
        {options.length === 0 ? (
          <option>Loading...</option>
        ) : (
          options.slice(0, 35).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

function SmallNumber({
  icon,
  label,
  value,
  min,
  max,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-cyan-300">
        {icon}
        <p className="text-sm font-bold text-slate-300">{label}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-10 w-10 rounded-xl bg-white/10 font-black hover:bg-white/20"
        >
          -
        </button>

        <div className="flex-1 text-center text-2xl font-black text-cyan-300">
          {value}
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-10 w-10 rounded-xl bg-white/10 font-black hover:bg-white/20"
        >
          +
        </button>
      </div>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-bold text-slate-200">{label}</span>

        <span className="rounded-full bg-cyan-300/10 px-4 py-1 font-black text-cyan-300">
          {value} {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-300"
      />
    </div>
  );
}

function MiniLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-2xl bg-black/30 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="truncate font-bold text-white">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "N/A";
  return `£${Math.round(value).toLocaleString()}`;
}