/** Browser-only fictional demo data. No connection to RemCard databases. */
export const HOURS = Array.from({ length: 24 }, (_, index) => String((index + 8) % 24).padStart(2, '0'));
export const STORAGE_KEY = 'remcard-faithful-demo-v2';
export const ORDER_TEMPLATES = [
  { id: 'saline', name: 'Натрия хлорид 0,9%', description: 'Внутривенно капельно', volume: 250, type: 'infusion' },
  { id: 'enteral', name: 'Энтеральное питание', description: 'Через зонд', volume: 200, type: 'enteral' },
  { id: 'monitoring', name: 'Контроль показателей', description: 'АД, пульс, температура, SpO₂', volume: 0, type: 'monitoring' },
  { id: 'water', name: 'Питьё', description: 'Перорально', volume: 150, type: 'oral' },
  { id: 'ceftriaxone', name: 'S. Ceftriaxoni 1 g', description: 'S. NaCl 0,9% — 10 мл, в/в струйно', volume: 10, type: 'drug' },
  { id: 'omeprazole', name: 'S. Omeprazoli 20 mg', description: 'S. NaCl 0,9% — 10 мл, в/в струйно', volume: 10, type: 'drug' },
  { id: 'custom', name: 'Произвольное назначение', description: 'Наблюдение', volume: 0, type: 'monitoring' },
];

