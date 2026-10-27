import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState, getPatient, getBalance, selectPatient, setRole, setTab,
  addOrder, toggleOrder, markOrder, deleteOrder, clearOrders, addVital, addOutput,
  undoLastVital, undoLastOutput, toggleScheduleSlot, undoLastOrderMark, loadState, saveState, STORAGE_KEY, HOURS,
} from '../src/demo-state.js';

test('учебный баланс не считает выполненное назначение дважды', () => {
  const state = createInitialState();
  assert.deepEqual(getBalance(getPatient(state)), { input: 770, output: 450, net: 320, planned: 1210 });
  assert.equal(getPatient(state).orders.length, 6);
  assert.equal(getPatient(state).orders.filter((order) => !order.completed).length, 5);
  assert.equal(HOURS.length, 24);
  assert.deepEqual(HOURS.slice(-8), ['00', '01', '02', '03', '04', '05', '06', '07']);
});

test('назначение проходит от врача к медсестре и обратимо меняет баланс', () => {
  const initial = createInitialState();
  const prescribed = addOrder(initial, { templateId: 'saline', time: '12', volume: 300 });
  const order = getPatient(prescribed).orders.at(-1);
  assert.equal(order.createdByUser, true);
  assert.equal(getBalance(getPatient(prescribed)).input, 770);
  const nurse = setRole(prescribed, 'nurse');
  const completed = toggleOrder(nurse, order.id);
  assert.equal(getBalance(getPatient(completed)).input, 1070);
  const reverted = toggleOrder(completed, order.id);
  assert.equal(getBalance(getPatient(reverted)).input, 770);
  assert.equal(getPatient(initial).orders.length, 6);
  assert.equal(getPatient(prescribed).orders.at(-1).completed, false);
});

test('изменения пациента не затрагивают других пациентов', () => {
  const initial = createInitialState();
  const changed = addOrder(selectPatient(initial, 'sokolova'), { templateId: 'water', time: '14' });
  assert.equal(getPatient(changed).orders.length, 7);
  assert.equal(getPatient(selectPatient(changed, 'morozov')).orders.length, 6);
  assert.strictEqual(changed.patients[0], initial.patients[0]);
});

test('роль ограничивает создание и выполнение назначений', () => {
  const doctor = createInitialState();
  const nurse = setRole(doctor, 'nurse');
  assert.throws(() => addOrder(nurse, { templateId: 'water', time: '12' }));
  assert.throws(() => toggleOrder(doctor, getPatient(doctor).orders[0].id));
  assert.throws(() => addOutput(doctor, { volume: 100 }));
  assert.throws(() => deleteOrder(nurse, getPatient(nurse).orders[1].id));
});

test('невалидные назначения и параметры навигации отклоняются', () => {
  const state = createInitialState();
  for (const volume of [0, -1, 2001, NaN, Infinity, '200']) {
    assert.throws(() => addOrder(state, { templateId: 'saline', time: '12', volume }));
  }
  assert.throws(() => addOrder(state, { templateId: 'missing', time: '12' }));
  assert.throws(() => addOrder(state, { templateId: 'water', time: '25' }));
  assert.throws(() => addOrder(state, { templateId: 'monitoring', time: '12', volume: 100 }));
  assert.throws(() => selectPatient(state, 'missing'));
  assert.throws(() => setRole(state, 'admin'));
  assert.throws(() => setTab(state, 'missing'));
  assert.equal(setTab(state, 'balance').tab, 'balance');
});

test('выведение снижает баланс, не меняя входящий объём', () => {
  const state = setRole(createInitialState(), 'nurse');
  const changed = addOutput(state, { volume: 100 });
  assert.deepEqual(getBalance(getPatient(changed)), { input: 770, output: 550, net: 220, planned: 1210 });
  assert.equal(getPatient(state).outputEntries.length, 1);
  assert.throws(() => addOutput(state, { volume: -5 }));
});

test('показатели обновляются для выбранного времени и проходят проверку', () => {
  const state = setRole(createInitialState(), 'nurse');
  const values = { time: '10:00', pulse: 82, systolic: 122, diastolic: 80, spo2: 99, temperature: 36.7 };
  const changed = addVital(state, values);
  assert.equal(getPatient(changed).vitals.length, getPatient(state).vitals.length);
  assert.equal(getPatient(changed).vitals.find((vital) => vital.time === '10:00').pulse, 82);
  assert.equal(getPatient(state).vitals.find((vital) => vital.time === '10:00').pulse, 80);
  assert.throws(() => addVital(state, { ...values, spo2: 101 }));
  assert.throws(() => addVital(state, { ...values, systolic: 75 }));
  const doctor = addVital(setRole(state, 'doctor'), values);
  assert.equal(getPatient(doctor).events[0].role, 'doctor');
  const reverted = undoLastVital(doctor);
  assert.deepEqual(getPatient(reverted).vitals, getPatient(state).vitals);
  assert.equal(getPatient(reverted).events[0].role, 'doctor');
});

