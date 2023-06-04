// Initialize and add the map
var gMap, infoWindow, marker = [], watchPos, lockPosition = true;
window.initMap = initMap;
window.initMap();

async function initMap() {
    const myLatLng = { lat: 0, lng: 0 };

    gMap = new google.maps.Map(document.getElementById("gMap"), {
        zoom: 2,
        center: myLatLng,
    });

    gMap.addListener("click", (e) => {
        // lockPosition = false;
        console.log(e);
    });
    gMap.addListener("dragend", (e) => {
        lockPosition = false;
    });


    marker.push(new google.maps.Marker({
        position: myLatLng,
        map: gMap,
        title: "Hello World!",
        icon: {
            url: './blueDot.png',
            anchor: new google.maps.Point(12, 12),
            scaledSize: new google.maps.Size(24, 24)
        }
    }));

    const response = await fetch("points.json");
    const jsonData = await response.json();
    console.log(jsonData);
    jsonData.forEach(element => {
        console.log(element);
        let newMarker = new google.maps.Marker({
            position: { lat: element.gps.lat, lng: element.gps.lng },
            map: gMap,
            icon: {
                url: './gem.png',
                anchor: new google.maps.Point(12, 12),
                scaledSize: new google.maps.Size(24, 24)
            }
        });

        newMarker.addListener('click', function () {
            console.log('I was clicked');
        });

        marker.push(newMarker);
    });

}


let gpsBtn = document.querySelector('input#locateMeGPS[type=checkbox]');
gpsBtn.addEventListener("change", function () {
    if (this.checked) {
        if (navigator.geolocation) {
            watchPos = navigator.geolocation.watchPosition(
                function (pos) {
                    // successfunction
                    const crd = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    console.log(pos);
                    marker[0].setPosition(crd);
                    if (lockPosition) {
                        gMap.panTo(crd);
                    }
                }, function (err) {
                    // errors occured
                    console.error('Error occured, ', err);
                }, {
                // options
                enableHighAccuracy: true,
                timeout: 120000,
                maximumAge: 10000
            });

        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, gMap.getCenter());
        }
    } else {
        console.log("Checkbox is not checked..");
        navigator.geolocation.clearWatch(watchPos);
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
