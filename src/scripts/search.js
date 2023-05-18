const instruction = document.querySelector('#resultado > .instruction');
const lista = document.querySelector('#resultado > #lista');
const searchInputField = document.querySelector('#search-area .search-bar input');
searchInputField.addEventListener('input', searchChangedEvent);

instruction.style.display = "";
lista.style.display = "none";

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
        const market = product.market;

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = image;
        productImage.classList.add('product-image');
        productImage.style.width = '200px';
        productImage.style.height = '200px';
        productDiv.appendChild(productImage);

        const productName = document.createElement('p');
        productName.textContent = `Nome do produto: ${name}`;
        productDiv.appendChild(productName);

        const productPrice = document.createElement('p');
        productPrice.textContent = `Preço: R$${price}`;
        productDiv.appendChild(productPrice);

        const productMarket = document.createElement('p');
        productMarket.textContent = `Mercado: ${market}`;
        productDiv.appendChild(productMarket);

        lista.appendChild(productDiv);
    });
}

function searchChangedEvent() {
    var inputText = String(this.value);
    var filteredProducts = data.filter(product => product.name.toLowerCase().includes(inputText.toLowerCase()));

    instruction.textContent = inputText.length > 0 ? "Digite para pesquisar" : "Digite para pesquisar";
    lista.style.display = inputText.length > 0 ? "" : "none"; 

    instruction.textContent = filteredProducts.length > 0 ? "" : "Nenhum produto encontrado.";
    instruction.style.display = filteredProducts.length > 0 ? "none" : "";
    lista.style.display = filteredProducts.length > 0 ? "" : "";
    
    clearProductContainer();
    
    if (filteredProducts.length > 0) {
        showProducts(filteredProducts);
    }
}


(async () => {
    await fetchData();
})();
