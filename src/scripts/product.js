import { loadMenuComponent } from "./components/menu.js";
import { fetchData, fetchCoord } from "./fetchData.js";
import { getClosestStoreCoord } from "./marketDistance.js";

var marketCoords;
const urlParams = new URLSearchParams(window.location.search);
const productID = urlParams.get('id');
console.log(productID);

const favoriteButton = document.getElementById("fav-button");
const topHeader = document.getElementById("top-header");
const backButton = document.getElementById("back-button");
const lista = document.getElementById("lista");

window.addEventListener("load", () => {
  if (!productID) {
    window.location.href = '/src/pages/search_products.html'
  }
});
favoriteButton.addEventListener("click", handleFavorite);
backButton.addEventListener("click", () => {
  window.history.back();
});

(async () => {
  const data = await fetchData();
  marketCoords = await fetchCoord();

  const product = data.filter(product => product.name === productID);
  console.log(product);

  var distance = getClosestStoreCoord(product[0].market, marketCoords);
  distance = distance == null ? "" : "Estabelecimento mais próximo à " + distance.toFixed(1) + " Km";

  const image = document.querySelector('#detalhes-produto > div.product-image-area > img.product-image');
  image.src = product[0].image;

  const titulo = document.querySelector('#detalhes-produto > div.product-info > h1.product-title');
  titulo.textContent = product[0].name;

  const preco = document.querySelector('#detalhes-produto > div.product-info > p.product-price');
  preco.textContent = `R$${product[0].price.toLocaleString('pt-BR')}`;

  const market = document.querySelector('#detalhes-produto > div.product-info > p.product-market');
  market.innerHTML = `Preço mais baixo no supermecado ${product[0].market}`;

  const marketDistance = document.querySelector('#detalhes-produto > div.product-info > p.product-market.distance');
  marketDistance.textContent = `${distance}`;

  const location = JSON.parse(localStorage.getItem("location"));
  const marketLocation = document.querySelector('#detalhes-produto > div.product-info .map-button');

  const locationRef = location ? `@${location.data.lat},${location.data.lon}` : ``;
  marketLocation.href = `https://www.google.com.br/maps/search/${product[0].market}+Supermercado/${locationRef}`

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isFav = favorites.includes(product[0].name);

  favoriteButton.className = isFav ? "active" : "disabled";

  document.title = product[0].name;

  getRelatedProduts();
  handleNotification();
  loadMenuComponent();
})();

async function getRelatedProduts() {
  const data = await fetchData();
  const produtcName = productID.split(" ")[0];
  const relatedProducts = data.filter(product => product.name.includes(produtcName)).slice(0, 10);
  const duplicateProductIndex = relatedProducts.findIndex(product => product.name === productID);

  if (duplicateProductIndex !== -1) {
    relatedProducts.splice(duplicateProductIndex, 1);
  }

  relatedProducts.forEach(product => {
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

async function handleFavorite() {
  const productName = productID;

  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", JSON.stringify([productName]));
    favoriteButton.className = "active";
  } else {
    const favorites = JSON.parse(localStorage.getItem("favorites"));
    const index = favorites.indexOf(productName);
    if (index > -1) {
      favorites.splice(index, 1);
      favoriteButton.className = "disabled";
    } else {
      favorites.push(productName);
      favoriteButton.className = "active";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

}

function handleNotification() {
  if (Notification.permission !== 'denied') {
    if (!localStorage.getItem('notificationDisplayed')) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Precinho', {
            body: 'A partir de agora você será notificado quando os preços forem atualizados.',
            vibrate: [200, 100, 200],
            icon: '/public/icon-192x192.png'
          })
          localStorage.setItem('notificationDisplayed', true);
        }
      })
    }
  }
}

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
  var scrollAmmount = 150;
  if (document.body.scrollTop > scrollAmmount || document.documentElement.scrollTop > scrollAmmount) {
    topHeader.className = "scrolled";
  }
  else {
    topHeader.className = "";
  }
}