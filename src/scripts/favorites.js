import { loadMenuComponent } from "./components/menu.js";
import { fetchData } from "./fetchData.js";

const lista = document.getElementById("lista");
const emptyArea = document.getElementById("empty-list-area");
loadMenuComponent();

(async () => {
    if (JSON.parse(localStorage.getItem("favorites")).length === 0 || !localStorage.getItem("favorites")) {
        console.log("Sem favoritos!");

        emptyArea.style.display = "";
    }
    else {
        emptyArea.style.display = "none";

        const favorites = JSON.parse(localStorage.getItem("favorites"));
        const data = await fetchData();
        const favoritesInfo = data.filter(item => favorites.includes(item.name));
        console.log(favoritesInfo);

        spawnFavoritesList(favoritesInfo);
    }

    //save last page
    localStorage.setItem("lastPage", window.location.href);
})()

function spawnFavoritesList(favoritesList){
    favoritesList.forEach(product => {
        const image = product.image;
        const name = product.name;
        const price = product.price;
        const market = product.market;

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImageArea = document.createElement('div');
        productImageArea.classList.add('product-image-area');
        productDiv.appendChild(productImageArea);

        const productImage = document.createElement('img');
        productImage.src = image;
        productImage.classList.add('product-image');
        productImage.setAttribute('draggable', false);
        productImageArea.appendChild(productImage);

        const productInfo = document.createElement('div');
        productInfo.classList.add('info');
        productDiv.appendChild(productInfo);

        const productPrice = document.createElement('span');
        productPrice.classList.add('product-price');
        productPrice.textContent = `R$ ${price.toLocaleString('pt-BR')}`;
        productInfo.appendChild(productPrice);

        const productName = document.createElement('span');
        productName.classList.add('product-name');
        productName.textContent = `${name}`;
        productInfo.appendChild(productName);

        const productMarket = document.createElement('span');
        productMarket.classList.add('product-market');
        productMarket.textContent = `Supermercado ${market}`;
        productInfo.appendChild(productMarket);

        productDiv.addEventListener('click', () => {
            window.location.href = `product.html?id=${name}`;
          });

        lista.appendChild(productDiv);
    });
}