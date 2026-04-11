# 📈 MarketView  
*SYST30025 – Software Engineering Project*

A full-stack stock analysis platform that combines real-time financial news with machine learning–powered sentiment analysis.

---

## 🚀 Tech Stack

- **Frontend:** Vite + React  
- **Backend:** Node.js + Express  
- **Machine Learning:** Python (FastAPI + Uvicorn)  
- **API:** Finnhub (stock news data)

---

## ✅ Prerequisites

Make sure you have installed:

- **Node.js** v18+  
- **Python** 3.9+  
- **npm** (comes with Node)  
- A terminal / command prompt  

---

## 🧩 Project Structure
marketview/


├── backend/ # Express API (news + analysis routes)


├── frontend/ # React frontend (Vite)


├── machine-learning/ # Python ML service (FastAPI)

---

## ⚙️ Setup Instructions


```bash
cd backend
npm install

cd frontend
npm install

cd machine-learning
pip install -r requirements.txt

Frontend (frontend/.env)
VITE_API_URL=http://localhost:3000

🔑 Environment Variables
📌 Backend (backend/.env)
PYTHON_API=http://localhost:8000

cd machine-learning
uvicorn main:app --reload
Start Frontend Server
cd backend
 npm run dev

Start Backend Server
cd backend
 npm run dev
