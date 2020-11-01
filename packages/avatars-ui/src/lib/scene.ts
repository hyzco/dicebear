import type { Modes, Scene, Styles } from '../types';

export function getPossibleScenes(modes: Modes, styles: Styles): Scene[] {
  let scenes: Scene[] = [];

  if (modes.length > 1) {
    scenes.push('mode');
  }

  if (Object.keys(styles).length > 1) {
    scenes.push('style');
  }

  scenes.push('form');

  return scenes;
}

export function getBackScene(modes: Modes, styles: Styles, scene: Scene): Scene {
  let possibleScenes = getPossibleScenes(modes, styles);
  let currentSceneIndex = possibleScenes.indexOf(scene);

  return currentSceneIndex === 0 ? undefined : possibleScenes[currentSceneIndex - 1];
}
