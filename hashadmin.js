const { genSalt, hash, compare } = require('bcryptjs');

async function gen(){
const salt = await genSalt(10);
const secpass = await hash("admin123", salt);
console.log(secpass);
}
gen();

