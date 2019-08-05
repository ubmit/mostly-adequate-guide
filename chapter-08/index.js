const {
  toUpperCase,
  prop,
  append,
  Maybe,
  match,
  Either,
  Left,
  curry,
  compose,
  add,
  concat,
  toString,
  map,
  either,
  identity,
  IO,
  reverse,
  safeProp
} = require("@mostly-adequate/support");
const moment = require("moment");

class Container {
  constructor(x) {
    this.$value = x;
  }
  static of(x) {
    return new Container(x);
  }
}

Container.of(3);
// Container(3)

Container.of("kebabs");
// Container('kebabs')

Container.of(Container.of({ name: "camila" }));
// Container(Container({ name: 'camila' }))

// a way to run functions inside the container

// (a -> b) -> Container a -> Container b
Container.prototype.map = function(f) {
  return Container.of(f(this.$value));
};

Container.of(2).map(x => x + 1);
// Container(3)

Container.of("keyboards").map(toUpperCase);
// Container('KEYBOARDS')

Container.of("cinco")
  .map(append("cinco"))
  .map(prop("length"));

Maybe.of("Malkovich Malkovich").map(match(/a/gi));
// Just(True)

Maybe.of(null);
// Nothing

Maybe.of(null).map(match(/a/gi));
// Nothing

Maybe.of({ name: "bauer" })
  .map(prop("size"))
  .map(x => x + 10);
// Nothing

Maybe.of({ name: "bauer", size: 65 })
  .map(prop("size"))
  .map(x => x + 10);
// Just(75)

const left = x => new Left(x);

Either.of("rain").map(str => `b${str}`);
// Right('brain')

left("rain").map(str => `It's gonna ${str}, better bring your umbrella!`);
// Left('rain')

Either.of({ host: "localhost", port: 80 }).map(prop("host"));
// Right('localhost')

left("rolls eyes...").map(prop("host"));
// Left('rolls eyes...')

// getAge :: Date -> User -> Either(String, Number)
const getAge = curry((now, user) => {
  const birthDate = moment(user.birthDate, "YYYY-MM-DD");

  return birthDate.isValid()
    ? Either.of(now.diff(birthDate, "years"))
    : left("Birth date could not be parsed");
});

getAge(moment(), { birthDate: "2005-12-12" });
// Right(9)

getAge(moment(), { birthDate: "July 4, 2001" });
// Left('Birth date could not be parsed')

// fortune :: Number => String
const fortune = compose(
  concat("If you survive, you will be "),
  toString,
  add(1)
);

fortune(23);
// "If you survice, you will be 24"

const zoltar = compose(
  console.log,
  either(identity, fortune),
  getAge(moment())
);

zoltar({ birthDate: "2005-12-12" });

zoltar({ birthDate: "balloons!" });

// ioWindow :: IO WIndow
const ioWindow = new IO(() => window);

ioWindow.map(win => win.innerWidth);

// topRoute :: String -> Maybe String
const topRoute = compose(
  Maybe.of,
  reverse
);

// bottomRoute :: String -> Maybe String;
const bottomRoute = compose(
  map(reverse),
  Maybe.of
);

topRoute("hi");
bottomRoute("hi");

// Write a function `validateName` which checks whether
// a user has a name longer than 3 characters or return
// an error message. Then use `either`, `showWelcome`
// and `save` to write a `register` function to signup
// and welcome a user when the validation is ok.
// Remember either's two arguments must return the same type.

const validateLength = name =>
  name.length <= 3
    ? left("the name is not longer than 3 chars")
    : Either.of(name);

// validateName :: User -> Either String ()
const validateName = compose(
  validateLength,
  prop("name")
);

const success = compose(
  map(showWelcome),
  save
);

// register :: User -> IO String
const register = compose(
  either(IO.of, success),
  validateUser(validateName)
);
