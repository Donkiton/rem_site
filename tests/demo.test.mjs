import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { LOCALES, createTranslator } from '../lib/i18n.ts';

const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/rem_site' : '';
const source = JSON.parse(await readFile(new URL('../demo/src/locales/source.json', import.meta.url), 'utf8'));
const siteCatalogs = {};
const demoCatalogs = {};
for (const locale of LOCALES) {
  siteCatalogs[locale] = JSON.parse(await readFile(new URL(`../content/i18n/${locale}.json`, import.meta.url), 'utf8'));
  demoCatalogs[locale] = JSON.parse(await readFile(new URL(`../demo/src/locales/${locale}.json`, import.meta.url), 'utf8'));
}
const placeholders = (text) => (text.match(/\{\w+\}/g) ?? []).sort();
const clean = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<option\b[^>]*>[\s\S]*?<\/option>/gi, '');

for (const locale of LOCALES) {
  test(`демо ${locale}: полный словарь с неизменными параметрами`, () => {
    const catalog = demoCatalogs[locale];
    for (const key of source) {
      assert.equal(typeof catalog[key], 'string', `${locale}: отсутствует ${key}`);
      assert.ok(catalog[key].trim(), `${locale}: пустая строка ${key}`);
      assert.deepEqual(placeholders(catalog[key]), placeholders(key), `${locale}: параметры ${key}`);
      if (locale !== 'ru') assert.doesNotMatch(catalog[key], /[А-Яа-яЁё]/, `${locale}: русский текст в переводе ${key}`);
    }
  });

  test(`демо ${locale}: отдельный маршрут, язык, предупреждение и ссылка с главной`, async () => {
    const prefix = locale === 'ru' ? '' : `${locale}/`;
    const html = await readFile(new URL(`../out/${prefix}demo/index.html`, import.meta.url), 'utf8');
    const home = await readFile(new URL(`../out/${prefix}index.html`, import.meta.url), 'utf8');
    const t = createTranslator(siteCatalogs[locale]);
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    assert.ok(html.includes(t('Интерактивное демо RemCard')));
    assert.ok(html.includes(t('Демонстрационная версия · часть возможностей отключена')));
    assert.ok(html.includes(`src="${basePath}/demo-app/index.html?lang=${locale}"`));
    assert.ok(home.includes(`href="${basePath}/${prefix}demo/"`), 'доступ с главной текущего языка');
    for (const alternate of LOCALES) {
      const route = `${alternate === 'ru' ? '' : `${alternate}/`}demo/`;
      assert.ok(html.includes(`href="https://donkiton.github.io/rem_site/${route}"`), `alternate ${alternate}`);
    }
    if (locale !== 'ru') assert.doesNotMatch(clean(html), /[А-Яа-яЁё]/, 'нет непереведённого текста страницы');
  });
}

test('дискета не рисуется в строках назначений', async () => {
  const code = await readFile(new URL('../demo/src/components/NativeOrders.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /name\s*=\s*["']savecard["']/);
});

test('сборка демо автономна и использует относительные ресурсы для GitHub Pages', async () => {
  const html = await readFile(new URL('../public/demo-app/index.html', import.meta.url), 'utf8');
  const scripts = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"?#]+)"/g)].map((match) => match[1]);
  assert.ok(scripts.length >= 2, 'скомпилированы JavaScript и CSS');
  for (const file of scripts) assert.ok((await stat(new URL(`../public/demo-app/${file}`, import.meta.url))).isFile());
  assert.doesNotMatch(html, /localhost|127\.0\.0\.1|\/src\/main\.jsx/);
  assert.ok((await stat(new URL('../out/demo-app/index.html', import.meta.url))).isFile());
});
