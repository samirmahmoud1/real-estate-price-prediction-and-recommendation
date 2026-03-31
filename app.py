import os
import numpy as np
import pandas as pd
import streamlit as st
import pydeck as pdk
import matplotlib.pyplot as plt

# =========================================================
# PAGE CONFIG
# =========================================================
st.set_page_config(
    page_title="Smart Property Investment Advisor",
    page_icon="🏠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =========================================================
# CSS
# =========================================================
CUSTOM_CSS = """
<style>
html, body, [class*="css"] {
    font-family: "Segoe UI", sans-serif;
}

.stApp {
    background:
        radial-gradient(circle at top left, rgba(0, 224, 255, 0.08), transparent 22%),
        radial-gradient(circle at top right, rgba(168, 85, 247, 0.08), transparent 20%),
        radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.06), transparent 18%),
        linear-gradient(135deg, #07111f 0%, #0b1020 45%, #0f172a 100%);
    color: #e5eefc;
}

.main-title {
    font-size: 3.2rem;
    font-weight: 900;
    text-align: center;
    margin-bottom: 0.3rem;
    background: linear-gradient(90deg, #67e8f9, #a78bfa, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.main-subtitle {
    text-align: center;
    color: #a8b6d3;
    font-size: 1.08rem;
    margin-bottom: 2rem;
}

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
    font-size: 1.35rem;
    font-weight: 800;
    color: #f8fbff;
    margin-bottom: 0.5rem;
}

.card-text {
    color: #b8c7e3;
    line-height: 1.7;
    font-size: 0.98rem;
}

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

[data-baseweb="input"] > div,
[data-baseweb="select"] > div,
div[data-baseweb="select"] {
    border-radius: 14px !important;
}

.block-container {
    padding-top: 1.6rem;
    padding-bottom: 2rem;
}

.info-banner {
    background: linear-gradient(90deg, rgba(103,232,249,0.10), rgba(52,211,153,0.10));
    border: 1px solid rgba(103,232,249,0.18);
    padding: 1rem 1.1rem;
    border-radius: 18px;
    color: #d9ecff;
    margin-top: 1rem;
}

.soft-divider {
    height: 1px;
    border: none;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    margin: 1.4rem 0 1.5rem 0;
}

div[role="radiogroup"] label {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    margin-right: 0.4rem;
}

.footer-box {
    margin-top: 2rem;
    padding: 1rem 1.2rem;
    border-radius: 18px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    text-align: center;
    color: #9fb0cf;
    font-size: 0.95rem;
}

.highlight-box {
    padding: 1rem;
    border-radius: 18px;
    background: rgba(103,232,249,0.06);
    border: 1px solid rgba(103,232,249,0.15);
    color: #dbeafe;
}

</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# =========================================================
# SESSION
# =========================================================
if "page" not in st.session_state:
    st.session_state.page = "Home"

# =========================================================
# LOAD DATA
# =========================================================
@st.cache_data(show_spinner=False)
def load_data():
    file_id = "1A10QlgkfBuDAm_SFB0XfUdSL5RBRzP0P"
    url = f"https://drive.google.com/uc?id={file_id}"
    try:
        data = pd.read_csv(url, low_memory=False)
    except Exception:
        local_file = "cleaned_data.csv"
        if os.path.exists(local_file):
            data = pd.read_csv(local_file, low_memory=False)
        else:
            raise
    return data

df = load_data()

# =========================================================
# HELPERS
# =========================================================
def go_to(page_name: str):
    st.session_state.page = page_name

def format_currency(value):
    if pd.isna(value):
        return "N/A"
    return f"£{value:,.0f}"

def safe_round_series(series, decimals=4):
    return series.round(decimals)

def nearest_comparable_price(
    data: pd.DataFrame,
    bedrooms: int,
    bathrooms: int,
    living_rooms: int,
    floor_area: float,
    latitude: float,
    longitude: float,
    property_type: str,
    tenure: str,
    confidence: str,
):
    work = data.copy()

    if "propertyType" in work.columns:
        temp = work[work["propertyType"].astype(str) == str(property_type)]
        if len(temp) >= 30:
            work = temp

    if "tenure" in work.columns:
        temp = work[work["tenure"].astype(str) == str(tenure)]
        if len(temp) >= 30:
            work = temp

    work["score_bed"] = (work["bedrooms"] - bedrooms).abs()
    work["score_bath"] = (work["bathrooms"] - bathrooms).abs()
    work["score_living"] = (work["livingRooms"] - living_rooms).abs() if "livingRooms" in work.columns else 0
    work["score_area"] = ((work["floorAreaSqM"] - floor_area).abs() / np.maximum(floor_area, 1))
    work["score_loc"] = np.sqrt((work["latitude"] - latitude) ** 2 + (work["longitude"] - longitude) ** 2)

    work["match_score"] = (
        work["score_bed"] * 1.2 +
        work["score_bath"] * 1.0 +
        work["score_living"] * 0.6 +
        work["score_area"] * 4.5 +
        work["score_loc"] * 120
    )

    comps = work.sort_values("match_score").head(30).copy()
    if comps.empty:
        return None, None, pd.DataFrame()

    median_price = comps["saleEstimate_currentPrice"].median()
    conf_factor = {"LOW": 0.98, "MEDIUM": 1.00, "HIGH": 1.02}.get(confidence, 1.0)
    predicted_price = median_price * conf_factor
    return predicted_price, median_price, comps

def get_market_status(predicted_price, median_price):
    if median_price is None or median_price == 0:
        return "No market comparison available."

    diff_ratio = (predicted_price - median_price) / median_price

    if abs(diff_ratio) < 0.05:
        return "📊 Fairly priced and closely aligned with the market."
    elif diff_ratio < 0:
        return "💰 Slightly undervalued compared to similar properties."
    else:
        return "⚠️ Slightly overpriced compared to similar properties."

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

    if "postcode" in filtered.columns:
        group_col = "postcode"
    elif "outcode" in filtered.columns:
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
    area_summary = area_summary.rename(columns={
        group_col: "area_name",
        "saleEstimate_currentPrice": "avg_price",
        "floorAreaSqM": "avg_area",
        "ROI": "avg_roi",
        "growth_rate": "avg_growth",
    })

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

    return area_summary.sort_values("investment_score", ascending=False).head(top_n)

# =========================================================
# DARK CHARTS
# =========================================================
def make_dark_figure(figsize=(9, 4.8)):
    fig, ax = plt.subplots(figsize=figsize)
    fig.patch.set_facecolor("#0f172a")
    ax.set_facecolor("#111827")
    ax.tick_params(colors="#dbeafe", labelsize=10)
    ax.xaxis.label.set_color("#dbeafe")
    ax.yaxis.label.set_color("#dbeafe")
    ax.title.set_color("#f8fafc")
    for spine in ax.spines.values():
        spine.set_color("#334155")
    ax.grid(True, alpha=0.15, color="#94a3b8")
    return fig, ax

def plot_histogram(series, title, bins=50):
    fig, ax = make_dark_figure((9, 5))
    ax.hist(series.dropna(), bins=bins, color="#38bdf8", edgecolor="#67e8f9", alpha=0.88)
    ax.set_title(title, fontsize=18, pad=12, fontweight="bold")
    ax.set_xlabel(series.name)
    ax.set_ylabel("Count")
    st.pyplot(fig, use_container_width=True)
    plt.close(fig)

def plot_scatter(data, x_col, y_col, title, sample_n=7000):
    plot_df = data[[x_col, y_col]].dropna()
    if len(plot_df) > sample_n:
        plot_df = plot_df.sample(sample_n, random_state=42)

    fig, ax = make_dark_figure((9, 5))
    ax.scatter(plot_df[x_col], plot_df[y_col], alpha=0.38, s=18, color="#a78bfa", edgecolors="none")
    ax.set_title(title, fontsize=18, pad=12, fontweight="bold")
    ax.set_xlabel(x_col)
    ax.set_ylabel(y_col)
    st.pyplot(fig, use_container_width=True)
    plt.close(fig)

def plot_box_by_category(data, cat_col, y_col, title):
    plot_df = data[[cat_col, y_col]].dropna().copy()
    categories = sorted(plot_df[cat_col].unique(), key=lambda x: str(x))
    grouped = [plot_df.loc[plot_df[cat_col] == cat, y_col].values for cat in categories]

    fig, ax = make_dark_figure((10, 5))
    bp = ax.boxplot(grouped, labels=[str(c) for c in categories], patch_artist=True, showfliers=False)
    for box in bp["boxes"]:
        box.set(facecolor="#34d399", alpha=0.45, edgecolor="#67e8f9")
    for whisker in bp["whiskers"]:
        whisker.set(color="#cbd5e1")
    for cap in bp["caps"]:
        cap.set(color="#cbd5e1")
    for median in bp["medians"]:
        median.set(color="#f8fafc", linewidth=2)

    ax.set_title(title, fontsize=18, pad=12, fontweight="bold")
    ax.set_xlabel(cat_col)
    ax.set_ylabel(y_col)
    plt.xticks(rotation=35)
    st.pyplot(fig, use_container_width=True)
    plt.close(fig)

def plot_bar_counts(series, title, top_n=10):
    counts = series.dropna().astype(str).value_counts().head(top_n)
    fig, ax = make_dark_figure((9, 5))
    ax.bar(counts.index, counts.values, color="#38bdf8", edgecolor="#67e8f9", alpha=0.9)
    ax.set_title(title, fontsize=18, pad=12, fontweight="bold")
    ax.set_xlabel(series.name)
    ax.set_ylabel("Count")
    plt.xticks(rotation=35, ha="right")
    st.pyplot(fig, use_container_width=True)
    plt.close(fig)

# =========================================================
# MAPS
# =========================================================
def render_recommendation_map(map_df, full_height=620):
    if map_df.empty:
        st.warning("No locations found for the selected filters.")
        return

    map_df = map_df.dropna(subset=["latitude", "longitude"]).drop_duplicates().copy()
    if map_df.empty:
        st.warning("Map data is empty after removing missing coordinates.")
        return

    radius_values = None
    if "saleEstimate_currentPrice" in map_df.columns:
        radius_values = np.clip(map_df["saleEstimate_currentPrice"] / 7000, 80, 240).tolist()

    deck = pdk.Deck(
        map_provider="carto",
        map_style="dark",
        initial_view_state=pdk.ViewState(
            latitude=float(map_df["latitude"].mean()),
            longitude=float(map_df["longitude"].mean()),
            zoom=10,
            pitch=42,
        ),
        layers=[
            pdk.Layer(
                "ScatterplotLayer",
                data=map_df,
                get_position="[longitude, latitude]",
                get_radius=radius_values if radius_values is not None else 120,
                radius_min_pixels=6,
                radius_max_pixels=24,
                get_fill_color=[103, 232, 249, 180],
                get_line_color=[255, 255, 255, 130],
                line_width_min_pixels=1,
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
    )
    st.pydeck_chart(deck, use_container_width=True, height=full_height)

def render_market_map(map_df, full_height=720):
    if map_df.empty:
        st.warning("No locations available for the market map.")
        return

    map_df = map_df.dropna(subset=["latitude", "longitude"]).copy()
    if map_df.empty:
        st.warning("Map data is empty.")
        return

    deck = pdk.Deck(
        map_provider="carto",
        map_style="dark",
        initial_view_state=pdk.ViewState(
            latitude=float(map_df["latitude"].mean()),
            longitude=float(map_df["longitude"].mean()),
            zoom=8,
            pitch=45,
            bearing=0,
        ),
        layers=[
            pdk.Layer(
                "HexagonLayer",
                data=map_df,
                get_position="[longitude, latitude]",
                radius=450,
                elevation_scale=40,
                elevation_range=[0, 3000],
                extruded=True,
                coverage=1,
                pickable=True,
                auto_highlight=True,
            ),
            pdk.Layer(
                "ScatterplotLayer",
                data=map_df.sample(min(2500, len(map_df)), random_state=42),
                get_position="[longitude, latitude]",
                get_radius=40,
                radius_min_pixels=2,
                radius_max_pixels=5,
                get_fill_color=[167, 139, 250, 110],
                pickable=False,
            ),
        ],
        tooltip={
            "html": """
                <div style="padding:6px 8px;">
                    <b>Market density view</b><br/>
                    Explore where property concentration is higher.
                </div>
            """,
            "style": {"backgroundColor": "#0f172a", "color": "white"},
        },
    )
    st.pydeck_chart(deck, use_container_width=True, height=full_height)

# =========================================================
# FOOTER
# =========================================================
def render_footer():
    st.markdown(
        """
        <div class='footer-box'>
            Smart Property Investment Advisor • Real Estate Analytics • Machine Learning • Streamlit App<br/>
            Built to support price estimation, investment analysis, and interactive market exploration.
        </div>
        """,
        unsafe_allow_html=True,
    )

# =========================================================
# SIDEBAR
# =========================================================
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

# =========================================================
# PAGES
# =========================================================
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
            <div class='card-title'>📈 Smart Price Prediction</div>
            <div class='card-text'>Estimate property value using comparable listings and market-aware pricing logic.</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>💰 Investment Recommendation</div>
            <div class='card-text'>Discover the best properties and areas based on budget, ROI, growth, and price efficiency.</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        st.markdown("""
        <div class='glass-card'>
            <div class='card-title'>🗺️ Market Analytics & Maps</div>
            <div class='card-text'>Explore market density, area behavior, and recommendation results on interactive maps.</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<hr class='soft-divider'>", unsafe_allow_html=True)

    rows_count = len(df)
    cols_count = len(df.columns)

    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.markdown(f"<div class='kpi-box'><div class='kpi-label'>Dataset Size</div><div class='kpi-value'>{rows_count:,}</div></div>", unsafe_allow_html=True)
    with k2:
        st.markdown(f"<div class='kpi-box'><div class='kpi-label'>Features</div><div class='kpi-value'>{cols_count}+</div></div>", unsafe_allow_html=True)
    with k3:
        st.markdown("<div class='kpi-box'><div class='kpi-label'>Models</div><div class='kpi-value'>2</div></div>", unsafe_allow_html=True)
    with k4:
        st.markdown("<div class='kpi-box'><div class='kpi-label'>Use Cases</div><div class='kpi-value' style='font-size:1.35rem;'>Prediction + Advice</div></div>", unsafe_allow_html=True)

    st.markdown("<div class='info-banner'>Use the sidebar to navigate between prediction, recommendation, analytics, and project details.</div>", unsafe_allow_html=True)

def page_business_prediction():
    st.markdown("<div class='section-title'>📈 Business Prediction</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>Estimate a realistic market price using comparable properties from the dataset.</div>", unsafe_allow_html=True)

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
        property_type_options = sorted(df["propertyType"].dropna().astype(str).unique().tolist()) if "propertyType" in df.columns else ["Flat"]
        tenure_options = sorted(df["tenure"].dropna().astype(str).unique().tolist()) if "tenure" in df.columns else ["Leasehold"]

        property_type = st.selectbox("Property Type", property_type_options)
        tenure = st.selectbox("Tenure", tenure_options)
        confidence = st.selectbox("Confidence Level", ["LOW", "MEDIUM", "HIGH"])

    if st.button("Predict Business Price"):
        predicted_price, median_price, comps = nearest_comparable_price(
            df, bedrooms, bathrooms, living_rooms, floor_area, latitude, longitude, property_type, tenure, confidence
        )

        if predicted_price is None:
            st.warning("Unable to generate a prediction from comparable properties.")
            return

        c1, c2, c3 = st.columns(3)
        c1.metric("Predicted Price", format_currency(predicted_price))
        c2.metric("Median Comparable Price", format_currency(median_price))
        c3.metric("Comparable Properties Used", f"{len(comps)}")

        status = get_market_status(predicted_price, median_price)
        st.markdown(f"<div class='glass-card'><div class='card-title'>Smart Insight</div><div class='card-text'>{status}</div></div>", unsafe_allow_html=True)

        st.markdown("<div class='section-title'>What affects price most?</div>", unsafe_allow_html=True)
        a, b, c = st.columns(3)
        with a:
            st.markdown("<div class='highlight-box'><b>📐 Area</b><br/>Larger floor area is one of the strongest drivers of property price.</div>", unsafe_allow_html=True)
        with b:
            st.markdown("<div class='highlight-box'><b>📍 Location</b><br/>Latitude and longitude strongly influence value through neighborhood differences.</div>", unsafe_allow_html=True)
        with c:
            st.markdown("<div class='highlight-box'><b>🛏️ Structure</b><br/>Bedrooms, bathrooms, and living rooms affect utility and market demand.</div>", unsafe_allow_html=True)

        st.markdown("<div class='section-title'>Nearest Comparable Properties</div>", unsafe_allow_html=True)
        comp_cols = [c for c in ["saleEstimate_currentPrice", "floorAreaSqM", "bedrooms", "bathrooms", "livingRooms", "latitude", "longitude"] if c in comps.columns]
        st.dataframe(comps[comp_cols].head(10), use_container_width=True)

def page_clean_model():
    st.markdown("<div class='section-title'>🧠 Clean Model</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>This page presents the academic, leakage-free model perspective.</div>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        st.markdown("<div class='glass-card'><div class='card-title'>Why is it clean?</div><div class='card-text'>The clean model excludes target-derived leakage features and focuses on realistic structural and location-based attributes.</div></div>", unsafe_allow_html=True)
    with col2:
        st.markdown("<div class='glass-card'><div class='card-title'>Observed Performance</div><div class='card-text'>Real MAE ≈ <b>15,404</b><br/>Log MAE ≈ <b>0.024</b><br/><br/>This is a strong and realistic result for a clean property pricing model.</div></div>", unsafe_allow_html=True)

def page_investment_advisor():
    st.markdown("<div class='section-title'>💰 Investment Advisor</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>Find the best properties and areas inside your budget, then explore them on a full interactive map.</div>", unsafe_allow_html=True)

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
        recommendations = recommend_properties(df, budget, min_bedrooms, min_bathrooms, min_area, top_n=10)
        best_areas = recommend_areas(df, budget=budget, top_n=5)

        if recommendations.empty:
            st.warning("No recommended properties found for the selected filters.")
            return

        st.markdown("<div class='section-title'>Top Recommended Properties</div>", unsafe_allow_html=True)
        display_cols = [col for col in ["saleEstimate_currentPrice", "ROI", "growth_rate", "floorAreaSqM", "bedrooms", "bathrooms", "latitude", "longitude"] if col in recommendations.columns]
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

        st.markdown("<div class='section-title'>Why were these properties recommended?</div>", unsafe_allow_html=True)
        x, y, z = st.columns(3)
        with x:
            st.markdown("<div class='highlight-box'><b>💸 Budget Fit</b><br/>Each property falls within the selected budget and minimum structural requirements.</div>", unsafe_allow_html=True)
        with y:
            st.markdown("<div class='highlight-box'><b>📈 Growth Potential</b><br/>Higher growth rate may indicate better long-term appreciation.</div>", unsafe_allow_html=True)
        with z:
            st.markdown("<div class='highlight-box'><b>🏘️ Value for Money</b><br/>Lower price per sqm and stronger ROI improve recommendation quality.</div>", unsafe_allow_html=True)

        st.markdown("<div class='section-title'>🗺️ Recommended Properties Map</div>", unsafe_allow_html=True)
        map_cols = [col for col in ["latitude", "longitude", "saleEstimate_currentPrice", "ROI", "growth_rate", "floorAreaSqM"] if col in recommendations.columns]
        map_data = recommendations[map_cols].dropna().drop_duplicates()
        render_recommendation_map(map_data, full_height=620)

def page_analytics_dashboard():
    st.markdown("<div class='section-title'>📊 Analytics Dashboard</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-sub'>Explore the dataset through professional dark-mode visual analytics.</div>", unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)
    mean_price = df["saleEstimate_currentPrice"].mean() if "saleEstimate_currentPrice" in df.columns else 0
    mean_roi = df["ROI"].mean() if "ROI" in df.columns else 0
    mean_growth = df["growth_rate"].mean() if "growth_rate" in df.columns else 0

    col1.metric("Average Price", format_currency(mean_price))
    col2.metric("Average ROI", f"{mean_roi:.4f}")
    col3.metric("Average Growth", f"{mean_growth:.2f}%")

    st.markdown("<hr class='soft-divider'>", unsafe_allow_html=True)

    section = st.radio(
        "Analysis Sections",
        [
            "Price Distribution",
            "Price vs Area",
            "Bedrooms vs Price",
            "Property Types",
            "Tenure Distribution",
            "Market Map",
            "Dataset Preview",
        ],
        horizontal=True,
    )

    if section == "Price Distribution":
        st.markdown("<div class='section-title'>Price Distribution</div>", unsafe_allow_html=True)
        plot_histogram(df["saleEstimate_currentPrice"], "Distribution of Property Prices", bins=50)
        st.markdown("<div class='highlight-box'><b>Insight:</b> Prices are right-skewed, meaning most properties are in the low-to-mid range while fewer high-end listings stretch the market tail.</div>", unsafe_allow_html=True)

    elif section == "Price vs Area":
        st.markdown("<div class='section-title'>Price vs Area</div>", unsafe_allow_html=True)
        plot_scatter(df, "floorAreaSqM", "saleEstimate_currentPrice", "Price vs Area")
        st.markdown("<div class='highlight-box'><b>Insight:</b> Area is one of the strongest pricing drivers. Larger properties tend to command noticeably higher prices.</div>", unsafe_allow_html=True)

    elif section == "Bedrooms vs Price":
        st.markdown("<div class='section-title'>Bedrooms vs Price</div>", unsafe_allow_html=True)
        plot_box_by_category(df, "bedrooms", "saleEstimate_currentPrice", "Price by Number of Bedrooms")
        st.markdown("<div class='highlight-box'><b>Insight:</b> More bedrooms generally increase price, but overlap shows that area and location still matter heavily.</div>", unsafe_allow_html=True)

    elif section == "Property Types":
        st.markdown("<div class='section-title'>Top Property Types</div>", unsafe_allow_html=True)
        if "propertyType" in df.columns:
            plot_bar_counts(df["propertyType"], "Top Property Types", top_n=10)
            st.markdown("<div class='highlight-box'><b>Insight:</b> Property type affects expectations for both price and investment appeal.</div>", unsafe_allow_html=True)
        else:
            st.info("propertyType column is not available.")

    elif section == "Tenure Distribution":
        st.markdown("<div class='section-title'>Tenure Distribution</div>", unsafe_allow_html=True)
        if "tenure" in df.columns:
            plot_bar_counts(df["tenure"], "Tenure Distribution", top_n=10)
            st.markdown("<div class='highlight-box'><b>Insight:</b> Tenure can influence long-term value, legal flexibility, and buyer preference.</div>", unsafe_allow_html=True)
        else:
            st.info("tenure column is not available.")

    elif section == "Market Map":
        st.markdown("<div class='section-title'>Full Market Map</div>", unsafe_allow_html=True)
        st.markdown("<div class='section-sub'>Interactive density map for the broader market.</div>", unsafe_allow_html=True)

        map_sample_size = st.slider(
            "Map sample size",
            min_value=1000,
            max_value=min(15000, len(df)),
            value=min(7000, len(df)),
            step=500,
        )

        cols = [c for c in ["latitude", "longitude", "saleEstimate_currentPrice", "ROI", "growth_rate", "floorAreaSqM"] if c in df.columns]
        map_df = df[cols].dropna().sample(map_sample_size, random_state=42)
        render_market_map(map_df, full_height=720)

    elif section == "Dataset Preview":
        st.markdown("<div class='section-title'>Dataset Preview</div>", unsafe_allow_html=True)
        preview_n = st.slider("Rows to preview", 5, 50, 10, 5)
        st.dataframe(df.head(preview_n), use_container_width=True)

    st.markdown("<div class='section-title'>Main Factors Affecting Price</div>", unsafe_allow_html=True)
    f1, f2, f3, f4 = st.columns(4)
    with f1:
        st.markdown("<div class='highlight-box'><b>📐 Floor Area</b><br/>Usually the strongest numerical predictor of price.</div>", unsafe_allow_html=True)
    with f2:
        st.markdown("<div class='highlight-box'><b>📍 Location</b><br/>Neighborhood position changes demand and market value.</div>", unsafe_allow_html=True)
    with f3:
        st.markdown("<div class='highlight-box'><b>🛏️ Rooms</b><br/>Bedrooms, bathrooms, and living rooms affect usability and demand.</div>", unsafe_allow_html=True)
    with f4:
        st.markdown("<div class='highlight-box'><b>📈 Market Signals</b><br/>Growth rate, ROI, and price efficiency shape investor decisions.</div>", unsafe_allow_html=True)

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
            • Business-Oriented Market Prediction<br/>
            • Property & Area Recommendation System<br/>
            • Interactive Market and Recommendation Maps
        </div>
    </div>
    """, unsafe_allow_html=True)

# =========================================================
# ROUTER
# =========================================================
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

render_footer()