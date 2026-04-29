import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Real Estate AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_data():
    file_id = "1A10QlgkfBuDAm_SFB0XfUdSL5RBRzP0P"
    url = f"https://drive.google.com/uc?id={file_id}"
    return pd.read_csv(url, low_memory=False)

df = load_data()


class RecommendRequest(BaseModel):
    budget: float
    minBedrooms: int = 1
    minBathrooms: int = 1
    minArea: float = 30


class PredictRequest(BaseModel):
    bedrooms: int
    bathrooms: int
    livingRooms: int = 1
    floorAreaSqM: float
    latitude: float
    longitude: float
    propertyType: str
    tenure: str
    confidence: str = "MEDIUM"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
    }


@app.get("/options")
def options():
    return {
        "propertyTypes": sorted(df["propertyType"].dropna().astype(str).unique().tolist())
        if "propertyType" in df.columns else [],
        "tenures": sorted(df["tenure"].dropna().astype(str).unique().tolist())
        if "tenure" in df.columns else [],
    }


@app.get("/dashboard")
def dashboard():
    price_col = "saleEstimate_currentPrice"

    overview = {
        "totalProperties": int(len(df)),
        "averagePrice": round(float(df[price_col].mean()), 2),
        "averageROI": round(float(df["ROI"].mean()), 4) if "ROI" in df.columns else 0,
        "averageGrowth": round(float(df["growth_rate"].mean()), 2) if "growth_rate" in df.columns else 0,
    }

    property_types = (
        df["propertyType"].dropna().astype(str).value_counts().head(10).to_dict()
        if "propertyType" in df.columns else {}
    )

    tenure = (
        df["tenure"].dropna().astype(str).value_counts().head(10).to_dict()
        if "tenure" in df.columns else {}
    )

    price_vs_area = (
        df[["floorAreaSqM", price_col]]
        .dropna()
        .sample(min(1200, len(df)), random_state=42)
        .to_dict(orient="records")
    )

    map_cols = [
        "latitude",
        "longitude",
        "saleEstimate_currentPrice",
        "ROI",
        "growth_rate",
        "floorAreaSqM",
        "bedrooms",
        "bathrooms",
        "propertyType",
        "tenure",
    ]

    map_cols = [c for c in map_cols if c in df.columns]

    map_points = (
        df[map_cols]
        .dropna(subset=["latitude", "longitude"])
        .sample(min(2000, len(df)), random_state=42)
        .replace([np.inf, -np.inf], np.nan)
        .fillna("")
        .to_dict(orient="records")
    )

    return {
        "overview": overview,
        "propertyTypes": property_types,
        "tenure": tenure,
        "priceVsArea": price_vs_area,
        "mapPoints": map_points,
    }


@app.post("/recommend")
def recommend(req: RecommendRequest):
    filtered = df[
        (df["saleEstimate_currentPrice"] <= req.budget)
        & (df["bedrooms"] >= req.minBedrooms)
        & (df["bathrooms"] >= req.minBathrooms)
        & (df["floorAreaSqM"] >= req.minArea)
    ].copy()

    if filtered.empty:
        return {"properties": []}

    sort_cols = []
    ascending = []

    if "ROI" in filtered.columns:
        sort_cols.append("ROI")
        ascending.append(False)

    if "growth_rate" in filtered.columns:
        sort_cols.append("growth_rate")
        ascending.append(False)

    if "price_per_sqm" in filtered.columns:
        sort_cols.append("price_per_sqm")
        ascending.append(True)

    if sort_cols:
        filtered = filtered.sort_values(by=sort_cols, ascending=ascending)

    cols = [
        "saleEstimate_currentPrice",
        "ROI",
        "growth_rate",
        "floorAreaSqM",
        "bedrooms",
        "bathrooms",
        "latitude",
        "longitude",
        "propertyType",
        "tenure",
    ]

    cols = [c for c in cols if c in filtered.columns]

    return {
        "properties": filtered[cols]
        .head(24)
        .replace([np.inf, -np.inf], np.nan)
        .fillna("")
        .to_dict(orient="records")
    }


@app.post("/predict")
def predict(req: PredictRequest):
    work = df.copy()

    if "propertyType" in work.columns:
        temp = work[work["propertyType"].astype(str) == str(req.propertyType)]
        if len(temp) >= 30:
            work = temp

    if "tenure" in work.columns:
        temp = work[work["tenure"].astype(str) == str(req.tenure)]
        if len(temp) >= 30:
            work = temp

    work["score_bed"] = (work["bedrooms"] - req.bedrooms).abs()
    work["score_bath"] = (work["bathrooms"] - req.bathrooms).abs()

    if "livingRooms" in work.columns:
        work["score_living"] = (work["livingRooms"] - req.livingRooms).abs()
    else:
        work["score_living"] = 0

    work["score_area"] = (
        (work["floorAreaSqM"] - req.floorAreaSqM).abs()
        / max(req.floorAreaSqM, 1)
    )

    work["score_loc"] = np.sqrt(
        (work["latitude"] - req.latitude) ** 2
        + (work["longitude"] - req.longitude) ** 2
    )

    work["match_score"] = (
        work["score_bed"] * 1.2
        + work["score_bath"] * 1.0
        + work["score_living"] * 0.6
        + work["score_area"] * 4.5
        + work["score_loc"] * 120
    )

    comps = work.sort_values("match_score").head(30).copy()

    if comps.empty:
        return {"error": "No comparable properties found"}

    median_price = comps["saleEstimate_currentPrice"].median()

    conf_factor = {
        "LOW": 0.98,
        "MEDIUM": 1.00,
        "HIGH": 1.02,
    }.get(req.confidence, 1.0)

    predicted_price = median_price * conf_factor

    diff_ratio = (predicted_price - median_price) / median_price

    if abs(diff_ratio) < 0.05:
        market_status = "Fairly priced"
    elif diff_ratio < 0:
        market_status = "Undervalued"
    else:
        market_status = "Overpriced"

    comp_cols = [
        "saleEstimate_currentPrice",
        "floorAreaSqM",
        "bedrooms",
        "bathrooms",
        "latitude",
        "longitude",
        "propertyType",
        "tenure",
    ]

    comp_cols = [c for c in comp_cols if c in comps.columns]

    return {
        "predictedPrice": round(float(predicted_price), 2),
        "medianComparablePrice": round(float(median_price), 2),
        "comparablesUsed": int(len(comps)),
        "marketStatus": market_status,
        "comparables": comps[comp_cols]
        .head(12)
        .replace([np.inf, -np.inf], np.nan)
        .fillna("")
        .to_dict(orient="records"),
    }
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "API is working 🚀"}