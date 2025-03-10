# 📧 Mailing Dashboard with Authentication

This project is a **Mailing Dashboard Application** built using **Next.js**, **Shadcn UI**, and **Tailwind CSS**.  
It includes **JWT-based authentication**, state management, and a fully functional mail UI.  

---

## 🚀 Features Implemented

### 🔐 Authentication System
- **State Management**:  
  - Used **Zustand** for authentication state management with persistence  
  - Implemented **login, register, and logout** functionality  
  - Added **mock user data** for demonstration  

- **Authentication Pages**:  
  - Login page with **email/password form and validation**  
  - Registration page with **name, email, and password fields**  
  - Protected routes that **redirect to login if not authenticated**  

---

## 📩 Mail Dashboard
### 🏡 Layout Components
- **Responsive design** with **sidebar, mail list, and mail display**  
- **Mobile-friendly layout** with a **slide-out sidebar on small screens**  
- **Header** with **search, settings, and user profile**  

### 📜 Mail Components
- **Sidebar**: Displays folders (**Inbox, Sent, Drafts, etc.**)  
- **Mail List**: Shows emails with **sender, subject, preview, and date**  
- **Mail Display**: Full email content with **reply, delete, and move options**  

### 📩 Mail State Management
- **Used Zustand** for managing mail states  
- **Implemented actions** for:
  - Selecting emails
  - Reading emails
  - Deleting/moving emails  
- **Mock email data** for demonstration  

---

## 🎯 Key Features
✅ **Responsive Design**: Works on **mobile, tablet, and desktop**  
✅ **Form Validation**: Using **react-hook-form** and **zod**  
✅ **Toast Notifications**: User feedback for actions  
✅ **Dark/Light Mode**: Theme support via **next-themes**  
✅ **Mock Data**: Simulated backend responses  

---

## 💻 How to Use
1️⃣ **Login**:  
   - Use the demo credentials (`john@example.com / password123`)  
   - OR register a new account  

2️⃣ **Navigate**:  
   - Use the sidebar to switch between mail folders  

3️⃣ **Read Mail**:  
   - Click an email in the list to view its content  

4️⃣ **Actions**:  
   - Archive, delete, or reply to emails  

---

## 🛠️ Tech Stack
- **Frontend**: Next.js, Shadcn UI, Tailwind CSS  
- **State Management**: Zustand  
- **Form Handling**: react-hook-form, zod  
- **Authentication**: JWT-based authentication  
- **Notifications**: react-toastify  

---

## 🏃‍♂️ Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/shanuziyaparveen/mailing-dashboard.git
cd mailing-dashboard   
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```
The application will be available at **http://localhost:3000**.  

---

### 🌟 Thank you for checking out this project! 🚀

