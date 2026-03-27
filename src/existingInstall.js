/**
 * @file Logic for dealing with existing devEngines CLI installs.
 */

import { execSync } from 'node:child_process';
import { chdir } from 'node:process';

import { select } from '@clack/prompts';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

/**
 * Attempts `git pull` on the installation to get
 * latest code.
 *
 * @param  {STATE}  state  Installer state/data
 * @return {string}        'done'
 */
const attemptUpgrade = async function (state) {
  console.info(0);
  if (!state.gitInstalled) {
    console.info(1);
    logger('Git CLI not found, upgrade not possible. Either install git or do a fresh install.');
    return 'done';
  }

  try {
    console.info(2, state.dotDevEnginesPath);
    // cd to the installation
    chdir(state.dotDevEnginesPath);
  } catch {
    console.info(3);
    logger('Error changing directory to devEngines installation.');
    return 'done';
  }

  try {
    console.info(4);
    // check `git status` to ensure `main` branch with no changes
    const status = String(execSync('git status'));
    if (!status.includes('On branch main')) {
      logger(
        'The devEngines CLI installation is not based on the main branch. ' +
        'Either manually change it to the main branch or do a fresh install.'
      );
      return 'done';
    }
    if (!status.includes('nothing to commit, working tree clean')) {
      // TODO: Need to stop committing cacheLists folder for this to work
      logger(
        'Your devEngines CLI installation has uncommitted changes. ' +
        'Manually resolve these, or do a fresh install.'
      );
      return 'done';
    }
  } catch {
    console.info(5);
    logger('Unable to check status prior to updating.');
    return 'done';
  }

  try {
    console.info(6);
    logger('Updating');
    const result = String(execSync('git pull origin main'));
    console.log(result);
  } catch {
    console.info(7);
    logger('Issue running `git pull origin main` on .devEngines installation.');
  }

  console.info(8);
  logger('Update complete.');
  return 'done';
};

const deleteAndReinstall = async function () {
  console.log('STUB: deleteAndReinstall');
  return 'done';
};

const uninstallDevEnginesCli = async function () {
  console.log('STUB: uninstallDevEnginesCli');
  return 'done';
};

/**
 * Handles if an existing install of devEngines is found, letting
 * the user pick how to proceed.
 *
 * @param  {STATE}  state  Installer state/data
 * @return {string}        Completion status
 */
export const handleExistingInstall = async function (state) {
  if (state.existingVersion) {
    const choice = await select({
      message: 'Found an existing installation of devEngines CLI (v' + state.existingVersion + '):',
      options: [
        {
          label: 'Keep it',
          value: 'keep',
          hint: 'exit installer'
        },
        {
          label: 'Upgrade',
          value: 'upgrade',
          hint: 'keep, but attempt to update it'
        },
        {
          label: 'Fresh install',
          value: 'delete',
          hint: 'Delete it, redownload, and reinstall'
        },
        {
          label: 'Uninstall',
          value: 'uninstall',
          hint: 'delete and remove "devEngines" from your PATH'
        }
      ]
    });
    if (choice === 'keep') {
      return 'done';
    }
    const choiceMap = {
      upgrade: attemptUpgrade,
      delete: deleteAndReinstall,
      uninstall: uninstallDevEnginesCli
    };
    const result = await choiceMap[choice](state);
    return result;
  }
};
