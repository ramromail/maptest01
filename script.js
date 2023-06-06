// Initialize and add the map
var gMap
    , infoWindow
    , marker = []
    , watchPos
    , lockPosition = true
    , curLat = 0
    , curLng = 0;

window.initMap = initMap;
window.initMap();

async function initMap() {
    const myLatLng = { lat: 0, lng: 0 };

    gMap = new google.maps.Map(document.getElementById("gMap"), {
        zoom: 2,
        center: myLatLng,
    });

    gMap.fitBounds({ south: 60.48, west: 19.87, north: 69.34, east: 33.94 });

    gMap.addListener("click", (e) => {
        console.log(e.latLng.toJSON());
    });

    gMap.addListener("dragend", (e) => {
        lockPosition = false;
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


        newMarker.addListener('click', function (e) {
            let lat_1 = e.latLng.lat();
            let lng_1 = e.latLng.lng();

            let distance = getDistance(lat_1, lng_1, curLat, curLng);
            if( distance <= 10) {
                infoW.open({
                    anchor: newMarker,
                    map: gMap,
                });
            }
            else {
                alert('You are too far, ' + Number.parseFloat(distance).toFixed(2) + ' m away. Come closer.');
            }
        });

        marker.push(newMarker);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            curLat = pos.lat;
            curLng = pos.lng;

            gMap.setCenter(pos);
            gMap.setZoom(15);
            marker[0].setPosition(pos);
        });
    }
}


let gpsBtn = document.querySelector('input#locateMeGPS[type=checkbox]');
gpsBtn.addEventListener("change", function () {
    if (this.checked) {
        lockPosition = true;
        if (navigator.geolocation) {
            watchPos = navigator.geolocation.watchPosition(
                function (pos) {
                    // successfunction
                    const crd = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    console.log(crd.lat, crd.lng, curLat, curLng);

                    let distance = getDistance(crd.lat, crd.lng, curLat, curLng);
                    if( distance >= 2) {
                        console.log('Yes : ' + Number.parseFloat(distance).toFixed(2) + 'm.');

                        curLat = crd.lat;
                        curLng = crd.lng;

                        marker[0].setPosition(crd);
                        if (lockPosition) {
                            gMap.setZoom(16);
                            gMap.panTo(crd);
                        }
                    }
                    else {
                        console.log('Moved: ' + Number.parseFloat(distance).toFixed(2) + 'm.');
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

function getDistance(lat_1, lng_1, lat_2, lng_2) {
    var R = 6371000, RAD = Math.PI / 180;

    var dLat = RAD * (lat_2 - lat_1);
    var dLon = RAD * (lng_2 - lng_1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(RAD * lat_1) * Math.cos(RAD * lat_2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}
