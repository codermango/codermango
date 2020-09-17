const request = require('request');
const cheerio = require('cheerio');
const { getSupportInfo } = require('prettier');

function getPrice(ch) {
  return ch
    .find('.views-field.views-field-price-gross')
    .children()
    .children()[0]
    .next.data.trim();
}

function getDate(ch) {
  return ch
    .find('.views-field.views-field-field-price-date')
    .children()
    .children()
    .get(1).children[0].data;
}

function fetchCircleKPrices() {
  return new Promise((resolve, reject) => {
    request(
      'https://www.circlek.se/drivmedelspriser',
      {},
      (error, response, body) => {
        if (error) {
          reject(error);
        }
        const $ = cheerio.load(body);
        const productTrList = $('.ck-prices-per-product table tbody tr');

        const td95 = $(productTrList[0]);
        const td98 = $(productTrList[1]);
        const td98Plus = $(productTrList[2]);

        const price95 = getPrice(td95);
        const date95 = getDate(td95);

        const price98 = getPrice(td98);
        const date98 = getDate(td98);

        const price98Plus = getPrice(td98Plus);
        const date98Plus = getDate(td98Plus);

        const result = [
          { product: '95', price: price95, date: date95 },
          { product: '98', price: price98, date: date98 },
          { product: '98Plus', price: price98Plus, date: date98Plus },
        ];

        resolve(result);
      }
    );
  });
}

module.exports = fetchCircleKPrices;
