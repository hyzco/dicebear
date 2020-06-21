export async function resolve(
  expr: any,
  root: Record<string, any>,
  prng: prng.IPrng,
  callstack: string[],
  nesting = 0
): any {
  if (Array.isArray(expr)) {
    if (typeof expr[0] === 'string' && expr[0][0] === '$') {
      let name = expr[0];
      let args = expr[1];

      if (Array.isArray(args)) {
        args = args.map((v) => resolve(v, root, prng, callstack, nesting + 1));

        switch (name) {
          case '$includes':
            const includes = await import('./includes');
            return includes.resolveIncludes(args);

          case '$every':
            const every = await import('./every');
            return every.resolveEvery(args);

          case '$some':
            const some = await import('./some');
            return some.resolveSome(args);

          case '$is':
            const is = await import('./is');
            return is.resolveIs(args);

          case '$isNot':
            const isNot = await import('./isNot');
            return isNot.resolveIsNot(args);

          case '$gt':
            const gt = await import('./gt');
            return gt.resolveGt(args);

          case '$gte':
            const gte = await import('./gte');
            return gte.resolveGte(args);

          case '$lt':
            const lt = await import('./lt');
            return lt.resolveLt(args);

          case '$lte':
            const lte = await import('./lte');
            return lte.resolveLte(args);

          case '$ref':
            const ref = await import('./ref');
            return ref.resolveRef(args);

          case '$prng.integer':
            const prngInteger = await import('./prngInteger');
            return prngInteger.resolvePrngInteger(args, prng);

          case '$prng.bool':
            const prngBool = await import('./prngBool');
            return prngBool.resolvePrngBool(args, prng);

          case '$prng.pick':
            const prngPick = await import('./prngPick');
            return prngPick.resolvePrngPick(args, prng);

          default:
            throw new Error(`Unsupported expression ${expr[0]}`);
        }
      } else {
        throw new Error(`Arguments must be defined as an array. ${typeof args} given.`);
      }
    } else if (nesting === 0) {
      let arr = expr.map((v) => resolve(v, root, prng, callstack, nesting + 1));

      return prng.pick(arr);
    }
  }

  if (typeof expr === 'object' && nesting === 0) {
    let arr = Object.keys(expr).filter((key) => resolve(expr[key], root, prng, callstack, nesting + 1));

    return prng.pick(arr);
  }

  return expr;
}
