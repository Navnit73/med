import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Users, IndianRupee, Stethoscope, MapPin,
  ChevronUp, ChevronDown, Star, Filter, Download, Award, TrendingUp,
} from "lucide-react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  indigo:      "#4f46e5",
  indigoLight: "#eef2ff",
  indigoMid:   "#818cf8",
  emerald:     "#10b981",
  emeraldLight:"#d1fae5",
  amber:       "#f59e0b",
  amberLight:  "#fef3c7",
  rose:        "#f43f5e",
  roseLight:   "#ffe4e6",
  violet:      "#7c3aed",
  violetLight: "#ede9fe",
  sky:         "#0ea5e9",
  skyLight:    "#e0f2fe",
  slate900:    "#0f172a",
  slate700:    "#334155",
  slate500:    "#64748b",
  slate300:    "#cbd5e1",
  slate100:    "#f1f5f9",
  white:       "#ffffff",
  bg:          "#f8f9fc",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Patients",    value: "4,218",  change: "+12.4%", up: true,  icon: Users,        color: "indigo"  },
  { label: "Total Revenue",     value: "₹38.6L", change: "+18.2%", up: true,  icon: IndianRupee,  color: "emerald" },
  { label: "Top Specialty",     value: "Cardio", change: "146 pts",up: true,  icon: Stethoscope,  color: "violet"  },
  { label: "Active Regions",    value: "12",     change: "+3 new", up: true,  icon: MapPin,       color: "amber"   },
];

const SPECIALTY_SERIES = [146, 98, 87, 73, 61, 44];
const SPECIALTY_LABELS = ["Cardiology", "Orthopedics", "Neurology", "Oncology", "Pediatrics", "Radiology"];
const SPECIALTY_COLORS = [T.indigo, T.emerald, T.violet, T.rose, T.amber, T.sky];

const REGIONS = [
  { name: "Maharashtra",   patients: 940, revenue: "₹9.2L",  growth: "+14%" },
  { name: "Delhi NCR",     patients: 812, revenue: "₹8.1L",  growth: "+11%" },
  { name: "Karnataka",     patients: 674, revenue: "₹6.8L",  growth: "+19%" },
  { name: "Tamil Nadu",    patients: 531, revenue: "₹5.4L",  growth: "+8%"  },
  { name: "Gujarat",       patients: 445, revenue: "₹4.6L",  growth: "+16%" },
  { name: "West Bengal",   patients: 388, revenue: "₹3.9L",  growth: "+7%"  },
];

const TOP_DOCTORS = [
  { name: "Dr. Priya Sharma",  dept: "Cardiology",   patients: 148, rating: 4.9, tag: "indigo"  },
  { name: "Dr. Arjun Mehta",   dept: "Neurology",    patients: 124, rating: 4.8, tag: "violet"  },
  { name: "Dr. Kavya Iyer",    dept: "Orthopedics",  patients: 117, rating: 4.9, tag: "emerald" },
  { name: "Dr. Rohan Gupta",   dept: "Oncology",     patients: 103, rating: 4.7, tag: "rose"    },
  { name: "Dr. Meena Verma",   dept: "Pediatrics",   patients: 96,  rating: 4.8, tag: "amber"   },
];

// ─── CHART CONFIGS ───────────────────────────────────────────────────────────
const revenueChartConfig = {
  series: [
    { name: "OPD Revenue",  data: [18, 24, 19, 28, 34, 29, 38, 35, 42, 48, 44, 52] },
    { name: "IPD Revenue",  data: [12, 16, 14, 20, 24, 22, 28, 26, 30, 34, 32, 38] },
  ],
  options: {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "DM Sans,sans-serif", stacked: false },
    colors: [T.indigo, T.emerald],
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0.02, stops: [0, 100] } },
    stroke: { curve: "smooth", width: 2.5 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      axisBorder: { show: false }, axisTicks: { show: false },
      labels: { style: { fontSize: "11px", colors: T.slate500 } },
    },
    yaxis: { labels: { formatter: v => `₹${v}L`, style: { fontSize: "11px", colors: T.slate500 } } },
    grid: { borderColor: T.slate100, strokeDashArray: 4 },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px", fontFamily: "DM Sans,sans-serif", labels: { colors: T.slate700 } },
    tooltip: { theme: "light", y: { formatter: v => `₹${v} Lakh` } },
  },
};

