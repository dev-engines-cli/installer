/**
 * @file Sharable type definitions specific to the /installer folder.
 */

/**
 * @typedef  {object}  STATE
 * @property {string}  homeDirectory              Path to the users home directory
 * @property {string}  dotDevEnginesPath          Path to the installed devEngines folder
 * @property {string}  devEnginesCliManifestPath  Path to the installed devEngines package.json
 * @property {boolean} [gitInstalled=false]       true = `git` CLI is available in the PATH
 * @property {boolean} [manifestExists=false]     true = devEngines package.json exists
 * @property {string}  existingVersion            The installed devEngines version number
 */

/* eslint-disable-next-line import/no-unused-modules */
export const types = {};
