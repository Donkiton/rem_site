import { useDemoI18n } from '../i18n.jsx';
import React, { useState } from 'react';
import { HOURS } from '../demo-state.js';
import { number } from '../format.js';
export function Icon({ name, size = 18, ...props }) {
    return <img className="native-icon" src={`./native/${name}.png`} width={size} height={size} alt="" aria-hidden="true" draggable="false" {...props}/>;
}
export function QtButton({ icon, children, className = '', ...props }) {
    return <button className={`qt-button ${className}`} {...props}>{icon && <Icon name={icon}/>}{children}</button>;
}
export function Sector({ title, children, className = '', ...props }) {
    const { tr } = useDemoI18n();
    return <section className={`sector ${className}`} {...props}>{title && <h2 className="sector-title">{tr(title)}</h2>}<div className="sector-body">{children}</div></section>;
}
export function TopToolbar({ role, onRoles, onPatients, onRefresh, onReset }) {
    const { t } = useDemoI18n();
    return <><div className="native-titlebar"><Icon name="remcardicon" size={22}/><strong>{t("РЕМКАРТА — ДЕМО")}</strong><span className="title-role">— {t(role === 'doctor' ? 'Врач' : 'Медсестра')}</span><span className="demo-title">{t("Демонстрационная база")}</span><button className="title-reset" onClick={onReset}>{t("Сбросить демо")}</button><button className="title-expand" aria-label={t("Развернуть демо на весь экран")} title={t("Развернуть на весь экран")} onClick={() => { if (document.fullscreenElement)
        document.exitFullscreen?.().catch(() => { });
    else
        document.documentElement.requestFullscreen?.().catch(() => { }); }}>□</button></div>
    <nav className="native-toolbar" aria-label={t("Главная панель")}><QtButton icon="reports" disabled title={t("Недоступно в демо")}>{t("Репорт")}</QtButton><QtButton icon="role" onClick={onRoles}>{t("Роли")}</QtButton><div className="toolbar-spacer"/><QtButton icon="add" disabled title={t("Недоступно в демо")}>{t("Добавить пациента")}</QtButton><QtButton onClick={onRefresh}><span className="refresh-icon" aria-hidden="true">⟳</span>{t("Обновить")}</QtButton><QtButton icon="archivepacient" disabled title={t("Недоступно в демо")}>{t("Архив")}</QtButton><QtButton icon="calc" disabled title={t("Недоступно в демо")}>{t("Расчёт")}</QtButton><QtButton icon="settings" disabled title={t("Недоступно в демо")}>{t("Настройки")}</QtButton><QtButton icon="back" onClick={onPatients}>{t("Назад")}</QtButton><QtButton icon="exit" disabled title={t("Закройте вкладку браузера, чтобы выйти")}>{t("Выход")}</QtButton></nav>
  </>;
}
export const VITALS = [
    { key: 'temperature', title: 'Температура (°C)', short: 'T', color: '#27ae60', bg: '#dafada', unit: '°C' },
    { key: 'systolic', title: 'АД (мм.рт.ст)', short: 'АД', color: '#e74c3c', bg: '#ffdada', unit: '' },
    { key: 'pulse', title: 'ЧСС (уд/мин)', short: 'ЧСС', color: '#0000ff', bg: '#dadaff', unit: '' },
    { key: 'respiratory', title: 'ЧДД (в мин)', short: 'ЧДД', color: '#e67e22', bg: '#fff0da', unit: '' },
    { key: 'spo2', title: 'SpO2 (%)', short: 'SpO₂', color: '#03a9f4', bg: '#e1f5fe', unit: '%' },
    { key: 'cvp', title: 'ЦВД (см.вод.ст)', short: 'ЦВД', color: '#ed5cf7', bg: '#f8c0fc', unit: '' },
];
export function PatientInfo({ patient, onPatients, onVitals }) {
    const { t, tr } = useDemoI18n();
    const vital = patient.vitals.at(-1);
    return <Sector title={t("Информация (доп)")} className="patient-info">
    <div className="patient-info-line"><span className="admission-status"><span />{t("В отделении (07:00)")}</span><strong className="history-number">№ {tr(patient.history)}</strong><strong className="native-patient-name">{tr(patient.name)}</strong><span>{t("Возраст: ")}{patient.age} {t(patient.age === 42 ? 'года' : 'лет')}</span><span>{t("Сутки: 1")}</span><span className="diagnosis">{t("Диагноз: ")}{tr(patient.diagnosis)}</span></div>
    <div className="patient-card-actions"><QtButton icon="loadcard" onClick={() => onVitals()}>{t("Показать карту")}</QtButton><QtButton disabled>{t("⇧ Вчерашняя карта")}</QtButton><QtButton icon="newcard" disabled>{t("Создать новую карту")}</QtButton><QtButton icon="nextcard" disabled>{t("План. карта")}</QtButton><QtButton icon="binder" onClick={onPatients}>{t("Список карт")}</QtButton><QtButton icon="sutki_print" disabled>{t("Отчёт за сутки")}</QtButton><QtButton icon="allprint" disabled>{t("Общий отчёт")}</QtButton><div className="vital-chips">{VITALS.map((metric) => <span key={metric.key} className="vital-chip" style={{ background: metric.bg, borderColor: metric.color }}>{tr(metric.short)}: {metric.key === 'systolic' ? `${vital.systolic}/${vital.diastolic}` : number(vital[metric.key])}{metric.unit}</span>)}</div></div>
  </Sector>;
}
export function TimePicker({ time, onChange }) {
    const { t, tr } = useDemoI18n();
    const [hour, minute] = time.split(':');
    const shiftTime = (offset) => { const total = (Number(hour) * 60 + Number(minute) + offset + 1440) % 1440; onChange(`${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`); };
    return <div className="time-picker"><label className="time-entry">{t("Время:")}<input type="time" aria-label={t("Время ввода данных")} value={time} onChange={(event) => onChange(event.target.value || '12:00')} required/></label><div className="time-shortcuts">{[['Сейчас', 0], ['-5 мин', -5], ['-30 мин', -30], ['-1 час', -60]].map(([label, offset]) => <button key={tr(label)} onClick={() => label === 'Сейчас' ? onChange('12:00') : shiftTime(offset)}>{tr(label)}</button>)}</div><div className="hours-picker">{HOURS.map((value) => <button key={value} onClick={() => onChange(`${value}:${minute}`)} className={value === hour ? 'chosen' : ''} aria-label={t(`Выбрать час ${value}`)}>{value}</button>)}</div><div className="minutes-picker">{Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, '0')).map((value) => <button key={value} className={value === minute ? 'chosen' : ''} onClick={() => onChange(`${hour}:${value}`)} aria-label={t(`Выбрать минуты ${value}`)}>{value}</button>)}</div></div>;
}
export function InputPanel({ time, onTime, patient, onSave, onUndo }) {
    const { t, tr } = useDemoI18n();
    const [values, setValues] = useState({ temperature: '', systolic: '', diastolic: '', pulse: '', respiratory: '', spo2: '', cvp: '' });
    const [error, setError] = useState('');
    const field = (key, placeholder, min, max, step = 1) => <input aria-label={t(placeholder)} placeholder={t(placeholder)} type="number" min={min} max={max} step={step} value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })}/>;
    function submit(event) {
        event.preventDefault();
        if (Object.values(values).every((value) => value === '')) {
            setError('Введите хотя бы один показатель.');
            return;
        }
        const next = { ...patient.vitals.at(-1), time };
        for (const [key, value] of Object.entries(values))
            if (value !== '')
                next[key] = Number(value);
        const result = onSave(next);
        if (result)
            setError(result);
        else {
            setError('');
            setValues({ temperature: '', systolic: '', diastolic: '', pulse: '', respiratory: '', spo2: '', cvp: '' });
        }
    }
    return <Sector title={t("Ввод данных")} className="input-panel"><TimePicker time={time} onChange={onTime}/><form onSubmit={submit}><label className="native-field"><span>{t("Темп:")}</span>{field('temperature', '36.6', 30, 43, 0.1)}</label><div className="native-field"><span>{t("АД:")}</span><div className="bp-inputs">{field('systolic', 'Сист', 70, 250)}{field('diastolic', 'Диаст', 40, 160)}</div></div><label className="native-field"><span>{t("Пульс:")}</span>{field('pulse', 'Пульс', 30, 220)}</label><label className="native-field"><span>{t("ЧДД:")}</span>{field('respiratory', 'в мин', 4, 80)}</label><label className="native-field"><span>SpO₂:</span>{field('spo2', '%', 50, 100)}</label><label className="native-field"><span>{t("ЦВД:")}</span>{field('cvp', 'см.вод.ст.', -10, 40)}</label>{error && <p role="alert" className="native-error">{tr(error)}</p>}<QtButton icon="add_vit" type="submit">{t("Добавить")}</QtButton><QtButton icon="otmena" type="button" onClick={onUndo}>{t("Отменить последнее")}</QtButton></form></Sector>;
}
export function UpcomingOrders({ patient, role, onSelect }) {
    const { t, tr } = useDemoI18n();
    const upcoming = patient.orders.flatMap((order) => order.slots.filter((slot) => slot.status === 'planned').map((slot) => ({ order, slot }))).sort((a, b) => ((Number(a.slot.time) + 16) % 24) - ((Number(b.slot.time) + 16) % 24));
    return <Sector title={t("Ближайшие назначения")} className="upcoming-panel"><div className="upcoming-scroll">{upcoming.map(({ order, slot }) => <button className="upcoming-card" key={`${order.id}-${slot.time}`} onClick={() => onSelect(order, slot)} title={t(role === 'nurse' ? 'Отметить выполнение' : 'Открыть назначение')}><div className="upcoming-time">{slot.time}:00<Icon name={Number(slot.time) < 12 && Number(slot.time) >= 8 ? 'time_error1' : 'time_error2'} size={30}/></div><div><strong>{order.customName ? order.name : tr(order.name)}</strong><span>{order.description.startsWith('S.') ? '' : 'S. '}{tr(order.description)}</span></div></button>)}{upcoming.length === 0 && <p className="empty-upcoming">{t("Ближайших назначений нет")}</p>}</div></Sector>;
}
