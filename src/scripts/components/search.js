import { fetchData } from "../fetchData.js";
import { loadMenuComponent } from "../components/menu.js";
import { until } from "../asyncUtils.js";

const instruction = document.querySelector('#resultado > .instruction');
const instructionIcon = document.querySelector('#resultado > .instruction > svg');
const instructionText = document.querySelector('#resultado > .instruction > span');

const lista = document.querySelector('#resultado > #lista');
const searchInputField = document.querySelector('#search-area .search-bar input');
searchInputField.addEventListener('input', searchChangedEvent);

const defaultInstructionText = instructionText.textContent;

const orderArea = document.querySelector('#resultado > #order');
const orderButton = document.querySelector('#resultado > #order > button');
const orderText = document.querySelector('#resultado > #order > .order-text');
const orderWindow = document.querySelector('#order-window');
const orderWindowBackground = document.querySelector('#order-window > .background');

const orderByRelevanceItem = document.querySelector('#order-window > .window > ul > li#relevance');
const orderByPriceItem = document.querySelector('#order-window > .window > ul > li#price');

const pageOccluder = document.querySelector('#occluder');

let data = [];

var orderType = 1; //1- Relevance | 2- Price

function initializePage(){
    orderWindow.className = "hidden";
    orderArea.style.display = "none";
    instruction.style.display = "";
    instructionIcon.style.display = "";
    lista.style.display = "none";
    
    orderButton.addEventListener('click', openOrderWindow);
    orderWindowBackground.addEventListener('click', closeOrderWindow);
    
    orderByRelevanceItem.addEventListener('click', orderByRelevance);
    orderByPriceItem.addEventListener('click', orderByPrice);
    
    updateOrderType();

    restoreLastSearch();
    
    //save last page
    localStorage.setItem("lastPage", window.location.href);
}

async function restoreLastSearch(){
    var lastSearchString = localStorage.getItem("lastSearch");
    await until(_ => data.length > 0);
    if (lastSearchString)
    {       
        searchInputField.value = lastSearchString;
        performSearch(lastSearchString);        
    }
    showPage(true);
}

initializePage();
loadMenuComponent();
//inicializeMenu();

function clearProductContainer() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}

function showProducts(products) {
    products.forEach(product => {
        const image = product.image;
        const name = product.name;
        const price = product.price;

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = image;
        productImage.classList.add('product-image');
        productImage.setAttribute('draggable', false);
        productDiv.appendChild(productImage);
        
        const productPrice = document.createElement('span');
        productPrice.classList.add('product-price');
        productPrice.textContent = `R$ ${price.toLocaleString('pt-BR')}`;
        productDiv.appendChild(productPrice);

        const productName = document.createElement('span');
        productName.classList.add('product-name');
        productName.textContent = `${name}`;
        productDiv.appendChild(productName);

        productDiv.addEventListener('click', () => {
            window.location.href = `product.html?id=${name}`;
          });

        lista.appendChild(productDiv);
    });
}

function searchChangedEvent() {
    performSearch(String(this.value));
}

function performSearch(searchString) {
    var inputText = searchString;
    var filteredProducts = data.filter(product => product.name.toLowerCase().includes(inputText.toLowerCase()));

    var isSearching = inputText.length > 0;
    var foundProducts = filteredProducts.length > 0;

    if(isSearching && foundProducts)
        instructionText.textContent = "";
    else if(isSearching){
        instructionText.textContent = "Nenhum produto encontrado";
        instructionIcon.style.display = "none";
    }
    else{
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

function showPage(show){
    pageOccluder.style.display = show ? "none" : "";
}

(async () => {
    data = await fetchData();
})();


function openOrderWindow(){
    orderWindow.className = "";
}
function closeOrderWindow(){
    orderWindow.className = "hidden";
}

// ---------------- ORDER FUNCTIONS -------------------------

function orderByRelevance(){
    orderType = 1;
    updateOrderType();

    //PODE FAZER A MUDANÇA DE ORDENAÇÃO AQUI
}

function orderByPrice(){
    orderType = 2;
    updateOrderType();

    //PODE FAZER A MUDANÇA DE ORDENAÇÃO AQUI
}

function updateOrderType(){
    orderByRelevanceItem.className = orderType == 1 ? "active" : "";
    orderByPriceItem.className = orderType == 2 ? "active" : "";

    var text = "Ordenando por ";
    if(orderType == 1)
        text += "relevância";
    else if(orderType == 2)
        text += "menor preço";

    orderText.innerHTML = text;

    closeOrderWindow();

    //PODE FAZER A MUDANÇA DE ORDENAÇÃO OU AQUI
}

// ---------------- TEST ONLY -------------------------
async function TestSearch(){
    await until(_ => data.length > 0);
    searchInputField.value = "arroz";
    performSearch("arroz");

    // instruction.style.display = "none";
    // instructionIcon.style.display = "none";
    // lista.style.display = "";
}
//TestSearch();
// ----------------------------------------------------