let sequence = 0;
const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${++sequence}`;
const clampEventList = (events) => events.slice(0, 12);
const isString = (value) => typeof value === 'string' && value.length > 0 && value.length < 500;
const isNumber = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
const validTime = (time) => typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const shiftMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  return ((hour + 16) % 24) * 60 + minute;
};

function vitalIsValid(vital) {
  return vital && validTime(vital.time)
    && isNumber(vital.pulse, 30, 220)
    && isNumber(vital.systolic, 70, 250)
    && isNumber(vital.diastolic, 40, 160)
    && vital.systolic > vital.diastolic
    && isNumber(vital.spo2, 50, 100)
    && isNumber(vital.temperature, 30, 43)
    && isNumber(vital.respiratory, 4, 80)
    && isNumber(vital.cvp, -10, 40);
}

function withSlots(order, slots) {
  return { ...order, slots, time: slots[0].time, completed: slots.every((slot) => slot.status === 'done') };
}

function seededOrder(patientId, templateId, times, doneTimes = []) {
  const template = ORDER_TEMPLATES.find((item) => item.id === templateId);
  return withSlots({ ...template, id: `${patientId}-${templateId}`, createdByUser: false },
    times.map((time) => ({ time, status: doneTimes.includes(time) ? 'done' : 'planned' })));
}

function createPatient(id, name, age, bed, diagnosis, offset = 0) {
  return {
    id, name, age, bed, diagnosis, history: `ДЕМО-${bed}/26`,
    baseInput: 500 + offset, baseOutput: 300 + offset,
    outputEntries: [{ id: `${id}-output-1`, time: '10:00', label: 'Диурез', volume: 150 }],
    vitalUndo: [], orderMarkUndo: [],
    vitals: [
      { time: '08:00', pulse: 92, systolic: 128, diastolic: 82, spo2: 96, temperature: 37.4 },
      { time: '08:30', pulse: 88, systolic: 124, diastolic: 80, spo2: 97, temperature: 37.3 },
      { time: '09:00', pulse: 84, systolic: 122, diastolic: 78, spo2: 97, temperature: 37.2 },
      { time: '09:30', pulse: 86, systolic: 126, diastolic: 80, spo2: 98, temperature: 37.1 },
      { time: '10:00', pulse: 80, systolic: 120, diastolic: 78, spo2: 98, temperature: 36.9 },
      { time: '10:30', pulse: 78, systolic: 118, diastolic: 76, spo2: 98, temperature: 36.8 },
    ].map((vital) => ({ ...vital, respiratory: 18, cvp: 6 })),
    orders: [
      seededOrder(id, 'ceftriaxone', ['09', '21'], ['09']),
      seededOrder(id, 'omeprazole', ['09'], ['09']),
      seededOrder(id, 'saline', ['10', '18'], ['10']),
      seededOrder(id, 'monitoring', ['09', '12', '15', '18', '21', '00', '03', '06'], ['09']),
      seededOrder(id, 'enteral', ['10', '14', '18', '22']),
      seededOrder(id, 'water', ['12']),
    ],
    events: [
      { id: `${id}-event-1`, time: '10:00', title: 'Учтено выведение', description: 'Диурез · 150 мл', role: 'nurse' },
      { id: `${id}-event-2`, time: '08:30', title: 'Назначение выполнено', description: 'Натрия хлорид 0,9% · 250 мл', role: 'nurse' },
      { id: `${id}-event-3`, time: '08:00', title: 'Подготовлена карта смены', description: 'Учебные назначения доступны врачу и медсестре', role: 'doctor' },
    ],
  };
}

export function createInitialState() {
  return {
    version: 2, patientId: 'morozov', role: 'doctor', tab: 'orders',
    patients: [
      createPatient('morozov', 'Алексей Морозов', 42, '03', 'Послеоперационное наблюдение'),
      createPatient('sokolova', 'Ирина Соколова', 67, '07', 'Плановое наблюдение в РАО', 150),
      createPatient('kuznetsov', 'Дмитрий Кузнецов', 55, '12', 'Восстановление после операции', 50),
    ],
  };
}

export function getPatient(state) {
  const patient = state.patients.find((item) => item.id === state.patientId);
  if (!patient) throw new Error('Учебный пациент не найден');
  return patient;
}

export function getBalance(patient) {
  const input = patient.baseInput + patient.orders.reduce((sum, order) => sum + order.slots.filter((slot) => slot.status === 'done').length * order.volume, 0);
  const output = patient.baseOutput + patient.outputEntries.reduce((sum, entry) => sum + entry.volume, 0);
  const planned = patient.orders.reduce((sum, order) => sum + order.slots.filter((slot) => slot.status === 'planned').length * order.volume, 0);
  return { input, output, net: input - output, planned };
}

export function selectPatient(state, id) {
  if (!state.patients.some((patient) => patient.id === id)) throw new Error('Учебный пациент не найден');
  return { ...state, patientId: id };
}

export function setRole(state, role) {
  if (!['doctor', 'nurse'].includes(role)) throw new Error('Неизвестная роль');
  return { ...state, role };
}

export function setTab(state, tab) {
  if (!['orders', 'vitals', 'balance'].includes(tab)) throw new Error('Неизвестная вкладка');
  return { ...state, tab };
}

function requireRole(state, role) {
  if (state.role !== role) throw new Error(role === 'doctor' ? 'Назначения создаёт врач' : 'Выполнение отмечает медсестра');
}

function updatePatient(state, operation) {
  const patient = getPatient(state);
  const updated = operation(patient);
  return { ...state, patients: state.patients.map((item) => item.id === patient.id ? updated : item) };
}

function event(title, description, role, time = '12:00') {
  return { id: nextId('event'), time, title, description, role };
}

export function addOrder(state, { templateId, time, volume, times, name, description, customName = false }) {
  requireRole(state, 'doctor');
  const template = ORDER_TEMPLATES.find((item) => item.id === templateId);
  if (!template) throw new Error('Выберите назначение из списка');
  const selectedTimes = times ?? [time];
  if (!Array.isArray(selectedTimes) || !selectedTimes.length || selectedTimes.some((hour) => !HOURS.includes(hour))) throw new Error('Выберите время назначения');
  const uniqueTimes = [...new Set(selectedTimes)].sort((a, b) => HOURS.indexOf(a) - HOURS.indexOf(b));
  const amount = volume === undefined ? template.volume : volume;
  if (template.volume === 0 ? amount !== 0 : !isNumber(amount, 1, 2000)) throw new Error('Объём должен быть от 1 до 2000 мл');
  if (name !== undefined && (typeof name !== 'string' || !isString(name.trim()))) throw new Error('Укажите название назначения');
  if (description !== undefined && (typeof description !== 'string' || !isString(description.trim()))) throw new Error('Укажите описание назначения');
  const order = withSlots({ ...template, id: nextId('order'), volume: amount, name: name?.trim() ?? template.name,
    description: description?.trim() ?? template.description, customName: Boolean(customName), createdByUser: true }, uniqueTimes.map((hour) => ({ time: hour, status: 'planned' })));
  return updatePatient(state, (patient) => ({
    ...patient, orders: [...patient.orders, order],
    events: clampEventList([event('Добавлено назначение', `${order.name}${amount ? ` · ${amount} мл` : ''} · ${uniqueTimes.join(', ')}`, 'doctor'), ...patient.events]),
  }));
}

export function markOrder(state, orderId, time, status) {
  requireRole(state, 'nurse');
  if (!HOURS.includes(time) || !['planned', 'done', 'missed'].includes(status)) throw new Error('Некорректная отметка выполнения');
  return updatePatient(state, (patient) => {
    const order = patient.orders.find((item) => item.id === orderId);
    if (!order) throw new Error('Назначение не найдено');
    const slot = order.slots.find((item) => item.time === time);
    if (!slot) throw new Error('На этот час назначение не запланировано');
    if (slot.status === status) return patient;
    const updated = withSlots(order, order.slots.map((item) => item.time === time ? { ...item, status } : item));
    const title = status === 'done' ? 'Назначение выполнено' : status === 'missed' ? 'Назначение пропущено' : 'Отметка выполнения отменена';
    return {
      ...patient,
      orders: patient.orders.map((item) => item.id === orderId ? updated : item),
      orderMarkUndo: [...patient.orderMarkUndo, { orderId, time, previousStatus: slot.status, nextStatus: status }].slice(-50),
      events: clampEventList([event(title, `${order.name}${order.volume ? ` · ${order.volume} мл` : ''}`, 'nurse', `${time}:00`), ...patient.events]),
    };
  });
}

export function toggleOrder(state, orderId, time) {
  requireRole(state, 'nurse');
  const order = getPatient(state).orders.find((item) => item.id === orderId);
  if (!order) throw new Error('Назначение не найдено');
  const slot = order.slots.find((item) => item.time === (time ?? order.slots[0].time));
  if (!slot) throw new Error('На этот час назначение не запланировано');
  return markOrder(state, orderId, slot.time, slot.status === 'done' ? 'planned' : 'done');
}

export function toggleScheduleSlot(state, orderId, time) {
  requireRole(state, 'doctor');
  if (!HOURS.includes(time)) throw new Error('Выберите время назначения');
  return updatePatient(state, (patient) => {
    const order = patient.orders.find((item) => item.id === orderId);
    if (!order) throw new Error('Назначение не найдено');
    const slot = order.slots.find((item) => item.time === time);
    if (slot && slot.status !== 'planned') throw new Error('Сначала отмените отметку медсестры');
    if (slot && order.slots.length === 1) throw new Error('У назначения должно остаться время выполнения');
    const slots = slot ? order.slots.filter((item) => item.time !== time)
      : [...order.slots, { time, status: 'planned' }].sort((a, b) => HOURS.indexOf(a.time) - HOURS.indexOf(b.time));
    return { ...patient,
      orders: patient.orders.map((item) => item.id === orderId ? withSlots(item, slots) : item),
      orderMarkUndo: patient.orderMarkUndo.filter((item) => item.orderId !== orderId || item.time !== time),
      events: clampEventList([event(slot ? 'Время назначения удалено' : 'Добавлено время назначения', `${order.name} · ${time}:00`, 'doctor'), ...patient.events]),
    };
  });
}

export function undoLastOrderMark(state) {
  requireRole(state, 'nurse');
  return updatePatient(state, (patient) => {
    const previous = patient.orderMarkUndo.at(-1);
    if (!previous) throw new Error('Нет отметок для отмены');
    const order = patient.orders.find((item) => item.id === previous.orderId);
    if (!order?.slots.some((slot) => slot.time === previous.time)) throw new Error('Назначение для отмены не найдено');
    const slots = order.slots.map((slot) => slot.time === previous.time ? { ...slot, status: previous.previousStatus } : slot);
    return { ...patient,
      orders: patient.orders.map((item) => item.id === previous.orderId ? withSlots(item, slots) : item),
      orderMarkUndo: patient.orderMarkUndo.slice(0, -1),
      events: clampEventList([event('Последняя отметка отменена', `${order.name} · ${previous.time}:00`, 'nurse'), ...patient.events]),
    };
  });
}

export function deleteOrder(state, orderId) {
  requireRole(state, 'doctor');
  return updatePatient(state, (patient) => {
    const order = patient.orders.find((item) => item.id === orderId);
    if (!order) throw new Error('Назначение не найдено');
    if (order.slots.some((slot) => slot.status === 'done')) throw new Error('Сначала отмените отметки выполнения');
    return {
      ...patient, orders: patient.orders.filter((item) => item.id !== orderId),
      orderMarkUndo: patient.orderMarkUndo.filter((item) => item.orderId !== orderId),
      events: clampEventList([event('Назначение удалено', order.name, 'doctor'), ...patient.events]),
    };
  });
}

export function addVital(state, values) {
  if (!['doctor', 'nurse'].includes(state.role)) throw new Error('Недоступная роль');
  const vital = { ...values, time: values.time ?? '12:00', respiratory: values.respiratory ?? 18, cvp: values.cvp ?? 6 };
  if (!vitalIsValid(vital)) throw new Error('Проверьте значения показателей');
  return updatePatient(state, (patient) => ({
    ...patient,
    vitalUndo: [...patient.vitalUndo, patient.vitals].slice(-20),
    vitals: [...patient.vitals.filter((item) => item.time !== vital.time), vital].sort((a, b) => shiftMinutes(a.time) - shiftMinutes(b.time)),
    events: clampEventList([event('Обновлены показатели', `АД ${vital.systolic}/${vital.diastolic} · пульс ${vital.pulse} · SpO₂ ${vital.spo2}%`, state.role, vital.time), ...patient.events]),
  }));
}

export function addOutput(state, { volume, label = 'Диурез', time = '12:00' }) {
  requireRole(state, 'nurse');
  if (!isNumber(volume, 1, 2000)) throw new Error('Объём должен быть от 1 до 2000 мл');
  if (!isString(label)) throw new Error('Укажите вид выведения');
  if (!validTime(time)) throw new Error('Укажите время выведения');
  return updatePatient(state, (patient) => ({
    ...patient, outputEntries: [...patient.outputEntries, { id: nextId('output'), time, label, volume }],
    events: clampEventList([event('Учтено выведение', `${label} · ${volume} мл`, 'nurse', time), ...patient.events]),
  }));
}

export function undoLastVital(state) {
  if (!['doctor', 'nurse'].includes(state.role)) throw new Error('Недоступная роль');
  return updatePatient(state, (patient) => {
    if (!patient.vitalUndo.length && patient.vitals.length <= 1) throw new Error('Последнюю точку показателей удалить нельзя');
    const vitals = patient.vitalUndo.length ? patient.vitalUndo.at(-1) : patient.vitals.slice(0, -1);
    return { ...patient, vitals, vitalUndo: patient.vitalUndo.slice(0, -1),
      events: clampEventList([event('Последний ввод показателей отменён', 'Предыдущие значения восстановлены', state.role), ...patient.events]) };
  });
}

export function undoLastOutput(state) {
  requireRole(state, 'nurse');
  return updatePatient(state, (patient) => {
    if (patient.outputEntries.length <= 1) throw new Error('Последнюю исходную запись удалить нельзя');
    const removed = patient.outputEntries.at(-1);
    return { ...patient, outputEntries: patient.outputEntries.slice(0, -1),
      events: clampEventList([event('Последний ввод выведения отменён', `${removed.label} · ${removed.volume} мл`, 'nurse'), ...patient.events]) };
  });
}

export function clearOrders(state) {
  requireRole(state, 'doctor');
  return updatePatient(state, (patient) => ({ ...patient, orders: [], orderMarkUndo: [],
    events: clampEventList([event('Назначения очищены', 'Все назначения текущей учебной карты удалены', 'doctor'), ...patient.events]) }));
}

function isUnique(items) {
  return new Set(items.map((item) => item.id)).size === items.length;
}

function stateIsValid(state) {
  if (!state || state.version !== 2 || !['doctor', 'nurse'].includes(state.role)
    || !['orders', 'vitals', 'balance'].includes(state.tab) || !Array.isArray(state.patients)
    || state.patients.length !== 3 || !state.patients.every((patient) => patient && isString(patient.id))
    || !isUnique(state.patients) || !state.patients.some((patient) => patient.id === state.patientId)) return false;
  return state.patients.every((patient) => isString(patient.name) && isString(patient.bed)
    && isString(patient.diagnosis) && isString(patient.history) && isNumber(patient.age, 0, 120)
    && isNumber(patient.baseInput, 0, 100000) && isNumber(patient.baseOutput, 0, 100000)
    && Array.isArray(patient.orders) && patient.orders.every((order) => order && isString(order.id)
      && isString(order.name) && isString(order.description) && ['infusion', 'enteral', 'oral', 'monitoring', 'drug'].includes(order.type)
      && isNumber(order.volume, 0, 2000) && HOURS.includes(order.time)
      && typeof order.completed === 'boolean' && typeof order.createdByUser === 'boolean'
      && Array.isArray(order.slots) && order.slots.length > 0 && order.slots.length <= 24
      && order.slots.every((slot) => slot && HOURS.includes(slot.time) && ['planned', 'done', 'missed'].includes(slot.status))
      && new Set(order.slots.map((slot) => slot.time)).size === order.slots.length
      && order.time === order.slots[0].time && order.completed === order.slots.every((slot) => slot.status === 'done')) && isUnique(patient.orders)
    && Array.isArray(patient.outputEntries) && patient.outputEntries.every((entry) => entry && isString(entry.id)
      && validTime(entry.time) && isString(entry.label) && isNumber(entry.volume, 1, 2000)) && isUnique(patient.outputEntries)
    && Array.isArray(patient.vitals) && patient.vitals.length > 0 && patient.vitals.every(vitalIsValid)
    && Array.isArray(patient.vitalUndo) && patient.vitalUndo.length <= 20
    && patient.vitalUndo.every((snapshot) => Array.isArray(snapshot) && snapshot.length > 0 && snapshot.every(vitalIsValid))
    && Array.isArray(patient.orderMarkUndo) && patient.orderMarkUndo.length <= 50
    && patient.orderMarkUndo.every((entry) => entry && isString(entry.orderId) && HOURS.includes(entry.time)
      && ['planned', 'done', 'missed'].includes(entry.previousStatus) && ['planned', 'done', 'missed'].includes(entry.nextStatus)
      && patient.orders.some((order) => order.id === entry.orderId && order.slots.some((slot) => slot.time === entry.time)))
    && Array.isArray(patient.events) && patient.events.length <= 12 && patient.events.every((entry) => entry && isString(entry.id)
      && validTime(entry.time) && isString(entry.title) && isString(entry.description) && ['doctor', 'nurse'].includes(entry.role)));
}

export function loadState(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    return stateIsValid(saved) ? saved : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveState(storage, state) {
  try {
    if (!stateIsValid(state)) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
