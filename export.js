const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
    'maths/2024/paper_2024_maths_822HZ.html',
    'science/2022/UP_Board_Class10_Science_2022_Solved.html',
    'science/2023/paper_science_2023_824EK.html',
];

(async () => {
    const browser = await puppeteer.launch();
    try {
        for (const rel of files) {
            const abs = path.resolve(__dirname, rel);
            if (!fs.existsSync(abs)) {
                console.error(`Missing: ${abs}`);
                continue;
            }
            const out = abs.replace(/\.html$/i, '.pdf');
            const page = await browser.newPage();
            await page.goto('file://' + abs, { waitUntil: 'networkidle0' });
            await page.evaluateHandle('document.fonts.ready');
            await page.pdf({
                path: out,
                format: 'A4',
                printBackground: true,
                margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
            });
            await page.close();
            console.log(`Exported: ${out}`);
        }
    } finally {
        await browser.close();
    }
})();
