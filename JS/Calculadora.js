
async function calcularPorcentaje() {
    // Obtener el valor ingresado por el usuario
    const consumoTotalKwhMes = parseFloat(document.getElementById('consumo-mensual').value);

    if (isNaN(consumoTotalKwhMes) || consumoTotalKwhMes <= 0) {
        alert("Por favor, ingresa un valor válido de consumo eléctrico mensual.");
        return;
    }

    // Convertir el consumo mensual a TWh anuales
    const valorUsuariosTwhAño = (consumoTotalKwhMes / 1000) * 12;

    try {
        // Leer el archivo CSV
        const response = await fetch('/data/05_hydropower-consumption.csv');
        const csvText = await response.text();

        // Procesar el archivo CSV
        const data = csvText.split('\n').map(row => row.split(','));
        const headers = data[0];
        const rows = data.slice(1);

        // Filtrar los datos para "Colombia" en el año 2021
        const entityIndex = headers.indexOf('Entity');
        const yearIndex = headers.indexOf('Year');
        const hidroIndex = headers.indexOf('Electricity from hydro (TWh)');
        
        if (entityIndex === -1 || yearIndex === -1 || hidroIndex === -1) {
            throw new Error("El archivo CSV no tiene las columnas esperadas.");
        }

        const row = rows.find(row => row[entityIndex] === 'Colombia' && row[yearIndex] === '2021');
        if (!row) {
            throw new Error("No se encontraron datos para Colombia en el año 2021.");
        }

        // Obtener el valor de electricidad hidroeléctrica
        const electricityFromHydroTwh = parseFloat(row[hidroIndex]);
        if (isNaN(electricityFromHydroTwh) || electricityFromHydroTwh <= 0) {
            throw new Error("El valor de electricidad hidroeléctrica es inválido.");
        }

        // Calcular el porcentaje de consumo del usuario
        const porcentajeUsuario = (valorUsuariosTwhAño / electricityFromHydroTwh) * 100;

        // Mostrar el resultado al usuario
        const resultado = porcentajeUsuario.toFixed(2); // Redondear a 2 decimales
        document.getElementById('resultados').innerText =
            `Tu consumo anual corresponde al ${resultado}% de la producción hidroeléctrica de Colombia en 2021.`;

    } catch (error) {
        console.error("Error al procesar los datos:", error);
        alert("Hubo un error al calcular el porcentaje. Por favor, verifica los datos e inténtalo nuevamente.");
    }
}
