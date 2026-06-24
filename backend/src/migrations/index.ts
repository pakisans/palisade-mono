import * as migration_20260618_172014_initial from './20260618_172014_initial';
import * as migration_20260619_204950_hero_media_style from './20260619_204950_hero_media_style';
import * as migration_20260624_100035_settings_global from './20260624_100035_settings_global';

export const migrations = [
  {
    up: migration_20260618_172014_initial.up,
    down: migration_20260618_172014_initial.down,
    name: '20260618_172014_initial',
  },
  {
    up: migration_20260619_204950_hero_media_style.up,
    down: migration_20260619_204950_hero_media_style.down,
    name: '20260619_204950_hero_media_style',
  },
  {
    up: migration_20260624_100035_settings_global.up,
    down: migration_20260624_100035_settings_global.down,
    name: '20260624_100035_settings_global'
  },
];
