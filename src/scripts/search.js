const instruction = document.querySelector('#resultado > .instruction');
const instructionIcon = document.querySelector('#resultado > .instruction > svg');
const instructionText = document.querySelector('#resultado > .instruction > span');

const lista = document.querySelector('#resultado > #lista');
const searchInputField = document.querySelector('#search-area .search-bar input');
searchInputField.addEventListener('input', searchChangedEvent);

instruction.style.display = "";
instructionIcon.style.display = "";
lista.style.display = "none";

const defaultInstructionText = instructionText.textContent;

const orderButton = document.querySelector('#resultado > .order > button');
const orderWindow = document.querySelector('#order-window');
const orderWindowBackground = document.querySelector('#order-window > .background');
orderButton.addEventListener('click', openOrderWindow);
orderWindowBackground.addEventListener('click', closeOrderWindow);
orderWindow.className = "hidden";
orderButton.style.display = "none";

let data = [];

async function fetchData() {
    const res = await fetch('https://market-api-ten.vercel.app/all');
    data = await res.json();
    console.log(data);
}

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

    orderButton.style.display = isSearching && foundProducts ? "" : "none";
    instruction.style.display = isSearching && foundProducts ? "none" : "";
    lista.style.display = filteredProducts.length > 0 ? "" : "none";
    
    clearProductContainer();
    
    if (filteredProducts.length > 0 && inputText.length > 0) {
        showProducts(filteredProducts);
    }
}

(async () => {
    await fetchData();
})();

function openOrderWindow(){
    orderWindow.className = "";
}
function closeOrderWindow(){
    orderWindow.className = "hidden";
}

// ---------------- TEST ONLY -------------------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const until = (predFn) => {
    const poll = (done) => (predFn() ? done() : setTimeout(() => poll(done), 500));
    return new Promise(poll);
};

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
