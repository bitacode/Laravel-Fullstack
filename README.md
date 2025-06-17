# Laravel Fullstack SaaS

This project demonstrates how a **Fullstack Laravel SaaS application** works, with a modern tech stack and decoupled frontend/backend architecture.

## 🚀 Overview

This is a showcase SaaS application built with:

- 🧠 **Laravel** for the backend API and core application logic  
- 🐘 **PhpMyAdmin** to manage the MySQL database  
- 🛠️ **Filament** as the internal admin panel/dashboard  
- ⚛️ **React + Vite** for the frontend interface  
- 💨 **Tailwind CSS** for utility-first styling  
- 📡 **Axios** for HTTP communication between React and Laravel APIs  
- ✅ **Zod** for schema-based form validation on the frontend

## 🌐 Architecture

- Backend API is served by **Laravel**, exposing routes via `routes/api.php`
- Frontend is **decoupled**, lives in a separate React/Vite app, and consumes API routes via Axios
- **Filament** handles admin tasks like resource management, CRUD operations, and user roles
- All forms on the frontend are **validated using Zod** before submission to the API
- **Pagination and lazy loading** are implemented for optimized UX

## ⚠️ Important Note
> This modification is intentional and **only this file is included** from the vendor directory. Everything else is excluded. ✨  

This project includes a **custom-edited file inside the `vendor/` directory**, which is normally ignored in Laravel projects. Specifically `vendor/filament/filament/src/Http/Middleware/EnsureHasApiKey.php`

This file contains **custom logic not present in the original Filament package**, and it is essential to the project’s behavior. Running `composer install` will overwrite the entire `vendor/` folder and replace this custom file with the default version from Filament.
To avoid losing this change:
- Review or back up the file before running Composer
- Or manually copy it back in after install

## ▶️ End Result
[![Watch the video](https://github.com/bitacode/images/blob/main/thumbnail-3.png)](https://youtu.be/_oKvcfmmaUA)

## 📌 Demo
[![Watch the video](https://github.com/bitacode/images/blob/main/thumbnail-4.png)](https://youtu.be/SsZ-sReW9SI)
