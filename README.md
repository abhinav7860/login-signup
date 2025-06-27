🔐 Modern Login & Signup App — React + Firebase + Aurora UI

A beautifully designed and responsive authentication system using **React**, **Vite**, **Tailwind CSS**, and **Firebase**, featuring:

- 🌈 Animated Aurora Background (WebGL)
- 🧊 Glassmorphism UI
- 🔐 Firebase Auth & Firestore Integration
- 🚀 Vercel-ready Deployment

## 🛠 Tech Stack

- ⚛️ React + Vite
- 🎨 Tailwind CSS
- 🔥 Firebase Authentication + Firestore
- 🧪 React Context API
- 🧊 Glassmorphism Design
- 🌌 Animated Aurora Background (OGL + GLSL)
- 🍞 react-hot-toast for notifications


## ⚙️ Setup Instructions

1. Clone the repository
git clone https://github.com/abhinav7860/login-signup.git
cd login-signup

2. Install dependencies
npm install

4. Configure Firebase
Create a Firebase project at https://firebase.google.com, enable Email/Password Auth and Firestore.

Create a .env file in the root directory:


VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

5. Start the dev server
6. 
npm run dev
Open in browser: http://localhost:5173

🧠 Features

🔐 Secure login/signup via Firebase
👤 Protected routes with React Router
🌈 Auto-changing Aurora background every 10s
🔔 Beautiful error/success toast messages
📱 Fully responsive design

📁 Folder Structure

src/
│

├── components/       # InputField, SubmitButton, etc.

├── contexts/         # AuthContext

├── pages/            # LoginPage, SignupPage, SuccessPage

├── aurora/           # Aurora.js + GLSL shaders

├── firebase.js       # Firebase initialization

└── App.jsx           # Main App & Routes

🚀 Deploy to Vercel

Push your code to GitHub.
Go to vercel.com/import.
Select the repo → Deploy.
Add Firebase env variables in Vercel > Settings > Environment Variables

## 📸 UI Preview
![image](https://github.com/user-attachments/assets/51c2a258-ba20-4ca3-b67a-bcd6f33301eb)
![image](https://github.com/user-attachments/assets/0c9adc37-e77c-4e5a-b10b-ddbe4dd55cc4)
![image](https://github.com/user-attachments/assets/f0647222-0b6c-4bf4-b046-d2072de0882e)
![image](https://github.com/user-attachments/assets/ef5a3bba-5f9d-43df-b9b6-d8fcfff053ae)
 Images uploaded inside a `/screenshots/` folder in the repo.
 
🙌 Credits

Aurora shader animation inspired by @gannonman's GLSL work
WebGL rendering powered by OGL
UI inspired by modern Auth UX patterns

📄 License
This project is licensed under the MIT License.

✨ Author
Built by Abhinav Sabu
