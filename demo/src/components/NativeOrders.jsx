import { useDemoI18n } from '../i18n.jsx';
import React, { useState } from 'react';
import { HOURS, ORDER_TEMPLATES } from '../demo-state.js';
import { Icon } from './NativeChrome.jsx';
const aliases = { saline: 'натрий натрия хлорид физраствор nacl раствор', ceftriaxone: 'цефтриаксон ceftriaxone', omeprazole: 'омепразол omeprazole', enteral: 'питание энтеральное', water: 'питьё вода', monitoring: 'контроль температура показатели', custom: 'ручной ввод' };
export default function NativeOrders({ patient, role, selectedOrderId, onSelect, onAdd, onMark, onSchedule, time }) {
    const { t, tr } = useDemoI18n();
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const matches = ORDER_TEMPLATES.filter((template) => [template.id, template.name, tr(template.name), template.description, tr(template.description), aliases[template.id] || '', tr(aliases[template.id] || '')].join(' ').toLowerCase().includes(search.toLowerCase()));
    function choose(template) { setSearch(''); setFocused(false); onAdd(template); }
    return <section className="orders-workspace" aria-label={t("Назначения на смену")}>
    {role === 'doctor' && <div className="prescription-search"><input placeholder={t("Введите препарат...")} aria-label={t("Введите препарат")} autoComplete="off" value={search} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 120)} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && search && matches[0]) {
        event.preventDefault();
        choose(matches[0]);
    } if (event.key === 'Escape') {
        setFocused(false);
    } }}/>{focused && search && <div className="prescription-results" role="listbox" aria-label={t("Препараты")}>{matches.map((template) => <button key={template.id} role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(template)}>{tr(template.name)} <span>({t(template.type === 'infusion' ? 'инфузия' : template.type === 'drug' ? 'болюс' : template.description)})</span></button>)}{matches.length === 0 && <span className="no-results">{t("Нет совпадений. Для произвольного назначения введите «ручной».")}</span>}</div>}</div>}
    <div className="native-table-scroll"><table className="native-orders-table"><colgroup><col className="prescription-column"/>{HOURS.map((hour) => <col key={hour}/>)}</colgroup><thead><tr><th scope="col">{t("Назначение")}</th>{HOURS.map((hour) => <th scope="col" key={hour}>{hour}</th>)}</tr></thead><tbody>{patient.orders.map((order) => <tr key={order.id} className={order.id === selectedOrderId ? 'selected-native-row' : ''}><th scope="row" onClick={() => onSelect(order.id)}><button className="order-name-button" onClick={() => onSelect(order.id)}>{order.customName ? order.name : tr(order.name)}</button><span className="native-order-description">{order.description.startsWith('S.') ? '' : 'S. '}{tr(order.description)}{t(order.volume > 0 ? ` · ${order.volume} мл` : '')}</span></th>{HOURS.map((hour, index) => {
                const slot = order.slots.find((item) => item.time === hour);
                const statusText = slot?.status === 'done' ? 'Выполнено' : slot?.status === 'missed' ? 'Не выполнено' : 'Назначено';
                return <td key={hour} className={`${index > 0 && index % 6 === 0 ? 'six-hour-line' : ''} ${hour === time.slice(0, 2) ? 'now-column' : ''}`}><button className={`native-order-cell ${slot?.status || 'empty'}`} title={t(role === 'doctor' ? 'Нажмите, чтобы изменить время назначения' : slot ? 'ЛКМ — выполнено, ПКМ — не выполнено. Повтор — отмена отметки.' : '')} aria-label={t(`${order.customName ? order.name : tr(order.name)}, ${hour}:00, ${slot ? statusText : 'нет назначения'}`)} disabled={role === 'nurse' && !slot} onClick={() => role === 'doctor' ? onSchedule(order.id, hour) : onMark(order, slot, 'done')} onContextMenu={(event) => { event.preventDefault(); if (role === 'nurse' && slot)
                    onMark(order, slot, 'missed'); }}>{slot?.status === 'done' ? <Icon name="done" size={25}/> : slot?.status === 'missed' ? <Icon name="notdone" size={25}/> : slot ? <strong>X</strong> : null}</button></td>;
            })}</tr>)}</tbody></table>{patient.orders.length === 0 && <div className="native-empty">{t("Введите препарат в строке над таблицей, чтобы добавить назначение.")}</div>}</div>
    <div className="native-table-caption">{t(role === 'doctor' ? 'Введите препарат для добавления. Нажмите в ячейке часа, чтобы изменить расписание.' : 'Левая кнопка мыши — выполнено. Правая — не выполнено. Повторное нажатие снимает отметку.')}</div>
  </section>;
}
