# UIDAI Data Hackathon 2026

This repository contains a complete data-driven web application built for the UIDAI Data Hackathon 2026, organised by the Unique Identification Authority of India (UIDAI) in association with the National Informatics Centre (NIC) and the Ministry of Electronics and Information Technology (MeitY). The project focuses on analysing anonymised Aadhaar enrolment and update datasets to identify meaningful patterns, trends, anomalies, and predictive indicators, and to present those insights through a clean and interactive web interface that can support informed decision-making and system improvements.

The core objective of this project is to transform large-scale Aadhaar operational data into actionable intelligence. By visualising enrolment and update behaviour across time and regions, the application helps highlight bottlenecks, irregularities, and opportunities for optimisation in Aadhaar service delivery.

The application features an interactive dashboard with dynamic charts and graphs, trend analysis across different parameters, anomaly indicators to flag unusual patterns, and a fast, responsive user interface optimised for clarity and usability. The project is designed with simplicity and transparency in mind, prioritising insight over unnecessary complexity.

The technology stack used in this project includes React with TypeScript for the frontend, Vite as the build tool, Node.js for local development, and charting libraries such as Chart.js or Recharts for data visualisation. The project also integrates Google Gemini API for intelligent data summarisation or insight generation, with all sensitive configuration handled securely through environment variables.

To run this project locally, ensure that Node.js is installed on your system. Clone the repository from GitHub, navigate into the project directory, install the dependencies using npm, and create a `.env.local` file in the root directory containing your Gemini API key in the format `GEMINI_API_KEY=your_api_key_here`. Once configured, start the development server using `npm run dev` and access the application in your browser at `http://localhost:5173`.

The project structure follows standard modern React practices, with source code organised into reusable components, service utilities, and application pages. All datasets used in this project are anonymised and provided officially by UIDAI through the Data.gov.in platform, ensuring that no personal or identifiable information is accessed or processed at any stage.

This project is developed by student participants as part of the UIDAI Data Hackathon 2026, with teams consisting of up to five members as per hackathon guidelines. The work presented here is intended solely for academic, research, and innovation purposes within the scope of the hackathon.

Contributions to this repository are welcome. Interested contributors may fork the repository, create feature branches, and submit pull requests for review. The project is released under the MIT License.

Acknowledgements are due to UIDAI for providing access to anonymised Aadhaar datasets, to NIC and MeitY for organising and supporting the hackathon, and to the Open Government Data Platform (data.gov.in) for enabling transparent access to public data.

Built with a focus on data, governance, and real-world impact.
