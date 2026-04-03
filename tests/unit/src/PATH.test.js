import { join } from 'node:path';

import { addToPATH, removeFromPATH } from 'all-caps-path';

import {
  addShimsToPath,
  removeShimsFromPath
} from '@/PATH.js';
import { PREFIX } from '@/logger.js';

vi.mock('all-caps-path', () => {
  return {
    addToPATH: vi.fn(),
    removeFromPATH: vi.fn()
  };
});

const mockedAddToPATH = vi.mocked(addToPATH);
const mockedRemoveFromPATH = vi.mocked(removeFromPATH);
const shimsPath = join('/home', 'FAKE_USER', '.devEngines', 'shims');
const state = { shimsPath };
const error = 'error';

describe('PATH', () => {
  describe('addShimsToPath', () => {
    test('Successfully adds shims to PATH', async () => {
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
