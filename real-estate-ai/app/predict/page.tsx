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
  const [confidence, setConfidence] =
    useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState("");

  // ✅ Init (نجيب options من نفس API)
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(
          "https://real-estate-price-prediction-and-recommendation-production.up.railway.app/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bedrooms: 2,
              bathrooms: 1,
              livingRooms: 1,
              floorAreaSqM: 80,
              latitude: locations[0].lat,
              longitude: locations[0].lng,
              propertyType: "Flat",
              tenure: "Freehold",
              confidence: "MEDIUM",
            }),
          }
        );

        const data = await res.json();

        if (data?.comparables?.length) {
          const propertyTypes = [
            ...new Set(
              data.comparables.map((c: any) => c.propertyType).filter(Boolean)
            ),
          ];

          const tenures = [
            ...new Set(
              data.comparables.map((c: any) => c.tenure).filter(Boolean)
            ),
          ];

          setOptions({ propertyTypes, tenures });
          setPropertyType(propertyTypes[0] || "");
          setTenure(tenures[0] || "");
        }
      } catch (err) {
        console.error(err);
      }
    }

    init();
  }, []);

  // ✅ Prediction (Railway)
  async function runPrediction() {
    setLoading(true);
    setActiveInsight("Running AI prediction...");

    try {
      const res = await fetch(
        "https://real-estate-price-prediction-and-recommendation-production.up.railway.app/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        }
      );

      const data = await res.json();

      if (data.error) {
        setResult(null);
        setActiveInsight(data.error);
      } else {
        setResult(data);
        setActiveInsight(
          `Used ${data.comparablesUsed} comparable properties`
        );
      }
    } catch (err) {
      setActiveInsight("API Error أو السيرفر واقع");
      console.error(err);
    }

    setLoading(false);
  }

  const delta = useMemo(() => {
    if (!result) return 0;
    return result.predictedPrice - result.medianComparablePrice;
  }, [result]);

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Predict Property Price</h1>

      <button
        onClick={runPrediction}
        className="bg-cyan-400 px-6 py-3 rounded-xl text-black font-bold"
      >
        {loading ? "Loading..." : "Predict"}
      </button>

      {result && (
        <div className="mt-6">
          <p>Predicted: £{result.predictedPrice}</p>
          <p>Median: £{result.medianComparablePrice}</p>
          <p>Delta: £{delta}</p>
        </div>
      )}
    </main>
  );
}