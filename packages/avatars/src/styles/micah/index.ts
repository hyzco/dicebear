import { IStyleDefaultOptions, IStyleSchema, IStyleCreate } from '../../interfaces';

export const name = 'micah';
export const title = 'Avatar Illustration System';
export const creator = 'Micah Lanier';
export const source = 'https://www.figma.com/community/file/829741575478342595';
export const license = {
  name: 'CC BY 4.0',
  link: 'https://creativecommons.org/licenses/by/4.0/',
};

type Options = {
  earrings: Array<'hoop' | 'stud'>;
  ears: Array<'attached' | 'detached'>;
  eyebrows: Array<'down' | 'eyelashesDown' | 'eyelashesUp' | 'up'>;
  eyes: Array<'eyes' | 'eyeshadow' | 'round' | 'smiling'>;
  facialHair: Array<'beard' | 'scruff'>;
  glasses: Array<'square' | 'round'>;
  mouth: Array<'frown' | 'laughing' | 'nervous' | 'pucker' | 'sad' | 'smile' | 'smirk' | 'surprised'>;
  nose: Array<'round' | 'pointed' | 'curve'>;
  shirt: Array<'open' | 'crew' | 'collared'>;
  tops: Array<'dannyPhantom' | 'dougFunny' | 'fonze' | 'full' | 'mrClean' | 'mrT' | 'pixie' | 'turban'>;
};

export const defaultOptions: IStyleDefaultOptions<Options> = {
  earrings: [],
  ears: [],
  eyebrows: [],
  eyes: [],
  facialHair: [],
  glasses: [],
  mouth: [],
  nose: [],
  shirt: [],
  tops: [],
};

export const schema: IStyleSchema = {};

export const create: IStyleCreate<Options> = () => {
  return {
    attributes: {
      viewBox: '0 0 639 639',
    },
    body: ``,
  };
};
