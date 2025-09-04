# GMC – Equipment Borrowing Management (Frontend)

This project is a **React application** built with **Vite** for managing equipment borrowing in a G’mach (free-loan community).  
It was developed as part of a college assignment, focusing on the **client-side implementation**.  
The server was provided only for demonstration purposes and does not persist data (all data is lost once the server restarts).

---

## Features
- **Authentication**: 
  - Login and registration pages
  - Role-based access: when logging in, the system checks if the user is an **Admin** or a **regular User**
- **Equipment Management**:
  - View available equipment
  - Borrow items via a dialog form
- **Admin Panel** (Admins only):
  - Add new equipment
  - Edit existing equipment
  - Manage borrow requests (approve/reject)
- **State Management**: Redux is used to handle user state and actions
- **React Hooks**: Uses `useState`, `useEffect`, etc. for state and lifecycle handling

---

## Tech Stack
- **Frontend**: React + Vite
- **State Management**: Redux Toolkit
- **Styling**: CSS
- **Server (temporary)**: Node.js/Express (non-persistent, for demonstration only)

---

## Getting Started

### Prerequisites
- Node.js (>= 16)
- npm (>= 8)

### Installation
```bash
git clone https://github.com/Noa-gv/GMC.git
cd GMC
npm install

###Running Locally
npm run dev
