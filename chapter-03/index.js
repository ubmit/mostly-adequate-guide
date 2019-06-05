const { Map } = require("immutable");

// pure happiness with pure functions

// a pure function is a function that, given the same input,
// will always return the same output and does not have
// any observable side effect

const xs = [1, 2, 3, 4, 5];

// pure
xs.slice(0, 3);
xs.slice(0, 3);
xs.slice(0, 3);
// all those will always return [1,2,3]

// impure
xs.splice(0, 3); // [1,2,3]
xs.splice(0, 3); // [4, 5]
xs.splice(0, 3); // []
// this happens because splice is MUTATING the original data

// pure
const checkAge = age => {
  const minimum = 21;
  return age >= minimum;
};

// impure
let minimum = 21;
const checkAgeImpure = age => age >= minimum;
// this is impure because it is using a mutable variable
// which is minimum and, as such, it can be changed
// besides that, by using it, the cognitive load is increased

// it is also possible to make minimum immutable:
const immutableState = Object.freeze({ minimum: 21 });

// using memoization to cache for specific function calls

const memoize = f => {
  const cache = {};

  return (...args) => {
    const argStr = JSON.stringify(args);
    cache[argStr] = cache[argStr] || f(...args);
    return cache[argStr];
  };
};

const squareNumber = memoize(x => x * x);

squareNumber(4); // 16
squareNumber(4); // 16, returns cache for input 4
squareNumber(5); // 25
squareNumber(5); // 25, return cache for input 5

// transforming impure function into pure ones by delaying evaluation
const pureHttpCall = memoize((url, params) => () => $.getJSON(url, params));
// note that in this case, the result itself is not being cached
// but the () =>  $.getJSON(url, params) is!
// it is also pure, because it is alwyas returning the same function
// this is a curried function by the way

// pure functions are completely self contained
// impure
const signUp = attrs => {
  const user = saveUser(attrs);
  welcomeUser(user);
};

// pure
const signUp = (Db, Email, attrs) => () => {
  const user = saveUser(Db, attrs);
  welcomeUser(Email, user);
};

// aliases: p = player, a = attacker, t = target
const jobe = Map({ name: "Jobe", hp: 20, team: "red" });
const michael = Map({ name: "Michael", hp: 20, team: "green" });
const decrementHP = p => p.set("hp", p.get("hp") - 1);
const isSameTeam = (p1, p2) => p1.get("team") === p2.get("team");
const punch = (a, t) => (isSameTeam(a, t) ? t : decrementHP(t));

punch(jobe, michael); // Map({ name: 'Michael', hp: 19, team:'green' })
