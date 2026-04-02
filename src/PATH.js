/**
 * @file Functions for adding/removing folders to/from the PATH.
 */

import { addToPATH, removeFromPATH } from 'all-caps-path';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

/**
 * Add the shims folder to the user's PATH.
 *
 * @param {STATE} state Installer state
 */
export const addShimsToPath = async function (state) {
  try {
    await addToPATH(state.shimsPath);
    logger('Added shims to PATH: ' + state.shimsPath);
  } catch (error) {
    logger('Error adding shims to PATH (' + state.shimsPath +')', error);
  }
};

/**
 * Remove the shims folder from the user's PATH.
 *
 * @param {STATE} state Installer state
 */
export const removeShimsFromPath = function (state) {
  try {
    await removeFromPATH(state.shimsPath);
    logger('Removed shims from PATH: ' + state.shimsPath);
    logger('Restart your terminal to complete uninstallation.');
  } catch (error) {
    logger('Error removing shims from PATH (' + state.shimsPath + ')', error);
  }
};
