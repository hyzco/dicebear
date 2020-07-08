const Avatars = require('../');

const prng = Avatars.prng.create('');
const exprResolve = (expr) => Avatars.expr.resolve({ value: expr }, prng).value;

test('$includes expression', () => {
  expect(exprResolve({ $includes: ['foo', ['foo']] })).toBeTruthy();
  expect(exprResolve({ $includes: ['bar', ['foo']] })).toBeFalsy();
});

test('$every expression', () => {
  expect(exprResolve({ $every: [[true, true]] })).toBeTruthy();
  expect(exprResolve({ $every: [[true, false]] })).toBeFalsy();
});

test('$some expression', () => {
  expect(exprResolve({ $some: [[true, false]] })).toBeTruthy();
  expect(exprResolve({ $some: [[false, false]] })).toBeFalsy();
});

test('$is expression', () => {
  expect(exprResolve({ $is: ['foo', 'foo'] })).toBeTruthy();
  expect(exprResolve({ $is: ['foo', 'bar'] })).toBeFalsy();
});

test('$isNot expression', () => {
  expect(exprResolve({ $isNot: ['foo', 'bar'] })).toBeTruthy();
  expect(exprResolve({ $isNot: ['foo', 'foo'] })).toBeFalsy();
});

test('$gt expression', () => {
  expect(exprResolve({ $gt: [10, 5] })).toBeTruthy();
  expect(exprResolve({ $gt: [10, 10] })).toBeFalsy();
});

test('$gte expression', () => {
  expect(exprResolve({ $gte: [10, 10] })).toBeTruthy();
  expect(exprResolve({ $gte: [5, 10] })).toBeFalsy();
});

test('$lt expression', () => {
  expect(exprResolve({ $lt: [5, 10] })).toBeTruthy();
  expect(exprResolve({ $lt: [10, 10] })).toBeFalsy();
});

test('$lte expression', () => {
  expect(exprResolve({ $lte: [10, 10] })).toBeTruthy();
  expect(exprResolve({ $lte: [10, 5] })).toBeFalsy();
});

test('$ref expression', () => {
  let object = {
    foo: 'foo',
    bar: { $ref: ['foo'] },
  };

  expect(Avatars.expr.resolve(object, prng).bar).toBe('foo');
});

test('$ref expression recursive', () => {
  let object = {
    foo: { $ref: ['bar'] },
    bar: { $ref: ['foo'] },
  };

  expect(() => Avatars.expr.resolve(object, prng).bar).toThrow(/Recursion/);
});

test('$bool expression', () => {
  expect(exprResolve({ $bool: [100] })).toBeTruthy();
});

test('$pick expression', () => {
  expect(exprResolve({ $pick: [[10]] })).toBe(10);
});

test('$integer expression', () => {
  expect(exprResolve({ $integer: [10, 10] })).toBe(10);
});
