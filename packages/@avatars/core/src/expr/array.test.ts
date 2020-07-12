import * as array from './array';
import { createContext } from '../expr';

test('array expression is responsible to array', () => {
  expect(array.isResponsible(['foo'])).toBe(true);
});

test('array expression is not responsible to empty array', () => {
  expect(array.isResponsible([])).toBe(false);
});

test('array expression resolves to foo', () => {
  expect(
    array.resolveValue(
      createContext({}, {
        pick: (arr: any[]) => arr[0],
      } as any),
      ['foo']
    )
  ).toBe('foo');
});
