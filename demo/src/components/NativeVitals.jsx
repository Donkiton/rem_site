import { useDemoI18n } from '../i18n.jsx';
import React, { useState } from 'react';
import { HOURS } from '../demo-state.js';
import { VITALS } from './NativeChrome.jsx';
import { number } from '../format.js';
function shiftHour(time) { const [hour, minute] = time.split(':').map(Number); return ((hour + 16) % 24) + minute / 60; }
export default function NativeVitals({ patient }) {
    const { t, tr } = useDemoI18n();
    const [hidden, setHidden] = useState([]);
    const width = 1200, height = 720, left = 36, top = 30, bottom = 12;
    const x = (time) => left + shiftHour(time) / 24 * (width - left - 6);
    const y = (value) => top + (260 - value) / 260 * (height - top - bottom);
    const points = (key) => patient.vitals.map((point) => `${x(point.time)},${y(point[key] ?? 0)}`).join(' ');
    const bpArea = `${points('systolic')} ${[...patient.vitals].reverse().map((point) => `${x(point.time)},${y(point.diastolic)}`).join(' ')}`;
    return <section className="native-vitals" aria-label={t("Витальные функции")}><div className="vitals-legend"><h2>{t("Показатели")}</h2>{VITALS.map((metric) => <button key={metric.key} style={{ background: metric.bg, borderLeftColor: metric.color }} aria-pressed={!hidden.includes(metric.key)} className={hidden.includes(metric.key) ? 'hidden-line' : ''} onClick={() => setHidden(hidden.includes(metric.key) ? hidden.filter((key) => key !== metric.key) : [...hidden, metric.key])}>{tr(metric.title)}</button>)}</div><div className="native-chart"><svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={t(`Витальные функции пациента ${tr(patient.name)}. ${patient.vitals.length} измерений. Пульс в последнем измерении ${patient.vitals.at(-1).pulse}.`)}>
      <rect width={width} height={height} fill="white"/>
      {Array.from({ length: 27 }, (_, index) => index * 10).map((value) => <g key={value}><line x1={left} y1={y(value)} x2={width} y2={y(value)} stroke={value % 50 === 0 ? '#888' : '#b6b6b6'} strokeWidth={0.65}/><text x={left - 5} y={y(value) + 4} textAnchor="end">{value || ''}</text></g>)}
      {HOURS.map((hour, index) => <g key={hour}><line x1={left + index / 24 * (width - left - 6)} y1={top} x2={left + index / 24 * (width - left - 6)} y2={height - bottom} stroke="#aaa" strokeWidth={0.65}/><text x={left + (index + .45) / 24 * (width - left - 6)} y={19} textAnchor="middle">{hour}:00</text></g>)}
      {!hidden.includes('systolic') && <><polygon points={bpArea} fill="#ffdada" opacity=".85"/><polyline points={points('diastolic')} fill="none" stroke="#e74c3c" strokeWidth="2" vectorEffect="non-scaling-stroke"/></>}
      {VITALS.filter((metric) => !hidden.includes(metric.key)).map((metric) => <polyline key={metric.key} points={points(metric.key)} fill="none" stroke={metric.color} strokeWidth={metric.key === 'pulse' ? 2.5 : 1.8} vectorEffect="non-scaling-stroke"/>)}
      {patient.vitals.map((vital) => <circle key={vital.time} cx={x(vital.time)} cy={y(vital.pulse)} r="3" fill="transparent"><title>{vital.time}{t(" · АД ")}{vital.systolic}/{vital.diastolic}{t(" · ЧСС ")}{vital.pulse} · SpO₂ {vital.spo2}% · T {number(vital.temperature)}°C</title></circle>)}
    </svg></div></section>;
}