test('удаление назначений не меняет выполненные записи', () => {
  const state = createInitialState();
  assert.throws(() => deleteOrder(state, getPatient(state).orders[0].id));
  const changed = deleteOrder(state, getPatient(state).orders[4].id);
  assert.equal(getPatient(changed).orders.length, 5);
  assert.equal(getBalance(getPatient(changed)).input, 770);
});

test('лента ограничена 12 событиями и хранит последнее действие первым', () => {
  let state = setRole(createInitialState(), 'nurse');
  for (let index = 0; index < 20; index++) state = addOutput(state, { volume: 1, label: `Запись ${index}` });
  assert.equal(getPatient(state).events.length, 12);
  assert.match(getPatient(state).events[0].description, /Запись 19/);
});

test('состояние переживает сохранение; повреждённые данные безопасно сбрасываются', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const state = addOrder(createInitialState(), { templateId: 'water', time: '14' });
  assert.equal(saveState(storage, state), true);
  assert.deepEqual(loadState(storage), state);
  for (const malformed of ['not json', 'null', '{}', JSON.stringify({ ...state, version: 1 }),
    JSON.stringify({ ...state, patientId: 'missing' }), JSON.stringify({ ...state, patients: [null, null, null] })]) {
    data.set(STORAGE_KEY, malformed);
    assert.deepEqual(loadState(storage), createInitialState());
  }
  const malformed = structuredClone(state);
  malformed.patients[0].vitals = [{ time: 'oops' }];
  data.set(STORAGE_KEY, JSON.stringify(malformed));
  assert.deepEqual(loadState(storage), createInitialState());
  const unavailable = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); } };
  assert.deepEqual(loadState(unavailable), createInitialState());
  assert.equal(saveState(unavailable, state), false);
});

test('каждый приём учитывается отдельно, пропуск не даёт объём и отметки обратимы', () => {
  const initial = setRole(createInitialState(), 'nurse');
  const order = getPatient(initial).orders.find((item) => item.id.endsWith('-enteral'));
  const first = markOrder(initial, order.id, '10', 'done');
  assert.equal(getBalance(getPatient(first)).input, 970);
  assert.equal(getBalance(getPatient(first)).planned, 1010);
  assert.equal(getPatient(first).orders.find((item) => item.id === order.id).completed, false);
  const second = markOrder(first, order.id, '14', 'done');
  assert.equal(getBalance(getPatient(second)).input, 1170);
  const missed = markOrder(second, order.id, '10', 'missed');
  assert.equal(getBalance(getPatient(missed)).input, 970);
  assert.equal(getBalance(getPatient(missed)).planned, 810);
  const planned = markOrder(missed, order.id, '10', 'planned');
  assert.equal(getBalance(getPatient(planned)).input, 970);
  assert.equal(getBalance(getPatient(planned)).planned, 1010);
  const repeated = markOrder(planned, order.id, '14', 'done');
  assert.deepEqual(repeated, planned);
  assert.strictEqual(getPatient(repeated), getPatient(planned));
  assert.throws(() => markOrder(initial, order.id, '09', 'done'));
  assert.throws(() => markOrder(initial, order.id, '10', 'invalid'));
  assert.throws(() => markOrder(setRole(initial, 'doctor'), order.id, '10', 'done'));
});

test('многократное назначение создаёт уникальные часы смены и совместимые поля', () => {
  const initial = createInitialState();
  const state = addOrder(initial, { templateId: 'ceftriaxone', times: ['21', '09', '21'] });
  const order = getPatient(state).orders.at(-1);
  assert.deepEqual(order.slots, [{ time: '09', status: 'planned' }, { time: '21', status: 'planned' }]);
  assert.equal(order.time, '09');
  const first = toggleOrder(setRole(state, 'nurse'), order.id);
  assert.equal(getPatient(first).orders.at(-1).completed, false);
  const all = toggleOrder(first, order.id, '21');
  assert.equal(getPatient(all).orders.at(-1).completed, true);
  assert.equal(getBalance(getPatient(all)).input, 790);
  const custom = addOrder(initial, { templateId: 'custom', times: ['23', '07'], name: 'Контроль диуреза', description: 'Каждый час' });
  assert.equal(getPatient(custom).orders.at(-1).name, 'Контроль диуреза');
  assert.throws(() => addOrder(initial, { templateId: 'water', times: [] }));
});

