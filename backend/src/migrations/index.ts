import * as migration_20260618_172014_initial from './20260618_172014_initial';
import * as migration_20260619_204950_hero_media_style from './20260619_204950_hero_media_style';
import * as migration_20260624_100035_settings_global from './20260624_100035_settings_global';
import * as migration_20260625_100230_about_mission_block from './20260625_100230_about_mission_block';
import * as migration_20260625_101728_about_mission_video_cover from './20260625_101728_about_mission_video_cover';
import * as migration_20260708_105507_product_docs from './20260708_105507_product_docs';

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
    name: '20260624_100035_settings_global',
  },
  {
    up: migration_20260625_100230_about_mission_block.up,
    down: migration_20260625_100230_about_mission_block.down,
    name: '20260625_100230_about_mission_block',
  },
  {
    up: migration_20260625_101728_about_mission_video_cover.up,
    down: migration_20260625_101728_about_mission_video_cover.down,
    name: '20260625_101728_about_mission_video_cover',
  },
  {
    up: migration_20260708_105507_product_docs.up,
    down: migration_20260708_105507_product_docs.down,
    name: '20260708_105507_product_docs'
  },
];
