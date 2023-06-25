import { loadMenuComponent } from "./components/menu.js";
import { fetchData } from "./fetchData.js";

const favButtonInnerHtml=`
<svg viewBox="0 0 39 37" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_149_331)">
<path d="M19.5 0L24.1033 14.1327H39L26.9483 22.8673L31.5517 37L19.5 28.2655L7.44834 37L12.0517 22.8673L0 14.1327H14.8967L19.5 0Z" />
</g>
<path d="M19.5 1.61444L23.6279 14.2876L23.7403 14.6327H24.1033H37.4581L26.6549 22.4624L26.3602 22.676L26.4729 23.0221L30.6 35.6928L19.7934 27.8606L19.5 27.648L19.2066 27.8606L8.39998 35.6928L12.5271 23.0221L12.6398 22.676L12.3451 22.4624L1.54191 14.6327H14.8967H15.2597L15.3721 14.2876L19.5 1.61444Z"/>
<defs>
<filter id="filter0_i_149_331" x="0" y="0" width="39" height="41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_149_331"/>
</filter>
</defs>
</svg>
`;

const lista = document.getElementById("lista");
const emptyArea = document.getElementById("empty-list-area");

// (async () => {
//     if (JSON.parse(localStorage.getItem("favorites")).length === 0 || !localStorage.getItem("favorites")) {
//         console.log("Sem favoritos!");

//         emptyArea.style.display = "";
//     }
//     else {
//         emptyArea.style.display = "none";

//         const favorites = JSON.parse(localStorage.getItem("favorites"));
//         const data = await fetchData();
//         const favoritesInfo = data.filter(item => favorites.includes(item.name));
//         console.log(favoritesInfo);

//         spawnFavoritesList(favoritesInfo);
//     }

//     //save last page
//     localStorage.setItem("lastPage", window.location.href);
// })();


initializePage();

loadMenuComponent();

async function initializePage(){
    lista.innerHTML = "";
    if (!localStorage.getItem("favorites") || JSON.parse(localStorage.getItem("favorites")).length === 0) {
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

    loadMenuComponent();
}

function spawnFavoritesList(favoritesList){
    lista.innerHTML = "";
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

        const favButton = document.createElement('div');
        favButton.classList.add('fav-button');
        favButton.innerHTML = favButtonInnerHtml;
        productDiv.appendChild(favButton);

        productDiv.addEventListener('click', () => {
            window.location.href = `product.html?id=${name}`;
        });

        favButton.addEventListener('click', (event, element) => {
            if (event.target != element) {
                event.stopPropagation();
                //return;
            }
            removeFromFavorites(name);
        });

        lista.appendChild(productDiv);
    });
}

async function removeFromFavorites(productName){
    const data = await fetchData();
  
    if (!localStorage.getItem("favorites")){
        //do nothing
    }
    else {
        const favorites = JSON.parse(localStorage.getItem("favorites"));
    
        const index = favorites.indexOf(productName);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(productName);
        }
    
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    initializePage();
}