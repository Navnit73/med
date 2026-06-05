import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Bed, UserPlus, Activity, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const STATS = [
  { label: 'Bed Occupancy',    value: '78%', delta: '+4%',  up: true,  icon: Bed,           bg: 'bg-blue-50',   icon_c: 'text-blue-600',   val_c: 'text-blue-700'   },
  { label: 'Active Doctors',   value: '64',  delta: '+2',   up: true,  icon: UserPlus,      bg: 'bg-emerald-50',icon_c: 'text-emerald-600', val_c: 'text-emerald-700'},
  { label: 'Admissions Today', value: '23',  delta: '-3',   up: false, icon: Activity,      bg: 'bg-violet-50', icon_c: 'text-violet-600',  val_c: 'text-violet-700' },
  { label: 'Emergency Cases',  value: '6',   delta: '+1',   up: false, icon: AlertTriangle, bg: 'bg-amber-50',  icon_c: 'text-amber-600',   val_c: 'text-amber-700'  },
];

const admissionSeries = [{
  name: 'Admissions',
  data: [14, 18, 12, 22, 17, 25, 20, 28, 23, 30, 26, 23],
}];

const admissionOptions = {
  chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false }, fontFamily: 'inherit', background: 'transparent' },
  stroke: { curve: 'smooth', width: 2.5, colors: ['#3b82f6'] },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100], colorStops: [{ offset: 0, color: '#3b82f6', opacity: 0.25 }, { offset: 100, color: '#3b82f6', opacity: 0.02 }] } },
  markers: { size: 0, hover: { size: 5, sizeOffset: 2 } },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
  },
  yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: v => v } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: {
    theme: 'light',
    x: { show: true },
    y: { formatter: v => `${v} patients` },
    style: { fontSize: '12px' },
    marker: { show: true, fillColors: ['#3b82f6'] },
  },
  dataLabels: { enabled: false },
};

const deptSeries = [{
  name: 'Performance Score',
  data: [90, 75, 82, 65, 88, 70],
}];

const deptOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
  plotOptions: {
    bar: {
      borderRadius: 6,
      borderRadiusApplication: 'end',
      columnWidth: '52%',
      distributed: true,
    },
  },
  colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#7c3aed', '#4f46e5', '#818cf8'],
  xaxis: {
    categories: ['Cardio', 'Neuro', 'Ortho', 'Peds', 'ICU', 'Radiol.'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
  },
  yaxis: {
    max: 100,
    labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: v => `${v}%` },
  },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, xaxis: { lines: { show: false } } },
  legend: { show: false },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'light',
    y: { formatter: v => `${v}%` },
    style: { fontSize: '12px' },
  },
};

const wardSeries = [44, 28, 18, 10];
const wardOptions = {
  chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
  labels: ['ICU', 'General', 'Cardio', 'Pediatrics'],
  colors: ['#ef4444', '#3b82f6', '#f59e0b', '#ec4899'],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Beds',
            fontSize: '11px',
            fontWeight: 500,
            color: '#94a3b8',
            formatter: () => '240',
          },
          value: { fontSize: '20px', fontWeight: 600, color: '#0f172a', offsetY: 4 },
        },
      },
    },
  },
  stroke: { width: 0 },
  tooltip: { y: { formatter: v => `${v} beds` } },
};

const WARD_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-amber-500', 'bg-pink-500'];
const WARD_LABELS = ['ICU', 'General', 'Cardio', 'Pediatrics'];

export default function DashboardTab() {
  return (
    <div className="space-y-5">

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, delta, up, icon: Icon, bg, icon_c, val_c }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
              <p className={`text-2xl font-semibold ${val_c}`}>{value}</p>
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {delta} <span className="text-slate-400 font-normal ml-0.5">vs yesterday</span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl ${bg} ${icon_c} flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5" strokeWidth={1.8} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Admission trend — 2/3 width */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 ">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Patient Admission Trends</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly admissions this year</p>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">2024</span>
          </div>
          <ReactApexChart
            type="area"
            series={admissionSeries}
            options={admissionOptions}
            height={220}
          />
        </div>

        {/* Ward occupancy donut — 1/3 width */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col">
          <div className="mb-1">
            <h2 className="text-sm font-semibold text-slate-800">Ward Occupancy</h2>
            <p className="text-xs text-slate-400 mt-0.5">Bed distribution by ward</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ReactApexChart
              type="donut"
              series={wardSeries}
              options={wardOptions}
              height={190}
              width={190}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {WARD_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${WARD_COLORS[i]}`} />
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-medium text-slate-700 ml-auto">{wardSeries[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 ">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Department Performance</h2>
            <p className="text-xs text-slate-400 mt-0.5">Efficiency score by department (%)</p>
          </div>
          <div className="flex items-center gap-1.5">
            {['1W', '1M', '3M', 'YTD'].map((p, i) => (
              <button key={p} className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                i === 1 ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}>{p}</button>
            ))}
          </div>
        </div>
        <ReactApexChart
          type="bar"
          series={deptSeries}
          options={deptOptions}
          height={220}
        />
      </div>

    </div>
  );
}