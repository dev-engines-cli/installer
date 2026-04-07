/**
 * @file Functions for adding/removing folders to/from the PATH.
 */

import { platform } from 'node:os';

import { select } from '@clack/prompts';
import {
  addToPATH,
  ALLOWED_SHELLS,
  removeFromPATH
} from 'all-caps-path';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

/**
 * Add the shims folder to the user's PATH.
 *
 * @param {STATE} state  Installer state
 */
export const addShimsToPath = async function (state) {
  let shell;
  if (!platform().startsWith('win')) {
    shell = await select({
      message: 'Where should the PATH be updated at?',
      options: ALLOWED_SHELLS.map((shellConfig) => {
        return {
          label: shellConfig,
          value: shellConfig
        };
      })
    });
  }

  try {
    await addToPATH(state.shimsPath, logger, shell);
    logger('Added shims to PATH: ' + state.shimsPath);
  } catch (error) {
    logger('Error adding shims to PATH (' + state.shimsPath + ')', error);
  }
};

/**
 * Remove the shims folder from the user's PATH.
 *
 * @param {STATE} state  Installer state
 */
export const removeShimsFromPath = async function (state) {
  try {
    await removeFromPATH(state.shimsPath);
    logger('Removed shims from PATH: ' + state.shimsPath);
    logger('Restart your terminal to complete uninstallation.');
  } catch (error) {
    logger('Error removing shims from PATH (' + state.shimsPath + ')', error);
  }
};
