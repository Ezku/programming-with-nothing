(function() {
  var ADD, CHAR_B, CHAR_F, CHAR_I, CHAR_U, CHAR_Z, CONS, EMPTY, FACTORIAL, FALSE, FIFTEEN, FIVE, FLIP, FOLD, HEAD, HUNDRED, I, IF, IS_EMPTY, IS_ZERO, K, LAZY, LEFT, LESS_OR_EQUAL, MAP, MOD, MULTIPLY, ONE, PAIR, POWER, PRED, PRODUCT, RANGE, RIGHT, STRING_BUZZ, STRING_FIZZ, SUBTRACT, SUCC, TAIL, TEN, THREE, TRUE, W, Wl, Y, Z, ZERO, deepEqual, ok, toArray, toBoolean, toChar, toInteger, toString, x, _ref;

  _ref = require('assert'), ok = _ref.ok, deepEqual = _ref.deepEqual;

  ZERO = function(p) {
    return function(x) {
      return x;
    };
  };

  ONE = function(p) {
    return function(x) {
      return p(x);
    };
  };

  SUCC = function(n) {
    return function(p) {
      return function(x) {
        return p(n(p)(x));
      };
    };
  };

  toInteger = function(p) {
    return p(function(n) {
      return n + 1;
    })(0);
  };

  ok((toInteger(ZERO)) === 0);

  ok((toInteger(ONE)) === 1);

  ok((toInteger(SUCC(ONE))) === 2);

  K = function(x) {
    return function() {
      return x;
    };
  };

  I = function(x) {
    return x;
  };

  FLIP = function(f) {
    return function(g) {
      return function(h) {
        return h(g(f));
      };
    };
  };

  PRED = function(n) {
    return function(p) {
      return function(x) {
        return n(FLIP(p))(K(x))(I);
      };
    };
  };

  ok((toInteger(PRED(ZERO))) === 0);

  ok((toInteger(PRED(ONE))) === 0);

  ok((toInteger(PRED(SUCC(ONE)))) === 1);

  ADD = function(m) {
    return function(n) {
      return n(SUCC)(m);
    };
  };

  SUBTRACT = function(m) {
    return function(n) {
      return n(PRED)(m);
    };
  };

  MULTIPLY = function(m) {
    return function(n) {
      return n(ADD(m))(ZERO);
    };
  };

  POWER = function(m) {
    return function(n) {
      return n(MULTIPLY(m))(ONE);
    };
  };

  ok((toInteger(ADD(ONE)(ONE))) === 2);

  ok((toInteger(SUBTRACT(ONE)(ONE))) === 0);

  ok((toInteger(MULTIPLY(SUCC(ONE))(SUCC(ONE)))) === 4);

  ok((toInteger(POWER(ONE)(ZERO))) === 1);

  ok((toInteger(POWER(SUCC(ONE))(SUCC(ONE)))) === 4);

  TRUE = function(x) {
    return function(y) {
      return x;
    };
  };

  FALSE = function(x) {
    return function(y) {
      return y;
    };
  };

  toBoolean = function(b) {
    return b(true)(false);
  };

  ok((toBoolean(TRUE)) === true);

  IF = function(b) {
    return b;
  };

  ok((IF(TRUE)('yes')('no')) === 'yes');

  ok((IF(FALSE)('yes')('no')) === 'no');

  IS_ZERO = function(n) {
    return n(function() {
      return FALSE;
    })(TRUE);
  };

  ok((toBoolean(IS_ZERO(ZERO))) === true);

  ok((toBoolean(IS_ZERO(ONE))) === false);

  LESS_OR_EQUAL = function(m) {
    return function(n) {
      return IS_ZERO(SUBTRACT(m)(n));
    };
  };

  ok((toBoolean(LESS_OR_EQUAL(ONE)(ONE))) === true);

  ok((toBoolean(LESS_OR_EQUAL(ONE)(SUCC(ONE)))) === true);

  ok((toBoolean(LESS_OR_EQUAL(SUCC(ONE))(ONE))) === false);

  LAZY = function(e) {
    return function(x) {
      return e()(x);
    };
  };

  MOD = function(m) {
    return function(n) {
      return IF(LESS_OR_EQUAL(n)(m))(LAZY(function() {
        return MOD(SUBTRACT(m)(n))(n);
      }))(m);
    };
  };

  ok((toInteger(MOD(SUCC(SUCC(ONE)))(SUCC(ONE)))) === 1);

  W = function(x) {
    return function(y) {
      return x(y(y));
    };
  };

  Y = function(f) {
    return (W(f))(W(f));
  };

  Wl = function(x) {
    return function(y) {
      return x(LAZY(function() {
        return y(y);
      }));
    };
  };

  Z = function(f) {
    return (Wl(f))(Wl(f));
  };

  MOD = Z(function(recurse) {
    return function(m) {
      return function(n) {
        return IF(LESS_OR_EQUAL(n)(m))(LAZY(function() {
          return recurse(SUBTRACT(m)(n))(n);
        }))(m);
      };
    };
  });

  ok((toInteger(MOD(SUCC(SUCC(ONE)))(SUCC(ONE)))) === 1);

  ok((toInteger(MOD(POWER(SUCC(SUCC(ONE)))(SUCC(SUCC(ONE))))(SUCC(ONE)))) === 1);

  PAIR = function(x) {
    return function(y) {
      return function(z) {
        return z(x)(y);
      };
    };
  };

  LEFT = function(p) {
    return p(TRUE);
  };

  RIGHT = function(p) {
    return p(FALSE);
  };

  ok((LEFT(PAIR('l')('r'))) === 'l');

  ok((RIGHT(PAIR('l')('r'))) === 'r');

  EMPTY = PAIR(TRUE)(TRUE);

  IS_EMPTY = LEFT;

  CONS = function(h) {
    return function(t) {
      return PAIR(FALSE)(PAIR(h)(t));
    };
  };

  HEAD = function(p) {
    return LEFT(RIGHT(p));
  };

  TAIL = function(p) {
    return RIGHT(RIGHT(p));
  };

  ok((toBoolean(IS_EMPTY(EMPTY))) === true);

  ok((toBoolean(IS_EMPTY(CONS()()))) === false);

  ok((toBoolean(IS_EMPTY(CONS(EMPTY)(ONE)))) === false);

  ok((toInteger(HEAD(CONS(ONE)(EMPTY)))) === 1);

  ok((toInteger(HEAD(CONS(ZERO)(CONS(ONE)(EMPTY))))) === 0);

  ok((toInteger(HEAD(TAIL(CONS(ZERO)(CONS(ONE)(EMPTY)))))) === 1);

  toArray = function(list) {
    var _results;
    list = CONS(EMPTY)(list);
    _results = [];
    while ((list = TAIL(list)) && !(toBoolean(IS_EMPTY(list)))) {
      _results.push(HEAD(list));
    }
    return _results;
  };

  deepEqual(toArray(CONS(0)(CONS(1)(CONS(2)(EMPTY)))), [0, 1, 2]);

  RANGE = Z(function(recurse) {
    return function(m) {
      return function(n) {
        return IF(LESS_OR_EQUAL(m)(n))(LAZY(function() {
          return CONS(m)(recurse(SUCC(m))(n));
        }))(EMPTY);
      };
    };
  });

  deepEqual((function() {
    var _i, _len, _ref2, _results;
    _ref2 = toArray(RANGE(ZERO)(SUCC(SUCC(ONE))));
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      x = _ref2[_i];
      _results.push(toInteger(x));
    }
    return _results;
  })(), [0, 1, 2, 3]);

  FOLD = Z(function(recurse) {
    return function(list) {
      return function(init) {
        return function(f) {
          return IF(IS_EMPTY(list))(init)(LAZY(function() {
            return f(HEAD(list))(recurse(TAIL(list))(init)(f));
          }));
        };
      };
    };
  });

  PRODUCT = function(list) {
    return FOLD(list)(ONE)(MULTIPLY);
  };

  FACTORIAL = function(n) {
    return PRODUCT(RANGE(ONE)(n));
  };

  ok((toInteger(FOLD(RANGE(ONE)(SUCC(SUCC(ONE))))(ZERO)(ADD))) === 6);

  ok((toInteger(FACTORIAL(SUCC(SUCC(SUCC(ONE)))))) === 24);

  MAP = function(list) {
    return function(f) {
      return FOLD(list)(EMPTY)(function(next) {
        return function(acc) {
          return CONS(f(next))(acc);
        };
      });
    };
  };

  deepEqual((function() {
    var _i, _len, _ref2, _results;
    _ref2 = toArray(MAP(RANGE(ZERO)(SUCC(ONE)))(SUCC));
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      x = _ref2[_i];
      _results.push(toInteger(x));
    }
    return _results;
  })(), [1, 2, 3]);

  THREE = SUCC(SUCC(ONE));

  FIVE = SUCC(SUCC(FIVE));

  TEN = ADD(FIVE)(FIVE);

  FIFTEEN = MULTIPLY(THREE)(FIVE);

  HUNDRED = MULTIPLY(TEN)(TEN);

  CHAR_B = TEN;

  CHAR_F = SUCC(CHAR_B);

  CHAR_I = SUCC(CHAR_F);

  CHAR_U = SUCC(CHAR_I);

  CHAR_Z = SUCC(CHAR_U);

  STRING_FIZZ = CONS(CHAR_F)(CONS(CHAR_I)(CONS(CHAR_Z)(CONS(CHAR_Z)(EMPTY))));

  STRING_BUZZ = CONS(CHAR_B)(CONS(CHAR_U)(CONS(CHAR_Z)(CONS(CHAR_Z)(EMPTY))));

  toChar = function(c) {
    return '0123456789BFiuz'.charAt(toInteger(c));
  };

  toString = function(s) {
    var c;
    return ((function() {
      var _i, _len, _ref2, _results;
      _ref2 = toArray(s);
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        c = _ref2[_i];
        _results.push(toChar(c));
      }
      return _results;
    })()).join();
  };

  ok((toString(STRING_FIZZ)) === 'Fizz');

  ok((toString(STRING_BUZZ)) === 'Buzz');

}).call(this);
