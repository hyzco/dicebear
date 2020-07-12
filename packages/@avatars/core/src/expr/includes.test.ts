import * as includes from './includes';
import { createContext } from '../expr';

test('includes expression is responsible to object with $includes', () => {
  expect(includes.isResponsible({ $includes: ['foo', ['foo', 'bar']] })).toBe(true);
});

test('includes expression resolves to true', () => {
  expect(includes.resolveValue(createContext({}, {} as any), { $includes: ['foo', ['foo', 'bar']] })).toBe(true);
});

test('includes expression resolves to false', () => {
  expect(includes.resolveValue(createContext({}, {} as any), { $includes: ['baz', ['foo', 'bar']] })).toBe(false);
});
