import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set headers to avoid detection
  await page.setExtraHTTPHeaders({
    'Referer': 'https://result.election.gov.np/'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36');

  try {
    await page.goto('https://result.election.gov.np/', { waitUntil: 'networkidle2' });
    
    // Extract data directly from the browser context
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.map(row => {
        const columns = row.querySelectorAll('td');
        return [
          columns[1]?.innerText.trim(), 
          parseInt(columns[2]?.innerText.replace(/,/g, ''))
        ];
      }).filter(item => item[0] && !isNaN(item[1]));
    });

    await browser.close();
    res.status(200).json(data);
  } catch (error) {
    await browser.close();
    res.status(500).json({ error: error.message });
  }
}