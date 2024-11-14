import Helper from '@ember/component/helper';

/* eslint-disable no-console */
/**
 * @param {number} first - the first argument
 * @param {number} second - the second argument
 * @return {number} the sum of the two values
 */
function plainHelperA(first, second) {
  return first + second;
}
const helperLikeB = (...args) => {
  console.log(args);
};
const plainHelperC = (a, b, options) => {
  /* ... */
  console.log(a, b, options);
};
class classHelperD extends Helper {
  /* ... */
}
class classHelperE extends Helper {
  /* ... */
}

export { classHelperD, classHelperE, helperLikeB, plainHelperA, plainHelperC };
//# sourceMappingURL=helper.js.map
