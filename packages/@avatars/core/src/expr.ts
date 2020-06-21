import * as every from './expr/every';
import * as gt from './expr/gt';
import * as gte from './expr/gte';
import * as includes from './expr/includes';
import * as is from './expr/is';
import * as isNot from './expr/isNot';
import * as lt from './expr/lt';
import * as lte from './expr/lte';
import * as prngBool from './expr/prngBool';
import * as prngInteger from './expr/prngInteger';
import * as prngPick from './expr/prngPick';
import * as ref from './expr/ref';
import * as resolve from './expr/resolve';
import * as some from './expr/some';

export type IExpression<T> =
  | every.IEveryExpression
  | gt.IGtExpression
  | gte.IGteExpression
  | includes.IIncludesExpression<T>
  | is.IIsExpression<T>
  | isNot.IIsNotExpression<T>
  | lt.ILtExpression
  | lte.ILteExpression
  | prngBool.IPrngBoolExpression
  | prngInteger.IPrngIntegerExpression
  | prngPick.IPrngPickExpression<T>
  | ref.IRefExpression
  | some.ISomeExpression
  | IExpressionResolved<T>;

// prettier-ignore
export type IExpressionResolved<T> =
  T extends every.IEveryExpression ? boolean :
  T extends gt.IGtExpression ? boolean :
  T extends gte.IGteExpression ? boolean :
  T extends includes.IIncludesExpression<any> ? boolean :
  T extends is.IIsExpression<any> ? boolean :
  T extends isNot.IIsNotExpression<any> ? boolean :
  T extends lt.ILtExpression ? boolean :
  T extends lte.ILteExpression ? boolean :
  T extends prngBool.IPrngBoolExpression ? boolean :
  T extends prngInteger.IPrngIntegerExpression ? boolean :
  T extends prngPick.IPrngPickExpression<infer U> ? U :
  T extends ref.IRefExpression ? any :
  T extends some.ISomeExpression ? boolean :
  T extends (T)[] ? T : T;

export { every, gt, gte, includes, is, isNot, lt, lte, prngBool, prngInteger, prngPick, ref, some, resolve };
