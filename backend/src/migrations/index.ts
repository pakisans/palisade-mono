import * as migration_20260618_172014_initial from './20260618_172014_initial';

export const migrations = [
  {
    up: migration_20260618_172014_initial.up,
    down: migration_20260618_172014_initial.down,
    name: '20260618_172014_initial'
  },
];
