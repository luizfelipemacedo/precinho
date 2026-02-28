import { until } from "../asyncUtils.js";
import { loadMenuComponent } from "../components/menu.js";
import { fetchData } from "../fetchData.js";
const urlParams = new URLSearchParams(window.location.search);

const instruction = document.querySelector("#resultado > .instruction");
const instructionIcon = document.querySelector(
  "#resultado > .instruction > svg"
);
const instructionText = document.querySelector(
  "#resultado > .instruction > span"
);

const lista = document.querySelector("#resultado > #lista");
const searchInputField = document.querySelector(
  "#search-area .search-bar input"
);
searchInputField.addEventListener("input", searchChangedEvent);

const defaultInstructionText = instructionText.textContent;

const orderArea = document.querySelector("#resultado > #order");
const orderButton = document.querySelector("#resultado > #order > button");
const orderText = document.querySelector("#resultado > #order > .order-text");
const orderWindow = document.querySelector("#order-window");
const orderWindowBackground = document.querySelector(
  "#order-window > .background"
);

const orderByRelevanceItem = document.querySelector(
  "#order-window > .window > ul > li#relevance"
);
const orderByLowerPriceItem = document.querySelector(
  "#order-window > .window > ul > li#priceLower"
);
const orderByHigherPriceItem = document.querySelector(
  "#order-window > .window > ul > li#priceHigher"
);

const pageOccluder = document.querySelector("#occluder");

let data = [];

var orderType = 1; //1- Relevance | 2- Price

function initializePage() {
  orderWindow.className = "hidden";
  orderArea.style.display = "none";
  instruction.style.display = "";
  instructionIcon.style.display = "";
  lista.style.display = "none";

  orderButton.addEventListener("click", openOrderWindow);
  orderWindowBackground.addEventListener("click", closeOrderWindow);

  orderByRelevanceItem.addEventListener("click", orderByRelevance);
  orderByLowerPriceItem.addEventListener("click", orderByLowerPrice);
  orderByHigherPriceItem.addEventListener("click", orderByHigherPrice);

  if (localStorage.getItem("orderType"))
    orderType = localStorage.getItem("orderType");
  updateOrderType();

  var marketParam = urlParams.get("market");
  if (marketParam && marketParam.length > 0) {
    showStoreProducts(marketParam);
  } else {
    restoreLastSearch();
    //save last page
  }

  localStorage.setItem("lastPage", window.location.href);

  loadMenuComponent();
}

async function restoreLastSearch() {
  var lastSearchString = localStorage.getItem("lastSearch");
  await until((_) => data.length > 0);
  if (lastSearchString) {
    searchInputField.value = lastSearchString;
    performSearch(lastSearchString);
  }
  showPage(true);
}

initializePage();

function clearProductContainer() {
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }
}

function showProducts(products) {
  products.forEach((product) => {
    const { id, name, price, image } = product;

    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const productImage = document.createElement("img");
    productImage.src = image;
    productImage.classList.add("product-image");
    productImage.setAttribute("draggable", false);
    productDiv.appendChild(productImage);

    const productPrice = document.createElement("span");
    productPrice.classList.add("product-price");
    productPrice.textContent = price ? `R$ ${price.toLocaleString("pt-BR")}` : "Preço indisponível";
    productDiv.appendChild(productPrice);

    const productName = document.createElement("span");
    productName.classList.add("product-name");
    productName.textContent = `${name}`;
    productDiv.appendChild(productName);

    productDiv.addEventListener("click", () => {
      window.location.href = `product.html?id=${id}`;
    });

    lista.appendChild(productDiv);
  });
}

function searchChangedEvent() {
  performSearch(String(this.value));
  if (window.location.href.includes("?market")) {
    localStorage.setItem("lastPage", window.location.href.split("?market")[0]);
    loadMenuComponent();
  }
}

function performSearch(searchString) {
  var inputText = searchString;
  var filteredProducts = data.filter((product) =>
    product.name.toLowerCase().includes(inputText.toLowerCase())
  );

  if (orderType == 2)
    filteredProducts.sort((a, b) => a.price - b.price); //ordena por menor preço
  else if (orderType == 3) filteredProducts.sort((a, b) => b.price - a.price); //ordena por maior preço

  var isSearching = inputText.length > 0;
  var foundProducts = filteredProducts.length > 0;

  if (isSearching && foundProducts) instructionText.textContent = "";
  else if (isSearching) {
    instructionText.textContent = "Nenhum produto encontrado";
    instructionIcon.style.display = "none";
  } else {
    instructionText.textContent = defaultInstructionText;
    instructionIcon.style.display = "";
  }

  orderArea.style.display = isSearching && foundProducts ? "" : "none";
  instruction.style.display = isSearching && foundProducts ? "none" : "";
  lista.style.display = filteredProducts.length > 0 ? "" : "none";

  clearProductContainer();

  if (filteredProducts.length > 0 && inputText.length > 0) {
    showProducts(filteredProducts);
  }

  localStorage.setItem("lastSearch", searchString);
}

async function showStoreProducts(storeName) {
  searchInputField.value = storeName;
  await until((_) => data.length > 0);

  var storeProducts = data.filter(
    (product) => product.market.toLowerCase() == storeName.toLowerCase()
  );

  var foundProducts = storeProducts.length > 0;

  instructionIcon.style.display = "none";

  instructionText.textContent = foundProducts
    ? ""
    : "Nenhum produto encontrado";

  orderArea.style.display = "none";
  instruction.style.display = foundProducts ? "none" : "";
  lista.style.display = storeProducts.length > 0 ? "" : "none";

  clearProductContainer();

  if (storeProducts.length > 0) {
    showProducts(storeProducts);
  }

  showPage(true);
}

function showPage(show) {
  pageOccluder.style.display = show ? "none" : "";
}

(async () => {
  data = await fetchData();
})();

function openOrderWindow() {
  orderWindow.className = "";
}
function closeOrderWindow() {
  orderWindow.className = "hidden";
}

// ---------------- ORDER FUNCTIONS -------------------------

function orderByRelevance() {
  orderType = 1;
  localStorage.setItem("orderType", orderType);
  updateOrderType();

  searchInputField.dispatchEvent(new Event("input"));
}

function orderByLowerPrice() {
  orderType = 2;
  localStorage.setItem("orderType", orderType);
  updateOrderType();

  searchInputField.dispatchEvent(new Event("input"));
}

function orderByHigherPrice() {
  orderType = 3;
  localStorage.setItem("orderType", orderType);
  updateOrderType();

  searchInputField.dispatchEvent(new Event("input"));
}

function updateOrderType() {
  orderByRelevanceItem.className = orderType == 1 ? "active" : "";
  orderByLowerPriceItem.className = orderType == 2 ? "active" : "";
  orderByHigherPriceItem.className = orderType == 3 ? "active" : "";

  var text = "Ordenando por ";
  if (orderType == 1) text += "relevância";
  else if (orderType == 2) text += "menor preço";
  else if (orderType == 3) text += "maior preço";

  orderText.innerHTML = text;

  closeOrderWindow();
}

// ---------------- TEST ONLY -------------------------
async function TestSearch() {
  await until((_) => data.length > 0);
  searchInputField.value = "arroz";
  performSearch("arroz");

  // instruction.style.display = "none";
  // instructionIcon.style.display = "none";
  // lista.style.display = "";
}
//TestSearch();
// ----------------------------------------------------
