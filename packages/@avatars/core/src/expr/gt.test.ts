import * as gt from './gt';
import { createContext } from '../expr';

test('gt expression is responsible to object with $gt', () => {
  expect(gt.isResponsible({ $gt: [1, 0] })).toBe(true);
});

test('gt expression resolves to true', () => {
  expect(gt.resolveValue(createContext({}, {} as any), { $gt: [1, 0] })).toBe(true);
});

test('gt expression resolves to false', () => {
  expect(gt.resolveValue(createContext({}, {} as any), { $gt: [1, 1] })).toBe(false);
});
