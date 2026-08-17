import dayjs from 'dayjs';

export const toNumber = (value) => (value === '' ? 0 : Number(value));

export const toDateTimeInput = (value) => (value ? dayjs(value).format('YYYY-MM-DDTHH:mm') : '');

export const fromDateTimeInput = (value) => (value ? dayjs(value).toISOString() : null);

export const getLookupLabel = (options = [], value) =>
  options.find((option) => option.value === value)?.label || value || '';

export const getPlayerTitle = (player) =>
  [
    player.name,
    player.userDisplayName || player.userLogin,
    player.deviceName || player.deviceUniqueId,
  ]
    .filter(Boolean)
    .join(' - ');
