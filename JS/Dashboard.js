document.addEventListener('DOMContentLoaded', () => {
    const chartData = {
        bar: {
            elementId: 'bar-chart',
            title: 'Producción de Energía Renovable por Fuente (Colombia, 2000-2021)',
            csvFiles: [
                '02-modern-renewable-energy-consumptio.csv',
                '12 solar-energy-consumption.csv',
                '05_hydropower-consumption.csv',
                '16 biofuel-production.csv',
            ]
        },
        pie: {
            elementId: 'pie-chart',
            title: 'Participación de Energías Renovables (Colombia, 2000-2021)',
            csvFiles: [
                '04 share-electricity-renewables.csv',
                '11 share-electricity-wind.csv',
                '15 share-electricity-solar.csv',
                '07 share-electricity-hydro.csv'
            ]
        },
        area: {
            elementId: 'area-chart',
            title: 'Comparación entre Consumo de Energía Renovable y Convencional (Global, 2000-2021)',
            csvFiles: [
                '02-modern-renewable-energy-consumption.csv',
                '03_modern-renewable-prod.csv'
            ]
        },
        line: { // Coma corregida aquí
            elementId: 'line-chart',
            title: 'Capacidad Instalada de Fuentes Renovables (Global)',
            csvFiles: [
                '09-cumulative-installed-wind-energy-capacity-gigawatts.csv',
                '13-installed-solar-PV-capacity.csv',
                '17-installed-geothermal-capacity.csv'
            ]
        }
    };

    async function fetchCSV(filePath) {
        try {
            const response = await fetch(`/data/${filePath}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`Error al cargar el archivo ${filePath}:`, error);
            return null;
        }
    }

    function parseCSV(csvText, filterByCountry = false, startYear = 2000, endYear = 2021) {
        const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        const labels = rows[0];
        let dataRows = rows.slice(1);

        if (filterByCountry) {
            dataRows = dataRows.filter(row => row.includes('Colombia') && row.some(cell => {
                const year = parseInt(cell);
                return year >= startYear && year <= endYear;
            }));
        } else {
            dataRows = dataRows.filter(row => {
                const year = parseInt(row.find(cell => !isNaN(parseInt(cell))));
                return year >= startYear && year <= endYear;
            });
        }

        if (dataRows.length === 0) {
            dataRows = [[labels[0], 'N/A', 'N/A', 0]];
        }

        const data = dataRows.map(row => row.map((value, index) => (index > 1 ? parseFloat(value) || 0 : value)));
        return { labels, data };
    }

    async function createChart(config, type) {
        const filterByCountry = type !== 'line'; // Filtrar solo por Colombia excepto para gráficos lineales
        const datasets = await Promise.all(config.csvFiles.map(fetchCSV));
        const parsedDatasets = datasets
            .filter(csv => csv)
            .map(csv => parseCSV(csv, filterByCountry, 2000, 2021));

        const labels = parsedDatasets[0]?.labels.slice(2) || [];
        const data = parsedDatasets.map(({ data }) => data.map(row => row.slice(2)).flat());

        const ctx = document.getElementById(config.elementId)?.getContext('2d');
        if (!ctx) {
            console.error(`No se encontró el elemento con ID: ${config.elementId}`);
            return;
        }

        const colors = [
            'rgba(0, 123, 255, 0.6)', // Azul
            'rgba(40, 167, 69, 0.6)', // Verde
            'rgba(255, 193, 7, 0.6)', // Amarillo
            'rgba(255, 87, 34, 0.6)', // Naranja
            'rgba(156, 39, 176, 0.6)', // Púrpura
            'rgba(233, 30, 99, 0.6)', // Rosa
            'rgba(0, 188, 212, 0.6)'  // Cian
        ];

        new Chart(ctx, {
            type: type === 'area' ? 'line' : type,
            data: {
                labels,
                datasets: data.map((values, index) => ({
                    label: config.csvFiles[index].replace('.csv', ''), // Nombre basado en el archivo CSV
                    data: values, // Datos del dataset
                    backgroundColor: colors[index % colors.length], // Colores distintos
                    borderColor: colors[index % colors.length].replace('0.6', '1'), // Bordes con opacidad 1
                    borderWidth: 2,
                    fill: type === 'line' && config.elementId === 'area-chart' // Relleno solo para el gráfico de área
                }))
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: config.title
                    }
                },
                responsive: true,
                scales: type !== 'pie' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {}
            }
        });
    }

    Object.entries(chartData).forEach(([type, config]) => {
        createChart(config, type === 'area' ? 'line' : type);
    });
});
