const { toUpperCase, head, toLowerCase } = require("@mostly-adequate/support");
const R = require("ramda");

// Hindley-Milner type signatures

// capitalize :: String -> String
const capitalize = s => toUpperCase(head(s)) + toLowerCase(R.tail(s));
const res = capitalize("smurf");
console.log(res);
