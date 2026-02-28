import fs from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer";
import { MARKETS, SEARCH_TERMS } from "./constants.js";

const __dirname = new URL(".", import.meta.url).pathname;

(async () => {
  const scrapePromises = SEARCH_TERMS.map(async (searchTerm, index) => {
    console.log(
      `scraping data for search term ${index + 1}/${
        SEARCH_TERMS.length
      }: ${searchTerm}`
    );
    return scrapeData(searchTerm);
  });

  const scrapedDataArrays = await Promise.all(scrapePromises);
  const scrapedData = scrapedDataArrays.flat();

  console.log("total items:", scrapedData.length);

  const formattedData = scrapedData.map((item, index) => ({
    id: String(index + 1),
    ...item,
    price: parseFloat(item.price?.trim().replace("R$", "").replace(",", ".")),
  }));

  try {
    const jsonData = JSON.stringify(formattedData, null, 2);
    const filePath = join(__dirname, "products.json");
    fs.writeFileSync(filePath, jsonData);

    console.log("products.json file created successfully");
  } catch (error) {
    console.log(error);
  }
})();

async function scrapeData(searchTerm) {
  const browser = await puppeteer.launch({
    headless: "false",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const scrapedDataPromises = MARKETS.map(async (market) => {
    const page = await browser.newPage();

    const { name, url, selectors } = market;
    const pageUrl = `${url}${searchTerm}`;

    return scrapeDataFromMarket(page, pageUrl, name, selectors);
  });

  const [...scrapedData] = await Promise.all(scrapedDataPromises);

  await browser.close();
  return scrapedData.flat();
}

async function scrapeDataFromMarket(
  pageInstance,
  pageUrl,
  marketName,
  { productNameSelector, productPriceSelector, productImageSelector }
) {
  const MAX_TIMEOUT = 60000;

  await pageInstance.goto(pageUrl, {
    timeout: MAX_TIMEOUT,
  });

  const products = await pageInstance.$$eval(
    `${productNameSelector}`,
    (elements) => elements.map((el) => el.innerText)
  );
  const prices = await pageInstance.$$eval(
    `${productPriceSelector}`,
    (elements) => elements.map((el) => el.innerText)
  );
  const images = await pageInstance.$$eval(`${productImageSelector}`, (imgs) =>
    imgs.map((img) => img.getAttribute("src"))
  );
  const pageBaseUrl = new URL(pageUrl).origin;

  return products.map((name, index) => {
    return {
      name,
      price: prices[index],
      image: getImageUrl(images[index], pageBaseUrl),
      market: marketName,
    };
  });

 function getImageUrl(imageSrc, pageBaseUrl) {
    if (!imageSrc) return null;

    if (imageSrc.startsWith("http")) {
      return imageSrc;
    }
    const imageUrl = new URL(imageSrc, pageBaseUrl);
    return imageUrl.href.replace('jpeg', 'webp'); // for extrabom, to get higher quality images
  } 
}
