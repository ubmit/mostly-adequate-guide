const { compose } = require("@mostly-adequate/support");

// declarative coding
// think about it as coding like you write SQL queries
// what it means is that you will specify what you want to do
// without having to "first do this, then do that"

const cars = ["uno", "palio", "idea"];

// imperative
const makesImperative = [];
for (let i = 0; i < cars.length; i += 1) {
  makesImperative.push(cars[i].make);
}

// declarative
const makes = cars.map(car => car.make);

const toUser = x => `this is a user created from this form: ${x}`;
const logIn = x => `the user ${x} is logged in`;

// imperative
const authenticate = form => {
  const user = toUser(form);
  return logIn(user);
};

// declarative
const authenticate = compose(
  logIn,
  toUser
);
