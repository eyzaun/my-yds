// This file captures the build time during compilation

export const BUILD_TIME = new Date().toLocaleString('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

export const BUILD_TIME_ISO = new Date().toISOString();
