// Initialize and add the map

var gMap, infoWindow, marker;

initMap();

function initMap() {
    const myLatLng = { lat: 0, lng: 0 };
    gMap = new google.maps.Map(document.getElementById("gMap"), {
        zoom: 2,
        center: myLatLng,
    });

    marker = new google.maps.Marker({
        position: myLatLng,
        map: gMap,
        title: "Hello World!",
    });
}

window.initMap = initMap;

let gpsBtn = document.querySelector('input#locateMeGPS[type=checkbox]');
gpsBtn.addEventListener("change", function () {
    if (this.checked) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    marker.setPosition(pos);
                    gMap.panTo(pos);
                    gMap.setZoom(16);
                },
                () => {
                    handleLocationError(true, infoWindow, gMap.getCenter());
                });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, gMap.getCenter());
        }
    } else {
        console.log("Checkbox is not checked..");
    }
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(gMap);
}



