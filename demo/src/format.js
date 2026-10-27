import { getDemoLocale } from './translation.js';

export const number = (value) => new Intl.NumberFormat(getDemoLocale()).format(value);
export const signed = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${number(Math.abs(value))}`;
export const roleName = (role) => role === 'doctor' ? 'Врач' : 'Медсестра';

export const date = (value) => new Intl.DateTimeFormat(getDemoLocale(), { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }).format(new Date(value + 'T12:00:00Z'));