test('отмена последнего ввода восстанавливает заменённую точку и баланс', () => {
  const initial = setRole(createInitialState(), 'nurse');
  const values = { time: '09:00', pulse: 82, systolic: 122, diastolic: 80, spo2: 99, temperature: 36.7, respiratory: 20, cvp: 7 };
  const edited = addVital(initial, values);
  const reverted = undoLastVital(edited);
  assert.deepEqual(getPatient(reverted).vitals, getPatient(initial).vitals);
  assert.deepEqual(getPatient(reverted).vitalUndo, []);
  const added = addVital(initial, { ...values, time: '12:15' });
  assert.deepEqual(getPatient(undoLastVital(added)).vitals, getPatient(initial).vitals);
  const output = addOutput(initial, { volume: 120, time: '13:15' });
  assert.equal(getPatient(output).outputEntries.at(-1).time, '13:15');
  assert.deepEqual(getBalance(getPatient(undoLastOutput(output))), getBalance(getPatient(initial)));
  assert.throws(() => undoLastOutput(initial));
  assert.throws(() => addOutput(initial, { volume: 100, time: '25:00' }));
  assert.throws(() => addVital(initial, { ...values, respiratory: 100 }));
  assert.throws(() => addVital(initial, { ...values, cvp: -20 }));
  let one = initial;
  for (let index = 0; index < 5; index++) one = undoLastVital(one);
  assert.equal(getPatient(one).vitals.length, 1);
  assert.throws(() => undoLastVital(one));
});

test('очистка удаляет все назначения текущего пациента после подтверждения в UI', () => {
  const initial = createInitialState();
  const cleared = clearOrders(initial);
  assert.equal(getPatient(cleared).orders.length, 0);
  assert.deepEqual(getBalance(getPatient(cleared)), { input: 500, output: 450, net: 50, planned: 0 });
  assert.equal(getPatient(selectPatient(cleared, 'sokolova')).orders.length, 6);
  assert.throws(() => clearOrders(setRole(initial, 'nurse')));
});

test('хранилище отклоняет повреждённые слоты и несовместимые производные поля', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key), setItem: (key, value) => data.set(key, value) };
  assert.equal(STORAGE_KEY, 'remcard-faithful-demo-v2');
  for (const mutate of [
    (state) => { state.patients[0].orders[0].slots[0].status = 'invalid'; },
    (state) => { state.patients[0].orders[0].slots = []; },
    (state) => { state.patients[0].orders[0].slots.push({ time: '09', status: 'done' }); },
    (state) => { state.patients[0].orders[0].completed = true; },
    (state) => { state.patients[0].orders[0].time = '12'; },
    (state) => { state.patients[0].vitals[0].respiratory = undefined; },
  ]) {
    const corrupted = createInitialState();
    mutate(corrupted);
    data.set(STORAGE_KEY, JSON.stringify(corrupted));
    assert.deepEqual(loadState(storage), createInitialState());
  }
  const edited = addVital(setRole(createInitialState(), 'nurse'), { pulse: 81, systolic: 121, diastolic: 79, spo2: 98, temperature: 36.6 });
  assert.equal(saveState(storage, edited), true);
  assert.deepEqual(loadState(storage), edited);
});

test('врач меняет расписание без удаления сестринских отметок и последнего часа', () => {
  const initial = createInitialState();
  const order = getPatient(initial).orders.find((item) => item.id.endsWith('-enteral'));
  const added = toggleScheduleSlot(initial, order.id, '01');
  assert.equal(getPatient(added).orders.find((item) => item.id === order.id).slots.at(-1).time, '01');
  const removed = toggleScheduleSlot(added, order.id, '01');
  assert.deepEqual(getPatient(removed).orders, getPatient(initial).orders);
  assert.throws(() => toggleScheduleSlot(initial, getPatient(initial).orders[0].id, '09'));
  assert.throws(() => toggleScheduleSlot(initial, getPatient(initial).orders.at(-1).id, '12'));
  assert.throws(() => toggleScheduleSlot(setRole(initial, 'nurse'), order.id, '01'));
  const marked = markOrder(setRole(initial, 'nurse'), order.id, '10', 'missed');
  assert.throws(() => toggleScheduleSlot(setRole(marked, 'doctor'), order.id, '10'));
});

test('отмена последней отметки восстанавливает точный предыдущий статус и баланс', () => {
  const initial = setRole(createInitialState(), 'nurse');
  const order = getPatient(initial).orders.find((item) => item.id.endsWith('-enteral'));
  assert.throws(() => undoLastOrderMark(initial));
  const completed = markOrder(initial, order.id, '10', 'done');
  const missed = markOrder(completed, order.id, '10', 'missed');
  const undoMiss = undoLastOrderMark(missed);
  assert.deepEqual(getPatient(undoMiss).orders, getPatient(completed).orders);
  assert.deepEqual(getBalance(getPatient(undoMiss)), getBalance(getPatient(completed)));
  const undoDone = undoLastOrderMark(undoMiss);
  assert.deepEqual(getPatient(undoDone).orders, getPatient(initial).orders);
  assert.deepEqual(getBalance(getPatient(undoDone)), getBalance(getPatient(initial)));
  assert.throws(() => undoLastOrderMark(setRole(completed, 'doctor')));
  const elsewhere = selectPatient(completed, 'sokolova');
  assert.throws(() => undoLastOrderMark(elsewhere));
});
