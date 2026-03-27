# devEngines CLI Installer

This repo contains the source code for the binary that is used to install the devEngines CLI.


## Running locally

1. Install the version of Bun denoted in the `packge.json:devEngines`
1. Run `npm install` to get dependencies
1. Run `npm start` to run the installer CLI source code


## Building

1. The builds happen automatically on GitHub Actions
1. To build locally do `npm run build`


## Tasks:

Tracking the project's progress.

* [x] Evaluate different tech stacks
  * [x] Bun Build <-- winner
  * [x] Node SEA
  * [x] Deno compile
  * [x] ~Neutralino~
  * [x] ~Batch/SH~
  * [x] ~NW.js~
* [x] Automated GHA builds for all platforms
* [x] 100% test coverage
* [ ] Handle existing installs of devEngines CLI
  * [x] keep
  * [x] upgrade
  * [ ] reinstall
  * [ ] uninstall
* [ ] Offer download Options:
  * [ ] git clone HTTPS
  * [ ] git clone SSH
  * [ ] GitHub CLI
  * [ ] https zip download options
* [ ] Clone repo or Download+Unzip
* [ ] Download/unzip correct Node version for the CLI
* [ ] Run `npm i`
* [ ] Add to PATH
* [ ] Remove from PATH (for uninstalls)
* [ ] Installation documentation
