import * as hasNot from '../../src/expr/hasNot';
import { createContext } from '../../src/expr';

test('hasNot expression is responsible to object with $hasNot', () => {
  expect(hasNot.isResponsible({ $hasNot: ['foo', ['foo', 'bar']] })).toBe(true);
});

test('hasNot expression resolves to true', () => {
  expect(hasNot.resolveValue(createContext({}, {} as any), { $hasNot: ['baz', ['foo', 'bar']] })).toBe(true);
});

test('hasNot expression resolves to false', () => {
  expect(hasNot.resolveValue(createContext({}, {} as any), { $hasNot: ['foo', ['foo', 'bar']] })).toBe(false);
});
