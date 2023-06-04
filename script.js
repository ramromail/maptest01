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

    gMap.fitBounds({south: 60.48, west: 19.87, north: 69.34, east: 33.94});

    gMap.addListener("click", (e) => {
        // lockPosition = false;
        console.log(gMap.get);
    });

    gMap.addListener("dragend", (e) => {
        lockPosition = false;
        console.log(e);
        // console.log(e.latlng.lat , e.latlng.lng);
    });

    marker.push(new google.maps.Marker({
        position: myLatLng,
        map: gMap,
        title: "You are here.",
        icon: {
            url: './blueDot.png',
            anchor: new google.maps.Point(12, 12),
            scaledSize: new google.maps.Size(24, 24)
        }
    }));

    const response = await fetch("points.json");
    const jsonData = await response.json();

    jsonData.forEach(element => {
        // console.log(element);
        let newMarker = new google.maps.Marker({
            position: { lat: element.gps.lat, lng: element.gps.lng },
            map: gMap,
            icon: {
                url: './gem.png',
                anchor: new google.maps.Point(12, 12),
                scaledSize: new google.maps.Size(24, 24)
            }
        });

        let infoW = new google.maps.InfoWindow({
            content: '<div><p><b>' + element.title + '</b></p><p>' + element.body + '</p></div>',
          });


        newMarker.addListener('click', function () {
            infoW.open({
                anchor: newMarker,
                map: gMap,
            });
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
