import { dirname, join } from 'node:path';
import { chdir } from 'node:process';

import { select } from '@clack/prompts';
import { fs, vol } from 'memfs';

import { run } from '@/devEnginesInstaller.js';
import { logo } from '@/logo.js';


vi.mock('node:child_process', () => {
  return {
    execSync: vi.fn()
  };
});
vi.mock('node:fs', () => {
  return fs;
});
vi.mock('node:os', () => {
  return {
    homedir: vi.fn(() => {
      return join('/home', 'FAKE_USER');
    })
  };
});
vi.mock('node:process', () => {
  return {
    chdir: vi.fn(),
    cwd: vi.fn(() => {
      return '/';
    })
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

describe('Run the installer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  test('Runs, without an existing install', async () => {
    await run();

    expect(console.log)
      .toHaveBeenCalledWith(logo);

    expect(console.log)
      .toHaveBeenCalledWith({
        state: {
          cwd: '/',
          devEnginesCliManifestPath: join('/home', 'FAKE_USER', '.devEngines', 'package.json'),
          dotDevEnginesPath: join('/home', 'FAKE_USER', '.devEngines'),
          existingVersion: undefined,
          gitInstalled: false,
          homeDirectory: join('/home', 'FAKE_USER'),
          manifestExists: false
        }
      });

    expect(mockedChdir)
      .not.toHaveBeenCalled();
  });

  test('Runs and keeps existing install', async () => {
    mockedSelect.mockResolvedValue(Promise.resolve('keep'));
    const manifestPath = join('/home', 'FAKE_USER', '.devEngines', 'package.json');
    const content = JSON.stringify({ version: '1.0.0' }, null, 2) + '\n';
    vol.mkdirSync(dirname(manifestPath), { recursive: true });
    vol.writeFileSync(manifestPath, content);
    await run();

    expect(console.log)
      .toHaveBeenCalledWith(logo);

    expect(console.log)
      .toHaveBeenCalledWith({
        state: {
          cwd: '/',
          devEnginesCliManifestPath: join('/home', 'FAKE_USER', '.devEngines', 'package.json'),
          dotDevEnginesPath: join('/home', 'FAKE_USER', '.devEngines'),
          existingVersion: '1.0.0',
          gitInstalled: false,
          homeDirectory: join('/home', 'FAKE_USER'),
          manifestExists: true
        }
      });

    expect(mockedChdir)
      .toHaveBeenCalledWith('/');
  });
});
