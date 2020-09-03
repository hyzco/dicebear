import { IPrng } from './interfaces';

const MIN = -2147483648;
const MAX = 2147483647;

function hashSeed(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }

  return hash;
}

function randomSeed() {
  return MIN + Math.floor((MAX - MIN) * Math.random());
}

export function create(seed?: string): IPrng {
  let value = (seed ? hashSeed(seed) : randomSeed()) || 1;

  const next = () => {
    let newValue = value;

    newValue ^= newValue << 13;
    newValue ^= newValue >> 17;
    newValue ^= newValue << 5;

    return newValue;
  };

  const integer = (min: number, max: number) => {
    return Math.floor(((next() - MIN) / (MAX - MIN)) * (max - min) + min);
  };

  return {
    seed,
    bool(likelihood: number = 50) {
      return integer(0, 100) < likelihood;
    },
    integer(min: number, max: number) {
      return integer(min, max);
    },
    pick<T>(arr: T[]): T {
      return arr[integer(0, arr.length - 1)];
    },
  };
}
