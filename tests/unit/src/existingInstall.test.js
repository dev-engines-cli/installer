import { chdir } from 'node:process';

import { select } from '@clack/prompts';

import { handleExistingInstall } from '@/existingInstall.js';

/*
vi.mock('node:child_process', () => {
  return {
    execSync: vi.fn()
  };
});
*/
vi.mock('node:process', () => {
  return {
    chdir: vi.fn()
  };
});
// Required because @clack/prompts is only installed in /installer folder
vi.mock('@clack/prompts', () => {
  return {
    select: vi.fn(() => {
      return Promise.resolve(null);
    })
  };
});

const mockedChdir = vi.mocked(chdir);
const mockedSelect = vi.mocked(select);


const simulateUserSelection = function (selection) {
  mockedSelect.mockResolvedValue(Promise.resolve(selection));
};

describe('Existing Install', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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
            'DEVENGINES CLI INSTALLER:',
            'Git CLI not found,',
            'upgrade not possible.',
            'Either install git or do a fresh install.'
          ].join(' '));

        expect(result)
          .toEqual('done');
      });

      test('Returns "done" if chdir fails', async () => {
        simulateUserSelection('upgrade');
        mockedChdir.mockResolvedValue(() => {
          throw 'error';
        });
        const state = {
          existingVersion: '1.0.0',
          gitInstalled: true,
          dotDevEnginesPath: '/'
        };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith([
            'DEVENGINES CLI INSTALLER:',
            'Error changing directory to devEngines installation.'
          ].join(' '));

        expect(result)
          .toEqual('done');
      });
    });

    describe('User picks "delete"', () => {
      test('Hits stub', async () => {
        simulateUserSelection('delete');
        const state = { existingVersion: '1.0.0' };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith('STUB: deleteAndReinstall');

        expect(result)
          .toEqual('done');
      });
    });

    describe('User picks "uninstall"', () => {
      test('Hits stub', async () => {
        simulateUserSelection('uninstall');
        const state = { existingVersion: '1.0.0' };
        const result = await handleExistingInstall(state);

        expect(console.log)
          .toHaveBeenCalledWith('STUB: uninstallDevEnginesCli');

        expect(result)
          .toEqual('done');
      });
    });
  });
});
