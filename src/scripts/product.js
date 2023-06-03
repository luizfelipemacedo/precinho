import { inicializeMenu } from "./components/menu.js";
import { fetchData } from "./fetchData.js";

const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');
console.log(produtoId);

const detalhesProduto = document.getElementById("detalhes-produto");
const favoriteButton = document.getElementById("fav-button");

inicializeMenu();

favoriteButton.addEventListener("click", handleFavorite);

(async () => {
  const data = await fetchData();
  const product = data.filter(product => product.name === produtoId);

  console.log(product);

  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  const image = document.createElement("img");
  image.src = product[0].image;
  image.classList.add('product-image');
  detalhesProduto.appendChild(image);

  const titulo = document.createElement("h1");
  titulo.textContent = product[0].name;
  titulo.classList.add('product-title');
  productDiv.appendChild(titulo);

  const preco = document.createElement("p");
  preco.textContent = `R$${product[0].price.toLocaleString('pt-BR')}`;
  preco.classList.add('product-price');
  productDiv.appendChild(preco);

  const market = document.createElement("p");
  market.textContent = `Preço mais baixo no supermecado ${product[0].market}`;
  market.classList.add('product-market');
  productDiv.appendChild(market);

  detalhesProduto.appendChild(productDiv);

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isFav = favorites.includes(product[0].name);

  if (isFav) {
    favoriteButton.innerText = 'Remover dos Favoritos';
  }
})()

async function handleFavorite() {
  const data = await fetchData();
  const fav = data.filter(product => product.name === produtoId);
  const productName = fav[0].name;

  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", JSON.stringify([productName]));
  } else {
    const favorites = JSON.parse(localStorage.getItem("favorites"));

    const index = favorites.indexOf(productName);
    if (index > -1) {
      favorites.splice(index, 1);
      favoriteButton.innerText = 'Adicionar aos Favoritos';
    } else {
      favorites.push(productName);
      favoriteButton.innerText = 'Remover dos Favoritos';
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}
