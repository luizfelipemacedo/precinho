import { loadMenuComponent } from "./components/menu.js";
import { fetchData, fetchCoord, handleServiceWorker } from "./fetchData.js";
import { getClosestStoreCoord } from "./marketDistance.js";

const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');
console.log(produtoId);

const favoriteButton = document.getElementById("fav-button");
const topHeader = document.getElementById("top-header");
const backButton = document.getElementById("back-button");

loadMenuComponent();

favoriteButton.addEventListener("click", handleFavorite);
backButton.addEventListener("click", backButtonClick);

var marketCoords;

(async () => {
    const data = await fetchData();
    marketCoords = await fetchCoord();

    const product = data.filter(product => product.name === produtoId);
    console.log(product);

    var distance = getClosestStoreCoord(product[0].market, marketCoords);
    distance = distance == null ? "" : "Estabelecimento mais próximo à "+ distance.toFixed(1) + " Km";

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
    marketLocation.href = `https://www.google.com.br/maps/search/${product[0].market}+Supermercado/@${location.data.lat},${location.data.lon}`;

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
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      // handleServiceWorker();
      new Notification('Precinho', {
        body: 'A partir de agora você será notificado quando os preços forem atualizados.',
        vibrate: [200, 100, 200],
        icon: '/public/icon-192x192.png'
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // handleServiceWorker();
        }
      });
    }
  }
  else {
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

function backButtonClick(){  
  var lastPage = localStorage.getItem("lastPage");
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