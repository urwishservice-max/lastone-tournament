const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SS_DIR = 'E:\\naveen\\refrence\\screenshots';

async function screenshot(browser, url, filename, waitMs = 4000, clickSelector = null) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
  } catch(e) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
  }
  await new Promise(r => setTimeout(r, waitMs));
  if (clickSelector) {
    try {
      await page.click(clickSelector);
      await new Promise(r => setTimeout(r, 2000));
    } catch(e) {}
  }
  const outPath = path.join(SS_DIR, filename);
  await page.screenshot({ path: outPath, fullPage: false });
  const size = fs.statSync(outPath).size;
  console.log(`✓ ${filename} (${(size/1024).toFixed(0)} KB)`);
  await page.close();
}

async function clickAndScreenshot(browser, url, buttonText, filename, waitMs = 3000) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
  } catch(e) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
  }
  await new Promise(r => setTimeout(r, 2000));
  
  // Try to find and click the button
  try {
    const found = await page.evaluate((text) => {
      const els = [...document.querySelectorAll('button, a, [role="button"]')];
      const el = els.find(e => e.textContent.toLowerCase().includes(text.toLowerCase()));
      if (el) { el.click(); return true; }
      return false;
    }, buttonText);
    if (found) await new Promise(r => setTimeout(r, waitMs));
  } catch(e) {}
  
  const outPath = path.join(SS_DIR, filename);
  await page.screenshot({ path: outPath, fullPage: false });
  const size = fs.statSync(outPath).size;
  console.log(`✓ ${filename} (${(size/1024).toFixed(0)} KB)`);
  await page.close();
}

(async () => {
  console.log('Starting screenshot capture of YOUR LastZone app...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    // 1. Home page
    await screenshot(browser, 'http://localhost/', 'your_01_home.png', 5000);
    
    // 2. Click Login
    await clickAndScreenshot(browser, 'http://localhost/', 'login', 'your_02_login.png', 3000);
    
    // 3. Click Register
    await clickAndScreenshot(browser, 'http://localhost/', 'register', 'your_03_register.png', 3000);
    
    // 4. Click Leaderboard
    await clickAndScreenshot(browser, 'http://localhost/', 'leaderboard', 'your_04_leaderboard.png', 3000);
    
    // 5. Click Play
    await clickAndScreenshot(browser, 'http://localhost/', 'play', 'your_05_play.png', 5000);
    
    // 6. API leaderboard JSON
    await screenshot(browser, 'http://localhost/api/leaderboard', 'your_06_api_json.png', 2000);
    
    // 7. Jenkins job page
    await screenshot(browser, 'http://localhost:8080/job/LastZone-Tournament/', 'your_07_jenkins_job.png', 3000);
    
    // 8. Jenkins Build 3
    await screenshot(browser, 'http://localhost:8080/job/LastZone-Tournament/3/', 'your_08_build3.png', 3000);
    
    // 9. Jenkins console
    await screenshot(browser, 'http://localhost:8080/job/LastZone-Tournament/3/consoleFull', 'your_09_console.png', 3000);

  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
    console.log('\nDone! Screenshots in:', SS_DIR);
    const files = fs.readdirSync(SS_DIR).filter(f => f.startsWith('your_'));
    files.forEach(f => {
      const s = fs.statSync(`${SS_DIR}\\${f}`).size;
      console.log(`  ${f} - ${(s/1024).toFixed(0)} KB`);
    });
  }
})();
