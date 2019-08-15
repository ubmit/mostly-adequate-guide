const {
  curry,
  head,
  compose,
  Maybe,
  IO,
  Task,
  Either,
  concat,
  add,
  map,
  prop,
  last,
  split
} = require("@mostly-adequate/support");

const fs = require("fs");

const jsdom = require("jsdom");
const jQuery = require("jquery")(new jsdom.JSDOM().window);

IO.of("tetris").map(concat(" master"));
// IO('tetris master')

Maybe.of(1336).map(add(1));
// Maybe(1337)

Task.of([{ id: 2 }, { id: 3 }]).map(map(prop("id")));
// Task([2,3])

Either.of("The past, present and future walk into a bar...").map(
  concat("it was tense.")
);

// monads are like onions

// readFile :: String -> IO String
const readFile = filename => new IO(() => fs.readFileSync(filename));

// print :: String -> IO String
const print = x =>
  new IO(() => {
    console.log(x);
    return x;
  });

// cat :: String -> IO (IO String)
const cat = compose(
  map(print),
  readFile
);

cat(".git/config");
// IO(IO('[core]\nrepositoryformatversion = 0\n'))

const catFirstChar = compose(
  map(map(head)),
  cat
);

catFirstChar(".git/config");
// IO(IO('['))

// safeProp :: Key -> {Key: a} -> Maybe a
// const safeProp = key => obj => Maybe.of(obj[key]);
const safeProp = curry((key, obj) => Maybe.of(obj[key]));

// safeHead :: [a] -> Maybe a
const safeHead = safeProp(0);

// firstAddressStreet :: User -> Maybe (Maybe (Maybe Street))
const firstAddressStreet = compose(
  map(map(safeProp("street"))),
  map(safeHead),
  safeProp("addresses")
);

firstAddressStreet({
  addresses: [
    { street: { name: "rua dos bobos", number: 0 } },
    { street: { name: "foo", number: 1337 } }
  ]
});

const mmo = Maybe.of(Maybe.of("nunchuks"));
// Maybe(Maybe('nunchucks'))

mmo.join();
// Maybe('nunchuks')

const ioio = IO.of(IO.of("pizza"));
// IO(IO('pizza'))

ioio.join();
// IO('pizza')

const ttt = Task.of(Task.of(Task.of("sewers")));
// Task(Task(Task('sewers')))

ttt.join();
// Task(Task('sewers'))

// join :: Monad m => m (m a) -> m a
const join = mma => mma.join();

const firstAddressStreetWithJoin = compose(
  join,
  map(safeProp("street")),
  join,
  map(safeHead),
  safeProp("addresses")
);

// log :: a -> IO a
const log = x =>
  new IO(() => {
    console.log(x);
    return x;
  });

// setStyle :: Selector -> CSSProps -> IO DOM
const setStyle = curry((sel, props) => new IO(() => jQuery(sel).css(props)));

const localStorageMock = { preferences: { background: "pink" } };

const localStorage = {
  getItem: key => localStorageMock[key]
};

// getItem :: String -> IO String
const getItem = key => new IO(() => localStorage.getItem(key));

// applyPreferences :: String -> IO DOM
const applyPreferences = compose(
  join,
  map(setStyle("#main")),
  join,
  map(log),
  getItem
);

applyPreferences("preferences").unsafePerformIO();

// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = f =>
  compose(
    join,
    map(f)
  );

const firstAddressStreetWithChain = compose(
  chain(safeProp("street")),
  chain(safeHead),
  safeProp("addresses")
);

const applyPreferencesWithChain = compose(
  chain(setStyle("#main")),
  chain(log),
  getItem
);

// associativity
// compose(join, map(join)) === compose(join, join)

// identity for all (M a)
// compose(join, of) === compose(join, map(of)) === id;

const mcompose = (f, g) =>
  compose(
    chain(f),
    g
  );

// left identity
// mcompose(M, f) === f;

// right identity
// mcompose(f, M) === f;

// associativity
// mcompose(mcompose(f,g), h) === mcompose(f, mcompose(g,h));

/* exercises */

const user = {
  id: 1,
  name: "Albert",
  address: {
    street: {
      number: 22,
      name: "Walnut St"
    }
  }
};

// getStreetName :: User -> Maybe String
const getStreetName = compose(
  chain(safeProp("name")),
  chain(safeProp("street")),
  safeProp("address")
);

// getFile :: IO String
const getFile = IO.of("../chapter-09/index.js");

// pureLog :: String -> IO ()
const pureLog = str => new IO(() => console.log(str));

// logFilename :: IO ()
const logFilename = compose(
  chain(pureLog),
  map(
    compose(
      last,
      split("/")
    )
  )
);

logFilename(getFile).unsafePerformIO();

const testRegexp = curry((regexp, str) => regexp.test(str));
const testEmail = textRegexPattern(/\S+@\S+\.\S+/);

// validateEmail :: Email -> Either String Email
const validateEmail = str =>
  testEmail(str) ? Either.of(str) : left("this is not an email");

// addToMailingList :: Email -> IO([Email])
const mailingList = IO.of(["primeiro@email.com", "segundo@email.com"]);
const addToMailingList = email => map(mailingList, arr => [email, ...arr]);

// emailBlast :: [Email] -> IO ()
const emailBlast = mailingList => map(mailingList, email => IO.of(email));

// joinMailingList :: Email -> Either String (IO (h))
const joinMailingList = compose(
  map(
    compose(
      chain(emailBlast),
      addToMailingList
    )
  ),
  validateEmail
);