const specialtyDonutConfig = {
  series: SPECIALTY_SERIES,
  options: {
    chart: { type: "donut", fontFamily: "DM Sans,sans-serif" },
    colors: SPECIALTY_COLORS,
    labels: SPECIALTY_LABELS,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true, label: "Total Cases",
              fontSize: "11px", fontWeight: 600, color: T.slate500,
              fontFamily: "DM Sans,sans-serif",
              formatter: () => "509",
            },
            value: { fontSize: "22px", fontWeight: 800, color: T.slate900, offsetY: 4, fontFamily: "'Sora',sans-serif" },
          },
        },
      },
    },
    tooltip: { theme: "light", y: { formatter: v => `${v} patients` } },
  },
};

const regionBarConfig = {
  series: [{ name: "Patients", data: REGIONS.map(r => r.patients) }],
  options: {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "DM Sans,sans-serif" },
    colors: REGIONS.map((_, i) => [T.indigo, T.emerald, T.violet, T.amber, T.rose, T.sky][i]),
    plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: "58%", distributed: true } },
    dataLabels: {
      enabled: true,
      formatter: v => `${v} pts`,
      offsetX: 6,
      style: { fontSize: "11px", fontWeight: 600, colors: [T.slate500] },
    },
    xaxis: {
      categories: REGIONS.map(r => r.name),
      labels: { style: { fontSize: "11px", colors: T.slate500 } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: "12px", colors: T.slate700, fontWeight: 500 } } },
    grid: { borderColor: T.slate100, strokeDashArray: 4, yaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: { theme: "light", y: { formatter: v => `${v} patients` } },
  },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const colorMap = {
  indigo:  { bg: T.indigoLight,   icon: T.indigo,   border: "rgba(79,70,229,0.12)"   },
  emerald: { bg: T.emeraldLight,  icon: T.emerald,  border: "rgba(16,185,129,0.12)"  },
  violet:  { bg: T.violetLight,   icon: T.violet,   border: "rgba(124,58,237,0.12)"  },
  amber:   { bg: T.amberLight,    icon: T.amber,    border: "rgba(245,158,11,0.12)"  },
  rose:    { bg: T.roseLight,     icon: T.rose,     border: "rgba(244,63,94,0.12)"   },
  sky:     { bg: T.skyLight,      icon: T.sky,      border: "rgba(14,165,233,0.12)"  },
};

