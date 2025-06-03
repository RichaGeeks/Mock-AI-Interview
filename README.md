<h2>🎤 AI-Powered Mock Interview Simulator</h2>

A cutting-edge platform that simulates real interview scenarios using voice and video interactions. This app helps users prepare for job interviews by providing AI-generated questions, real-time feedback, and detailed score analysis — all powered by advanced speech recognition and AI technologies.

---

✨ Key Features

- 🔒 **Secure Login** – Social and email-based authentication
- 🤖 **AI-Generated Questions** – Personalized by job role, experience, and tech stack
- 🎥 **Real-Time Interview Simulation** – Webcam + microphone support for immersive experience
- 🗣️ **Speech-to-Text Conversion** – Uses browser-native Web Speech API
- 📊 **Live Feedback & Scoring** – Get evaluated after each response
- 🧠 **Interview History Tracking** – Review past interviews and track progress

---

🧠 User Flow

1. **User Inputs Interview Info**  
   → Job Role, Experience, Tech Stack, No. of Questions

2. **AI Generates Questions**  
   → Powered by Gemini API

3. **Select Interviewer**  
   → Choose Male/Female AI interviewer

4. **Interview Begins**  
   → One question per screen with camera & mic support  
   → Start/Stop recording via voice

5. **Speech-to-Text Analysis**  
   → Transcribes and analyzes user answers

6. **Get Scored**  
   → Instant feedback per question

7. **Track Interview History**  
   → Review scores and answers over time

---

Preview

![11](https://github.com/user-attachments/assets/a452bcaf-4ef2-4c53-b367-71d830df12f3)
![12](https://github.com/user-attachments/assets/228da455-4be7-4446-a32e-7c0f4ed836bb)
![13](https://github.com/user-attachments/assets/fb54c6ee-4373-4264-a3c8-f01215fd0dd7)
![14](https://github.com/user-attachments/assets/5ff52aa4-791e-4c90-aabc-f083f5eb4de1)
![15](https://github.com/user-attachments/assets/10c01092-7aa2-4603-b33b-ba7849a2d8bd)
![16](https://github.com/user-attachments/assets/dffc507d-a444-46c2-8e90-5edd9cfd86c6)
![17](https://github.com/user-attachments/assets/904f53f4-6bfd-4b3d-9548-42fe070706bd)
![18](https://github.com/user-attachments/assets/ec9e92ad-b38e-49a5-bf3c-756d90745d28)
![19](https://github.com/user-attachments/assets/e18873c6-2f48-46de-ab6f-c00bc2bf2424)
![20](https://github.com/user-attachments/assets/9b6319db-4f5a-43c5-910a-1298d7830a96)
![21](https://github.com/user-attachments/assets/cc5efa32-08a2-4bd6-986a-2590ec7f849e)
![22](https://github.com/user-attachments/assets/45eedfd3-e226-464c-80e5-eac1d267c83e)

---

🏗️ Tech Stack

### 🎯 Frontend
- **Next.js**
- **React.js**
- **Tailwind CSS**

### 🧠 AI & Voice
- **Gemini API** – AI-based question generation and feedback
- **Web Speech API** – Browser-based speech recognition

### 🌐 Backend & Auth
- **MongoDB (Atlas)** – Interview data and user info
- **Next.js API Routes**
- **NextAuth.js** – Secure authentication with OAuth & Email

---

## 📄 Pages Overview

- **Landing Page** – Introduction & Sign In option
- **Dashboard** – Track interviews and performance
- **Interview Setup Page** – Enter job details
- **Interviewer Selection** – Choose a male/female AI interviewer
- **Interview Page** – One question per screen, live webcam/mic interaction, voice input
- **Score Page** – AI feedback and overall score
- **About Us**, **Contact Us**, **Terms and Services**

---

## 🚀 Getting Started

1. Clone the repository
git clone my repo
cd mock-interview-ai
2. Install dependencies
npm install
3. Add environment variables
Create a .env.local file and configure:

MONGODB_URI=your_mongodb_uri
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GEMINI_API_KEY=your_gemini_api_key
4. Run the app
npm run dev
Visit http://localhost:3000 to get started.

📌 Future Enhancements
🎙️ Improve speech analysis with Whisper.js
🧩 Add customizable interviewer personalities
📥 Download interview reports as PDF
🌍 Support for multiple languages
📅 Schedule live mock interviews with mentors

🙌 Acknowledgements
Gemini API

NextAuth.js

Web Speech API Docs

Ready to face real interviews with confidence? This tool is your ultimate prep buddy. 🎯
