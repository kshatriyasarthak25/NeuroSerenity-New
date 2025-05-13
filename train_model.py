import pandas as pd
import tensorflow as tf
import numpy as np
from sklearn.model_selection import train_test_split
from scipy.signal import welch

# Load EEG data from CSV
def load_eeg_data(file_name="EEG.csv"):
    return pd.read_csv(file_name)

# Extract features from the EEG data
def extract_features(df, window_size=256):
    features = []
    labels = []

    for i in range(0, len(df), window_size):
        window = df.iloc[i:i + window_size]
        if len(window) == window_size:
            mean_amplitude = window['Amplitude'].mean()
            std_amplitude = window['Amplitude'].std()
            freqs, power = welch(window['Amplitude'], fs=128)  # Frequency analysis
            dominant_freq = freqs[np.argmax(power)]  # Dominant frequency
            
            label = window['Label'].mode()[0]  # 'Relaxed', 'Engaged', or 'Seizure'
            features.append([mean_amplitude, std_amplitude, dominant_freq])
            labels.append(label)

    feature_df = pd.DataFrame(features, columns=['Mean_Amplitude', 'Std_Amplitude', 'Dominant_Freq'])
    return feature_df, labels

# Train a TensorFlow model for multi-class classification
def train_tensorflow_model(df):
    X, y = extract_features(df)
    
    # Dynamically generate label mapping based on unique labels in the dataset
    unique_labels = set(y)
    label_mapping = {label: i for i, label in enumerate(unique_labels)}
    print(f"Label Mapping: {label_mapping}")  # Debugging: Check the mapping
    
    y_mapped = [label_mapping[label] for label in y]  # Map labels to integers

    # Convert to numpy arrays
    X = np.array(X)
    y = np.array(y_mapped)

    # Normalize features
    X = (X - X.mean(axis=0)) / X.std(axis=0)

    # Define TensorFlow model
    model = tf.keras.models.Sequential([
        tf.keras.layers.Dense(64, input_dim=3, activation='relu'),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(len(unique_labels), activation='softmax')  # Multi-class output
    ])

    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    model.fit(X, y, epochs=10, batch_size=32, validation_split=0.2)

    # Save the model
    model.save('eeg_multiclass_model.h5')
    print("Model saved as eeg_multiclass_model.h5")

# Load EEG data and train the model
eeg_data = load_eeg_data("EEG.csv")
train_tensorflow_model(eeg_data)