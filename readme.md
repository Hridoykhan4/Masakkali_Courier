<div align="center">
<img src="public/preview.png" alt="Masakkali Preview" width="100%" />
<br/>
<br/>
<img src="https://readme-typing-svg.demolab.com?font=Urbanist&weight=900&size=40&pause=1200&color=10B981&center=true&vCenter=true&width=700&lines=MASAKKALI;Full-Stack+Logistics+Platform;Customer+%7C+Rider+%7C+Admin+Portals;16+Parallel+Queries.+Zero+Lag." alt="Masakkali Typing SVG" />
<br/>
<p>
  <strong>A production-ready logistics ecosystem featuring multi-role workflows, real-time Stripe integration, 
  and a high-performance MongoDB aggregation engine—optimized for the 64 districts of Bangladesh.</strong>
</p>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-10B981?style=for-the-badge)](https://masakkali.vercel.app)
[![Server Repo](https://img.shields.io/badge/⚙️%20Server%20Code-0f172a?style=for-the-badge)](https://github.com/YOUR_USERNAME/masakkali-server)

</div>

---

## 🔐 Rapid Testing (Recruiter Access)
Skip the registration. Use these pre-seeded accounts to explore the full depth of the platform. **Password for all: `123456aA`**

| Role | Email | Key Complexity to Observe |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `admin1@gmail.com` | **Analytics Engine:** Observe the dashboard loading 16 distinct data points (Revenue, Volume, Trends) via a single optimized aggregation request. |
| 🛵 **Rider** | `admin11@gmail.com` | **State Management:** Real-time task transitions from "Assigned" to "Delivered" with instant earnings wallet updates. |
| 👤 **User** | `admin4@gmail.com` | **Financial Flow:** Dynamic pricing engine & Stripe PaymentIntent integration. |

> **Note:** Use Stripe test card `4242 4242 4242 4242` for checkout.

---

## 🚀 Technical Highlights

### ⚡ Performance: The 16-Query Aggregation Engine
Unlike standard apps that make dozens of API calls to build a dashboard, Masakkali uses a **Parallel Aggregation Pipeline**. 
* **Challenge:** Calculating daily revenue, 7-day volume trends, top districts, and status counts usually kills DB performance.
* **Solution:** Utilized `Promise.all()` with custom MongoDB `$facet` and `$group` pipelines to execute 16 complex analytics queries in a single database round-trip.

### 🛡️ Security: Multi-Layered Guardrails
* **Server-Side Price Validation:** Every parcel's cost is recalculated on the backend based on weight and district logic before processing. If a user tries to "inspect element" and change the price, the server rejects the transaction.
* **Role-Based Access Control (RBAC):** Custom `verifyAdmin` and `verifyRider` middleware decode Firebase JWTs and cross-reference MongoDB roles to prevent unauthorized API access.

### 📊 Real-Time Logistics
* **Tracking Engine:** Generates unique PCL-format IDs and maintains a chronological event timeline (`booked` → `assigned` → `in-transit` → `delivered`).
* **Rider Wallet:** Automatic commission split logic (80% for same-district, 30% for inter-district) calculated at the moment of delivery.

---

## 🛠️ Tech Stack
* **Frontend:** React 19, Tailwind CSS 4, Framer Motion (Animations), Recharts (Data Viz)
* **Backend:** Express 5, Node.js, Firebase Admin SDK
* **Database:** MongoDB Atlas (Aggregation Framework)
* **Payments:** Stripe API (PaymentIntents)
* **Infrastructure:** Vercel (Client), Render/Railway (Server)

---

## 📸 System Walkthrough
<details>
<summary>View Dashboard Previews</summary>

| Admin Analytics | Rider Tasks |
| :---: | :---: |
| <img src="public/admin-ss.png" width="400" /> | <img src="public/rider-ss.png" width="400" /> |

</details>

---

## 👤 Connect with me
[Your Name] - [LinkedIn](your-link) - [Portfolio](your-link)

<div align="center">
  <sub>Built for scale. Documented for clarity. 🇧🇩 2026</sub>
</div>