import * as has from '../../src/expr/has';
import { createContext } from '../../src/expr';

test('has expression is responsible to object with $has', () => {
  expect(has.isResponsible({ $has: ['foo', ['foo', 'bar']] })).toBe(true);
});

test('has expression resolves to true', () => {
  expect(has.resolveValue(createContext({}, {} as any), { $has: ['foo', ['foo', 'bar']] })).toBe(true);
});

test('has expression resolves to false', () => {
  expect(has.resolveValue(createContext({}, {} as any), { $has: ['baz', ['foo', 'bar']] })).toBe(false);
});
