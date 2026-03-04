<div align="center">

<a href="https://masakkali-courier.web.app" target="_blank">
  <img src="https://raw.githubusercontent.com/Hridoykhan4/Masakkali_Courier/main/client/public/preview.png"
       alt="Masakkali — Parcel Delivery Platform" width="100%" style="border-radius:12px" />
</a>

<br/>

<img
  src="https://readme-typing-svg.demolab.com?font=Urbanist&weight=900&size=34&pause=1400&color=10B981&center=true&vCenter=true&width=720&lines=MASAKKALI+%E2%80%94+Courier+Platform;3+Portals.+Real+Payments.+Live+Tracking.;Built+for+Production%2C+Not+a+Tutorial."
  alt="Masakkali" />

<br/>

> **A full-stack parcel delivery system** with three role-based portals (Customer · Rider · Admin),  
> real Stripe payments, Firebase JWT auth, live tracking, and a 16-query parallel MongoDB  
> aggregation engine — covering all 64 districts of Bangladesh.

<br/>

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express_5-000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB_7-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer)
![TanStack](https://img.shields.io/badge/TanStack_Query_5-FF4154?style=flat-square&logo=reactquery&logoColor=white)

<br/>

[![🚀 Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-10B981?style=for-the-badge)](https://masakkali-courier.web.app)
&nbsp;
[![⚙️ Server Repo](https://img.shields.io/badge/⚙️%20Server%20Repo-0f172a?style=for-the-badge)](https://github.com/Hridoykhan4/Masakkali_Courier/tree/main/server)

</div>

---

## 🔐 Try It Right Now — No Signup

| Role | Email | Password | Suggested flow |
|------|-------|----------|----------------|
| 👤 **Customer** | `admin4@gmail.com` | `123456aA` | Book parcel → pay → watch status update live |
| 🛵 **Rider** | `admin11@gmail.com` | `123456aA` | Open task queue → confirm pickup → deliver → earnings update |
| 🛡️ **Admin** | `admin1@gmail.com` | `123456aA` | Approve a rider → assign a delivery → explore the KPI dashboard |

<details>
<summary>💳 <strong>Stripe test card</strong></summary>

```
4242 4242 4242 4242   ·   Any future expiry   ·   Any CVC
```
Stripe test mode — no real charge, ever.
</details>

---

## 🎯 Why this isn't just another portfolio project

Most portfolio apps stop at a UI with mock data. This one doesn't.

| What it does | Why it matters |
|---|---|
| **Server-side pricing validation** | Parcel cost is recalculated on the backend and compared to the client value. Mismatch → `400`. Price tampering is impossible. |
| **Firebase JWT on every route** | `firebase-admin` decodes and verifies tokens server-side. Role is checked from MongoDB — not the token claim. A modified token does nothing. |
| **16 parallel MongoDB aggregations** | The admin overview fires all KPI queries inside a single `Promise.all()`. Zero sequential waterfalls, one round-trip. |
| **Full Stripe PaymentIntents flow** | Secret key never touches the client. Only the `client_secret` does. Webhook-ready payment recording. |
| **Three purpose-built dashboards** | Each role has a separate data model, API, and animated UI — not the same page with hidden tabs. |

---

## ✨ What each role can do

<details>
<summary>👤 <strong>Customer Portal</strong></summary>

| Feature | Detail |
|---------|--------|
| Parcel Booking | Multi-step form — document vs non-document, weight tiers, same/inter-district auto-pricing |
| Stripe Payment | Full PaymentIntent flow — card UI → confirmation → DB write → parcel marked paid |
| Live Tracking | Public page — unique `PCL-YYYYMMDD-XXXXX` ID, full event log with location + timestamp |
| Dashboard | Single API: stats, active parcel progress stepper, monthly spend bar chart, status donut |
| Payment History | Transaction IDs, amounts, dates |
</details>

<details>
<summary>🛵 <strong>Rider Portal</strong></summary>

| Feature | Detail |
|---------|--------|
| Task Queue | Live assigned + in-transit parcels, colour-coded by delivery type |
| Pickup / Delivery | One-tap confirmation → status update → tracking event written to DB |
| Earnings Wallet | Lifetime / weekly / monthly breakdown, settled vs pending cashout |
| Commission | 80% same-district · 30% inter-district — shown inline, always visible |
| Dashboard | Profile card, active queue, route analysis chart, cashout nudge |
</details>

<details>
<summary>🛡️ <strong>Admin Command Centre</strong></summary>

| Feature | Detail |
|---------|--------|
| KPI Overview | 16 parallel queries — revenue today/7d/30d, parcel counts, top districts, 7-day sparkline |
| Rider Approval | Review NID, bike, region → approve or reject inline |
| Rider Assignment | Filter by district → assign → rider phone shown for coordination |
| User Management | All users + last login + roles → promote to admin in one click |
</details>

---

## 🏗️ How it's built

```
  React 19 + Vite 7
  ┌────────────┬────────────┬────────────┐
  │  Customer  │   Rider    │   Admin    │
  └─────┬──────┴─────┬──────┴─────┬──────┘
        └────────────┼────────────┘
              TanStack Query v5
         (cache · stale-time · refetch)
                     │
           Axios + Firebase JWT
                     │
        Express 5  ──  verifyFBToken
                        → verifyAdmin
                        → verifyRider
                     │
        MongoDB Atlas  ──  $match · $group
                    Promise.all([...16])
                     │
     users · parcels · riders · payments · tracking
```

---

## 🛠️ Tech Stack

| | Tech | Version | Role |
|-|------|---------|------|
| **Frontend** | React, Vite, React Router | 19 · 7 · 7 | UI, routing, layouts |
| **State** | TanStack Query, React Hook Form | 5 · 7 | Server cache, forms |
| **Styling** | Tailwind CSS, DaisyUI | 4 · 5 | Utility-first, light/dark |
| **Motion** | Framer Motion, Recharts | 12 · 3 | Animations, charts |
| **Payments** | Stripe.js + Stripe Node | 8 · 20 | PaymentIntents, PCI |
| **Auth** | Firebase SDK + Admin SDK | 12 · 13 | Client auth + server JWT |
| **Backend** | Express, MongoDB Atlas | 5 · 7 | REST API, aggregations |
| **Maps** | React Leaflet | 5 | Coverage visualisation |

---

## 💰 Pricing logic

```
Document        Same district ৳60  ·  Inter district ৳80

Non-Document    Base ≤ 3 kg:  ৳110 same  /  ৳150 inter
                Extra weight: +৳40 per kg above 3 kg
                Inter surcharge: +৳40

Rider cut       Same district 80%  ·  Inter district 30%
```

Calculated client-side for UX, **recalculated server-side for trust**.

---

## 🔒 Security model

- Firebase Admin SDK verifies JWT on every protected route — forged tokens rejected
- Role stored in MongoDB — changing the token claim does nothing
- Email ownership enforced server-side — users can't read each other's data
- Rider role explicitly blocked from the role-promotion endpoint
- Stripe secret key is server-only — client only receives `client_secret`

---

## 🚀 Run locally

```bash
git clone https://github.com/Hridoykhan4/masakkali-client
git clone https://github.com/Hridoykhan4/masakkali-server
```

**`server/.env`**
```env
PORT=5000
DB_USER=
DB_PASS=
Stripe_KEY=sk_test_...
FB_SERVICE_KEY=base64_firebase_service_account
```

**`client/.env.local`**
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PK=pk_test_...
```

```bash
cd masakkali-server && npm i && npm run dev
cd masakkali-client && npm i && npm run dev
```

---

<div align="center">

**Built by [Md. Toyob Uddin Hridoy](https://md-toyob-hridoy-portfolio.vercel.app)**

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white)](https://md-toyob-hridoy-portfolio.vercel.app)
&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/md-toyob-uddin-hridoy)

<sub>Full-stack · Production-grade · Bangladesh 🇧🇩 · 2026</sub>

</div>