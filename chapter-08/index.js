const {
  toUpperCase,
  prop,
  append,
  Maybe,
  match,
  Either,
  Left,
  curry
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
