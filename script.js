// Initialize and add the map
let map, infoWindow, marker;
initMap();

async function initMap() {
    // The location of Uluru
    const position = { lat: 0, lng: 0 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    infoWindow = new google.maps.InfoWindow();

    // The map, centered at Uluru
    map = new Map(document.getElementById("gMap"), {
        zoom: 1,
        center: position,
        mapId: "gMap",
    });

    // The marker, positioned at Uluru
    // marker = new AdvancedMarkerElement({
    marker = google.maps.Marker({
        map: map,
        position: position,
        // title: "Uluru",
    });

    console.log("marker: ", marker);


    if (navigator.geolocation) {
        console.log("marker: ", marker);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                console.log("marker: ", marker);

                marker.setPosition(pos);
                map.setCenter(pos);
                map.setZoom(16);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    }
}

let gpsBtn = document.querySelector('input#locateMeGPS[type=checkbox]');
gpsBtn.addEventListener("change", function () {
    if (this.checked) {
        console.log("Checkbox checked..");
        if (navigator.geolocation) {
            console.log(map, marker);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    console.log(map, marker);
                    map.setCenter(pos);
                    map.setZoom(15);
                    marker.setPosition(pos);
                    console.log(pos, marker);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
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
    infoWindow.open(map);
}