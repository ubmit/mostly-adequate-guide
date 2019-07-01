const { curry } = require("@mostly-adequate/support");

// you can choose to call a function with fewer args than it expects
const add = x => y => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12

// however, calling it with both args all at once is a bit painful
// the curry function comes to make it easier
const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));

match(/r/g, "hello world"); // ['r']

const hasLetterR = match(/r/g); // x => x.match(/r/g)
hasLetterR("hello world"); // ['r']
hasLetterR("xpto"); // null

filter(hasLetterR, ["rock and roll", "smooth jazz"]); // ['rock and roll']

const removeStringsWithoutRs = filter(hasLetterR); // xs => xs.filter(x => x.match(/r/g))
removeStringsWithoutRs(["rock and roll", "smooth jazz", "drum circle"]); // ['rock and roll', 'drum circle']

const noVowels = replace(/[aeiou]/gi); // (r,x) => x.replace(/[aeiou]/ig, r)
const censored = noVowels("*"); // x => x.replace(/[aeiou]/ig, '*')
censored("Chocolate Rain");

// since we have this map on steroids function, which is a curried map
// we do not need to bother about creating functions that support arrays
// we can just write functions that work for a single element
// and then wrap it using map
const getPizzasFromMenu = obj => obj.pizzas;

const getPizzasFromAllMenus = map(getPizzasFromMenu);

const res = getPizzasFromAllMenus([
  { juice: "maracuja", pizzas: "4 queijos" },
  { juice: "manga", pizzas: "frango com catupiry" }
]);
