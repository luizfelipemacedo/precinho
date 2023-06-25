import { loadMenuComponent } from "./components/menu.js";
import { fetchData, fetchCoord } from "./fetchData.js";
import { getClosestStoreCoord } from "./marketDistance.js";

// function Store(name, count){
//     this.name = name;
//     this.count = count;
// };

const gpsSvg =`
<svg viewBox="132.3 10 735.4 980" xmlns="http://www.w3.org/2000/svg">
<path d="M513.3,985.4c-3.9,3.1-8.6,4.6-13.3,4.6c-4.7,0-9.4-1.5-13.3-4.6C472.2,974,132.3,659.5,132.3,377.5C132.3,174.9,297.3,10,500,10c202.7,0,367.7,164.9,367.7,367.5C867.7,659.5,527.8,974,513.3,985.4z M500,205.9c-94.8,0-171.6,76.8-171.6,171.6c0,94.8,76.8,171.6,171.6,171.6c94.8,0,171.6-76.8,171.6-171.6C671.6,282.7,594.8,205.9,500,205.9z"/>
</svg>
`;

const lista = document.getElementById("lista");

var marketCoords;

initializePage();

async function initializePage(){
    lista.innerHTML = "";

    const data = await fetchData();
    marketCoords = await fetchCoord();

    var storeObjectList = getStoreListFromData(data);

    spawnStoreList(storeObjectList, marketCoords);

    //save last page
    localStorage.setItem("lastPage", window.location.href);

    loadMenuComponent();
}

function getStoreListFromData(data){
    //var storeObjects = [];
    var storeList = [];
    data.forEach(item =>{
        if(!storeList.includes(item.market))
            storeList.push(item.market);
    });
    //console.log("Store List: " + storeList);

    // storeList.forEach(store =>{
    //     var allStoreProducts = data.filter(item => item.market == store);
    //     console.log("length: " + allStoreProducts.length);
    //     var thisStore = new Store(store, allStoreProducts.length);
    //     storeObjects.push(thisStore);
    // });    
    return storeList;
}

function spawnStoreList(storeList, marketCoords){
    lista.innerHTML = "";
    storeList.forEach(store => {
        var distance = getClosestStoreCoord(store, marketCoords);
        distance = distance == null ? "- Km" : distance.toFixed(1) + " Km";

        const storeDiv = document.createElement('div');
        storeDiv.classList.add('store');

        const imageArea = document.createElement('div');
        imageArea.classList.add('store-image-area');
        storeDiv.appendChild(imageArea);

        const image = document.createElement('img');
        // image.src = image;
        image.alt = "";
        image.classList.add('product-image');
        image.setAttribute('draggable', false);
        imageArea.appendChild(image);

        const storeInfo = document.createElement('div');
        storeInfo.classList.add('info');
        storeDiv.appendChild(storeInfo);

        const storeName = document.createElement('span');
        storeName.classList.add('store-name');
        storeName.textContent = `${store}`;
        storeInfo.appendChild(storeName);

        const storeLocation = document.createElement('div');
        storeLocation.classList.add('location');
        storeLocation.innerHTML = gpsSvg+`<span>${distance}</span>`;
        storeDiv.appendChild(storeLocation);
        //storeLocation.style.display = distance == null || distance == "" ? "none" : "";

        // const storeProductCount = document.createElement('span');
        // storeProductCount.classList.add('store-name');
        // storeProductCount.textContent = `${store.count}`;
        // storeInfo.appendChild(storeProductCount);

        storeDiv.addEventListener('click', () => {
            window.location.href = `search_products.html?market=${store}`;
        });

        lista.appendChild(storeDiv);
    });
}
