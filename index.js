const puppeteer = require('puppeteer');
const {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics
} = require('./helpers');

async function retrieveMetrics(url, page) {
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  await page.goto(url);

  let firstMeaningfulPaint = 0;
  let performanceMetrics;

  while (firstMeaningfulPaint === 0) {
    await page.waitFor(300);
    performanceMetrics = await client.send('Performance.getMetrics');
    firstMeaningfulPaint = getTimeFromPerformanceMetrics(
      performanceMetrics,
      'FirstMeaningfulPaint'
    );
  }

  return { performanceMetrics, performanceTiming}
}

async function analyzePage (url) {
  const browser = await puppeteer.launch({
    headless : true,
    args: [ '--no-sandbox' ]
  });
  const page = await browser.newPage();
  let metrics = await retrieveMetrics(url, page)
  await browser.close();
  return metrics
}

module.exports = analyzePage;
