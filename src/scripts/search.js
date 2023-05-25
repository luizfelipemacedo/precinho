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

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = image;
        productImage.classList.add('product-image');
        productDiv.appendChild(productImage);
        
        const productPrice = document.createElement('p');
        productPrice.classList.add('product-price');
        productPrice.textContent = `R$ ${price}`;
        productDiv.appendChild(productPrice);

        const productName = document.createElement('p');
        productName.classList.add('product-name');
        productName.textContent = `${name}`;
        productDiv.appendChild(productName);

        lista.appendChild(productDiv);
    });
}

function searchChangedEvent() {
    const inputText = String(this.value);
    const filteredProducts = data.filter(product => product.name.toLowerCase().includes(inputText.toLowerCase()));
    
    lista.style.display = inputText.length > 0 ? "" : "none";

    instruction.style.display = inputText.length === 0 ? "" : "none";
    instruction.textContent = inputText.length === 0 ? "Digite algo na caixa de pesquisa" : "";

    instruction.style.display = filteredProducts.length > 0 ? "none" : "";
    instruction.textContent = filteredProducts.length > 0 ? "" : "Nenhum produto encontrado.";
    
    clearProductContainer();
    
    if (filteredProducts.length > 0 && inputText.length > 0) {
        showProducts(filteredProducts);
    }
}


(async () => {
    await fetchData();
})();
