import { platform } from 'node:os';

import {
  addShimsToPath,
  removeShimsFromPath
} from '@/PATH.js';
import { PREFIX } from '@/logger.js';

vi.mock('node:os', () => {
  return {
    platform: vi.fn()
  };
});

const mockedPlatform = vi.mocked(platform);

describe('PATH', () => {
  describe('addShimsToPath', () => {
    test('Windows stub', () => {
      mockedPlatform.mockReturnValue('win32');

      addShimsToPath();

      expect(console.log)
        .toHaveBeenCalledWith([
          PREFIX,
          'STUB: Windows implementation not complete.'
        ].join(' '));
    });
  });

  describe('removeShimsFromPath', () => {
    test('Windows stub', () => {
      mockedPlatform.mockReturnValue('win32');

      removeShimsFromPath();

      expect(console.log)
        .toHaveBeenCalledWith([
          PREFIX,
          'Remove the devEngines shims folder from your PATH manually.'
        ].join(' '));
    });
  });
});
