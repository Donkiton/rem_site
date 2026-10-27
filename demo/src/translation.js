export const DEMO_LOCALES = ['ru', 'en', 'zh-CN', 'ja', 'de'];

export function getDemoLocale(search = typeof window === 'undefined' ? '' : window.location.search) {
  const requested = new URLSearchParams(search).get('lang');
  return DEMO_LOCALES.includes(requested) ? requested : 'ru';
}

const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Translate canonical model strings only at the rendering boundary. */
export function createDemoTranslator(messages, locale) {
  const templates = [];
  const fragments = [];
  for (const [source, target] of Object.entries(messages)) {
    if (source.includes('{')) {
      const names = [];
      let expression = '', cursor = 0;
      for (const match of source.matchAll(/\{(\w+)\}/g)) {
        expression += escapeRegExp(source.slice(cursor, match.index)) + '(.+?)';
        names.push(match[1]);
        cursor = match.index + match[0].length;
      }
      expression += escapeRegExp(source.slice(cursor));
      templates.push({ pattern: new RegExp(`^${expression}$`, 'u'), names, target });
    } else if (source !== target && /[А-Яа-яЁё]/.test(source)) {
      // Letter boundaries keep short units such as «г» out of patient-entered words.
      const before = /^[\p{L}\p{N}]/u.test(source) ? '(?<![\\p{L}\\p{N}_])' : '';
      const after = /[\p{L}\p{N}]$/u.test(source) ? '(?![\\p{L}\\p{N}_])' : '';
      fragments.push({ source, target, pattern: new RegExp(before + escapeRegExp(source) + after, 'giu') });
    }
  }
  fragments.sort((a, b) => b.source.length - a.source.length);
  const interpolate = (value, values) => value.replace(/\{(\w+)\}/g, (token, name) => Object.hasOwn(values, name) ? String(values[name]) : token);
  const clinical = (value) => {
    if (typeof value !== 'string' || locale === 'ru') return value;
    const direct = messages[normalize(value)];
    if (direct !== undefined) return direct;
    let result = value;
    for (const fragment of fragments) result = result.replace(fragment.pattern, () => fragment.target);
    return result;
  };
  function t(value, values = {}) {
    if (typeof value !== 'string') return value;
    const key = normalize(value);
    let translated = messages[key];
    if (translated === undefined && locale !== 'ru') {
      for (const template of templates) {
        const match = template.pattern.exec(key);
        if (match) {
          translated = interpolate(template.target, Object.fromEntries(template.names.map((name, index) => [name, clinical(match[index + 1])])));
          break;
        }
      }
    }
    if (translated === undefined) translated = clinical(key);
    const leading = value.match(/^\s*/)?.[0] || '';
    const trailing = value.match(/\s*$/)?.[0] || '';
    return `${leading}${interpolate(translated, values)}${trailing}`;
  }
  return { t, tr: t };
}
