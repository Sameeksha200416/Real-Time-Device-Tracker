const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
        const { latitude, longitude} = position.coords;
        console.log("sending location:", latitude, longitude); // Add this line
        socket.emit("send-location", {latitude,longitude});
        if (!window._mapCentered) {
                map.setView([latitude, longitude], 15);
                window._mapCentered = true;
            }
    },
    (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000 ,///this is 5000 milliseconds
        maximumAge: 0//anytime you need data take it 
    }
);
}

const map = L.map("map").setView([0,0],2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Sameeksha"
}).addTo(map)

// Object to hold markers for each user
const markers = {};

// Listen for location updates from the server
// socket.on("receive-locations", (data)=> {
//     const {id,latitude , longitude} = data;
//     console.log("Received location:", id, latitude, longitude); // Add this line
//     map.setView([latitude,longitude]);
//     // if marker already exists, update its position
//     if(markers[id]){
//         markers[id].setLatLng([latitude,longitude]);
//     }
//     // if marker does not exist, create a new one
//     else{
//         markers[id] = L.marker([latitude,longitude]).addTo(map);
//     }
// })

socket.on("receive-locations", (users) => {
    console.log("Received locations:", users); // Add this line
    for (const id in users) {
        const { latitude, longitude } = users[id];

        // Center map only once, optionally
        // if (!centered) {
        //     map.setView([latitude, longitude], 15);
        //     centered = true;
        // }

        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]);
        } else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    }

    // Clean up markers of disconnected users
    for (const id in markers) {
        if (!users[id]) {
            map.removeLayer(markers[id]);
            delete markers[id];
        }
    }
});


// socket.on("user-disconnected",(id) => {

//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// })