import { rmSync } from 'node:fs';
import { join } from 'node:path';

import { deleteDevEnginesInstall } from '@/deleteInstall.js';

vi.mock('node:fs', () => {
  return {
    rmSync: vi.fn()
  };
});

const mockedRmSync = vi.mocked(rmSync);
const PREFIX = 'DEVENGINES CLI INSTALLER:';

describe('deleteInstall', () => {
  test('Logs information on failure to delete', () => {
    mockedRmSync.mockThrow();
    const dotDevEnginesPath = join('/home', 'FAKE_USER', '.devEngines');
    const state = { dotDevEnginesPath };
    deleteDevEnginesInstall(state);

    expect(console.log)
      .toHaveBeenCalledWith([
        PREFIX,
        'Error deleting existing devEngines installation.',
        'Try manually deleting the folder:',
        dotDevEnginesPath
      ].join(' '));
  });
});
