import { useDemoI18n } from './i18n.jsx';
import React, { useEffect, useState } from 'react';
import { date } from './format.js';
import { createInitialState, loadState, saveState, getPatient, selectPatient, setRole, setTab, addOrder, markOrder, toggleScheduleSlot, deleteOrder, clearOrders, addVital, addOutput, undoLastVital, undoLastOutput, undoLastOrderMark } from './demo-state.js';
import { TopToolbar, PatientInfo, UpcomingOrders, InputPanel } from './components/NativeChrome.jsx';
import NativeOrders from './components/NativeOrders.jsx';
import NativeVitals from './components/NativeVitals.jsx';
import NativeBalance, { BalanceRail } from './components/NativeBalance.jsx';
import { CharacteristicsDialog, RoleDialog, PatientsDialog, StatusDialog, ConfirmDialog, TemplatesDialog, HistoryDialog } from './components/NativeDialogs.jsx';
function storage() { try {
    return window.localStorage;
}
catch {
    return null;
} }
const TABS = [{ id: 'vitals', name: 'Витальные функции' }, { id: 'orders', name: 'Назначения' }, { id: 'balance', name: 'Баланс жидкости' }];
export default function App() {
    const { t, tr } = useDemoI18n();
    const [state, setState] = useState(() => loadState(storage()));
    const [dialog, setDialog] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [time, setTime] = useState('12:00');
    const [notice, setNotice] = useState('Демонстрационная база. Все пациенты и события вымышлены.');
    const [storageAvailable, setStorageAvailable] = useState(true);
    const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
    useEffect(() => { const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
    const scale = Math.min(1, viewport.width / 1280);
    const patient = getPatient(state);
    const selectedOrder = patient.orders.find((order) => order.id === selectedOrderId);
    useEffect(() => { setStorageAvailable(saveState(storage(), state)); }, [state]);
    function update(transform, message) {
        setState((current) => transform(current));
        if (message)
            setNotice(message);
    }
    function guardedUpdate(transform, message) {
        try {
            const next = transform(state);
            setState(next);
            if (message)
                setNotice(message);
            return null;
        }
        catch (error) {
            setNotice(error.message);
            return error.message;
        }
    }
    function submit(transform, message) { const error = guardedUpdate(transform, message); if (!error)
        setDialog(null); return error; }
    function changeRole(role) { update((current) => setRole(current, role), t('Рабочее место: {role}. Открыта та же карта пациента.', { role: t(role === 'doctor' ? 'Врач' : 'Медсестра') })); setSelectedOrderId(null); setDialog(null); }
    function changePatient(id) { update((current) => selectPatient(current, id)); setSelectedOrderId(null); setDialog(null); }
    function mark(order, slot, requested) { const status = slot.status !== 'planned' ? 'planned' : requested; guardedUpdate((current) => markOrder(current, order.id, slot.time, status), t('{name}, {time} — {status}. Баланс пересчитан.', { name: order.customName ? order.name : tr(order.name), time: slot.time + ':00', status: t(status === 'done' ? 'выполнено' : status === 'missed' ? 'не выполнено' : 'отметка снята') })); }
    function upcoming(order, slot) { if (state.role === 'nurse')
        setDialog({ type: 'status', orderId: order.id, time: slot.time });
    else {
        setSelectedOrderId(order.id);
        update((current) => setTab(current, 'orders'));
    } }
    function activateTab(tab) { update((current) => setTab(current, tab)); }
    return <div className="native-window" style={{ zoom: scale, width: `${viewport.width / scale}px`, height: `${viewport.height / scale}px` }}>
    <a className="skip-link" href="#native-content">{t("К реанимационной карте")}</a>
    <TopToolbar role={state.role} onRoles={() => setDialog({ type: 'roles' })} onPatients={() => setDialog({ type: 'patients' })} onRefresh={() => setNotice('Карта обновлена. Все изменения доступны обоим рабочим местам.')} onReset={() => setDialog({ type: 'reset' })}/>
    <div className="demo-limitations" role="note">{t('Демонстрационная версия. Реализована только часть возможностей RemCard. Некоторые разделы отключены; поведение может отличаться от полной программы. Все данные вымышлены.')}</div>
    <div className="native-main-layout"><aside className="native-left-rail"><UpcomingOrders patient={patient} role={state.role} onSelect={upcoming}/><InputPanel key={patient.id} time={time} onTime={setTime} patient={patient} onSave={(values) => guardedUpdate((current) => addVital(current, values), `Показатели на ${time} добавлены в карту.`)} onUndo={() => guardedUpdate(undoLastVital, 'Последнее измерение отменено.')}/></aside>
      <main className="native-card" id="native-content"><PatientInfo patient={patient} onPatients={() => setDialog({ type: 'patients' })} onVitals={() => activateTab('vitals')}/>
        <section className="native-card-tabs"><div className="native-shift-heading"><strong>{t("Реанимационная карта")}{t(state.role === 'nurse' ? ' (Медсестра)' : '')}</strong><span>{date('2026-10-27')} (08:00 — {date('2026-10-28')} 08:00)</span><strong className="orange-value">{t("Текущее время: 12:00")}</strong></div><div className="native-tab-buttons" role="tablist" aria-label={t("Вкладки реанимационной карты")}>{TABS.map((tab) => <button key={tab.id} role="tab" id={`native-tab-${tab.id}`} aria-controls={`native-panel-${tab.id}`} aria-selected={state.tab === tab.id} tabIndex={state.tab === tab.id ? 0 : -1} className={`qt-button ${state.tab === tab.id ? 'active-tab' : ''}`} onClick={() => activateTab(tab.id)} onKeyDown={(event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key))
        return; event.preventDefault(); const index = TABS.findIndex((item) => item.id === state.tab); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3; activateTab(TABS[next].id); document.getElementById(`native-tab-${TABS[next].id}`).focus(); }}>{tr(tab.name)}</button>)}{(state.role === 'doctor' ? ['ИВЛ', 'Процедуры', 'Анализы', 'Движение', 'Диета'] : ['Анализы', 'Движение', 'Диета']).map((name) => <button key={tr(name)} className="qt-button disabled-tab" disabled title={t("Раздел недоступен в демо")}>{tr(name)}</button>)}</div></section>
        <div className="native-card-body"><section className="native-content" role="tabpanel" id={`native-panel-${state.tab}`} aria-labelledby={`native-tab-${state.tab}`}>
          {state.tab === 'orders' && <NativeOrders patient={patient} role={state.role} time={time} selectedOrderId={selectedOrderId} onSelect={setSelectedOrderId} onAdd={(template) => setDialog({ type: 'order', template })} onMark={mark} onSchedule={(id, hour) => guardedUpdate((current) => toggleScheduleSlot(current, id, hour), 'Расписание назначения изменено.')}/>}
          {state.tab === 'vitals' && <NativeVitals key={patient.id} patient={patient}/>}
          {state.tab === 'balance' && <NativeBalance key={patient.id} patient={patient} role={state.role} time={time} onOutput={(values) => guardedUpdate((current) => addOutput(current, values), 'Выведение записано. Баланс обновлён.')} onUndoOutput={() => guardedUpdate(undoLastOutput, 'Последняя запись выведения отменена.')}/>}
        </section><BalanceRail patient={patient} role={state.role} tab={state.tab} selectedOrder={selectedOrder} onClear={() => setDialog({ type: 'clear' })} onDelete={() => selectedOrder && guardedUpdate((current) => deleteOrder(current, selectedOrder.id), 'Назначение удалено.')} onUndoMark={() => guardedUpdate(undoLastOrderMark, 'Последняя отметка медсестры отменена.')} onTemplates={() => setDialog({ type: 'templates' })} onVitals={() => activateTab('vitals')} onHistory={() => setDialog({ type: 'history' })}/></div>
      </main>
    </div>
    <footer className="native-statusbar" role="status" aria-live="polite"><span>{tr(notice)}</span><span>{t(storageAvailable ? 'Локальная демобаза' : 'Без сохранения после перезагрузки')} · {t(state.role === 'doctor' ? 'Врач' : 'Медсестра')}</span></footer>
    {dialog?.type === 'roles' && <RoleDialog role={state.role} onSelect={changeRole} onClose={() => setDialog(null)}/>}
    {dialog?.type === 'patients' && <PatientsDialog state={state} onSelect={changePatient} onClose={() => setDialog(null)}/>}
    {dialog?.type === 'order' && <CharacteristicsDialog template={dialog.template} onClose={() => setDialog(null)} onSubmit={(values) => submit((current) => addOrder(current, values), 'Назначение сохранено. Оно доступно в карте медсестры.')}/>}
    {dialog?.type === 'status' && <StatusDialog order={patient.orders.find((order) => order.id === dialog.orderId)} time={dialog.time} onClose={() => setDialog(null)} onMark={(status) => submit((current) => markOrder(current, dialog.orderId, dialog.time, status), 'Отметка медсестры сохранена. Баланс пересчитан.')}/>}
    {dialog?.type === 'templates' && <TemplatesDialog onClose={() => setDialog(null)} onSelect={(template) => setDialog({ type: 'order', template })}/>}
    {dialog?.type === 'history' && <HistoryDialog patient={patient} onClose={() => setDialog(null)}/>}
    {dialog?.type === 'reset' && <ConfirmDialog title={t("Сбросить демонстрационную базу?")} text={t("Добавленные учебные записи будут сброшены. Пациенты вернутся в исходное состояние.")} action={t("Сбросить демо")} onClose={() => setDialog(null)} onConfirm={() => { setState(createInitialState()); setSelectedOrderId(null); setTime('12:00'); setDialog(null); setNotice('Демонстрационная база восстановлена.'); }}/>}
    {dialog?.type === 'clear' && <ConfirmDialog title={t("Очистить лист назначений?")} text={t("Все назначения этого учебного пациента и отметки их выполнения будут удалены.")} action={t("Очистить лист")} onClose={() => setDialog(null)} onConfirm={() => submit(clearOrders, 'Лист назначений очищен.')}/>}
  </div>;
}
