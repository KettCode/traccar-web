import dayjs from 'dayjs';

export const toDateTimeInput = (value) => (value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : '');

export const fromDateTimeInput = (value) => (value ? dayjs(value).toISOString() : null);

export const toNumber = (value) => (value === '' ? 0 : Number(value));

export const memberTitle = (item) => item.displayName || `Member #${item.id}`;

export const userTitle = (item) => item.name || item.login || `User #${item.id}`;

export const speedhuntTitle = (item) =>
  item.sequenceNumber > 0 ? String(item.sequenceNumber) : `Speedhunt #${item.id}`;

export const jokerTitle = (item, typeLabels = {}) => {
  const type = typeLabels[item.type] || item.type;
  return `Joker #${item.id}: ${type}`;
};

export const pingTitle = (item, sourceLabels = {}) => {
  const source = sourceLabels[item.source] || item.source;
  return `Ping #${item.id}: ${source}` ;
};

export const relationTitle = (prefix, item, ...parts) =>
  [`${prefix} #${item.id}`, ...parts.filter(Boolean)].join(' - ');
