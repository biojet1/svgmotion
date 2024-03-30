import puppeteer from "puppeteer";
(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        timeout: 10000,
    });
    console.log(browser);
    const page = await browser.newPage();
    await page.goto('https://www.freecodecamp.org/news/how-to-use-puppeteer-with-nodejs/');
    console.log(page);
    // # await page.waitForNavigation({waitUntil: 'networkidle', networkIdleTimeout: 1000});
    console.log("title", await page.title());
    await browser.close();
})();
//# sourceMappingURL=index.js.map