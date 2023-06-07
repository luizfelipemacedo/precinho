import { loadMenuComponent } from "./components/menu.js";
import { fetchData } from "./fetchData.js";

const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');
console.log(produtoId);

const detalhesProduto = document.getElementById("detalhes-produto");
const favoriteButton = document.getElementById("fav-button");
const topHeader = document.getElementById("top-header");
const backButton = document.getElementById("back-button");

loadMenuComponent();

favoriteButton.addEventListener("click", handleFavorite);
backButton.addEventListener("click", backButtonClick);

(async () => {
    const data = await fetchData();
    const product = data.filter(product => product.name === produtoId);

    console.log(product);

    //const productDiv = document.createElement('div');
    //productDiv.classList.add('product');

    //const image = document.createElement("img");
    const image = document.querySelector('#detalhes-produto > div.product-image-area > img.product-image');
    image.src = product[0].image;
    //image.classList.add('product-image');
    //detalhesProduto.appendChild(image);

    //const titulo = document.createElement("h1");
    const titulo = document.querySelector('#detalhes-produto > div.product-info > h1.product-title');
    titulo.textContent = product[0].name;
    //titulo.classList.add('product-title');
    //productDiv.appendChild(titulo);

    //const preco = document.createElement("p");
    const preco = document.querySelector('#detalhes-produto > div.product-info > p.product-price');
    preco.textContent = `R$${product[0].price.toLocaleString('pt-BR')}`;
    //preco.classList.add('product-price');
    //productDiv.appendChild(preco);

    //const market = document.createElement("p");
    const market = document.querySelector('#detalhes-produto > div.product-info > p.product-market');
    market.textContent = `Preço mais baixo no supermecado ${product[0].market}`;
    //market.classList.add('product-market');
    //productDiv.appendChild(market);

    //detalhesProduto.appendChild(productDiv);

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFav = favorites.includes(product[0].name);

    favoriteButton.className = isFav ? "active" : "disabled";

    if (isFav) {
      //favoriteButton.innerText = 'Remover dos Favoritos';
    }

    //Extra
    document.title = product[0].name;
})();

async function handleFavorite() {
  const data = await fetchData();
  const fav = data.filter(product => product.name === produtoId);
  const productName = fav[0].name;

  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", JSON.stringify([productName]));
  }
  else {
    const favorites = JSON.parse(localStorage.getItem("favorites"));

    const index = favorites.indexOf(productName);
    if (index > -1) {
      favorites.splice(index, 1);
      //favoriteButton.innerText = 'Adicionar aos Favoritos';
      favoriteButton.className = "disabled";
    } else {
      favorites.push(productName);
      //favoriteButton.innerText = 'Remover dos Favoritos';
      favoriteButton.className = "active";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function backButtonClick(){  
  var lastPage = localStorage.getItem("lastPage");
  alert("LAST PAGE: "+lastPage);
  var samePage = lastPage == window.location.href;
  if(lastPage && !samePage){
    window.location.href = lastPage;
  }
  else
    window.location.href = "../pages/search_products.html";
}

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  var scrollAmmount = 150;
  if (document.body.scrollTop > scrollAmmount || document.documentElement.scrollTop > scrollAmmount) {
    topHeader.className = "scrolled";
  }
  else{
    topHeader.className = "";
  }
}