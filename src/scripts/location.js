// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function () {
//         navigator.serviceWorker
//             .register("/serviceWorker.js")
//             .then(res => console.log("service worker registered"))
//             .catch(err => console.log("service worker not registered", err))
//     })
// }

const SEARCH_LOCATION_STRING = "Buscar localização atual";
const UPDATE_LOCATION_STRING = "Atualizar localização atual";

const geoButton = document.querySelector('#get-geo');
const selectGeo = document.querySelector('#select-geo');
const geoButtonText = document.querySelector('#get-geo > span.button-text');
const btn_del = document.querySelector('#manual-location');

selectGeo.addEventListener('click', function() {
    window.location.href = '/src/pages/search_products.html';
});
btn_del.addEventListener('click', deleteGeo);
geoButton.addEventListener('click', getLocation);

if (localStorage.getItem('location')) {
    const location = JSON.parse(localStorage.getItem('location'));

    switchToSavedLocation(location.data.address.city);
    getLocation();
} else {
    document.querySelector('#select-geo').style.display = 'none';
}

function deleteGeo() {
    localStorage.removeItem('location');
    window.location.reload();
}

function switchToSavedLocation(city){
    document.querySelector('#saved-location > .text').innerHTML = `${city}`;
    document.querySelector('#saved-location').style.display = "block";
    geoButton.style.display = "none";
    document.querySelector("#select-geo").style.display = "block";
    geoButtonText.innerHTML = UPDATE_LOCATION_STRING;
}

function getLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(async function (position) {
            try {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                if (latitude && longitude) {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,);
                    const data = await res.json();
                    console.log(data);
                    const currentTime = new Date().toISOString();
                    localStorage.setItem('location', JSON.stringify({ data, currentTime }));                    
                    
                    switchToSavedLocation(data.address.city);
                }
            } catch (err) {
                console.log(err);
            }
        }, function () {
            M.toast({html: 'A localização está desligada. Por favor, habilite a localização para usar este recurso.'})
        })
    } else {
        alert('Geolocalização não disponível!')
    }
}