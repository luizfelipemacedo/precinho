import fs from "fs";
import puppeteer from 'puppeteer';

async function scrapeData(searchTerm) {
    const browser = await puppeteer.launch({ headless: 'false' });
    const page = await browser.newPage();

    await page.goto(`https://www.extrabom.com.br/busca/?q=${searchTerm}&sort=2`, { timeout: 60000 });
    const extrabomProducts = await page.$$eval('.name-produto', elements => elements.map(el => el.innerText).slice(0, 10));
    const extrabomPrices = await page.$$eval('.item-por__val', elements => elements.map(el => el.innerText).slice(0, 10));
    const extrabomImages = await page.$$eval('.carousel__img', imgs => imgs.map(img => img.getAttribute('src')).slice(0, 10));

    const extrabomResult = extrabomProducts.map((nome, indice) => {
        return { name: nome, price: extrabomPrices[indice], image: extrabomImages[indice], market: "Extrabom" };
    });

    await page.goto(`https://www.carone.com.br/${searchTerm}`, { timeout: 60000 });

    const caroneProducts = await page.$$eval('.product-name', elements => elements.map(el => el.innerText).slice(0, 10));
    const caronePrices = await page.$$eval('.skuBestPrice', elements => elements.map(el => el.innerText).slice(0, 10));
    const caroneImages = await page.$$eval('div.product-image img', imgs => imgs.map(img => img.getAttribute('src')).slice(0, 10));

    const caroneResult = caroneProducts.map((nome, indice) => {
        return { name: nome, price: caronePrices[indice], image: caroneImages[indice], market: "Carone" };
    });

    await browser.close();

    const combinedArray = [...extrabomResult, ...caroneResult];

    return combinedArray;
};

(async () => {
    const searchTerms = ['leite longa vida', 'arroz kg', 'feijão kg', 'cafe 500g', 'açucar kg'];
    const scrapePromises = searchTerms.map(searchTerm => scrapeData(searchTerm));

    const scrappedDataArrays = await Promise.all(scrapePromises);
    const scrappedData = scrappedDataArrays.flat();
    console.log(scrappedData.length);

    const formattedData = scrappedData.map((item) => ({
        ...item,
        price: parseFloat(item.price.trim().replace("R$", "").replace(",", ".")),
    }));

    try {
        const jsonData = JSON.stringify(formattedData, null, 2);
        fs.writeFileSync('data.json', jsonData);

        console.log('Produtos atualizados com sucesso!');

    } catch (error) {
        console.log(error);
    }
})();
