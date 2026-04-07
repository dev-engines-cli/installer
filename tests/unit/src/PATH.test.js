import { join } from 'node:path';

import { select } from '@clack/prompts';
import {
  addToPATH,
  removeFromPATH
} from 'all-caps-path';

import {
  addShimsToPath,
  removeShimsFromPath
} from '@/PATH.js';
import { PREFIX } from '@/logger.js';

vi.mock('@clack/prompts', () => {
  return {
    select: vi.fn(() => {
      return Promise.resolve(null);
    })
  };
});
vi.mock('all-caps-path', () => {
  return {
    addToPATH: vi.fn(),
    ALLOWED_SHELLS: [
      '.bashrc',
      '.zshrc'
    ],
    removeFromPATH: vi.fn()
  };
});
vi.mock('node:os', () => {
  return {
    platform: vi.fn(() => {
      return global.mockedPlatform;
    })
  };
});

const mockedAddToPATH = vi.mocked(addToPATH);
const mockedRemoveFromPATH = vi.mocked(removeFromPATH);
const mockedSelect = vi.mocked(select);
const shimsPath = join('/home', 'FAKE_USER', '.devEngines', 'shims');
const state = { shimsPath };
const error = 'error';

const simulateUserSelection = function (selection) {
  mockedSelect.mockResolvedValue(Promise.resolve(selection));
};

describe('PATH', () => {
  beforeEach(() => {
    global.mockedPlatform = 'win32';
  });

  describe('addShimsToPath', () => {
    test('Successfully adds shims to PATH', async () => {
      global.mockedPlatform = 'linux';
      simulateUserSelection('.bashrc');
      mockedAddToPATH.mockResolvedValue(undefined);

      await addShimsToPath(state);

      expect(console.log)
        .toHaveBeenCalledWith([
          PREFIX,
          'Added shims to PATH:',
          shimsPath
        ].join(' '));
    });

    test('Fails to add shims to PATH', async () => {
      mockedAddToPATH.mockRejectedValue(error);

      await addShimsToPath(state);

      expect(console.log)
        .toHaveBeenCalledWith(PREFIX + ' Error adding shims to PATH (' + shimsPath + ')', error);
    });
  });

  describe('removeShimsFromPath', () => {
    test('Successfully removes shims from PATH', async () => {
      mockedRemoveFromPATH.mockResolvedValue(undefined);

      await removeShimsFromPath(state);

      expect(console.log)
        .toHaveBeenCalledWith([
          PREFIX,
          'Removed shims from PATH:',
          shimsPath
        ].join(' '));
    });

    test('Fails to remove shims from PATH', async () => {
      mockedRemoveFromPATH.mockRejectedValue(error);

      await removeShimsFromPath(state);

      expect(console.log)
        .toHaveBeenCalledWith(PREFIX + ' Error removing shims from PATH (' + shimsPath + ')', error);
    });
  });
});
