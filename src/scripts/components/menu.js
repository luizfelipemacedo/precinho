export function inicializeMenu() {
        const divElement = document.getElementById('menu');

        const htmlContent = `<div id="bottom-tab">
        <div class="products">
            <button type="button">
                <svg class="search-icon" viewBox="0 0 27 28" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.4077 16.3522H18.5821L26 23.785L23.785 26L16.3522 18.582V17.4077L15.9508 16.9914C14.2561 18.4483 12.056 19.3253 9.66267 19.3253C4.3259 19.3253 3.8147e-06 14.9994 3.8147e-06 9.66266C3.8147e-06 4.3259 4.3259 0 9.66267 0C14.9994 0 19.3253 4.3259 19.3253 9.66266C19.3253 12.056 18.4483 14.2561 16.9914 15.9508L17.4077 16.3522ZM2.97313 9.66266C2.97313 13.3642 5.96112 16.3522 9.66267 16.3522C13.3642 16.3522 16.3522 13.3642 16.3522 9.66266C16.3522 5.96112 13.3642 2.97313 9.66267 2.97313C5.96112 2.97313 2.97313 5.96112 2.97313 9.66266Z"/>
                </svg>
                <span class="">Buscar&nbsp;produtos</span>
            </button>
        </div>            

        <div class="favorites">
            <button type="button" class="">
                <svg class="fav-icon" viewBox="0 0 25 26" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3148 0L16.458 9.67376H26.6296L18.4006 15.6525L21.5438 25.3262L13.3148 19.3475L5.0858 25.3262L8.22899 15.6525L0 9.67376H10.1716L13.3148 0Z"/>
                </svg>
                <span >Favoritos</span>
            </button>
        </div>

        <div class="stores">
            <button type="button" class="">
                <svg class="list-icon" viewBox="0 0 1000 920" xmlns="http://www.w3.org/2000/svg">
                    <path d="M104.8,152.3c-52.4,0-94.8,42.5-94.8,94.8s42.5,94.8,94.8,94.8s94.8-42.5,94.8-94.8S157.2,152.3,104.8,152.3z M104.8,405.2C52.5,405.2,10,447.6,10,500c0,52.4,42.5,94.8,94.8,94.8s94.8-42.5,94.8-94.8C199.7,447.6,157.2,405.2,104.8,405.2z M104.8,658.1c-52.4,0-94.8,42.5-94.8,94.8c0,52.4,42.5,94.8,94.8,94.8s94.8-42.5,94.8-94.8C199.7,700.5,157.2,658.1,104.8,658.1z M326.1,310.3h600.6c34.9,0,63.2-28.3,63.2-63.2s-28.3-63.2-63.2-63.2H326.1c-34.9,0-63.2,28.3-63.2,63.2S291.2,310.3,326.1,310.3z M926.8,436.8H326.1c-34.9,0-63.2,28.3-63.2,63.2c0,34.9,28.3,63.2,63.2,63.2h600.6c34.9,0,63.2-28.3,63.2-63.2C990,465.1,961.7,436.8,926.8,436.8z M926.8,689.7H326.1c-34.9,0-63.2,28.3-63.2,63.2c0,34.9,28.3,63.2,63.2,63.2h600.6c34.9,0,63.2-28.3,63.2-63.2C990,718,961.7,689.7,926.8,689.7z"/>
                </svg>
                <span>Estabelecimentos</span>
            </button>
        </div>
        </section>

        <link rel="stylesheet" href="../styles/css/components/menu.css" />
        <script src="../scripts/components/menu.js"></script>`;

        divElement.innerHTML = htmlContent;
        document.body.appendChild(divElement);

        const searchButton = document.querySelector('#bottom-tab > .products > button');
        const favoritesButton = document.querySelector('#bottom-tab > .favorites > button');
        const storesButton = document.querySelector('#bottom-tab > .stores > button');

        searchButton.addEventListener('click', loadSearchPage);
        favoritesButton.addEventListener('click', loadFavoritesPage);
        storesButton.addEventListener('click', loadStoresPage);

        function loadSearchPage() {
                window.location.href = `search_products.html`;
        }

        function loadFavoritesPage() {
                window.location.href = `favorites.html`;
        }

        function loadStoresPage() {
                alert("EM BREVE");
        }
}