'use strict';

/**
 * Logger minimalista con marca de tiempo.
 * Suficiente para el MVP; se puede sustituir por pino/winston más adelante.
 */
function ts() {
  return new Date().toISOString();
}

const logger = {
  info: (...args) => console.log(`[${ts()}] [INFO]`, ...args),
  warn: (...args) => console.warn(`[${ts()}] [WARN]`, ...args),
  error: (...args) => console.error(`[${ts()}] [ERROR]`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${ts()}] [DEBUG]`, ...args);
    }
  },
};

module.exports = logger;
