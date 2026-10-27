import { useDemoI18n } from '../i18n.jsx';
import React, { useState } from 'react';
import { getBalance, HOURS } from '../demo-state.js';
import { Icon, QtButton, Sector } from './NativeChrome.jsx';
import { number, signed } from '../format.js';
export const INPUT_CATEGORIES = [{ key: 'infusion', label: 'Инфузии', icon: 'balans_infuzia' }, { key: 'drug', label: 'Препараты', icon: 'balans_preparat' }, { key: 'blood', label: 'Кровь', icon: 'balans_blood' }, { key: 'plasma', label: 'Плазма', icon: 'balans_plasma' }, { key: 'oral', label: 'Перорально', icon: 'diet' }];
export const OUTPUT_CATEGORIES = [{ label: 'Диурез', icon: 'balans_diurez' }, { label: 'Дренажи', icon: 'balans_drenazh' }, { label: 'ЖКТ (зонд)', icon: 'balans_zond' }, { label: 'Рвота', icon: 'balans_rvota' }, { label: 'Другое', icon: 'drugoe' }];
function outputAtHour(patient, label, hour) {
    const baseline = label === 'Диурез' && hour === '08' ? patient.baseOutput : 0;
    return baseline + patient.outputEntries.filter((entry) => entry.label === label && entry.time.slice(0, 2) === hour).reduce((sum, entry) => sum + entry.volume, 0);
}
export function inputAmounts(patient, type) {
    const orders = patient.orders.filter((order) => (order.type === 'enteral' ? 'oral' : order.type) === type);
    const done = orders.reduce((sum, order) => sum + order.slots.filter((slot) => slot.status === 'done').length * order.volume, 0) + (type === 'infusion' ? patient.baseInput : 0);
    const planned = orders.reduce((sum, order) => sum + order.slots.filter((slot) => slot.status !== 'missed').length * order.volume, 0) + (type === 'infusion' ? patient.baseInput : 0);
    return { done, planned };
}
export function BalanceRows({ patient, output = false }) {
    const { t, tr } = useDemoI18n();
    return <div className="balance-category-rows">{(output ? OUTPUT_CATEGORIES : INPUT_CATEGORIES).map((category) => {
            const amount = output ? patient.outputEntries.filter((entry) => entry.label === category.label).reduce((sum, entry) => sum + entry.volume, 0) + (category.label === 'Диурез' ? patient.baseOutput : 0) : inputAmounts(patient, category.key);
            return <div className="balance-category-row" key={tr(category.label)}><Icon name={category.icon} size={15}/><span>{tr(category.label)}</span><span className="category-amount">{output ? number(amount) : `${number(amount.done)}/${number(amount.planned)}`}{t(" мл")}</span></div>;
        })}</div>;
}
export function BalanceRail({ patient, role, tab, onClear, onTemplates, onDelete, onUndoMark, onVitals, selectedOrder, onHistory }) {
    const { t } = useDemoI18n();
    const balance = getBalance(patient);
    return <aside className="native-right-rail"><Sector title={t("Баланс жидкости")} className="rail-input"><div className="balance-rail-total"><strong>{t("Всего:")}</strong><strong className="green-value" data-testid="balance-input">{number(balance.input)}/{number(balance.input + balance.planned)}{t(" мл")}</strong></div><BalanceRows patient={patient}/></Sector><Sector title={t("Выведено")} className="rail-output"><div className="balance-rail-total"><strong>{t("Всего:")}</strong><strong className="green-value" data-testid="balance-output">{number(balance.output)}{t(" мл")}</strong></div><BalanceRows patient={patient} output/></Sector><Sector className="rail-net"><strong>{t("Баланс:")}<span data-testid="balance-net" className={balance.net < 0 ? 'red-value' : 'blue-value'}>{signed(balance.net)}/{signed(balance.net + balance.planned)}{t(" мл")}</span></strong></Sector><Sector title={t(tab === 'orders' ? 'Навигация' : 'Доп')} className="rail-navigation">
    {tab === 'orders' && <><QtButton icon="savecard" disabled>{t("Сохранить")}</QtButton>{role === 'doctor' ? <><QtButton icon="clean" onClick={onClear}>{t('Очистить лист')}</QtButton><QtButton icon="garbage" disabled={!selectedOrder} onClick={onDelete}>{t('Удалить назначение')}</QtButton><QtButton icon="archivepacient" disabled>{t('Вчерашнее')}</QtButton></> : null}<QtButton icon="otmena" disabled={role !== 'nurse' || !patient.orderMarkUndo?.length} onClick={onUndoMark}>{t("Отмена")}</QtButton>{role === 'doctor' && <QtButton icon="binder" onClick={onTemplates}>{t("Шаблоны")}</QtButton>}<QtButton icon="pokaz" onClick={onVitals}>{t("Показатели")}</QtButton></>}
    <QtButton icon="reports" onClick={onHistory}>{t("Журнал изменений")}</QtButton>
  </Sector></aside>;
}
export default function NativeBalance({ patient, role, time, onOutput, onUndoOutput }) {
    const { t, tr } = useDemoI18n();
    const balance = getBalance(patient);
    const [category, setCategory] = useState('Диурез');
    const [volume, setVolume] = useState('');
    const [error, setError] = useState('');
    function save(event) { event.preventDefault(); const result = onOutput({ volume: Number(volume), label: category, time }); if (result)
        setError(result);
    else {
        setError('');
        setVolume('');
    } }
    return <section className="native-balance" aria-label={t("Баланс жидкости")}><div className="balance-main-top"><Sector title={t("Введено:")}><div className="balance-rail-total"><strong>{t("Всего введено:")}</strong><strong className="green-value">{number(balance.input)}/{number(balance.input + balance.planned)}{t(" мл")}</strong></div><BalanceRows patient={patient}/></Sector><Sector title={t("Выведение:")}><div className="balance-rail-total"><strong>{t("Всего выведено за текущий час:")}</strong><strong className="green-value">{OUTPUT_CATEGORIES.reduce((sum, item) => sum + outputAtHour(patient, item.label, time.slice(0, 2)), 0)}{t(" мл")}</strong></div><div className="output-category-select">{OUTPUT_CATEGORIES.map((item) => <button key={tr(item.label)} className={category === item.label ? 'selected' : ''} onClick={() => setCategory(item.label)}><Icon name={item.icon} size={17}/><span>{tr(item.label)}</span><span>{outputAtHour(patient, item.label, time.slice(0, 2))}{t(" мл")}</span></button>)}</div><div className="native-balance-total"><strong>{t("Баланс:")}</strong><strong className="blue-value">{signed(balance.net)}/{signed(balance.net + balance.planned)}{t(" мл")}</strong></div></Sector><Sector title={t("Выведение")} className="output-controls"><form onSubmit={save}><select aria-label={t("Категория выведения")} value={category} disabled={role !== 'nurse'} onChange={(event) => setCategory(event.target.value)}>{OUTPUT_CATEGORIES.map((item) => <option key={item.label} value={item.label}>{tr(item.label)}</option>)}</select><div><input aria-label={t("Объём выведения")} type="number" placeholder={t("Объём...")} min="1" max="2000" step="1" required disabled={role !== 'nurse'} value={volume} onChange={(event) => setVolume(event.target.value)}/><QtButton icon="add_vit" disabled={role !== 'nurse'} type="submit">{t("Добавить")}</QtButton></div><p>{t("Время: ")}<strong>{time}</strong></p>{error && <p role="alert" className="native-error">{tr(error)}</p>}</form><div className="output-undo"><QtButton icon="otmena" disabled={role !== 'nurse' || !patient.outputEntries.length} onClick={onUndoOutput}>{t("Отменить последнее")}</QtButton></div></Sector></div><div className="fluid-grid-scroll"><table className="native-fluid-grid"><thead><tr><th /><>{HOURS.map((hour) => <th scope="col" key={hour}>{hour}</th>)}</></tr></thead><tbody>{OUTPUT_CATEGORIES.map((item) => <tr key={tr(item.label)}><th scope="row">{tr(item.label)}</th>{HOURS.map((hour) => { const amount = outputAtHour(patient, item.label, hour); return <td className={hour === time.slice(0, 2) ? 'now-column' : ''} key={hour}>{amount || ''}</td>; })}</tr>)}</tbody></table></div></section>;
}
