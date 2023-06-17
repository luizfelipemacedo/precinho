export async function fetchData() {
    if (!sessionStorage.getItem("data")) {
        const res = await fetch("../../../data/data.json");
        const data = await res.json();
        sessionStorage.setItem("data", JSON.stringify(data));
        return data;
    } else {
        const data = sessionStorage.getItem("data");
        return JSON.parse(data);
    }
}

export function handleServiceWorker() {
    navigator.serviceWorker.register('/serviceWorker.js')
    .then(async serviceWorker => {
        serviceWorker.update()
        try {
            let subscription = await serviceWorker.pushManager.getSubscription()

        if (!subscription) {
            const publicKeyResponse = await fetch('http://localhost:3005/notifications/push/public-key')
            const data = await publicKeyResponse.json();
            subscription = await serviceWorker.pushManager.subscribe({
                applicationServerKey: await data.publicKey,
                userVisibleOnly: true
            })
        }
        console.log(subscription);

        await fetch('http://localhost:3005/notifications/push/send', {
            method: "POST",
            body: JSON.stringify({ subscription }),
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
               }
            ,
            mode: "cors"
        })

        } catch (error) {
            console.log(error);   
        }
    })
}


export async function fetchCoord() {
    if (!sessionStorage.getItem("market_coord")) {
        const res = await fetch("../../../data/market_coord.json");
        const coord = await res.json();
        sessionStorage.setItem("market_coord", JSON.stringify(coord));
        return coord;
    } else {
        const coord = sessionStorage.getItem("market_coord");
        return JSON.parse(coord);
    }
}