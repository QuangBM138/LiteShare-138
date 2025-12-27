⚡ LiteShare - Secure Serverless Data Sharing System

LiteShare (formerly QuickShare) is a simple, fast, and secure web application for sharing text, source code, and notes. The project operates on a Serverless model, utilizing Google Sheets as the database and Google Apps Script as the Backend API, ensuring cost-efficiency and easy deployment.

🚀 Key Features

📝 Versatile Sharing: Supports plain Text and Source Code with Monospace font.

🔒 High Security:

Login via Email with OTP (One-Time Password).

Data is encoded (Base64) before storage.

Only the owner can edit the content they shared.

⏳ Auto-Expiration: Expiration options ranging from 10 minutes to Forever.

🌍 Multi-language: Built-in support for English (EN) and Vietnamese (VN).

📱 Modern Interface: Fully responsive for both Mobile and Desktop, includes Dark Mode.

QR Code: Automatically generates QR codes for quick sharing on mobile devices.

🛠️ Tech Stack

Frontend: HTML5, CSS3, JavaScript (Vanilla - No heavy frameworks).

Backend: Google Apps Script (GAS).

Database: Google Sheets.

Hosting: GitHub Pages.

CI/CD: GitHub Actions (For securing the API URL).

⚙️ Deployment Guide

Part 1: Backend Configuration (Google Apps Script)

Create a new Google Sheet.

Go to Extensions > Apps Script.

Copy the entire content of Code.gs into the editor.

Run the setupSheet() function once to initialize the Sheets (Database, Auth).

Click Deploy > New deployment.

Type: Web App.

Execute as: Me.

Who has access: Anyone.

Copy the Web App URL (ending with /exec). Note: Keep this URL secret.

Part 2: Frontend Configuration (GitHub)

Create a new Repository on GitHub (Private is recommended to better hide source code).

Upload the index.html file to the root directory.

Important: In index.html, ensure the line const API_URL = "PLACEHOLDER_API_URL"; remains unchanged (do not paste the real link here).

Create a Workflow file for automatic deployment:

Path: .github/workflows/deploy.yml

Content: Copy from the deploy.yml file provided in the project.

Part 3: Securing API Key & Deploying

To prevent exposing the Google Script API URL, we use GitHub Secrets:

Go to the Settings tab of your GitHub Repository.

Select Secrets and variables > Actions.

Click New repository secret.

Name: APPS_SCRIPT_URL

Value: Paste the Web App URL you copied in Part 1.

Click Add secret.

Once configured, every time you push code to the main branch, GitHub Actions will:

Automatically replace PLACEHOLDER_API_URL with your actual secure link.

Deploy the website to GitHub Pages.

📖 Usage Guide

Login (Optional): Enter your email to receive an OTP. Logging in allows you to manage your sharing history and edit links later.

Create Share:

Select content type (Text/Code).

Select expiration time.

Enter content and click Save & Create Link.

Share: Copy the link or scan the QR code to send to friends.

Edit: Access the old link (while logged in with the creator's account), and the Edit button will appear.

🛡️ Security Mechanisms

Rate Limiting: Backend automatically blocks spam if a user sends too many requests in a short time.

Validation: Checks content length to prevent Google Sheets memory overflow.

No Hardcode Secrets: The API URL is never stored directly in the source code on GitHub.

🤝 Contribution

All contributions are welcome! Please create a Pull Request or open an Issue if you find any bugs.

Project built for educational and personal sharing purposes.