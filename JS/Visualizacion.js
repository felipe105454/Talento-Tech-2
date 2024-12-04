let datosOriginales = [];

// Cargar datos del archivo CSV
async function cargarDatos() {
    try {
        const response = await fetch('/data/02-modern-renewable-energy-consumption.csv');
        const dataText = await response.text();

        // Parsear las filas del CSV
        const rows = dataText.trim().split('\n').map(row => row.split(','));
        datosOriginales = rows.slice(1); // Excluir la cabecera
        actualizarTabla(datosOriginales); // Mostrar todos los datos al cargar
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Actualizar la tabla
function actualizarTabla(datos) {
    const tableBody = document.querySelector('#tabla-datos');
    tableBody.innerHTML = ''; // Limpiar la tabla

    if (datos.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 7;
        celda.textContent = 'Debes cargar primero todos los datos globales completos para aplicar los filtros.';
        celda.className = 'text-center text-danger';
        fila.appendChild(celda);
        tableBody.appendChild(fila);
        return;
    }

    datos.forEach(row => {
        const fila = document.createElement('tr');
        row.forEach(cell => {
            const celda = document.createElement('td');
            celda.textContent = cell;
            fila.appendChild(celda);
        });
        tableBody.appendChild(fila);
    });
}
function filtrarPorPaisYAnio() {
    const pais = document.getElementById('filtro-pais').value.trim().toLowerCase();
    const anio = document.getElementById('filtro-anio').value.trim();

    // Filtrar por país y año
    const datosFiltrados = datosOriginales.filter(row => {
        const entidad = row[0].toLowerCase();  // Considera la entidad (país) en minúsculas
        const año = row[2];  // Asumir que el año está en la tercera columna

        // Filtrar por país y año, incluyendo las verificaciones cuando están vacíos
        const coincidePais = pais === '' || entidad.includes(pais);
        const coincideAnio = anio === '' || año.toString().includes(anio);  // Convertir el año a string para la comparación

        return coincidePais && coincideAnio;  // Ambas condiciones deben cumplirse
    });

    actualizarTabla(datosFiltrados);  // Actualizar la tabla con los datos filtrados
}