function StatCard({ label, value, change, up, icon: Icon, color }) {
  const c = colorMap[color] || colorMap.indigo;
  return (
    <div style={{
      background: T.white, borderRadius: 16, padding: "20px 22px",
      border: `1px solid ${c.border}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(79,70,229,0.04)",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: c.bg, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={20} color={c.icon} strokeWidth={1.8} />
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: 11, fontWeight: 700,
          color: up ? T.emerald : T.rose,
          background: up ? T.emeraldLight : T.roseLight,
          padding: "3px 8px", borderRadius: 999,
        }}>
          {up ? <ChevronUp size={11} /> : <ChevronDown size={11} />} {change}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.slate900, fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: T.slate500, marginTop: 5, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.white, borderRadius: 16,
      border: `1px solid ${T.slate100}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, action }) {
  return (
    <div style={{
      padding: "18px 22px",
      borderBottom: `1px solid ${T.slate100}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: T.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>{title}</h2>
        {sub && <p style={{ fontSize: 11, color: T.slate500, margin: "3px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [activePeriod, setActivePeriod] = useState(2);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  return (
    <div >

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: T.indigo, textTransform: "uppercase", margin: 0 }}>
            Hospital Intelligence
          </p>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: T.slate900, margin: "4px 0 4px" }}>
            Overview Dashboard
          </h1>
          <p style={{ fontSize: 12, color: T.slate500, margin: 0 }}>Live metrics across patients, revenue, specialties &amp; regions</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            borderRadius: 10, border: `1px solid ${T.slate300}`,
            background: T.white, fontSize: 12, fontWeight: 600, color: T.slate500, cursor: "pointer",
          }}>
            <Filter size={13} /> Filter
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            borderRadius: 10, border: "none", background: T.indigo,
            fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer",
          }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Revenue + Specialty Donut ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>

        {/* Revenue area chart */}
        <Card>
          <CardHeader
            title="Revenue Trend"
            sub="OPD vs IPD monthly revenue (₹ Lakh)"
            action={
              <div style={{ display: "flex", gap: 6 }}>
                {["1M","6M","1Y"].map((p, i) => (
                  <button key={p} onClick={() => setActivePeriod(i)} style={{
                    padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: activePeriod === i ? T.indigoLight : "transparent",
                    color: activePeriod === i ? T.indigo : T.slate500,
                    border: activePeriod === i ? `1px solid rgba(79,70,229,0.2)` : "1px solid transparent",
                  }}>{p}</button>
                ))}
              </div>
            }
          />
          <div style={{ padding: "4px 8px 0" }}>
            {mounted && <ReactApexChart options={revenueChartConfig.options} series={revenueChartConfig.series} type="area" height={230} />}
          </div>
        </Card>

        {/* Specialty donut */}
        <Card>
          <CardHeader title="Specialty Breakdown" sub="Patient volume by department" />
          <div style={{ padding: "8px 16px 4px", display: "flex", justifyContent: "center" }}>
            {mounted && <ReactApexChart options={specialtyDonutConfig.options} series={specialtyDonutConfig.series} type="donut" height={200} width={200} />}
          </div>
          <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
            {SPECIALTY_LABELS.map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: SPECIALTY_COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: T.slate600 }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.slate700, marginLeft: "auto" }}>{SPECIALTY_SERIES[i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Region Map + Top Doctors ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Region-wise patients */}
        <Card>
          <CardHeader title="Region-wise Patients" sub="Top 6 states by patient volume" />
          <div style={{ padding: "8px 8px 0" }}>
            {mounted && <ReactApexChart options={regionBarConfig.options} series={regionBarConfig.series} type="bar" height={240} />}
          </div>
          <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 0" }}>
            {REGIONS.map((r, i) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderTop: `1px solid ${T.slate100}` }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: [T.indigo,T.emerald,T.violet,T.amber,T.rose,T.sky][i], flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.slate700 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: T.slate500 }}>{r.revenue} <span style={{ color: T.emerald, fontWeight: 600 }}>{r.growth}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Doctors */}
        <Card>
          <CardHeader
            title="Top Doctors"
            sub="Ranked by patient load this month"
            action={
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                background: T.indigoLight, color: T.indigo,
              }}>This Month</span>
            }
          />
          <div>
            {TOP_DOCTORS.map((doc, i) => {
              const c = colorMap[doc.tag] || colorMap.indigo;
              const isFirst = i === 0;
              return (
                <div key={doc.name} style={{
                  padding: "13px 20px",
                  borderBottom: i < TOP_DOCTORS.length - 1 ? `1px solid ${T.slate100}` : "none",
                  display: "flex", alignItems: "center", gap: 12,
                  background: isFirst ? `linear-gradient(90deg, ${T.indigoLight} 0%, transparent 100%)` : "transparent",
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 24, height: 24, borderRadius: 8,
                    background: isFirst ? T.indigo : T.slate100,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800,
                    color: isFirst ? T.white : T.slate500,
                    flexShrink: 0,
                  }}>
                    {isFirst ? <Award size={12} /> : i + 1}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: c.bg, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: c.icon, flexShrink: 0,
                  }}>
                    {doc.name.split(" ").slice(1).map(n => n[0]).join("").slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.slate900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: 11, color: T.slate500, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 999,
                        background: c.bg, color: c.icon,
                      }}>{doc.dept}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.slate900, fontFamily: "'Sora',sans-serif" }}>
                      {doc.patients}
                    </div>
                    <div style={{ fontSize: 10, color: T.slate500 }}>patients</div>
                    <div style={{ fontSize: 10, color: T.amber, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end", marginTop: 1 }}>
                      <Star size={9} fill={T.amber} /> {doc.rating}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Progress bars */}
            <div style={{ padding: "12px 20px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.slate500, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: ".06em" }}>
                <TrendingUp size={10} style={{ marginRight: 4 }} />Patient Load Share
              </p>
              {TOP_DOCTORS.map(doc => {
                const c = colorMap[doc.tag];
                const pct = Math.round((doc.patients / TOP_DOCTORS[0].patients) * 100);
                return (
                  <div key={doc.name} style={{ marginBottom: 7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: T.slate600, fontWeight: 500 }}>{doc.name.split(" ").slice(1).join(" ")}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.icon }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: T.slate100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: c.icon, borderRadius: 999, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}