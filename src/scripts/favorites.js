import { fetchData } from "./fetchData.js";

const lista = document.getElementById("lista");

(async () => {
    if (JSON.parse(localStorage.getItem("favorites")).length === 0 || !localStorage.getItem("favorites")) {
        console.log("Sem favoritos!");
    } else {
        const favorites = JSON.parse(localStorage.getItem("favorites"));
        const data = await fetchData();
        const favoritesInfo = data.filter(item => favorites.includes(item.name));
        console.log(favoritesInfo);

        favoritesInfo.forEach(product => {
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
})()