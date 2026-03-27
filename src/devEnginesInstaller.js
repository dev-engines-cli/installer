/**
 * @file The entry point to the devEngines CLI installer.
 */

import { chdir } from 'node:process';

import { handleExistingInstall } from './existingInstall.js';
import { logger } from './logger.js';
import { logo } from './logo.js';
import { initializeState } from './state.js';

/**
 * Runs the installer to check for existing installs,
 * download/install Node.js, clone down devEngines CLI,
 * and add specific folders to the PATH. Or delete the
 * devEngines CLI and remove folders from PATH to
 * uninstall.
 *
 * @return {undefined} Does not return data.
 */
export const run = async function () {
  console.log(logo);

  const state = initializeState();
  // Remove later
  console.log({ state });

  const existingOutcome = await handleExistingInstall(state);
  if (existingOutcome === 'done') {
    logger('Done.');
    chdir(state.cwd);
    return;
  }

  /*
  How would you like to download the devEngines CLI?
    Use git clone HTTPS (disabled if unable to find local git)
    Use git clone SSH (disabled if unable to find local git)
    Use GitHub CLI (gh whatever, disabled if not found)
    download a zip over regular HTTPS
  */
  /*
  Downloading/Cloning ........
  Unzipping .........
  Downloading Node v25.5.1......
  Unzipping........
  Running npm i
  Adding to PATH.......
  DONE! It is now safe to exit and delete this installer.
  */
};
