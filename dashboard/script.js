// =====================================================
// HUB OPERATIONS DASHBOARD
// Data Processing & Visualization
// =====================================================

const DATA_URL = "../data/hub_operations.csv";

let shipments = [];

let destinationChart = null;
let errorChart = null;
let processingChart = null;


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

        showErrorMessage();

    }
}


// =====================================================
// 2. CSV PARSER
// =====================================================

function parseCSV(text) {

    const lines = text
        .trim()
        .split(/\r?\n/);

    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0]
        .split(",")
        .map(header => header.trim());

    return lines.slice(1).map(line => {

        const values = line.split(",");

        const row = {};

        headers.forEach((header, index) => {

            row[header] = values[index]
                ? values[index].trim()
                : "";

        });

        row.quantity = Number(row.quantity) || 0;

        return row;

    });
}


// =====================================================
// 3. UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    if (shipments.length === 0) {
        showErrorMessage();
        return;
    }

    const totalShipments = shipments.length;


    const totalQuantity = shipments.reduce(
        (sum, item) => sum + item.quantity,
        0
    );


    const errorShipments = shipments.filter(
        item => item.error_type &&
                item.error_type.toLowerCase() !== "none"
    );


    const errorCount = errorShipments.length;


    const errorRate =
        totalShipments > 0
            ? (errorCount / totalShipments) * 100
            : 0;


    // Update KPI

    document.getElementById("totalShipments").textContent =
        totalShipments.toLocaleString();


    document.getElementById("totalQuantity").textContent =
        totalQuantity.toLocaleString();


    document.getElementById("errorCount").textContent =
        errorCount.toLocaleString();


    document.getElementById("errorRate").textContent =
        errorRate.toFixed(2) + "%";


    // Create charts

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

        const destination =
            item.destination || "Unknown";


        if (!destinationData[destination]) {
            destinationData[destination] = 0;
        }


        destinationData[destination] +=
            item.quantity;

    });


    const labels =
        Object.keys(destinationData);


    const values =
        Object.values(destinationData);


    const canvas =
        document.getElementById("destinationChart");


    if (destinationChart) {
        destinationChart.destroy();
    }


    destinationChart = new Chart(canvas, {

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

            },

            scales: {

                y: {
                    beginAtZero: true
                }

            }

        }

    });

}


// =====================================================
// 5. ERROR CHART
// =====================================================

function createErrorChart() {

    const errorData = {};


    shipments
        .filter(item =>
            item.error_type &&
            item.error_type.toLowerCase() !== "none"
        )
        .forEach(item => {

            const error =
                item.error_type;


            if (!errorData[error]) {
                errorData[error] = 0;
            }


            errorData[error]++;

        });


    const labels =
        Object.keys(errorData);


    const values =
        Object.values(errorData);


    const canvas =
        document.getElementById("errorChart");


    if (errorChart) {
        errorChart.destroy();
    }


    errorChart = new Chart(canvas, {

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

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}


// =====================================================
// 6. TIME CONVERSION
// =====================================================

function timeToMinutes(time) {

    if (!time) {
        return 0;
    }


    const parts =
        time.split(":");


    const hours =
        Number(parts[0]) || 0;


    const minutes =
        Number(parts[1]) || 0;


    return hours * 60 + minutes;
}


// =====================================================
// 7. PROCESSING TIME CHART
// =====================================================

function createProcessingChart() {

    const labels = [];

    const processingTimes = [];


    shipments.forEach(item => {

        const inbound =
            timeToMinutes(item.inbound_time);


        const outbound =
            timeToMinutes(item.outbound_time);


        let processing =
            outbound - inbound;


        // Handle overnight operation

        if (processing < 0) {
            processing += 24 * 60;
        }


        labels.push(item.shipment_id);

        processingTimes.push(processing);

    });


    const canvas =
        document.getElementById("processingChart");


    if (processingChart) {
        processingChart.destroy();
    }


    processingChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [
                {
                    label: "Processing Time (minutes)",

                    data: processingTimes,

                    tension: 0.3,

                    fill: false
                }
            ]

        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Minutes"
                    }

                }

            }

        }

    });

}


// =====================================================
// 8. SHIPMENT TABLE
// =====================================================

function createShipmentTable() {

    const table =
        document.getElementById("shipmentTable");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    shipments.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${item.shipment_id || "-"}
            </td>

            <td>
                ${item.destination || "-"}
            </td>

            <td>
                ${Number(item.quantity || 0).toLocaleString()}
            </td>

            <td>
                ${item.status || "-"}
            </td>

            <td>
                ${item.error_type || "None"}
            </td>

        `;


        table.appendChild(row);

    });

}


// =====================================================
// 9. ERROR MESSAGE
// =====================================================

function showErrorMessage() {

    const container =
        document.querySelector(".container");


    if (!container) {
        return;
    }


    const message =
        document.createElement("div");


    message.style.background = "#fee2e2";
    message.style.color = "#991b1b";
    message.style.padding = "15px";
    message.style.borderRadius = "10px";
    message.style.marginBottom = "20px";


    message.textContent =
        "Unable to load warehouse data. Please check the CSV file path.";


    container.prepend(message);

}


// =====================================================
// 10. START DASHBOARD
// =====================================================

loadData();
