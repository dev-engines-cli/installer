/**
 * @file Deletes the devEngines install folder.
 *       Separated file for easier testing.
 */

import { rmSync } from 'node:fs';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

/**
 * Deletes the ~/.devEngines folder.
 *
 * @param {STATE} state Installer state
 */
export const deleteDevEnginesInstall = function (state) {
  try {
    rmSync(state.dotDevEnginesPath, { recursive: true, force: true });
  } catch (error) {
    logger('Error deleting existing devEngines installation. Try manually deleting the folder: ' + state.dotDevEnginesPath);
    console.log(error);
  }
};
