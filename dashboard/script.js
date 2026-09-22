// =====================================================
// Hub Operations Dashboard
// JavaScript Data Processing & Visualization
// =====================================================

const DATA_URL = "../data/hub_operations.csv";

let shipments = [];


// =====================================================
// 1. LOAD CSV DATA
// =====================================================

async function loadData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("Cannot load CSV file");
        }

        const csvText = await response.text();

        shipments = parseCSV(csvText);

        updateDashboard();

    } catch (error) {
        console.error("Error loading data:", error);
    }
}


// =====================================================
// 2. CSV PARSER
// =====================================================

function parseCSV(text) {

    const lines = text.trim().split("\n");

    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {

        const values = line.split(",");

        const row = {};

        headers.forEach((header, index) => {
            row[header.trim()] = values[index]
                ? values[index].trim()
                : "";
        });

        row.quantity = Number(row.quantity);

        return row;
    });
}


// =====================================================
// 3. UPDATE KPI
// =====================================================

function updateDashboard() {

    const totalShipments = shipments.length;

    const totalQuantity = shipments.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const errorShipments = shipments.filter(
        item => item.error_type !== "None"
    );

    const errorCount = errorShipments.length;

    const errorRate =
        totalShipments > 0
            ? (errorCount / totalShipments) * 100
            : 0;


    document.getElementById("totalShipments").textContent =
        totalShipments;

    document.getElementById("totalQuantity").textContent =
        totalQuantity.toLocaleString();

    document.getElementById("errorCount").textContent =
        errorCount;

    document.getElementById("errorRate").textContent =
        errorRate.toFixed(2) + "%";


    createDestinationChart();

    createErrorChart();

    createProcessingChart();

    createShipmentTable();
}


// =====================================================
// 4. DESTINATION CHART
// =====================================================

function createDestinationChart() {

    const destinationData = {};

    shipments.forEach(item => {

        if (!destinationData[item.destination]) {
            destinationData[item.destination] = 0;
        }

        destinationData[item.destination] += item.quantity;

    });


    const labels = Object.keys(destinationData);

    const values = Object.values(destinationData);


    new Chart(
        document.getElementById("destinationChart"),
        {
            type: "bar",

            data: {
                labels: labels,

                datasets: [
                    {
                        label: "Quantity",
                        data: values
                    }
                ]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }
    );
}


// =====================================================
// 5. ERROR CHART
// =====================================================

function createErrorChart() {

    const errorData = {};

    shipments
        .filter(item => item.error_type !== "None")
        .forEach(item => {

            if (!errorData[item.error_type]) {
                errorData[item.error_type] = 0;
            }

            errorData[item.error_type]++;

        });


    const labels = Object.keys(errorData);

    const values = Object.values(errorData);


    new Chart(
        document.getElementById("errorChart"),
        {
            type: "doughnut",

            data: {
                labels: labels,

                datasets: [
                    {
                        data: values
                    }
                ]
            },

            options: {
                responsive: true
            }
        }
    );
}


// =====================================================
// 6. PROCESSING TIME
// =====================================================

function timeToMinutes(time) {

    const parts = time.split(":");

    const hours = Number(parts[0]);

    const minutes = Number(parts[1]);

    return hours * 60 + minutes;
}


function createProcessingChart() {

    const labels = [];

    const processingTimes = [];


    shipments.forEach(item => {

        const inbound =
            timeToMinutes(item.inbound_time);

        const outbound =
            timeToMinutes(item.outbound_time);

        const processing =
            outbound - inbound;


        labels.push(item.shipment_id);

        processingTimes.push(processing);

    });


    new Chart(
        document.getElementById("processingChart"),
        {
            type: "line",

            data: {
                labels: labels,

                datasets: [
                    {
                        label: "Processing Time (minutes)",
                        data: processingTimes,
                        tension: 0.3
                    }
                ]
            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
}


// =====================================================
// 7. SHIPMENT TABLE
// =====================================================

function createShipmentTable() {

    const table =
        document.getElementById("shipmentTable");


    table.innerHTML = "";


    shipments.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${item.shipment_id}</td>
            <td>${item.destination}</td>
            <td>${item.quantity}</td>
            <td>${item.status}</td>
            <td>${item.error_type}</td>
        `;


        table.appendChild(row);

    });
}


// =====================================================
// 8. START DASHBOARD
// =====================================================

loadData();
