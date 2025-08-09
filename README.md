# 📎 MERN URL Shortener – Backend

This is the **backend API** for a MERN stack URL shortener application.  
It is built using **Node.js, Express, and MongoDB** and provides endpoints to shorten URLs, redirect users, and manage URLs (admin only).

---

## 🚀 Features

- **POST /api/shorten** – Accepts a long URL and returns a shortened code.
- **GET /:shortcode** – Redirects to the original URL.
- **Admin-only** routes:
  - View all shortened URLs.
  - Delete URLs.
  - Track clicks and last visited timestamp.
- Built with **Express** and **Mongoose**.
- Environment variables for configuration.

---

## 🛠 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **Shortid/Nanoid** – For generating short codes
- **Dotenv** – Environment configuration

---

## 📂 Project Structure
backend/
│
├── models/ # Mongoose models
├── server.js # Main entry point & Express route handlers
└── package.json

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/urlshortener
BASE_URL=http://localhost:5000
ADMIN_PASSWORD=your-admin-password
```
📦 Installation & Setup
Clone the repository:

```
git clone https://github.com/rockyhans/URL-Shortener-Backend.git
cd backend
```
Install dependencies:

```
npm install
```

Start the server (development mode):

```
node index.js
```

🔗 API Endpoints

1️⃣ Shorten a URL
POST /api/shorten

Request Body:

```json
{
  "longUrl": "https://example.com/some/long/url"
}
```
Response:

```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:5000/abc123",
  "longUrl": "https://example.com/some/long/url"
}
```
2️⃣ Redirect to Original URL
GET /:shortcode

Redirects the user to the original long URL.

3️⃣ Admin – View All URLs
GET /api/admin/urls

4️⃣ Admin – Delete a URL
DELETE /api/admin/urls/:shortcode

👤 Contributors
<table> <tr> <td align="center"> <img src="https://avatars.githubusercontent.com/u/164065390?v=4" width="80px;" alt="Danish Rizwan"/> <br /><sub><b>Danish Rizwan</b></sub><br /> <sub>Full-Stack Developer</sub> </td> </tr> </table>
📬 Contact
<br>
📧 Email: rdanishrizwan@example.com
<br>
