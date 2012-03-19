{ok, deepEqual} = require 'assert'

# Church numerals
ZERO = (p) -> (x) -> x
ONE = (p) -> (x) -> p x
# "Evaluate n, then add another application of p"
SUCC = (n) -> (p) -> (x) -> p(n(p)(x))

toInteger = (p) -> p((n) -> n + 1)(0)
ok (toInteger ZERO) is 0
ok (toInteger ONE) is 1
ok (toInteger SUCC ONE) is 2

# K combinator
K = (x) -> () -> x
# I combinator
I = (x) -> x
# Which combinator is this?
FLIP = (f) -> (g) -> (h) -> h(g f)
# 0 if n is zero, n - 1 otherwise
PRED = (n) -> (p) -> (x) -> n(FLIP p)(K x)(I)
ok (toInteger PRED ZERO) is 0
ok (toInteger PRED ONE) is 0
ok (toInteger PRED SUCC ONE) is 1

# Numeric operations

# n(a)(b) = n times, apply a to b
ADD = (m) -> (n) -> n(SUCC)(m)
SUBTRACT = (m) -> (n) -> n(PRED)(m)
MULTIPLY = (m) -> (n) -> n(ADD(m))(ZERO)
POWER = (m) -> (n) -> n(MULTIPLY(m))(ONE)
ok (toInteger ADD(ONE)(ONE)) is 2
ok (toInteger SUBTRACT(ONE)(ONE)) is 0
ok (toInteger MULTIPLY(SUCC ONE)(SUCC ONE)) is 4
ok (toInteger POWER(ONE)(ZERO)) is 1
ok (toInteger POWER(SUCC ONE)(SUCC ONE)) is 4

# Conditional logic
TRUE = (x) -> (y) -> x
FALSE = (x) -> (y) -> y
toBoolean = (b) -> b(true)(false)
ok (toBoolean TRUE) is true

# Predicates act directly as if-clauses
# IF = (b) -> (x) -> (y) -> b(x)(y)
IF = (b) -> b
ok (IF(TRUE)('yes')('no')) is 'yes'
ok (IF(FALSE)('yes')('no')) is 'no'

IS_ZERO = (n) -> n(-> FALSE)(TRUE)
ok (toBoolean IS_ZERO ZERO) is true
ok (toBoolean IS_ZERO ONE) is false

# m <= n
LESS_OR_EQUAL = (m) -> (n) -> IS_ZERO(SUBTRACT(m)(n))
ok (toBoolean LESS_OR_EQUAL(ONE)(ONE)) is true
ok (toBoolean LESS_OR_EQUAL(ONE)(SUCC ONE)) is true
ok (toBoolean LESS_OR_EQUAL(SUCC ONE)(ONE)) is false

# Prevent unbounded recursion by explicitly declaring value as lazy
LAZY = (e) -> (x) -> e()(x)
# m % n
# Trivial implementation
MOD = (m) -> (n) ->
	IF(LESS_OR_EQUAL(n)(m))(
		LAZY -> MOD(SUBTRACT(m)(n))(n)
	)(
		m
	)
ok (toInteger MOD(SUCC SUCC ONE)(SUCC ONE)) is 1

# Unwrapping the recursion
# W combinator: duplicates y
W = (x) -> (y) -> x(y y)
# The one and only Y combinator
Y = (f) -> (W(f))(W(f))
# Lazy W combinator
Wl = (x) -> (y) -> x(LAZY -> y y)
# Z combinator (lazy Y combinator)
Z = (f) -> (Wl(f))(Wl(f))

# Lazy, unwrapped implementation of MOD
MOD = Z((recurse) -> (m) -> (n) ->
	IF(LESS_OR_EQUAL(n)(m))(
		LAZY -> recurse(SUBTRACT(m)(n))(n)
	)(
		m
	)
)
ok (toInteger MOD(SUCC SUCC ONE)(SUCC ONE)) is 1
ok (toInteger MOD(
		POWER(SUCC SUCC ONE)(SUCC SUCC ONE)
	)(
		SUCC ONE
	)) is 1

# Church pairs
PAIR = (x) -> (y) -> (z) -> z(x)(y)
LEFT = (p) -> p(TRUE)
RIGHT = (p) -> p(FALSE)
ok (LEFT PAIR('l')('r')) is 'l'
ok (RIGHT PAIR('l')('r')) is 'r'

# Linked lists
EMPTY = PAIR(TRUE)(TRUE)
IS_EMPTY = LEFT
CONS = (h) -> (t) -> PAIR(FALSE)(PAIR(h)(t))
HEAD = (p) -> LEFT RIGHT(p)
TAIL = (p) -> RIGHT RIGHT(p)

