import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Users, CheckCircle2, AlertCircle, Hospital, DollarSign,
  ChevronUp, ChevronDown, ChevronRight, ArrowUpRight,
  Star, Filter, Download
} from "lucide-react";

const C = {
  indigo: "#4f46e5",
  indigoLight: "#eef2ff",
  indigoMid: "#818cf8",
  slate900: "#0f172a",
  slate500: "#64748b",
  slate300: "#cbd5e1",
  slate100: "#f1f5f9",
  white: "#ffffff",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#7c3aed",
};

function StatCard({ label, value, icon: Icon, change, changeUp, color }) {
  const colors = {
    indigo:  { bg: C.indigoLight, icon: C.indigo,   border: "rgba(79,70,229,0.15)"  },
    emerald: { bg: "#d1fae5",     icon: C.emerald,  border: "rgba(16,185,129,0.15)" },
    amber:   { bg: "#fef3c7",     icon: C.amber,    border: "rgba(245,158,11,0.15)" },
    rose:    { bg: "#ffe4e6",     icon: C.rose,     border: "rgba(244,63,94,0.15)"  },
    violet:  { bg: "#ede9fe",     icon: C.violet,   border: "rgba(124,58,237,0.15)" },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div style={{
      background: C.white, borderRadius: 16, padding: "20px 22px",
      border: `1px solid ${c.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(79,70,229,0.04)",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: c.bg, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon size={20} color={c.icon} strokeWidth={1.8} />
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: 11, fontWeight: 600,
          color: changeUp ? C.emerald : C.rose,
          background: changeUp ? "#d1fae5" : "#ffe4e6",
          padding: "3px 8px", borderRadius: 999,
        }}>
          {changeUp ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {change}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.slate900, fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: C.slate500, marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    "In Review": { bg: "#fef3c7", color: "#d97706" },
    "Completed": { bg: "#d1fae5", color: "#059669" },
    "Pending":   { bg: "#ede9fe", color: "#7c3aed" },
    "Urgent":    { bg: "#ffe4e6", color: "#e11d48" },
  };
  const s = map[status] || map["Pending"];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
      background: s.bg, color: s.color, letterSpacing: ".03em", whiteSpace: "nowrap"
    }}>{status}</span>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const revenueChart = {
    series: [{ name: "Revenue", data: [42, 58, 51, 67, 82, 74, 93, 88, 105, 118, 112, 134] }],
    options: {
      chart: { type: "area", toolbar: { show: false }, fontFamily: "DM Sans,sans-serif" },
      colors: [C.indigo],
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] } },
      stroke: { curve: "smooth", width: 2.5 },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { fontSize: "11px", colors: C.slate500 } },
      },
      yaxis: { labels: { formatter: v => `$${v}k`, style: { fontSize: "11px", colors: C.slate500 } } },
      grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
      tooltip: { theme: "light", y: { formatter: v => `$${v},000` } },
    },
  };

  const casesDonut = {
    series: [46, 30, 14, 10],
    options: {
      chart: { type: "donut", fontFamily: "DM Sans,sans-serif" },
      colors: [C.indigo, C.emerald, C.amber, C.rose],
      labels: ["Cardiology", "Oncology", "Neurology", "Other"],
      legend: { position: "bottom", fontSize: "12px", fontFamily: "DM Sans,sans-serif" },
      plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Cases", fontSize: "13px", color: C.slate500, fontFamily: "DM Sans,sans-serif", formatter: () => "324" } } } } },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      tooltip: { theme: "light" },
    },
  };

  const bookingsBar = {
    series: [
      { name: "Bookings",  data: [18, 27, 22, 35, 29, 40, 33] },
      { name: "Completed", data: [14, 21, 18, 29, 25, 36, 30] },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false }, fontFamily: "DM Sans,sans-serif" },
      colors: [C.indigo, C.emerald],
      plotOptions: { bar: { borderRadius: 6, columnWidth: "55%", borderRadiusApplication: "end" } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { fontSize: "11px", colors: C.slate500 } },
      },
      yaxis: { labels: { style: { fontSize: "11px", colors: C.slate500 } } },
      grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
      legend: { position: "top", horizontalAlign: "right", fontSize: "12px", fontFamily: "DM Sans,sans-serif" },
      tooltip: { theme: "light" },
    },
  };

  const hospitalRadial = {
    series: [78, 62, 91, 55],
    options: {
      chart: { type: "radialBar", fontFamily: "DM Sans,sans-serif" },
      colors: [C.indigo, C.violet, C.emerald, C.amber],
      labels: ["Mayo Clinic", "Johns Hopkins", "Cleveland", "Stanford"],
      plotOptions: {
        radialBar: {
          startAngle: -90, endAngle: 90,
          hollow: { size: "28%" },
          track: { background: "#f1f5f9" },
          dataLabels: { name: { fontSize: "11px" }, value: { fontSize: "13px", fontWeight: 700 } },
        },
      },
      legend: { show: true, position: "bottom", fontSize: "11px", fontFamily: "DM Sans,sans-serif" },
    },
  };

  const recentCases = [
    { id: "#10451", type: "Cardiology Review",        doctor: "Dr. Sarah Johnson", time: "2h ago",  status: "In Review", avatar: "SJ" },
    { id: "#10452", type: "Oncology Second Opinion",  doctor: "Dr. Raj Patel",     time: "4h ago",  status: "Completed", avatar: "RP" },
    { id: "#10453", type: "Neurology Consultation",   doctor: "Dr. Liu Wei",       time: "5h ago",  status: "Pending",   avatar: "LW" },
    { id: "#10454", type: "Orthopedics Review",       doctor: "Dr. Maria Santos",  time: "7h ago",  status: "Urgent",    avatar: "MS" },
    { id: "#10455", type: "Radiology Analysis",       doctor: "Dr. Tom Harrison",  time: "9h ago",  status: "In Review", avatar: "TH" },
  ];

  const hospitals = [
    { name: "Mayo Clinic",      cases: 89, rev: "$124k", rating: 4.9 },
    { name: "Johns Hopkins",    cases: 72, rev: "$98k",  rating: 4.8 },
    { name: "Cleveland Clinic", cases: 61, rev: "$87k",  rating: 4.9 },
    { name: "Stanford Medical", cases: 54, rev: "$76k",  rating: 4.7 },
  ];

  const card = (children, style = {}) => (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.slate100}`, ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ background: "#f8f9fc", minHeight: "100vh", padding: "28px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: C.slate900, margin: 0 }}>
            Overview
          </h1>
          <p style={{ fontSize: 13, color: C.slate500, marginTop: 4 }}>
            Here's what's happening with MedExpert today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.slate300}`,
            background: C.white, fontSize: 12, fontWeight: 600, color: C.slate500, cursor: "pointer"
          }}>
            <Filter size={13} /> Filter
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10, border: "none",
            background: C.indigo, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer"
          }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Revenue"       value="$1.24M" icon={DollarSign}   change="+18.2%" changeUp color="indigo"  />
        <StatCard label="Active Patients"      value="3,842"  icon={Users}        change="+9.4%"  changeUp color="emerald" />
        <StatCard label="Pending Cases"        value="127"    icon={AlertCircle}  change="+4.1%"  changeUp={false} color="amber" />
        <StatCard label="Completed Opinions"   value="2,189"  icon={CheckCircle2} change="+22.7%" changeUp color="violet" />
        <StatCard label="Partner Hospitals"    value="512"    icon={Hospital}     change="+6.3%"  changeUp color="rose"   />
      </div>

      {/* Revenue + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        {card(
          <>
            <div style={{ padding: "20px 24px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>Revenue Overview</h2>
                <p style={{ fontSize: 12, color: C.slate500, margin: "3px 0 0" }}>Monthly revenue from second opinion services</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["1M","6M","1Y"].map((t, i) => (
                  <button key={t} style={{
                    padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: i === 2 ? C.indigoLight : "transparent",
                    color: i === 2 ? C.indigo : C.slate500,
                    border: i === 2 ? `1px solid rgba(79,70,229,0.2)` : "1px solid transparent",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            {mounted && <ReactApexChart options={revenueChart.options} series={revenueChart.series} type="area" height={220} />}
          </>
        )}
        {card(
          <>
            <div style={{ padding: "20px 24px 4px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>Cases by Specialty</h2>
              <p style={{ fontSize: 12, color: C.slate500, margin: "3px 0 0" }}>Distribution this quarter</p>
            </div>
            {mounted && <ReactApexChart options={casesDonut.options} series={casesDonut.series} type="donut" height={248} />}
          </>
        )}
      </div>

      {/* Bookings + Radial */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {card(
          <>
            <div style={{ padding: "20px 24px 4px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>Weekly Bookings</h2>
              <p style={{ fontSize: 12, color: C.slate500, margin: "3px 0 0" }}>Consultations booked vs completed</p>
            </div>
            {mounted && <ReactApexChart options={bookingsBar.options} series={bookingsBar.series} type="bar" height={210} />}
          </>
        )}
        {card(
          <>
            <div style={{ padding: "20px 24px 4px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>Hospital Performance</h2>
              <p style={{ fontSize: 12, color: C.slate500, margin: "3px 0 0" }}>Case completion rate by partner</p>
            </div>
            {mounted && <ReactApexChart options={hospitalRadial.options} series={hospitalRadial.series} type="radialBar" height={210} />}
          </>
        )}
      </div>

      {/* Recent Cases + Top Hospitals */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>

        {/* Recent cases */}
        {card(
          <>
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.slate100}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>Recent Cases</h2>
              <button style={{ fontSize: 12, color: C.indigo, fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                View all <ChevronRight size={12} />
              </button>
            </div>
            {recentCases.map((c, i) => (
              <div key={c.id} style={{
                padding: "13px 22px",
                borderBottom: i < recentCases.length - 1 ? `1px solid ${C.slate100}` : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: C.indigoLight, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: C.indigo, flexShrink: 0
                  }}>{c.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.slate900 }}>{c.type}</div>
                    <div style={{ fontSize: 11, color: C.slate500 }}>{c.id} · {c.doctor}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Badge status={c.status} />
                  <span style={{ fontSize: 11, color: C.slate500 }}>{c.time}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Top hospitals */}
        {card(
          <>
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.slate100}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.slate900, fontFamily: "'Sora',sans-serif", margin: 0 }}>Top Hospitals</h2>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: C.indigoLight, color: C.indigo }}>
                This Month
              </span>
            </div>
            {hospitals.map((h, i) => (
              <div key={h.name} style={{
                padding: "14px 22px",
                borderBottom: i < hospitals.length - 1 ? `1px solid ${C.slate100}` : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.indigoLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Hospital size={16} color={C.indigo} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.slate900 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: C.slate500, display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={10} color={C.amber} fill={C.amber} /> {h.rating}
                      <span style={{ color: C.slate300 }}>·</span>
                      {h.cases} cases
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.slate900 }}>{h.rev}</div>
                  <div style={{ fontSize: 10, color: C.emerald, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end" }}>
                    <ArrowUpRight size={10} /> +12%
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: "14px 22px" }}>
              <button style={{
                width: "100%", padding: "9px", borderRadius: 10,
                border: `1.5px dashed ${C.slate300}`, background: "transparent",
                fontSize: 12, fontWeight: 600, color: C.slate500, cursor: "pointer",
              }}>
                + Add Hospital Partner
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}