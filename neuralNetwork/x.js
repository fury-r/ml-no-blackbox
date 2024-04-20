function plus(value) {
  let result = value;
  function plusFn(v) {
    result += v;
    return plus(result);
  }

  function minusFn(v) {
    result -= v;
    return minus(result);
  }
  return {
    plus: plusFn,
    minus: minusFn,
    values: () => {
      return value;
    },
  };
}
function minus(value) {
  let result = value;
  function plusFn(v) {
    result += v;
    return plus(result);
  }

  function minusFn(v) {
    result -= v;
    return minus(result);
  }
  return {
    plus: plusFn,
    minus: minusFn,
    values: () => {
      return value;
    },
  };
}
console.log(plus(2).plus(2).minus(1).values());
