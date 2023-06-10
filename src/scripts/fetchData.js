export async function fetchData() {
    if (!sessionStorage.getItem("data")) {
        const res = await fetch(`https://market-api-ten.vercel.app/all`);
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