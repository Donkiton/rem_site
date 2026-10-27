import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createDemoTranslator, DEMO_LOCALES, getDemoLocale } from '../src/translation.js';
import { createInitialState, getPatient, getBalance } from '../src/demo-state.js';

const catalogs = {};
for (const locale of DEMO_LOCALES) catalogs[locale] = JSON.parse(await readFile(new URL(`../src/locales/${locale}.json`, import.meta.url), 'utf8'));

test('язык демо выбирается из маршрута сайта, неподдерживаемые значения безопасно возвращают русский', () => {
  for (const locale of DEMO_LOCALES) assert.equal(getDemoLocale(`?lang=${locale}`), locale);
  for (const search of ['', '?lang=fr', '?lang=__proto__', '?language=en']) assert.equal(getDemoLocale(search), 'ru');
});

test('перевод интерфейса и составных медицинских строк не изменяет модель и баланс', () => {
  const state = createInitialState();
  const before = JSON.stringify(state);
  for (const locale of DEMO_LOCALES) {
    const { t, tr } = createDemoTranslator(catalogs[locale], locale);
    assert.equal(t('Назначения'), catalogs[locale]['Назначения']);
    assert.equal(t('Выполнено'), catalogs[locale]['Выполнено']);
    assert.equal(t('Не выполнено'), catalogs[locale]['Не выполнено']);
    assert.equal(tr('Алексей Морозов'), catalogs[locale]['Алексей Морозов']);
    const clinical = tr('S. NaCl 0,9% — 10 мл, в/в струйно');
    assert.ok(clinical.includes('NaCl'), 'латинское наименование сохранено');
    if (locale !== 'ru') assert.doesNotMatch(clinical, /[А-Яа-яЁё]/);
    assert.deepEqual(getBalance(getPatient(state)), { input: 770, output: 450, net: 320, planned: 1210 });
  }
  assert.equal(JSON.stringify(state), before, 'локализация не переписывает данные пациента');
});

test('перевод сохраняет неизвестные пользовательские названия и подставляет параметры', () => {
  const { t } = createDemoTranslator({ 'Час {hour}': 'Hour {hour}', 'г': 'g' }, 'en');
  assert.equal(t('Час {hour}', { hour: 0 }), 'Hour 0');
  assert.equal(t('Час 12'), 'Hour 12');
  assert.equal(t('Patient-entered label 7'), 'Patient-entered label 7');
  assert.equal(t('Дренажи'), 'Дренажи', 'короткая единица не заменяет буквы внутри слов');
});
