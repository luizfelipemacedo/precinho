if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

const btn = document.querySelector('#get-geo');
btn.addEventListener('click', getLocation);

const btn_del = document.querySelector('#delete-geo');
btn_del.addEventListener('click', deleteGeo);

if (localStorage.getItem('location')) {
    const location = JSON.parse(localStorage.getItem('location'));
    document.querySelector('#resultado').innerHTML = `Sua localização atual é:\n ${location.display_name}`;
    btn.remove();
    btn_del.style.display = "block";
}

function deleteGeo() {
    localStorage.removeItem('location');
    window.location.reload();
}

function getLocation() {
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
                localStorage.setItem('location', JSON.stringify(data));
                document.querySelector('#resultado').innerHTML = `Sua localização atual é:\n ${data.display_name}`;
                btn.remove();
                btn_del.style.display = "block";
            }
        } catch (err) {
            console.log(err);
        }
    })
}
