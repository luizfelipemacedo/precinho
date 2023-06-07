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