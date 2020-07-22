import * as isNot from './isNot';
import { createContext } from '../expr';

test('isNot expression isNot responsible to object with $isNot', () => {
  expect(isNot.isResponsible({ $isNot: ['foo', 'foo'] })).toBe(true);
});

test('isNot expression resolves to true', () => {
  expect(isNot.resolveValue(createContext({}, {} as any), { $isNot: ['foo', 'bar'] })).toBe(true);
});

test('isNot expression resolves to false', () => {
  expect(isNot.resolveValue(createContext({}, {} as any), { $isNot: ['foo', 'foo'] })).toBe(false);
});
