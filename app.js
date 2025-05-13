// Setting up the Chart.js graph
const ctx = document.getElementById('eegChart').getContext('2d');
const feedbackElement = document.getElementById('feedback');
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('eegChart').getContext('2d');
    const feedbackElement = document.getElementById('feedback');
    let time = 0;

    // Initialize Chart.js
    const eegChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Amplitude',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                fill: false
            }]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Time (seconds)' } },
                y: { title: { display: true, text: 'Amplitude' } }
            }
        }
    });

    // Fetch EEG data
    function fetchEEGData() {
        fetch('http://127.0.0.1:5000/simulate_eeg')
            .then(response => response.json())
            .then(data => {
                time += 1;
                eegChart.data.labels.push(time);
                eegChart.data.datasets[0].data.push(data.amplitude);
                eegChart.update();

                feedbackElement.innerText = `Feedback: ${data.feedback}`;
                if (data.feedback === "Seizure") {
                    feedbackElement.style.color = "red"; // Alert for seizures
                } else {
                    feedbackElement.style.color = "black";
                }
            })
            .catch(error => {
                console.error('Error fetching EEG data:', error);
                feedbackElement.innerText = "Error fetching data.";
            });
    }

    setInterval(fetchEEGData, 1000); // Fetch data every second
});
// Real-time simulation state
let time = 0;
let isSimulating = false;

// Start/Stop the simulation
function startSimulation() {
    isSimulating = !isSimulating;
    if (isSimulating) {
        feedbackElement.innerHTML = "Simulation Started...";
        simulateEEG();
    } else {
        feedbackElement.innerHTML = "Simulation Stopped.";
    }
}
// Simulate EEG data and update the chart
// Update this in your app.js
function simulateEEG() {
    fetch('http://localhost:5000/simulate_eeg')  // Flask route
        .then(response => response.json())     // Convert the response to JSON
        .then(data => {
            console.log(data);  // Check the response in the console
            time += 1;
            eegChart.data.labels.push(time);
            eegChart.data.datasets[0].data.push(data.amplitude);
            eegChart.update();
            feedbackElement.innerHTML = data.feedback;
            setTimeout(simulateEEG, 1000);
        })
        .catch(error => {
            console.error("Error fetching EEG data:", error);
            feedbackElement.innerHTML = "Error fetching data from backend.";
        });
}