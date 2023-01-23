// Objeto donde se guardaran las simulaciones realizadas por el usuario

class simulacion {
    constructor(origenFlete, destinoFlete, pesoCarga, distanciaFlete, distanciaRealFlete, duracionFlete) {
        this.origenFlete = origenFlete;
        this.destinoFlete = destinoFlete;
        this.pesoCarga = pesoCarga;
        this.distanciaFlete = distanciaFlete;
        this.distanciaRealFlete = distanciaRealFlete;
        this.duracionFlete = duracionFlete;
    }
}

const form = document.getElementById('form');
const divMap = document.getElementById("map");

const validarFormulario = (e) => {
    e.preventDefault();
    const formulario = new FormData(form);
    const origen = formulario.get('origen') + ', Olavarria';
    const destino = formulario.get('destino') + ', Olavarria';
    const peso = formulario.get('peso');
    initMap(origen, destino, peso);
    irAResponse("response");
}

//Escuchamos el evento "submit", y llamamos a la funcion validarFormulario
form.addEventListener('submit', validarFormulario);

function initMap(origen, destino, peso) {
    // Inicializamos servicios propiciados por la API 
    const bounds = new google.maps.LatLngBounds();
    const markersArray = [];
    const map = new google.maps.Map(divMap, {
        center: { lat: -36.8949559, lng: -60.3560463 },
        zoom: 12,
    });

    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();

    // Definimos la solicitud a la api
    const origin1 = origen;
    const destinationA = destino;
    const request = {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };
// Realizamos la solicitud, y recibimos la repuesta, la cual guardamos en una nueva instancia 
// del objeto simulacion

    service.getDistanceMatrix(request)
        .then((response) => {

            const origenFlete1 = origen;
            const destinoFlete1 = destino;
            const pesoCarga1 = peso;
            const distanciaRealFlete1 = response.rows[0].elements[0].distance.value;
            const distanciaFlete1 = response.rows[0].elements[0].distance.text;
            const duracionFlete1 = response.rows[0].elements[0].duration.text

            const simulacionFlete = new simulacion(origenFlete1, destinoFlete1, pesoCarga1, distanciaFlete1, distanciaRealFlete1, duracionFlete1);

            // Calculamos el precio del flete, y redondeamos al entero mas cercano
            const totalFlete = Math.round((700 * (1 + pesoCarga1 / 100)) + (distanciaRealFlete1 / 10));
// Editamos del document (HTML) el contenido del div con el ID response.
            document.getElementById("response").innerHTML =
                `<div class = "container-fluid mb-3 d-flex justify-content-center align-items-center">
            <div class = "col-md-4 border border-warning rounded bg-light">
            <h3 class = "text-center mt-2">Tu flete</h3>
            <div class = "px-3">
            <p>Origen del flete: ${simulacionFlete.origenFlete}</p>
            <p>Destino del flete: ${simulacionFlete.destinoFlete}</p>
            <p>Peso de la carga en kilos: ${simulacionFlete.pesoCarga} kg</p>
            <p>Distancia del viaje: ${simulacionFlete.distanciaFlete}</p>
            <p>Duracion del viaje: ${simulacionFlete.duracionFlete}</p>
            <p>Precio: $${totalFlete}</p>
            </div>
            </div></div>
`;

            // Colocamos los marcadores en el mapa, sobre el origen y el destino

            const originList = response.originAddresses;
            const destinationList = response.destinationAddresses;

            // Invocamos la funcion para eliminar los marcadores para 
            // luego colocarlos en la nueva posicion.

            deleteMarkers(markersArray);

            const showGeocodedAddressOnMap = (asDestination) => {
                const handler = ({ results }) => {
                    map.fitBounds(bounds.extend(results[0].geometry.location));
                    markersArray.push(
                        new google.maps.Marker({
                            map,
                            position: results[0].geometry.location,
                            label: asDestination ? "A" : "B",
                        })
                    );
                };
                return handler;
            };

            for (let i = 0; i < originList.length; i++) {
                const results = response.rows[i].elements;

                geocoder
                    .geocode({ address: originList[i] })
                    .then(showGeocodedAddressOnMap(false));

                for (let j = 0; j < results.length; j++) {
                    geocoder
                        .geocode({ address: destinationList[j] })
                        .then(showGeocodedAddressOnMap(true));
                }
            }
        });

}
// Funcion para eliminar los marcadores del mapa, recorriendo el array de marcadores
function deleteMarkers(markersArray) {
    for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }

    markersArray = [];
}

// Funcion para ir a la seccion con el ID response
function irAResponse(response) {
    location.hash = "#" + response;
}

window.initMap = initMap;