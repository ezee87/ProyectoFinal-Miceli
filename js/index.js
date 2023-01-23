document.addEventListener('DOMContentLoaded', () => {
    initMap();

    if (localStorage.getItem('simulacionFlete') && (localStorage.getItem('totalFlete'))) {
        simulacionFlete = obtenerSimulacionStorage();
        totalFlete = obtenerTotalStorage();
        pintarFlete(simulacionFlete, totalFlete);
    }

})