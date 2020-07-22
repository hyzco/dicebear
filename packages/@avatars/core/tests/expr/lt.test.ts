import * as lt from '../../src/expr/lt';
import { createContext } from '../../src/expr';

test('lt expression is responsible to object with $lt', () => {
  expect(lt.isResponsible({ $lt: [1, 0] })).toBe(true);
});

test('lt expression resolves to true', () => {
  expect(lt.resolveValue(createContext({}, {} as any), { $lt: [0, 1] })).toBe(true);
});

test('lt expression resolves to false', () => {
  expect(lt.resolveValue(createContext({}, {} as any), { $lt: [1, 1] })).toBe(false);
});
