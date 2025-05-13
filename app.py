from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import tensorflow as tf
import numpy as np
from scipy.signal import welch
import random

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load EEG data and model
eeg_data = pd.read_csv("EEG.csv")
model = tf.keras.models.load_model('eeg_multiclass_model.h5')

# Extract features for real-time classification
def extract_realtime_features(window):
    mean_amplitude = window['Amplitude'].mean()
    std_amplitude = window['Amplitude'].std()
    freqs, power = welch(window['Amplitude'], fs=128)
    dominant_freq = freqs[np.argmax(power)]
    return np.array([[mean_amplitude, std_amplitude, dominant_freq]])

# Simulate real-time EEG data and classify
@app.route('/simulate_eeg', methods=['GET'])
def simulate_eeg():
    try:
        time_step = random.randint(0, len(eeg_data) - 256)
        window = eeg_data.iloc[time_step: time_step + 256]

        if len(window) == 256:
            features = extract_realtime_features(window)
            amplitude = features[0][0]  # Mean amplitude

            # Classify based on amplitude
            if amplitude > 60:
                feedback = "Seizure detected(When a immedidate spike is there more than 60 amplitude)"
            elif amplitude > 40:
                feedback = "Patient is engaged(Aplha wave dominant)"
            else:
                feedback = "Patient is relaxed(Theta wave dominant)"

            return jsonify({
                "amplitude": round(amplitude, 2),
                "feedback": feedback
            })
    except Exception as e:
        print(f"Error in simulate_eeg: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)