/**
 * @file Functions for adding/removing folders to/from the PATH.
 */

/**
 * Consider using a library for this
 *
 * https://github.com/ritch/paths
 * Only does Unix, last update 2012, just updates the ~/.profile, uses CJS
 *
 * https://git.rootprojects.org/root/pathman/src/branch/master/npm
 * Just downloads a binary to add/remove from the PATH for you. The source code is actually GO.
 *
 * https://github.com/MarkTiedemann/win-path
 * Only does Windows, requires powershell already in PATH (should be fine), uses CJS, published 2017
 */

import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import {
  homedir,
  platform
} from 'node:os';
import { join } from 'node:path';

import { logger } from './logger.js';

/** @typedef {import('../types.js').STATE} STATE */

function addToWindowsPATH () {
  logger('STUB: Windows implementation not complete.');
}

/**
 * Add the shims folder to the user's PATH for Unix based systems.
 *
 * @param {STATE} state Installer state
 */
function addToUnixPATH (state) {
  const home = state.homeDirectory;
  const shell = process.env.SHELL || '/bin/bash';
  let configFile;
  if (shell.includes('zsh')) {
    configFile = join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    // For osx, prefer .bash_profile, fallback to .bashrc
    configFile = join(home, '.bashrc');
    if (existsSync(join(home, '.bash_profile'))) {
      configFile = join(home, '.bash_profile');
    }
  } else {
    configFile = join(home, '.profile');
  }
}

/**
 * Add the shims folder to the user's PATH.
 *
 * @param {STATE} state Installer state
 */
export const addShimsToPath = function (state) {
  if (platform() === 'win32') {
    addToWindowsPATH();
  } else {
    addToUnixPATH();
  }


  /*
  const shimsDir = join(__dirname, '..', 'shims');

  // Mac/Linux: Find config file
  const home = homedir();


  const exportLine = `\n# devEngines\nexport PATH="${shimsDir}:$PATH"\n`;
  logger('exportLine', exportLine);

  // Check if already added
  if (existsSync(configFile)) {
    const content = readFileSync(configFile, 'utf-8');
    if (content.includes('devEngines')) {
      logger('PATH already configured in:', configFile);
      return;
    }
  }

  appendFileSync(configFile, exportLine);
  logger('Added to PATH in:', configFile);
  logger('\nRestart your terminal or run:');
  logger(`  source ${configFile}`);
  */
};

/**
 * Remove the shims folder from the user's PATH.
 *
 * @param {STATE} state Installer state
 */
export const removeShimsFromPath = function (state) {
  if (platform() === 'win32') {
    logger('Remove the devEngines shims folder from your PATH manually.');
    return;
  }
  /*

  // Check config files
  const home = homedir();
  const configFiles = [
    join(home, '.zshrc'),
    join(home, '.bashrc'),
    join(home, '.bash_profile'),
    join(home, '.profile')
  ];

  for (const configFile of configFiles) {
    if (!existsSync(configFile)) {
      continue;
    }

    const content = readFileSync(configFile, 'utf-8');
    if (content.includes('devEngines')) {
      // Remove the devEngines lines
      const newContent = content
        .split('\n')
        .filter((line) => !line.includes('devEngines'))
        .join('\n');

      writeFileSync(configFile, newContent);
      logger('Removed from:', configFile);
    }
  }

  logger('\nRestart your terminal to complete uninstallation.');
  */
};
