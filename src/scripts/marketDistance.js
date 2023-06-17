
export function getClosestStoreCoord(marketName, marketCoords){
        marketName = marketName.toLowerCase();

        if(!marketCoords[marketName])
            return null;

        var userCoordArray = getUserCoord();
        if(userCoordArray == null || userCoordArray.length != 2){
            console.log("Couldn't get user coord.");
            return null;
        }
        var closestDistance = Number.MAX_VALUE;
        var closestLatLon = [0,0];
        for(var market in marketCoords[marketName]) {
            var coordString = marketCoords[marketName][market].coord.split(",");
            var lat = Number(coordString[0]);
            var lon = Number(coordString[1]);
            var storeDistance = calculateDistance(lat, lon, userCoordArray[0], userCoordArray[1])
            //console.log(`${marketName}: ${storeDistance.toFixed(3)} | ${coordString}` );
            if(storeDistance < closestDistance){
                closestDistance = storeDistance;
                closestLatLon = [lat, lon];
            }
        }
        //console.log("Closest "+marketName+": "+closestDistance + " | "+closestLatLon);
        return closestDistance;
        //console.log("userCoordArray: "+userCoordArray);
}
    
function getUserCoord(){
        if (localStorage.getItem('location')) {
            const location = JSON.parse(localStorage.getItem('location'));
            const latitude = Number(location.data.lat);
            const longitute = Number(location.data.lon);
            return [latitude, longitute];
        }
        else {
            return null;
        }
}
    
function calculateDistance(lat1, lon1, lat2, lon2) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515; //default is Miles
            if (true) { dist = dist * 1.609344 } //Km
            return dist;
        }
}