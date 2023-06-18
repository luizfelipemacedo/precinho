export async function fetchData() {
    if (!sessionStorage.getItem("data")) {
        const res = await fetch("../../../data/products.json");
        const data = await res.json();
        sessionStorage.setItem("data", JSON.stringify(data));
        return data;
    } else {
        const data = sessionStorage.getItem("data");
        return JSON.parse(data);
    }
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