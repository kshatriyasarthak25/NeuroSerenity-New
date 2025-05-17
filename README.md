# NeuroSerenity

**NeuroSerenity** is an initial-phase Brain-Computer Interface (BCI) model designed to process and interpret EEG data.  
The project aims to bridge the gap between neural signals and actionable insights, leveraging modern web technologies and machine learning.

## 🧠 Project Overview

This repository serves as the foundation for developing a BCI system that can analyze EEG signals and translate them into meaningful outputs.  
The integration of machine learning models with a user-friendly interface facilitates real-time interaction and data visualization.

## 🚀 Features

- **EEG Data Processing**: Utilizes pre-trained models (`eeg_model.h5`, `eeg_multiclass_model.h5`) for interpreting EEG signals.
- **Web Interface**: Built with Next.js and Tailwind CSS for a responsive and modern UI.
- **Data Visualization**: Interactive components to display EEG data trends and patterns.
- **Modular Architecture**: Organized codebase with clear separation of concerns for scalability.

### 📁 Project Structure

- **NeuroSerenity-New/**
  - `app/` — Main application components  
  - `components/` — Reusable UI components  
  - `hooks/` — Custom React hooks  
  - `lib/` — Utility libraries and functions  
  - `public/` — Static assets  
  - `styles/` — Global and component-specific styles  
  - `EEG.csv` — Sample EEG dataset  
  - `app.js` — Entry point for the frontend application  
  - `app.py` — Backend server or API endpoints  
  - `train_model.py` — Script for training EEG models  
  - `eeg_model.h5` — Pre-trained EEG model  
  - `eeg_multiclass_model.h5` — Pre-trained multiclass EEG model  
  - `index.html` — HTML template  
  - `package.json` — Project metadata and dependencies  
  - `tailwind.config.ts` — Tailwind CSS configuration  
  - `tsconfig.json` — TypeScript configuration  
  - `...` — Additional configuration and lock files

## 🧪 Usage

- Place your EEG data in the `EEG.csv` file following the required format.
- Use `train_model.py` to train your models or utilize the pre-trained `.h5` models provided.
- Launch the application to interact with the BCI interface and visualize EEG data.

## 🤝 Contributing

Contributions are welcome!  
Please fork the repository and submit a pull request for any enhancements or bug fixes.
