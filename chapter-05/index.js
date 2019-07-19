// LET'S COMPOSE!
const {
  map,
  replace,
  curry,
  split,
  intercalate,
  toLowerCase
} = require("@mostly-adequate/support");

const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const trim = str => str.trim();
const uppercase = str => str.toUpperCase();
const exclaim = str => `${str}!`;

const orderJuice = compose(
  exclaim,
  uppercase,
  trim
);

const firstRes = orderJuice("           maracujá          ");
console.log(firstRes);

const head = xs => xs[0];
const reverse = xs => xs.reduce((acc, x) => [x].concat(acc), []);
const last = compose(
  head,
  reverse
);

const secondRes = last(["jumpkick", "roundhouse", "uppercut"]);
console.log(secondRes);

const compose2 = (f, g) => x => f(g(x));
const reverse2 = xs => xs.reduce((acc, x) => [x].concat(acc), []);
const last2 = compose2(head, reverse2);

const thirdRes = last2(["hk", "mp", "lp"]);
console.log(thirdRes);

// associativity
// compose(f, compose(g, h)) === compose(compose(f, g), h)
// so we could simply write compose(h, g, f)

// pointfree means that the functions do not mention the data they operate with
// const snakeCase = word => word.trim().toLowerCase()
// versus
// const snakeCase = compose(toLowerCase, trim)

// debugging
// if you are having trouble debuggin composition:
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const dasherize = compose(
  intercalate("-"),
  map(toLowerCase),
  trace("after split"),
  split(" "),
  replace(/\s{2,}/gi, "")
);

const fourthRes = dasherize("The world is a vampire");
console.log(fourthRes);

// EXERCISES
// my answers for the exercises 1 and 2 were exactly the same
// as the solutions
// my solution for the exercise 3 was a little bit different
const fastestCar = compose(
  flip(concat, " is the fastest"),
  prop("name"),
  last,
  sortBy(prop("horsepower"))
);
