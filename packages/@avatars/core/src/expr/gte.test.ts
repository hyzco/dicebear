import * as gte from './gte';
import { createContext } from '../expr';

test('gte expression is responsible to object with $gte', () => {
  expect(gte.isResponsible({ $gte: [1, 0] })).toBe(true);
});

test('gte expression resolves to true', () => {
  expect(gte.resolveValue(createContext({}, {} as any), { $gte: [1, 1] })).toBe(true);
});

test('gte expression resolves to false', () => {
  expect(gte.resolveValue(createContext({}, {} as any), { $gte: [1, 2] })).toBe(false);
});
