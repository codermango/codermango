const request = require('request');

const getCircleKPrices = require('./getCircleKPrices.js');

// start file

// 1. get circle k price every data at 6am
getCircleKPrices().then((result) => console.log(result));

// 2. make it as a view

// 3. create a png for that

// 4. replace the png from previous day
