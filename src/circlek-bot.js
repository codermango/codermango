const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { getSupportInfo } = require('prettier');
const { resolve } = require('path');

function getPrice(ch) {
  return ch.find('.views-field.views-field-price-gross').children().children()[0].next.data.trim();
}

function getDate(ch) {
  return ch.find('.views-field.views-field-field-price-date').children().children().get(1).children[0].data;
}

function fetchCircleKPrices() {
  return new Promise((resolve, reject) => {
    request('https://www.circlek.se/drivmedelspriser', {}, (error, response, body) => {
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
    });
  });
}

function convertHTMLtoString(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function convertImageToBase64(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }

      const base64Image = new Buffer.from(data).toString('base64');
      const dataURI = 'data:image/jpeg;base64,' + base64Image;
      resolve(dataURI);
    });
  });
}

module.exports = {
  fetchCircleKPrices,
  convertHTMLtoString,
  convertImageToBase64,
};
