// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function () {
//         navigator.serviceWorker
//             .register("/serviceWorker.js")
//             .then(res => console.log("service worker registered"))
//             .catch(err => console.log("service worker not registered", err))
//     })
// }

const btn = document.querySelector('#get-geo');
btn.addEventListener('click', getLocation);

const btn_del = document.querySelector('#delete-geo');
btn_del.addEventListener('click', deleteGeo);

if (localStorage.getItem('location')) {
    const location = JSON.parse(localStorage.getItem('location'));
    document.querySelector('#resultado').innerHTML = `Sua localização atual é:\n ${location.data.display_name}`;
    btn.remove();
    btn_del.style.display = "block";

    drawMap(location.data.lat, location.data.lon);
    getLocation();
}

function deleteGeo() {
    localStorage.removeItem('location');
    window.location.reload();
}

function drawMap(latitude, longitude) {
    var map = L.map('mapid').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Você está aqui.')
        .openPopup();
}

function getLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(async function (position) {
            try {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                if (latitude && longitude) {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                    );
                    const data = await res.json();
                    console.log(data)
                    const currentTime = new Date().toISOString();
                    localStorage.setItem('location', JSON.stringify({ data, currentTime }));

                    document.querySelector('#resultado').innerHTML = `Sua localização atual é:\n ${data.display_name}`;
                    btn.remove();
                    btn_del.style.display = "block";

                    drawMap(latitude, longitude);
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