ok (toBoolean IS_EMPTY EMPTY) is true
ok (toBoolean IS_EMPTY CONS()()) is false
ok (toBoolean IS_EMPTY CONS(ONE)(EMPTY)) is false
ok (toInteger HEAD CONS(ONE)(EMPTY)) is 1
ok (toInteger HEAD CONS(ZERO)(CONS(ONE)(EMPTY))) is 0
ok (toInteger HEAD TAIL CONS(ZERO)(CONS(ONE)(EMPTY))) is 1

toArray = (list) ->
	list = CONS(EMPTY)(list)
	while (list = TAIL list) and not (toBoolean IS_EMPTY list)
		HEAD list

deepEqual (toArray CONS(0)(CONS(1)(CONS(2)(EMPTY)))), [0, 1, 2]

# [m..n]
RANGE = Z((recurse) -> (m) -> (n) ->
	IF(LESS_OR_EQUAL(m)(n))(
		LAZY -> CONS(m)(recurse(SUCC m)(n))
	)(
		EMPTY
	)
)
deepEqual (toInteger x for x in toArray RANGE(ZERO)(SUCC SUCC ONE)), [0, 1, 2, 3]

FOLD = Z((recurse) -> (list) -> (init) -> (f) ->
	IF(IS_EMPTY(list))(
		init
	)(
		LAZY -> f(HEAD list)(recurse(TAIL list)(init)(f))
	)
)
PRODUCT = (list) -> FOLD(list)(ONE)(MULTIPLY)
FACTORIAL = (n) -> PRODUCT(RANGE(ONE)(n))
ok (toInteger FOLD(RANGE(ONE)(SUCC SUCC ONE))(ZERO)(ADD)) is 6
ok (toInteger FACTORIAL(SUCC SUCC SUCC ONE)) is 24

MAP = (list) -> (f) ->
	FOLD(list)(EMPTY)(
		(next) -> (acc) -> CONS(f(next))(acc)
	)
deepEqual (toInteger x for x in toArray MAP(RANGE(ZERO)(SUCC ONE))(SUCC)), [1, 2, 3]

# A few useful numerals
THREE = SUCC SUCC ONE
FIVE = SUCC SUCC THREE
TEN = ADD(FIVE)(FIVE)
NINE = PRED TEN
FIFTEEN = MULTIPLY(THREE)(FIVE)
HUNDRED = MULTIPLY(TEN)(TEN)

# Chars and then strings
CHAR_B = TEN
CHAR_F = SUCC CHAR_B
CHAR_I = SUCC CHAR_F
CHAR_U = SUCC CHAR_I
CHAR_Z = SUCC CHAR_U

STRING_FIZZ = CONS(CHAR_F)(CONS(CHAR_I)(CONS(CHAR_Z)(CONS(CHAR_Z)(EMPTY))))
STRING_BUZZ = CONS(CHAR_B)(CONS(CHAR_U)(CONS(CHAR_Z)(CONS(CHAR_Z)(EMPTY))))

toChar = (c) -> '0123456789BFiuz'.charAt toInteger c
toString = (s) -> (toChar c for c in (toArray s)).join("")
ok (toString STRING_FIZZ) is 'Fizz'
ok (toString STRING_BUZZ) is 'Buzz'

CONCAT = (a) -> (b) -> FOLD(a)(b)(CONS)
PUSH = (a) -> (x) -> CONCAT(a)(CONS(x)(EMPTY))
STRING_FIZZBUZZ = CONCAT(STRING_FIZZ)(STRING_BUZZ)
deepEqual (toInteger x for x in toArray (PUSH(EMPTY)(ONE))), [1]
deepEqual (toInteger x for x in toArray (PUSH(RANGE(THREE)(FIVE))(ZERO))), [3, 4, 5, 0]
ok (toString STRING_FIZZBUZZ) is 'FizzBuzz'

DIV = Z((recurse) -> (m) -> (n) ->
	IF(LESS_OR_EQUAL(n)(m))(
		LAZY -> SUCC recurse(SUBTRACT(m)(n))(n)
	)(
		ZERO
	)
)
toDigits = Z((recurse) -> (n) ->
	PUSH(
		IF(LESS_OR_EQUAL(n)(NINE))(
			EMPTY
		)(
			LAZY -> recurse DIV(n)(TEN)
		)
	)(
		MOD(n)(TEN)
	)
)
deepEqual (toInteger x for x in toArray toDigits FIFTEEN), [1, 5]
deepEqual (toInteger x for x in toArray toDigits HUNDRED), [1, 0, 0]

# Finally, FizzBuzz.

FIZZBUZZ = MAP(RANGE(ONE)(HUNDRED))((n) ->
	IF(IS_ZERO(MOD(n)(FIFTEEN)))(
		STRING_FIZZBUZZ
	)(IF(IS_ZERO(MOD(n)(THREE)))(
		STRING_FIZZ
	)(IF(IS_ZERO(MOD(n)(FIVE)))(
		STRING_BUZZ
	)(
		toDigits n
	)))
)
console.log (toString x for x in toArray FIZZBUZZ).join("\n")