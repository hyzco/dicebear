import { ColorCollection, Color } from '@dicebear/core/lib/types';

type Options = {
  colors?: Array<keyof ColorCollection>;
  primaryColorLevel?: keyof Color;
  secondaryColorLevel?: keyof Color;
  colorful?: boolean;
  mouthChance?: number;
  sidesChance?: number;
  textureChance?: number;
  topChance?: number;
};

export default Options;
