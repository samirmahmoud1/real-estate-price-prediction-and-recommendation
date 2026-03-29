import streamlit as st
import pandas as pd
import numpy as np
import pydeck as pdk

# =========================
# Page Config
# =========================
st.set_page_config(
    page_title="Smart Property Investment Advisor",
    page_icon="🏠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =========================
# Custom CSS
# =========================
CUSTOM_CSS = """
<style>
/* Global */
html, body, [class*="css"] {
    font-family: "Segoe UI", sans-serif;
}

.stApp {
    background:
        radial-gradient(circle at top left, rgba(0, 224, 255, 0.10), transparent 22%),
        radial-gradient(circle at top right, rgba(168, 85, 247, 0.10), transparent 20%),
        radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.08), transparent 18%),
        linear-gradient(135deg, #07111f 0%, #0b1020 45%, #0f172a 100%);
    color: #e5eefc;
}

/* Main title */
.main-title {
    font-size: 3.2rem;
    font-weight: 900;
    text-align: center;
    margin-bottom: 0.3rem;
    background: linear-gradient(90deg, #67e8f9, #a78bfa, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeDown 0.8s ease;
}

.main-subtitle {
    text-align: center;
    color: #a8b6d3;
    font-size: 1.08rem;
    margin-bottom: 2rem;
    animation: fadeUp 1s ease;
}

/* Cards */
.glass-card {
    background: rgba(255, 255, 255, 0.045);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 24px;
    padding: 1.25rem 1.2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
    transition: 0.28s ease;
    height: 100%;
}

.glass-card:hover {
    transform: translateY(-6px);
    border-color: rgba(103, 232, 249, 0.38);
    box-shadow: 0 14px 35px rgba(0, 224, 255, 0.10);
}

.card-title {
    font-size: 1.55rem;
    font-weight: 800;
    color: #f8fbff;
    margin-bottom: 0.5rem;
}

.card-text {
    color: #b8c7e3;
    line-height: 1.7;
    font-size: 0.98rem;
}

/* Section title */
.section-title {
    font-size: 1.65rem;
    font-weight: 850;
    color: #f8fbff;
    margin: 1rem 0 0.7rem 0;
}

.section-sub {
    color: #9fb0cf;
    margin-bottom: 1rem;
}

/* KPIs */
.kpi-box {
    background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 1rem 1.05rem;
    box-shadow: 0 10px 22px rgba(0,0,0,0.16);
}
.kpi-label {
    color: #9db0d3;
    font-size: 0.9rem;
}
.kpi-value {
    color: #f8fbff;
    font-size: 2rem;
    font-weight: 850;
    margin-top: 0.35rem;
}

/* Sidebar */
section[data-testid="stSidebar"] {
    background:
        radial-gradient(circle at top left, rgba(0, 224, 255, 0.08), transparent 25%),
        linear-gradient(180deg, #08101d 0%, #0b1220 100%);
    border-right: 1px solid rgba(255,255,255,0.06);
}

.sidebar-title {
    font-size: 1.25rem;
    font-weight: 900;
    color: #f8fbff;
    margin-bottom: 0.8rem;
}

.sidebar-caption {
    color: #9fb0cf;
    font-size: 0.92rem;
    margin-bottom: 1rem;
}

/* Streamlit buttons */
.stButton > button {
    width: 100%;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: linear-gradient(90deg, rgba(103,232,249,0.12), rgba(167,139,250,0.12));
    color: #f8fbff;
    font-weight: 700;
    padding: 0.72rem 0.95rem;
    transition: all 0.2s ease;
}

.stButton > button:hover {
    border-color: rgba(103,232,249,0.45);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(103,232,249,0.08);
}

/* Inputs */
[data-baseweb="input"] > div,
[data-baseweb="select"] > div,
div[data-baseweb="select"] {
    border-radius: 14px !important;
}

.stNumberInput, .stSelectbox {
    margin-bottom: 0.4rem;
}

/* Tables/dataframes containers */
.block-container {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

/* Info box */
.info-banner {
    background: linear-gradient(90deg, rgba(103,232,249,0.10), rgba(52,211,153,0.10));
    border: 1px solid rgba(103,232,249,0.18);
    padding: 1rem 1.1rem;
    border-radius: 18px;
    color: #d9ecff;
    margin-top: 1rem;
}

/* Divider */
.soft-divider {
    height: 1px;
    border: none;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    margin: 1.4rem 0 1.5rem 0;
}

@keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
"""

st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# =========================
# Session State for Navigation
# =========================
if "page" not in st.session_state:
    st.session_state.page = "Home"

# =========================
# Load Data
# =========================
import streamlit as st
import pandas as pd

@st.cache_data
def load_data():
    url = "https://drive.google.com/uc?id=1A10QlgkfBuDAm_SFB0XfUdSL5RBRzP0P"
    df = pd.read_csv(url, low_memory=False)
    return df

df = load_data()

# =========================
# Utility Functions
# =========================
def go_to(page_name: str):
    st.session_state.page = page_name

def safe_round_series(series, decimals=4):
    return series.round(decimals)

def recommend_properties(data, budget, min_bedrooms=1, min_bathrooms=1, min_area=30, top_n=10):
    filtered = data[
        (data["saleEstimate_currentPrice"] <= budget) &
        (data["bedrooms"] >= min_bedrooms) &
        (data["bathrooms"] >= min_bathrooms) &
        (data["floorAreaSqM"] >= min_area)
    ].copy()

    if filtered.empty:
        return filtered

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

    return filtered.head(top_n)

def recommend_areas(data, budget, top_n=5):
    filtered = data[data["saleEstimate_currentPrice"] <= budget].copy()

    if filtered.empty:
        return filtered

    group_col = "postcode" if "postcode" in filtered.columns else None
    if group_col is None:
        if "outcode" in filtered.columns:
            group_col = "outcode"
        else:
            filtered["area_group"] = (
                filtered["latitude"].round(2).astype(str) + ", " +
                filtered["longitude"].round(2).astype(str)
            )
            group_col = "area_group"

    agg_dict = {
        "saleEstimate_currentPrice": "mean",
        "floorAreaSqM": "mean",
        "latitude": "mean",
        "longitude": "mean",
    }

    if "ROI" in filtered.columns:
        agg_dict["ROI"] = "mean"
    if "growth_rate" in filtered.columns:
        agg_dict["growth_rate"] = "mean"

    area_summary = filtered.groupby(group_col).agg(agg_dict).reset_index()

    rename_map = {
        group_col: "area_name",
        "saleEstimate_currentPrice": "avg_price",
        "floorAreaSqM": "avg_area",
        "ROI": "avg_roi",
        "growth_rate": "avg_growth",
    }
    area_summary = area_summary.rename(columns=rename_map)

    if "avg_roi" not in area_summary.columns:
        area_summary["avg_roi"] = 0.0
    if "avg_growth" not in area_summary.columns:
        area_summary["avg_growth"] = 0.0

    counts = filtered.groupby(group_col).size().reset_index(name="properties_count")
    counts = counts.rename(columns={group_col: "area_name"})
    area_summary = area_summary.merge(counts, on="area_name", how="left")

    area_summary["investment_score"] = (
        area_summary["avg_roi"] * 100 * 0.6 +
        area_summary["avg_growth"] * 0.4 +
        area_summary["properties_count"] * 0.03
    )

    area_summary = area_summary.sort_values("investment_score", ascending=False).head(top_n)
    return area_summary

def render_map(map_df, lat_col="latitude", lon_col="longitude"):
    if map_df.empty:
        st.warning("No locations found for the selected filters.")
        return

    map_df = map_df.dropna(subset=[lat_col, lon_col]).drop_duplicates().copy()

    if map_df.empty:
        st.warning("Map data is empty after removing missing coordinates.")
        return

    st.pydeck_chart(
        pdk.Deck(
            map_style="mapbox://styles/mapbox/dark-v11",
            initial_view_state=pdk.ViewState(
                latitude=float(map_df[lat_col].mean()),
                longitude=float(map_df[lon_col].mean()),
                zoom=10,
                pitch=35,
            ),
            layers=[
                pdk.Layer(
                    "ScatterplotLayer",
                    data=map_df,
                    get_position=f"[{lon_col}, {lat_col}]",
                    get_radius=120,
                    radius_min_pixels=6,
                    radius_max_pixels=18,
                    get_fill_color=[103, 232, 249, 180],
                    pickable=True,
                )
            ],
            tooltip={
                "html": """
                    <div style="padding:6px 8px;">
                        <b>Price:</b> {saleEstimate_currentPrice}<br/>
                        <b>ROI:</b> {ROI}<br/>
                        <b>Growth:</b> {growth_rate}<br/>
                        <b>Area:</b> {floorAreaSqM} sqm
                    </div>
                """,
                "style": {
                    "backgroundColor": "#0f172a",
                    "color": "white",
                    "border": "1px solid rgba(255,255,255,0.08)",
                    "borderRadius": "10px",
                },
            },
        ),
        use_container_width=True,
    )

# =========================
# Sidebar Navigation
# =========================
with st.sidebar:
    st.markdown("<div class='sidebar-title'>🏠 Smart Property</div>", unsafe_allow_html=True)
    st.markdown("<div class='sidebar-caption'>Navigate through the platform pages</div>", unsafe_allow_html=True)

    if st.button("🏠  Home", key="nav_home"):
        go_to("Home")
    if st.button("📈  Business Prediction", key="nav_business"):
        go_to("Business Prediction")
    if st.button("🧠  Clean Model", key="nav_clean"):
        go_to("Clean Model")
    if st.button("💰  Investment Advisor", key="nav_invest"):
        go_to("Investment Advisor")
    if st.button("📊  Analytics Dashboard", key="nav_dashboard"):
        go_to("Analytics Dashboard")
    if st.button("ℹ️  About Project", key="nav_about"):
        go_to("About Project")

    st.markdown("---")
    st.caption(f"Current page: **{st.session_state.page}**")

# =========================
# Pages
# =========================
def page_home():
    st.markdown("<div class='main-title'>🏡 Smart Property Investment Advisor</div>", unsafe_allow_html=True)
    st.markdown(
        "<div class='main-subtitle'>A premium real estate analytics, prediction, and recommendation platform powered by Machine Learning.</div>",
        unsafe_allow_html=True,
    )

    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>📈 Predict Prices</div>
            <div class='card-text'>
                Estimate property value using machine learning models built on structural and market-related signals.
            </div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>💰 Investment Advice</div>
            <div class='card-text'>
                Discover the best properties and areas based on budget, return potential, and growth indicators.
            </div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>🗺️ Explore on Map</div>
            <div class='card-text'>
                Visualize recommended properties on an interactive map with investment metrics and location context.
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<hr class='soft-divider'>", unsafe_allow_html=True)
    st.markdown("<div class='section-title'>Why this platform?</div>", unsafe_allow_html=True)
    st.markdown(
        "<div class='section-sub'>This application helps users analyze the real estate market, estimate prices, discover investment opportunities, and interact with recommendations visually.</div>",
        unsafe_allow_html=True,
    )

    rows_count = len(df)
    cols_count = len(df.columns)

    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.markdown(f"""
        <div class='kpi-box'>
            <div class='kpi-label'>Dataset Size</div>
            <div class='kpi-value'>{rows_count:,}</div>
        </div>
        """, unsafe_allow_html=True)
    with k2:
        st.markdown(f"""
        <div class='kpi-box'>
            <div class='kpi-label'>Features</div>
            <div class='kpi-value'>{cols_count}+</div>
        </div>
        """, unsafe_allow_html=True)
    with k3:
        st.markdown("""
        <div class='kpi-box'>
            <div class='kpi-label'>Models</div>
            <div class='kpi-value'>2</div>
        </div>
        """, unsafe_allow_html=True)
    with k4:
        st.markdown("""
        <div class='kpi-box'>
            <div class='kpi-label'>Use Cases</div>
            <div class='kpi-value' style='font-size:1.45rem;'>Prediction + Advice</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown(
        "<div class='info-banner'>Use the sidebar buttons to navigate through the app pages.</div>",
        unsafe_allow_html=True,
    )

def page_business_prediction():
    st.markdown("<div class='section-title'>📈 Business Prediction</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>A business-oriented prediction experience. You can later connect this page to the high-accuracy business model.</div>", unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)

    with col1:
        bedrooms = st.number_input("Bedrooms", min_value=0, value=2, step=1)
        bathrooms = st.number_input("Bathrooms", min_value=0, value=1, step=1)
        living_rooms = st.number_input("Living Rooms", min_value=0, value=1, step=1)

    with col2:
        floor_area = st.number_input("Floor Area (sqm)", min_value=10.0, value=80.0, step=5.0)
        latitude = st.number_input("Latitude", value=51.5074, format="%.6f")
        longitude = st.number_input("Longitude", value=-0.1278, format="%.6f")

    with col3:
        property_type = st.selectbox(
            "Property Type",
            sorted(df["propertyType"].dropna().astype(str).unique().tolist()) if "propertyType" in df.columns else ["Flat"]
        )
        tenure = st.selectbox(
            "Tenure",
            sorted(df["tenure"].dropna().astype(str).unique().tolist()) if "tenure" in df.columns else ["Leasehold"]
        )
        confidence = st.selectbox("Confidence Level", ["LOW", "MEDIUM", "HIGH"])

    if st.button("Predict Business Price"):
        # Placeholder smart approximation
        area_factor = floor_area * 8500
        room_factor = bedrooms * 22000 + bathrooms * 18000 + living_rooms * 12000
        confidence_factor = {"LOW": 0.96, "MEDIUM": 1.00, "HIGH": 1.04}[confidence]
        predicted_price = max(90000, (area_factor + room_factor) * confidence_factor)

        st.success("Prediction generated successfully.")
        st.markdown(f"""
        <div class='glass-card'>
            <div class='card-title'>💷 Predicted Business Price</div>
            <div class='card-text' style='font-size:2rem; font-weight:900; color:#f8fbff;'>£{predicted_price:,.0f}</div>
            <div class='card-text'>This is a UI-ready placeholder until the serialized business model is connected.</div>
        </div>
        """, unsafe_allow_html=True)

def page_clean_model():
    st.markdown("<div class='section-title'>🧠 Clean Model</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>This page represents the leakage-free academic model view.</div>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>What makes it clean?</div>
            <div class='card-text'>
                This model excludes target-derived leakage features and relies on realistic property characteristics such as area, location, and structural attributes.
            </div>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>Observed performance</div>
            <div class='card-text'>
                Real MAE ≈ <b>15,404</b><br/>
                Log MAE ≈ <b>0.024</b><br/><br/>
                This is a strong and realistic result for a clean real estate prediction model.
            </div>
        </div>
        """, unsafe_allow_html=True)

def page_investment_advisor():
    st.markdown("<div class='section-title'>💰 Investment Advisor</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>Find the best properties and areas inside your budget, then explore them on a live map.</div>", unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        budget = st.number_input("Budget", min_value=50000, value=700000, step=10000)
    with c2:
        min_bedrooms = st.number_input("Min Bedrooms", min_value=1, value=2, step=1)
    with c3:
        min_bathrooms = st.number_input("Min Bathrooms", min_value=1, value=1, step=1)
    with c4:
        min_area = st.number_input("Min Area (sqm)", min_value=20, value=60, step=5)

    if st.button("Get Smart Recommendations"):
        recommendations = recommend_properties(
            df,
            budget=budget,
            min_bedrooms=min_bedrooms,
            min_bathrooms=min_bathrooms,
            min_area=min_area,
            top_n=10,
        )

        best_areas = recommend_areas(df, budget=budget, top_n=5)

        if recommendations.empty:
            st.warning("No recommended properties found for the selected filters.")
            return

        st.markdown("<div class='section-title'>Top Recommended Properties</div>", unsafe_allow_html=True)

        display_cols = [
            col for col in [
                "latitude", "longitude", "saleEstimate_currentPrice",
                "ROI", "growth_rate", "floorAreaSqM", "bedrooms", "bathrooms"
            ] if col in recommendations.columns
        ]

        table_df = recommendations[display_cols].copy()

        if "ROI" in table_df.columns:
            table_df["ROI"] = safe_round_series(table_df["ROI"], 4)
        if "growth_rate" in table_df.columns:
            table_df["growth_rate"] = safe_round_series(table_df["growth_rate"], 2)

        st.dataframe(table_df, use_container_width=True)

        if not best_areas.empty:
            st.markdown("<div class='section-title'>Best Areas Within Budget</div>", unsafe_allow_html=True)
            area_show = best_areas.copy()
            for c in ["avg_price", "avg_roi", "avg_growth", "avg_area", "investment_score"]:
                if c in area_show.columns:
                    area_show[c] = area_show[c].round(2)
            st.dataframe(area_show, use_container_width=True)

        st.markdown("<div class='section-title'>🗺️ Recommended Properties Map</div>", unsafe_allow_html=True)

        map_cols = [
            col for col in [
                "latitude", "longitude", "saleEstimate_currentPrice",
                "ROI", "growth_rate", "floorAreaSqM"
            ] if col in recommendations.columns
        ]
        map_data = recommendations[map_cols].dropna().drop_duplicates()
        render_map(map_data)

def page_analytics_dashboard():
    st.markdown("<div class='section-title'>📊 Analytics Dashboard</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>Quick market-level insights from the cleaned dataset.</div>", unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)

    mean_price = df["saleEstimate_currentPrice"].mean() if "saleEstimate_currentPrice" in df.columns else 0
    mean_roi = df["ROI"].mean() if "ROI" in df.columns else 0
    mean_growth = df["growth_rate"].mean() if "growth_rate" in df.columns else 0

    with col1:
        st.metric("Average Price", f"£{mean_price:,.0f}")
    with col2:
        st.metric("Average ROI", f"{mean_roi:.4f}")
    with col3:
        st.metric("Average Growth", f"{mean_growth:.2f}%")

    st.markdown("<hr class='soft-divider'>", unsafe_allow_html=True)

    if "propertyType" in df.columns:
        top_types = df["propertyType"].value_counts().head(10)
        st.subheader("Top Property Types")
        st.bar_chart(top_types)

    if "tenure" in df.columns:
        top_tenure = df["tenure"].value_counts()
        st.subheader("Tenure Distribution")
        st.bar_chart(top_tenure)

def page_about_project():
    st.markdown("<div class='section-title'>ℹ️ About Project</div>", unsafe_allow_html=True)
    st.markdown("""
    <div class='glass-card'>
        <div class='card-title'>Project Summary</div>
        <div class='card-text'>
            This project combines real estate data analysis, machine learning, and recommendation logic
            to support smarter property pricing and investment decisions.
            <br/><br/>
            <b>Core components:</b><br/>
            • Exploratory Data Analysis<br/>
            • Clean ML Model<br/>
            • Business-Oriented Model<br/>
            • Recommendation System<br/>
            • Interactive Map Visualization
        </div>
    </div>
    """, unsafe_allow_html=True)

# =========================
# Router
# =========================
page_name = st.session_state.page

if page_name == "Home":
    page_home()
elif page_name == "Business Prediction":
    page_business_prediction()
elif page_name == "Clean Model":
    page_clean_model()
elif page_name == "Investment Advisor":
    page_investment_advisor()
elif page_name == "Analytics Dashboard":
    page_analytics_dashboard()
elif page_name == "About Project":
    page_about_project()