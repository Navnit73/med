import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Users, BedDouble, FlaskConical, IndianRupee, TrendingUp, TrendingDown, Award, Star } from 'lucide-react';

// ─── STAT CARDS ─────────────────────────────────────────────────────────────
const STATS = [
  {
    label: 'OPD Consultations',
    value: '312',
    delta: '+18',
    up: true,
    icon: Users,
    bg: 'bg-sky-50',
    icon_c: 'text-sky-600',
    val_c: 'text-sky-700',
    sub: 'patients today',
  },
  {
    label: 'IPD Conversions',
    value: '47',
    delta: '+5',
    up: true,
    icon: BedDouble,
    bg: 'bg-violet-50',
    icon_c: 'text-violet-600',
    val_c: 'text-violet-700',
    sub: '15.1% conversion rate',
  },
  {
    label: 'Tests Booked',
    value: '189',
    delta: '-12',
    up: false,
    icon: FlaskConical,
    bg: 'bg-amber-50',
    icon_c: 'text-amber-600',
    val_c: 'text-amber-700',
    sub: 'lab + radiology',
  },
  {
    label: 'Revenue Today',
    value: '₹2.4L',
    delta: '+₹0.3L',
    up: true,
    icon: IndianRupee,
    bg: 'bg-emerald-50',
    icon_c: 'text-emerald-600',
    val_c: 'text-emerald-700',
    sub: 'vs ₹2.1L yesterday',
  },
];

// ─── ADMISSION TREND ─────────────────────────────────────────────────────────
const admissionSeries = [
  { name: 'OPD', data: [210, 240, 195, 280, 260, 310, 295, 320, 312, 340, 318, 305] },
  { name: 'IPD', data: [32, 38, 28, 44, 40, 47, 43, 51, 47, 54, 49, 46] },
];
const admissionOptions = {
  chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: ['#0ea5e9', '#8b5cf6'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.18, opacityTo: 0.01, stops: [0, 100] },
  },
  markers: { size: 0, hover: { size: 5 } },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
  },
  yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, xaxis: { lines: { show: false } } },
  legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: { colors: '#64748b' } },
  tooltip: {
    theme: 'light',
    y: { formatter: v => `${v} patients` },
    style: { fontSize: '12px' },
  },
  dataLabels: { enabled: false },
};

// ─── DOCTOR PATIENT DISTRIBUTION ─────────────────────────────────────────────
const DOCTORS = [
  { name: 'Dr. Sharma',    dept: 'Cardiology',  patients: 58, color: '#6366f1' },
  { name: 'Dr. Mehta',     dept: 'Neurology',   patients: 44, color: '#0ea5e9' },
  { name: 'Dr. Kapoor',    dept: 'Orthopedics', patients: 39, color: '#f59e0b' },
  { name: 'Dr. Verma',     dept: 'Pediatrics',  patients: 35, color: '#ec4899' },
  { name: 'Dr. Gupta',     dept: 'ICU',         patients: 52, color: '#ef4444' },
  { name: 'Dr. Iyer',      dept: 'Radiology',   patients: 28, color: '#10b981' },
  { name: 'Dr. Singh',     dept: 'Gynecology',  patients: 46, color: '#8b5cf6' },
];

const doctorSeries = DOCTORS.map(d => d.patients);
const doctorColors = DOCTORS.map(d => d.color);
const TOTAL_PATIENTS = DOCTORS.reduce((a, d) => a + d.patients, 0);

const doctorDonutOptions = {
  chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
  labels: DOCTORS.map(d => d.name),
  colors: doctorColors,
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Patients',
            fontSize: '10px',
            fontWeight: 500,
            color: '#94a3b8',
            formatter: () => String(TOTAL_PATIENTS),
          },
          value: { fontSize: '22px', fontWeight: 700, color: '#0f172a', offsetY: 4 },
        },
      },
    },
  },
  stroke: { width: 0 },
  tooltip: { y: { formatter: v => `${v} patients` } },
};

// ─── TOP DOCTORS BAR ─────────────────────────────────────────────────────────
const TOP_DOCTORS = [...DOCTORS].sort((a, b) => b.patients - a.patients).slice(0, 5);
const topDoctorSeries = [{ name: 'Patients', data: TOP_DOCTORS.map(d => d.patients) }];
const topDoctorOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  plotOptions: {
    bar: { borderRadius: 6, borderRadiusApplication: 'end', horizontal: true, barHeight: '55%', distributed: true },
  },
  colors: TOP_DOCTORS.map(d => d.color),
  xaxis: {
    categories: TOP_DOCTORS.map(d => d.name),
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: '#1e293b', fontSize: '12px', fontWeight: 500 } } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, yaxis: { lines: { show: false } } },
  legend: { show: false },
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    formatter: v => `${v} pts`,
    offsetX: 6,
    style: { fontSize: '11px', fontWeight: 500, colors: ['#64748b'] },
  },
  tooltip: { theme: 'light', y: { formatter: v => `${v} patients` }, style: { fontSize: '12px' } },
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const PERIODS = ['1W', '1M', '3M', 'YTD'];

export default function DashboardTab() {
  const [activePeriod, setActivePeriod] = useState(1);

  return (
    <div className="space-y-5">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, delta, up, icon: Icon, bg, icon_c, val_c, sub }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 truncate">{label}</p>
              <p className={`text-2xl font-bold ${val_c}`}>{value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {delta}
                <span className="text-slate-400 font-normal ml-0.5">vs yesterday</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${bg} ${icon_c} flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5" strokeWidth={1.8} />
            </div>
          </div>
        ))}
      </div>

      {/* ── OPD vs IPD Trend ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">OPD → IPD Trends</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monthly consultations & admissions</p>
          </div>
          <div className="flex items-center gap-1.5">
            {PERIODS.map((p, i) => (
              <button
                key={p}
                onClick={() => setActivePeriod(i)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  activePeriod === i ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >{p}</button>
            ))}
          </div>
        </div>
        <ReactApexChart type="area" series={admissionSeries} options={admissionOptions} height={220} />
      </div>

      {/* ── Doctor Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Doctor Patient Distribution Donut — 2/5 */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 flex flex-col">
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-slate-800">Patient Distribution by Doctor</h2>
            <p className="text-xs text-slate-400 mt-0.5">OPD share per consultant today</p>
          </div>
          <div className="flex items-center justify-center py-1">
            <ReactApexChart type="donut" series={doctorSeries} options={doctorDonutOptions} height={200} width={200} />
          </div>
          <div className="mt-3 space-y-1.5">
            {DOCTORS.map((doc) => (
              <div key={doc.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: doc.color }} />
                <span className="text-xs text-slate-600 flex-1 truncate">{doc.name}</span>
                <span className="text-xs text-slate-400 truncate">{doc.dept}</span>
                <span className="text-xs font-semibold text-slate-700 ml-1 w-6 text-right">{doc.patients}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors Bar — 3/5 */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Top Doctors
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by patient load today</p>
            </div>
          </div>
          <ReactApexChart type="bar" series={topDoctorSeries} options={topDoctorOptions} height={220} />

          {/* Top performer badge */}
          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-500 shrink-0" fill="#f59e0b" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Top Performer — {TOP_DOCTORS[0].name}</p>
              <p className="text-[11px] text-amber-600 mt-0.5">{TOP_DOCTORS[0].dept} · {TOP_DOCTORS[0].patients} patients today</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}