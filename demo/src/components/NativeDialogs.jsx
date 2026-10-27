import { useDemoI18n } from '../i18n.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { HOURS, ORDER_TEMPLATES } from '../demo-state.js';
import { Icon, QtButton } from './NativeChrome.jsx';
export function NativeDialog({ title, onClose, children, className = '' }) {
    const { t, tr } = useDemoI18n();
    const ref = useRef(null);
    useEffect(() => { const previous = document.activeElement; ref.current.showModal(); return () => previous?.focus(); }, []);
    return <dialog ref={ref} className={`native-dialog ${className}`} aria-labelledby="native-dialog-title" onCancel={onClose}><div className="native-dialog-titlebar"><Icon name="remcardicon" size={19}/><h2 id="native-dialog-title">{tr(title)}</h2><button aria-label={t("Закрыть диалог")} onClick={onClose}>×</button></div><div className="native-dialog-content">{children}</div></dialog>;
}
export function CharacteristicsDialog({ template, onClose, onSubmit }) {
    const { t, tr } = useDemoI18n();
    const [name, setName] = useState(template.name);
    const [nameEdited, setNameEdited] = useState(false);
    const [form, setForm] = useState(template.type === 'drug' ? 'Раствор для инъекций' : template.type === 'infusion' ? 'Раствор для инфузий' : 'Другое');
    const [route, setRoute] = useState(template.type === 'enteral' ? 'Через зонд' : template.type === 'oral' ? 'Перорально' : template.type === 'drug' ? 'В/в струйно' : 'В/в капельно');
    const [volume, setVolume] = useState(template.volume);
    const [duration, setDuration] = useState(template.type === 'infusion' ? '30 мин' : 'Болюс');
    const [diluent, setDiluent] = useState('Без растворителя');
    const [dose, setDose] = useState(template.id === 'ceftriaxone' ? 1 : template.id === 'omeprazole' ? 20 : template.volume || 1);
    const [unit, setUnit] = useState(template.id === 'ceftriaxone' ? 'г' : template.id === 'omeprazole' ? 'мг' : 'мл');
    const [times, setTimes] = useState(['12']);
    const [error, setError] = useState('');
    function updateDoseName(nextDose, nextUnit) {
        const base = template.id === 'ceftriaxone' ? 'S. Ceftriaxoni' : template.id === 'omeprazole' ? 'S. Omeprazoli' : null;
        if (base && !nameEdited)
            setName(`${base} ${nextDose} ${{ 'г': 'g', 'мг': 'mg', 'мкг': 'mcg', 'мл': 'ml', 'ЕД': 'IU', 'шт': 'шт' }[nextUnit]}`);
    }
    function submit(event) {
        event.preventDefault();
        const description = `${form}, ${dose} ${unit}, ${route.toLowerCase()}${duration === 'Болюс' ? '' : ` — ${duration}`}${diluent === 'Без растворителя' ? '' : `, ${diluent}`}`;
        const result = onSubmit({ templateId: template.id, name: name.trim(), customName: nameEdited, description, volume: template.volume === 0 ? 0 : Number(volume), time: times[0], times });
        if (result)
            setError(result);
    }
    return <NativeDialog title={t("Выберите характеристики препарата")} onClose={onClose} className="characteristics-dialog"><form onSubmit={submit} className="characteristics-form">
    <label>{t("Введите название препарата:")}<input required maxLength="150" value={nameEdited ? name : tr(name)} onChange={(event) => { setNameEdited(true); setName(event.target.value); }}/></label>
    <label>{t("Выберите форму препарата:")}<select value={form} onChange={(event) => setForm(event.target.value)}><option value="Раствор для инфузий">{t("Раствор для инфузий")}</option><option value="Раствор для инъекций">{t("Раствор для инъекций")}</option><option value="Таблетки">{t("Таблетки")}</option><option value="Другое">{t("Другое")}</option></select></label>
    <label>{t("Выберите путь введения:")}<select value={route} onChange={(event) => setRoute(event.target.value)}><option value="В/в капельно">{t("В/в капельно")}</option><option value="В/в струйно">{t("В/в струйно")}</option><option value="Перорально">{t("Перорально")}</option><option value="Через зонд">{t("Через зонд")}</option><option value="Наблюдение">{t("Наблюдение")}</option></select></label>
    <label>{t("Введите дозировку:")}<span className="native-inline-inputs"><input aria-label={t("Дозировка")} type="number" min="0" max="10000" step="0.1" required value={dose} onChange={(event) => { setDose(event.target.value); updateDoseName(event.target.value, unit); }}/><select aria-label={t("Единица дозировки")} value={unit} onChange={(event) => { setUnit(event.target.value); updateDoseName(dose, event.target.value); }}>{['мг', 'мкг', 'г', 'мл', 'ЕД', 'шт'].map((value) => <option key={value} value={value}>{t(value)}</option>)}</select></span></label>
    <label>{t("Длительность введения:")}<select value={duration} onChange={(event) => setDuration(event.target.value)}>{['Болюс', '5 мин', '15 мин', '30 мин', '60 мин', '120 мин', 'До конца суток'].map((value) => <option key={value} value={value}>{t(value)}</option>)}</select></label>
    <label>{t("Растворитель:")}<select value={diluent} onChange={(event) => setDiluent(event.target.value)}><option value="Без растворителя">{t("Без растворителя")}</option><option>S. NaCl 0,9%</option><option>S. Glucosae 5%</option></select></label>
    {template.volume > 0 && <label>{t("Объём введения, мл:")}<input aria-label={t("Объём введения, мл")} type="number" min="1" max="2000" step="1" required value={volume} onChange={(event) => setVolume(event.target.value)}/></label>}
    <fieldset className="native-schedule-picker"><legend>{t("Время выполнения")}</legend><div>{HOURS.map((hour) => <label key={hour}><input type="checkbox" checked={times.includes(hour)} onChange={() => setTimes(times.includes(hour) ? times.filter((value) => value !== hour) : HOURS.filter((value) => [...times, hour].includes(value)))}/>{hour}</label>)}</div></fieldset>
    {error && <p role="alert" className="native-error">{tr(error)}</p>}<div className="native-dialog-actions"><QtButton type="submit" className="default-button">{t("ОК")}</QtButton><QtButton type="button" onClick={onClose}>{t("Отмена")}</QtButton></div>
  </form></NativeDialog>;
}
export function RoleDialog({ role, onSelect, onClose }) {
    const { t, tr } = useDemoI18n();
    return <NativeDialog title={t("Выбор роли")} onClose={onClose} className="role-dialog"><h3>{t("Добро пожаловать")}</h3><p>{t("Выберите свою роль, чтобы продолжить работу.")}</p><div className="native-role-options">{[{ id: 'doctor', title: 'Врач', description: 'Ведение пациентов, назначения и реанимационная карта' }, { id: 'nurse', title: 'Медсестра', description: 'Выполнение назначений, мониторинг и учёт манипуляций' }].map((item) => <button key={item.id} onClick={() => onSelect(item.id)} className={role === item.id ? 'current' : ''} style={{ backgroundImage: "url('./native/unified_role_photos_light_v3.png')", backgroundPosition: item.id === 'doctor' ? 'left top' : 'right top' }}><strong>{tr(item.title)}</strong><span>{tr(item.description)}</span><span className="role-enter" aria-hidden="true">→</span></button>)}</div><p className="role-data-note">{t("Обе роли работают с одной учебной картой.")}</p></NativeDialog>;
}
export function PatientsDialog({ state, onSelect, onClose }) {
    const { t, tr } = useDemoI18n();
    return <NativeDialog title={t("Список карт пациентов")} onClose={onClose} className="patients-dialog"><table className="native-patient-table"><thead><tr><th>{t("Койка")}</th><th>{t("ФИО пациента")}</th><th>{t("Возраст")}</th><th>{t("№ истории")}</th></tr></thead><tbody>{state.patients.map((patient) => <tr key={patient.id} className={patient.id === state.patientId ? 'selected' : ''}><td>{patient.bed}</td><td><button onClick={() => onSelect(patient.id)}>{tr(patient.name)}</button></td><td>{patient.age}</td><td>{tr(patient.history)}</td></tr>)}</tbody></table><div className="native-dialog-actions"><QtButton onClick={onClose}>{t("Закрыть")}</QtButton></div></NativeDialog>;
}
export function StatusDialog({ order, time, onMark, onClose }) {
    const { t, tr } = useDemoI18n();
    return <NativeDialog title={t(`${time}:00 · Выполнение`)} onClose={onClose} className="status-dialog"><p>{order.customName ? order.name : tr(order.name)}</p><div className="native-status-actions"><button onClick={() => onMark('done')}><Icon name="done" size={40}/><span>{t("Выполнено")}</span></button><button onClick={() => onMark('missed')}><Icon name="notdone" size={40}/><span>{t("Не выполнено")}</span></button><QtButton onClick={() => onMark('planned')}>{t("Снять отметку")}</QtButton></div></NativeDialog>;
}
export function ConfirmDialog({ title, text, action, onClose, onConfirm }) {
    const { t, tr } = useDemoI18n();
    return <NativeDialog title={tr(title)} onClose={onClose} className="confirm-dialog"><p>{tr(text)}</p><div className="native-dialog-actions"><QtButton className="default-button" onClick={onConfirm}>{tr(action)}</QtButton><QtButton onClick={onClose}>{t("Отмена")}</QtButton></div></NativeDialog>;
}
export function TemplatesDialog({ onSelect, onClose }) {
    const { t, tr } = useDemoI18n();
    return <NativeDialog title={t("Шаблоны назначений")} onClose={onClose}><div className="native-template-list">{ORDER_TEMPLATES.map((template) => <button key={template.id} onClick={() => onSelect(template)}>{tr(template.name)}<small>{tr(template.description)}</small></button>)}</div></NativeDialog>;
}
export function HistoryDialog({ patient, onClose }) {
    const { t, tr } = useDemoI18n();
    return <NativeDialog title={t("Журнал изменений карты")} onClose={onClose} className="history-dialog"><table className="native-patient-table"><thead><tr><th>{t("Время")}</th><th>{t("Роль")}</th><th>{t("Действие")}</th></tr></thead><tbody>{patient.events.map((event) => <tr key={event.id}><td>{event.time}</td><td>{t(event.role === 'doctor' ? 'Врач' : 'Медсестра')}</td><td>{tr(event.title)}<small>{tr(event.description)}</small></td></tr>)}</tbody></table></NativeDialog>;
}
