import * as migration_20260325_222610 from './20260325_222610';
import * as migration_20260325_223736 from './20260325_223736';
import * as migration_20260329_221620 from './20260329_221620';
import * as migration_20260406_062532 from './20260406_062532';
import * as migration_20260520_113552 from './20260520_113552';

export const migrations = [
  {
    up: migration_20260325_222610.up,
    down: migration_20260325_222610.down,
    name: '20260325_222610',
  },
  {
    up: migration_20260325_223736.up,
    down: migration_20260325_223736.down,
    name: '20260325_223736',
  },
  {
    up: migration_20260329_221620.up,
    down: migration_20260329_221620.down,
    name: '20260329_221620',
  },
  {
    up: migration_20260406_062532.up,
    down: migration_20260406_062532.down,
    name: '20260406_062532',
  },
  {
    up: migration_20260520_113552.up,
    down: migration_20260520_113552.down,
    name: '20260520_113552'
  },
];
