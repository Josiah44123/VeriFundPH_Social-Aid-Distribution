const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/admin/console');
  
  console.log("WAITING FOR LOAD");
  await page.waitForSelector('text/I-Verify');
  
  // Click I-Verify Tab
  const tabs = await page.$$('button');
  for (const t of tabs) {
    const text = await page.evaluate(el => el.textContent, t);
    if (text?.includes('I-Verify')) {
      await t.click();
      break;
    }
  }
  
  console.log("CLICKED I-VERIFY");
  await new Promise(r => setTimeout(r, 1000));
  
  // Is it throwing an error?
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await browser.close();
})();
