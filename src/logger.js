/**
 * @file Centralized logging function.
 */

export const PREFIX = 'DEVENGINES CLI INSTALLER:';

/**
 * Centralized logging function.
 *
 * @param {string} message  Any message to be logged to the console
 */
export const logger = function (message) {
  console.log(PREFIX + ' ' + message);
};
