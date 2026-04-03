/* eslint-disable jsdoc/reject-any-type */

/**
 * @file Centralized logging function.
 */

export const PREFIX = 'DEVENGINES CLI INSTALLER:';

/**
 * Centralized logging function.
 *
 * @param {string} message  Any message to be logged to the console
 * @param {any}    data     Any additional data
 */
export const logger = function (message, data) {
  if (data) {
    console.log(PREFIX + ' ' + message, data);
  } else {
    console.log(PREFIX + ' ' + message);
  }
};
