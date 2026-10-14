# ✈️ AeroSky - Modern Airline Reservation & Ticketing System

> [!TIP]
> 🌐 **Live Demo Website (Instant Online Access)**: **[https://21a4122f1d22f4.lhr.life](https://21a4122f1d22f4.lhr.life)**  
> ☁️ **Cloud Deployment (Render)**: **[https://airline-reservation-system-dqtl.onrender.com](https://airline-reservation-system-dqtl.onrender.com)**  
> 💻 **Local URL**: `http://localhost:3000`

A high-performance, full-featured commercial Airline Reservation & Passenger Service System (PSS) designed with a real-world airline workflow: dynamic flight discovery, interactive aircraft cabin seat allocation, atomic core-bank payment simulation, instant digital boarding pass generation, web check-in, and automated cancellation with instant bank refunds.

---

## 🌟 What's New: Tomcat Replaced & Modernized

1. **🚫 No External Tomcat Server Needed**: Eliminated all standalone Apache Tomcat 9 server requirements, WAR deployments, and servlet classloading errors (`Unsupported class file major version`).
2. **⚡ 1-Second Zero-Config Startup**: Powered by an embedded, self-contained architecture with persistent JSON database storage. Runs cleanly on any operating system with a single command (`npm start`).
3. **🧹 Purged Over 120MB of Bloated Files**: Deleted obsolete video recordings (98MB MP4), duplicate binaries, old presentation decks, PDFs, and Oracle XE dumps.
4. **🛫 Real-World Commercial Airline Workflow**:
   - **Route Discovery**: 22 global airports with IATA codes (HYD, DEL, BOM, BLR, DXB, SIN, JFK, LHR, JNB, SYD, etc.).
   - **Realistic Flight Cards**: Leading commercial carriers (Air India, Emirates, IndiGo, Singapore Airlines, British Airways, SpiceJet) with aircraft models (Boeing 787 Dreamliner, Airbus A350, A320neo).
   - **Passenger Manifest**: Full travel document verification, special meals (Vegetarian Hindu, Vegan, Jain, Child), and baggage allowances.
   - **Interactive Aircraft Cabin Seat Selector**: Realistic visual fuselage seating map (3-3 / 2-4-2 layout) with Window, Aisle, and Premium Extra-Legroom seats.
   - **Core Bank Gateway**: Pre-loaded accounts with balance checks, security PIN authentication, and atomic funds transfer.
   - **Digital Boarding Pass**: Printable, downloadable boarding pass with perforated tear-off stub, flight route visualization, and scannable QR/barcodes.
   - **Self-Service Check-in & Cancellation**: Retrieve any reservation by 6-character PNR (e.g. `AR-7N9X2`), perform web check-in, or cancel with instant bank refunds.
   - **Audit Ledger**: Chronological transaction log recording debits, credits, timestamps, and account numbers.

---

## 🚀 How to Run Locally (Easy Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher — Node v20/22/25 supported)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```

### 3. Open in Your Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Pre-Configured Test Credentials

### User Accounts
| Email / User ID | Password | Name |
| :--- | :--- | :--- |
| `nav@gmail.com` | `nav` | Naveen Kumar *(Default)* |
| `sai` | `kumar` | Sai Kumar |
| `naveen6` | `naveen` | Naveen Chowdary |

*(You can also register new accounts instantly via the Register button)*

### Bank Accounts & PINs (For Payment Simulation)
| Account Holder | Account Number | Security PIN | Available Balance | Type |
| :--- | :--- | :--- | :--- | :--- |
| **Airline Merchant (r.teja)** | `31120883421` | `2297` | ₹3,000,000 | **Recipient** |
| **y.saikrishna** | `30552909581` | `5879` | ₹2,000,000 | Passenger |
| **t.srinivas** | `33540765663` | `3721` | ₹3,000,000 | Passenger |
| **m.ganesh** | `30345439612` | `4690` | ₹4,000,000 | Passenger |
| **y.vinod** | `31158932810` | `3371` | ₹1,500,000 | Passenger |
| **s.ramu** | `30543824115` | `4781` | ₹5,000,000 | Passenger |

*(Tip: In the payment checkout screen, selecting an account automatically auto-fills the account number and PIN for rapid testing!)*

---

## 🗺️ Step-by-Step Real Airline Walkthrough

```mermaid
graph LR
    A[1. Search Flights] --> B[2. Select Flight]
    B --> C[3. Passenger Info & Meals]
    C --> D[4. Interactive Seat Map]
    D --> E[5. Bank Payment Authorization]
    E --> F[6. Digital Boarding Pass]
    F --> G[7. Web Check-in & Cancellation]
```

1. **Search Flights**: Choose Origin (e.g. `Hyderabad - HYD`), Destination (e.g. `South Africa - JNB`), Departure Date, Cabin Class, and Passengers.
2. **Select Flight**: Compare departure/arrival times, aircraft types, stops, and dynamic ticket pricing.
3. **Passenger Info**: Provide passenger names, travel document IDs, special meal requests, and baggage allowances.
4. **Seat Selection**: Interactive airplane visual cabin map. Click seats (e.g. `12A`, `12B`) to reserve specific window/aisle spots.
5. **Payment Settlement**: Select a passenger bank account and authorize using the security PIN. Balances are verified in real time.
6. **E-Ticket & Boarding Pass**: Instant 6-digit PNR generation (`AR-XXXXX`), gate allocation, terminal assignment, and printable boarding pass with QR code.
7. **Manage Booking**: Use the **Manage Booking** tab to enter your PNR, perform **Web Check-in**, or click **Cancel Ticket & Refund** to immediately credit money back into the payer's bank account.
8. **Audit Ledger**: Open the **Audit Ledger** tab to review real-time debits and credits.

---

## 🐳 Docker Deployment (Optional)

If deploying to Docker or Render/Cloud:

```bash
# Build the container
docker build -t aerosky-airline .

# Run the container
docker run -p 3000:3000 aerosky-airline
```

---

## 📁 Clean Repository Structure

```text
├── Dockerfile              # Lightweight Node Alpine container
├── README.md               # Setup and documentation
├── package.json            # Node.js dependencies and scripts
├── server.js               # Express core, REST APIs, and embedded database
├── data/
│   └── airline_db.json     # Persistent database (auto-seeded)
└── public/
    ├── index.html          # Semantic HTML5 airline application shell
    ├── css/
    │   └── style.css       # Aviation design system, seat map & boarding pass styles
    └── js/
        └── app.js          # Booking controller, seat picker & payment logic
```
