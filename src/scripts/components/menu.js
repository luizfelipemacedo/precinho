//carrega o arquivo html como string e inicializa o menu depois de carregado
export function loadMenuComponent(){
    $.get("../pages/components/menu.html", function(html_string)
    {
        initializeMenu(html_string); 
    },'html');
}

function initializeMenu(htmlContent) {
        const divElement = document.getElementById('menu');

        divElement.innerHTML = htmlContent;
        document.body.appendChild(divElement);

        const searchButton = document.querySelector('#bottom-tab > .products > button');
        const favoritesButton = document.querySelector('#bottom-tab > .favorites > button');
        const storesButton = document.querySelector('#bottom-tab > .stores > button');

        searchButton.addEventListener('click', loadSearchPage);
        favoritesButton.addEventListener('click', loadFavoritesPage);
        storesButton.addEventListener('click', loadStoresPage);

        function loadSearchPage() {
            window.location.href = "../pages/search_products.html";
        }

        function loadFavoritesPage() {
            window.location.href = "../pages/favorites.html";
        }

        function loadStoresPage() {
            window.location.href = "../pages/stores.html";
        }

        updateMenuActiveButton();
}


function updateMenuActiveButton(){
    const searchButton = document.querySelector('#bottom-tab > .products > button');
    const favoritesButton = document.querySelector('#bottom-tab > .favorites > button');
    const storesButton = document.querySelector('#bottom-tab > .stores > button');

    //var fileName = location.href.split("/").slice(-1);
    var lastPage = localStorage.getItem("lastPage") ? localStorage.getItem("lastPage") : location.href;
    var path = lastPage.substring(lastPage.lastIndexOf("/")+ 1);
    var fileName = (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];

    console.log(fileName);

    if(lastPage.includes("?market=") || fileName == "stores.html"){
        searchButton.className = "disabled";
        favoritesButton.className = "disabled";
        storesButton.className = "";
        console.log("MENU > ESTABALECIMENTOS");
    }
    else if(fileName == "search_products.html" || fileName == "product.html"){
        searchButton.className = "";
        favoritesButton.className = "disabled";
        storesButton.className = "disabled";
        console.log("MENU > SEARCH");  
    }
    else if(fileName == "favorites.html"){
        searchButton.className = "disabled";
        favoritesButton.className = "";
        storesButton.className = "disabled";  
        console.log("MENU > FAVORITES");
    }
    else{        
        searchButton.className = "disabled";
        favoritesButton.className = "disabled";
        storesButton.className = "disabled";
        console.log("MENU > NOTHING");
    }
}