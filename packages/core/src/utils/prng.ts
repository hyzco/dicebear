import type { Prng } from '../types';

const MIN = -2147483648;
const MAX = 2147483647;

function xorshift(value: number) {
  value ^= value << 13;
  value ^= value >> 17;
  value ^= value << 5;

  return value;
}

function hashSeed(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    hash = xorshift(hash);
  }

  return hash;
}

export function create(seed: string = ''): Prng {
  let value = hashSeed(seed) || 1;

  const next = () => (value = xorshift(value));
  const integer = (min: number, max: number) => {
    return Math.floor(((next() - MIN) / (MAX - MIN)) * (max + 1 - min) + min);
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
