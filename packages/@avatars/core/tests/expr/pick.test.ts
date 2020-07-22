import * as pick from '../../src/expr/pick';

test('pick expression is responsible to object with $pick and array', () => {
  expect(pick.isResponsible({ $pick: [['foo']] })).toBe(true);
});

test('pick expression is not responsible to object with $pick and empty array', () => {
  expect(pick.isResponsible({ $pick: [[]] })).toBe(false);
});

test('pick expression resolves to foo', () => {
  expect(
    pick.resolveValue(
      {
        resolveValue: (v: any) => v,
        prng: {
          pick: (arr: any[]) => arr[0],
        },
      } as any,
      { $pick: [['foo']] }
    )
  ).toBe('foo');
});
