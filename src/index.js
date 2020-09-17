const path = require('path');
const nodeHtmlToImage = require('node-html-to-image');
const circlekBot = require('./circlek-bot.js');

// nodeHtmlToImage({
//   output: './image.png',
//   html: '<html><body>Hello world!</body></html>',
// }).then(() => console.log('The image was created successfully!'));

// start file

// 1. get circle k price every data at 6am
// circlekBot.fetchCircleKPrices.then((result) => console.log(result));

// 2. make it as a view

// 3. create a png for that

// 4. replace the png from previous day

async function main() {
  const prices = await circlekBot.fetchCircleKPrices();

  const template = await circlekBot.convertHTMLtoString(`${path.resolve(__dirname)}/index.html`);
  const miles95Url = await circlekBot.convertImageToBase64(`${path.resolve(__dirname, '../')}/public/miles_95.png`);
  const miles98Url = await circlekBot.convertImageToBase64(`${path.resolve(__dirname, '../')}/public/miles_98.png`);
  const miles98PlusUrl = await circlekBot.convertImageToBase64(
    `${path.resolve(__dirname, '../')}/public/miles_plus_98.png`
  );

  // console.log(miles95Url);
  await nodeHtmlToImage({
    output: './circle-k-result.png',
    html: template,
    content: {
      image95: miles95Url,
      image98: miles98Url,
      image98Plus: miles98PlusUrl,
      price95: prices[0].price,
      price98: prices[1].price,
      price98Plus: prices[2].price,
      date95: prices[0].date,
      date98: prices[1].date,
      date98Plus: prices[2].date,
    },
  });
}

main();
