import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { chdir } from 'node:process';

import { select } from '@clack/prompts';
import { fs, vol } from 'memfs';

import { handleExistingInstall } from '@/existingInstall.js';
import { PREFIX } from '@/logger.js';

vi.mock('node:child_process', () => {
  return {
    execSync: vi.fn()
  };
});
vi.mock('node:fs', () => {
  return fs;
});
vi.mock('node:process', () => {
  return {
    chdir: vi.fn()
  };
});
vi.mock('@clack/prompts', () => {
  return {
    select: vi.fn(() => {
      return Promise.resolve(null);
    })
  };
});

const mockedChdir = vi.mocked(chdir);
const mockedExecSync = vi.mocked(execSync);
const mockedSelect = vi.mocked(select);

const simulateUserSelection = function (selection) {
  mockedSelect.mockResolvedValue(Promise.resolve(selection));
};

describe('Existing Install', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  describe('handleExistingInstall', () => {
    test('Nothing happens if no version exists', async () => {
      const state = { existingVersion: undefined };
      const result = await handleExistingInstall(state);

      expect(result)
        .toEqual(undefined);
    });

    test('Presents selection to user', async () => {
      simulateUserSelection('keep');
      const state = { existingVersion: '1.0.0' };
      await handleExistingInstall(state);

      expect(select)
        .toHaveBeenCalledWith({
          message: 'Found an existing installation of devEngines CLI (v1.0.0):',
          options: expect.any(Array)
        });
    });

    describe('User picks "keep"', () => {
      test('Returns "done"', async () => {
        simulateUserSelection('keep');
        const state = { existingVersion: '1.0.0' };
        const result = await handleExistingInstall(state);

        expect(result)
          .toEqual('done');
      });
    });

    describe('User picks "upgrade"', () => {
      test('Returns "done" with warning if git not installed', async () => {
        simulateUserSelection('upgrade');
        const state = { existingVersion: '1.0.0' };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Git CLI not found,',
            'upgrade not possible.',
            'Either install git or do a fresh install.'
          ].join(' '));

        expect(console.log)
          .not.toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" if chdir fails', async () => {
        mockedChdir.mockThrow();
        simulateUserSelection('upgrade');
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Error changing directory to devEngines installation.'
          ].join(' '));

        expect(console.log)
          .not.toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" if "git status" check fails', async () => {
        mockedExecSync.mockThrow();
        simulateUserSelection('upgrade');
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Unable to check status prior to updating.'
          ].join(' '));

        expect(console.log)
          .not.toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" if existing repo is on wrong branch', async () => {
        mockedExecSync.mockReturnValue('On branch asdf\nnothing to commit, working tree clean');
        simulateUserSelection('upgrade');
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'The devEngines CLI installation is not based on the main branch.',
            'Either manually change it to the main branch or do a fresh install.'
          ].join(' '));

        expect(console.log)
          .not.toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" if existing repo has uncommitted changes', async () => {
        mockedExecSync.mockReturnValue('On branch main\nChanges not staged for commit:');
        simulateUserSelection('upgrade');
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Your devEngines CLI installation has uncommitted changes.',
            'Manually resolve these, or do a fresh install.'
          ].join(' '));

        expect(console.log)
          .not.toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" if updating existing install fails', async () => {
        mockedExecSync
          .mockReturnValueOnce('On branch main\nnothing to commit, working tree clean')
          .mockThrow();
        simulateUserSelection('upgrade');
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Updating'
          ].join(' '));

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Issue running `git pull origin main` on .devEngines installation.'
          ].join(' '));

        expect(console.log)
          .not.toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" after updating the existing install', async () => {
        mockedExecSync
          .mockReturnValueOnce('On branch main\nnothing to commit, working tree clean')
          .mockReturnValueOnce('Already up to date.');
        simulateUserSelection('upgrade');
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            PREFIX,
            'Updating'
          ].join(' '));

        expect(console.log)
          .toHaveBeenCalledWith(PREFIX + ' Update complete.');

        expect(result)
          .toEqual('done');
      });
    });

    describe('User picks "reinstall"', () => {
      test('Hits stub', async () => {
        simulateUserSelection('reinstall');
        const state = {
          existingVersion: '1.0.0',
          dotDevEnginesPath: join('/home', 'FAKE_USER', '.devEngines')
        };
        vol.mkdirSync(state.dotDevEnginesPath, { recursive: true });
        const contents = JSON.stringify({ version: '1.0.0' }, null, 2) + '\n';
        vol.writeFileSync(join(state.dotDevEnginesPath, 'package.json'), contents);

        expect(vol.existsSync(state.dotDevEnginesPath))
          .toEqual(true);

        const result = await handleExistingInstall(state);

        expect(vol.existsSync(state.dotDevEnginesPath))
          .toEqual(false);

        expect(console.log)
          .toHaveBeenCalledWith('STUB: deleteAndReinstall');

        expect(result)
          .toEqual('done');
      });
    });

    describe('User picks "uninstall"', () => {
      test('Hits stub', async () => {
        simulateUserSelection('uninstall');
        const state = {
          existingVersion: '1.0.0',
          dotDevEnginesPath: join('/home', 'FAKE_USER', '.devEngines')
        };
        vol.mkdirSync(state.dotDevEnginesPath, { recursive: true });
        const contents = JSON.stringify({ version: '1.0.0' }, null, 2) + '\n';
        vol.writeFileSync(join(state.dotDevEnginesPath, 'package.json'), contents);

        expect(vol.existsSync(state.dotDevEnginesPath))
          .toEqual(true);

        const result = await handleExistingInstall(state);

        expect(vol.existsSync(state.dotDevEnginesPath))
          .toEqual(false);

        expect(console.log)
          .toHaveBeenCalledWith('STUB: uninstallDevEnginesCli');

        expect(result)
          .toEqual('done');
      });
    });
  });
});
