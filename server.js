const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'airline_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Seeds (Ported & enriched from original schema.sql)
function getInitialSeed() {
  return {
    users: [
      {
        userId: 'nav@gmail.com',
        firstName: 'Naveen',
        lastName: 'Kumar',
        gender: 'Male',
        dob: '1991-08-06',
        password: 'nav',
        contactNumber: '9010919287',
        address: 'Hyderabad, India',
        city: 'Hyderabad'
      },
      {
        userId: 'sai',
        firstName: 'Sai',
        lastName: 'Kumar',
        gender: 'Male',
        dob: '1991-08-06',
        password: 'kumar',
        contactNumber: '9848012345',
        address: 'Bhimavaram, AP',
        city: 'Bhimavaram'
      },
      {
        userId: 'naveen6',
        firstName: 'Naveen',
        lastName: 'Chowdary',
        gender: 'Male',
        dob: '1991-08-06',
        password: 'naveen',
        contactNumber: '9988776655',
        address: 'Sri Ram Printers, Valluru',
        city: 'Valluru'
      }
    ],
    accounts: [
      { accountNumber: '31120883421', holderName: 'Airline Merchant (r.teja)', balance: 3000000, minBalance: 500, pin: '2297', isMerchant: true },
      { accountNumber: '30552909581', holderName: 'y.saikrishna', balance: 2000000, minBalance: 500, pin: '5879', isMerchant: false },
      { accountNumber: '33540765663', holderName: 't.srinivas', balance: 3000000, minBalance: 500, pin: '3721', isMerchant: false },
      { accountNumber: '30345439612', holderName: 'm.ganesh', balance: 4000000, minBalance: 500, pin: '4690', isMerchant: false },
      { accountNumber: '31158932810', holderName: 'y.vinod', balance: 1500000, minBalance: 500, pin: '3371', isMerchant: false },
      { accountNumber: '31007463299', holderName: 'n.dora', balance: 1400000, minBalance: 500, pin: '2262', isMerchant: false },
      { accountNumber: '30543824115', holderName: 's.ramu', balance: 5000000, minBalance: 500, pin: '4781', isMerchant: false }
    ],
    places: [
      { id: 'p1', name: 'Hyderabad', code: 'HYD', country: 'India', airport: 'Rajiv Gandhi Intl Airport' },
      { id: 'p2', name: 'Chennai', code: 'MAA', country: 'India', airport: 'Chennai Intl Airport' },
      { id: 'p3', name: 'Mumbai', code: 'BOM', country: 'India', airport: 'Chhatrapati Shivaji Maharaj Intl' },
      { id: 'p4', name: 'Delhi', code: 'DEL', country: 'India', airport: 'Indira Gandhi Intl Airport' },
      { id: 'p5', name: 'Bangalore', code: 'BLR', country: 'India', airport: 'Kempegowda Intl Airport' },
      { id: 'p6', name: 'Kolkata', code: 'CCU', country: 'India', airport: 'Netaji Subhash Chandra Bose Intl' },
      { id: 'p7', name: 'Ranchi', code: 'IXR', country: 'India', airport: 'Birsa Munda Airport' },
      { id: 'p8', name: 'Goa', code: 'GOI', country: 'India', airport: 'Dabolim Intl Airport' },
      { id: 'p9', name: 'Pune', code: 'PNQ', country: 'India', airport: 'Pune Airport' },
      { id: 'p10', name: 'Kerala', code: 'COK', country: 'India', airport: 'Cochin Intl Airport' },
      { id: 'p11', name: 'Coimbatore', code: 'CJB', country: 'India', airport: 'Coimbatore Intl Airport' },
      { id: 'p12', name: 'Ahmedabad', code: 'AMD', country: 'India', airport: 'Sardar Vallabhbhai Patel Intl' },
      { id: 'p13', name: 'Jaipur', code: 'JAI', country: 'India', airport: 'Jaipur Intl Airport' },
      { id: 'p14', name: 'Vijayawada', code: 'VGA', country: 'India', airport: 'Vijayawada Airport' },
      { id: 'p15', name: 'New York', code: 'JFK', country: 'USA', airport: 'John F. Kennedy Intl' },
      { id: 'p16', name: 'Madurai', code: 'IXM', country: 'India', airport: 'Madurai Airport' },
      { id: 'p17', name: 'Singapore', code: 'SIN', country: 'Singapore', airport: 'Changi International Airport' },
      { id: 'p18', name: 'Dubai', code: 'DXB', country: 'UAE', airport: 'Dubai International Airport' },
      { id: 'p19', name: 'Hong Kong', code: 'HKG', country: 'Hong Kong', airport: 'Hong Kong Intl Airport' },
      { id: 'p20', name: 'USA (Los Angeles)', code: 'LAX', country: 'USA', airport: 'Los Angeles Intl Airport' },
      { id: 'p21', name: 'South Africa (Johannesburg)', code: 'JNB', country: 'South Africa', airport: 'O.R. Tambo Intl' },
      { id: 'p22', name: 'Australia (Sydney)', code: 'SYD', country: 'Australia', airport: 'Sydney Kingsford Smith' }
    ],
    flights: [
      { id: '1', flightNo: 'AI-201', airline: 'Air India', aircraft: 'Boeing 787-8 Dreamliner', source: 'p1', dest: 'p21', category: 'international', classType: 'Economy', cost: 14000, depTime: '06:30', arrTime: '15:45', duration: '9h 15m', stops: 'Non-stop' },
      { id: '2', flightNo: 'AI-304', airline: 'Air India', aircraft: 'Airbus A320neo', source: 'p11', dest: 'p14', category: 'domestic', classType: 'Business', cost: 15000, depTime: '08:15', arrTime: '10:45', duration: '2h 30m', stops: 'Non-stop' },
      { id: '3', flightNo: 'EK-702', airline: 'Emirates', aircraft: 'Boeing 777-300ER', source: 'p21', dest: 'p4', category: 'international', classType: 'Business', cost: 30000, depTime: '11:00', arrTime: '21:30', duration: '10h 30m', stops: '1 Stop (DXB)' },
      { id: '4', flightNo: 'SG-115', airline: 'SpiceJet', aircraft: 'Boeing 737 MAX 8', source: 'p4', dest: 'p9', category: 'domestic', classType: 'Economy', cost: 4000, depTime: '14:20', arrTime: '16:30', duration: '2h 10m', stops: 'Non-stop' },
      { id: '5', flightNo: '6E-442', airline: 'IndiGo', aircraft: 'Airbus A321neo', source: 'p11', dest: 'p14', category: 'domestic', classType: 'Business', cost: 27000, depTime: '17:00', arrTime: '19:30', duration: '2h 30m', stops: 'Non-stop' },
      { id: '6', flightNo: 'SQ-423', airline: 'Singapore Airlines', aircraft: 'Airbus A350-900', source: 'p3', dest: 'p17', category: 'international', classType: 'Economy', cost: 30000, depTime: '23:45', arrTime: '07:45', duration: '5h 30m', stops: 'Non-stop' },
      { id: '7', flightNo: 'CX-645', airline: 'Cathay Pacific', aircraft: 'Airbus A350-1000', source: 'p8', dest: 'p19', category: 'international', classType: 'Business', cost: 29000, depTime: '09:10', arrTime: '18:25', duration: '6h 45m', stops: 'Non-stop' },
      { id: '8', flightNo: 'AI-883', airline: 'Air India', aircraft: 'Airbus A320neo', source: 'p7', dest: 'p1', category: 'domestic', classType: 'Business', cost: 19000, depTime: '12:00', arrTime: '14:20', duration: '2h 20m', stops: 'Non-stop' },
      { id: '9', flightNo: '6E-551', airline: 'IndiGo', aircraft: 'Airbus A320neo', source: 'p8', dest: 'p19', category: 'international', classType: 'Economy', cost: 22000, depTime: '15:30', arrTime: '23:55', duration: '5h 55m', stops: '1 Stop' },
      { id: '10', flightNo: 'BA-277', airline: 'British Airways', aircraft: 'Boeing 777-200', source: 'p20', dest: 'p2', category: 'international', classType: 'Business', cost: 32000, depTime: '18:00', arrTime: '13:30', duration: '19h 30m', stops: '1 Stop (LHR)' },
      { id: '11', flightNo: '6E-804', airline: 'IndiGo', aircraft: 'Airbus A320neo', source: 'p17', dest: 'p9', category: 'international', classType: 'Economy', cost: 22000, depTime: '07:30', arrTime: '10:50', duration: '5h 50m', stops: 'Non-stop' },
      { id: '12', flightNo: 'SG-228', airline: 'SpiceJet', aircraft: 'Boeing 737-800', source: 'p7', dest: 'p1', category: 'domestic', classType: 'Economy', cost: 7500, depTime: '19:40', arrTime: '21:55', duration: '2h 15m', stops: 'Non-stop' },
      { id: '13', flightNo: '6E-319', airline: 'IndiGo', aircraft: 'Airbus A320', source: 'p6', dest: 'p8', category: 'domestic', classType: 'Economy', cost: 8200, depTime: '06:15', arrTime: '09:05', duration: '2h 50m', stops: 'Non-stop' },
      { id: '14', flightNo: 'EK-505', airline: 'Emirates', aircraft: 'Airbus A380-800', source: 'p10', dest: 'p15', category: 'international', classType: 'Business', cost: 55000, depTime: '04:30', arrTime: '18:15', duration: '20h 15m', stops: '1 Stop (DXB)' },
      { id: '15', flightNo: 'AI-611', airline: 'Air India', aircraft: 'Airbus A321', source: 'p12', dest: 'p11', category: 'domestic', classType: 'Economy', cost: 6800, depTime: '10:15', arrTime: '13:00', duration: '2h 45m', stops: 'Non-stop' },
      { id: '16', flightNo: '6E-792', airline: 'IndiGo', aircraft: 'Airbus A320neo', source: 'p13', dest: 'p12', category: 'domestic', classType: 'Economy', cost: 5400, depTime: '11:45', arrTime: '13:10', duration: '1h 25m', stops: 'Non-stop' },
      { id: '17', flightNo: 'AI-519', airline: 'Air India', aircraft: 'Airbus A319', source: 'p14', dest: 'p16', category: 'domestic', classType: 'Economy', cost: 4800, depTime: '16:00', arrTime: '18:00', duration: '2h 00m', stops: 'Non-stop' },
      { id: '18', flightNo: 'EK-202', airline: 'Emirates', aircraft: 'Boeing 777-300ER', source: 'p15', dest: 'p1', category: 'international', classType: 'Business', cost: 48000, depTime: '22:15', arrTime: '23:30', duration: '17h 45m', stops: '1 Stop (DXB)' },
      { id: '19', flightNo: 'BA-112', airline: 'British Airways', aircraft: 'Boeing 787-9', source: 'p15', dest: 'p18', category: 'international', classType: 'Business', cost: 52000, depTime: '20:30', arrTime: '19:40', duration: '14h 10m', stops: '1 Stop (LHR)' },
      { id: '20', flightNo: '6E-108', airline: 'IndiGo', aircraft: 'Airbus A320neo', source: 'p16', dest: 'p2', category: 'domestic', classType: 'Economy', cost: 3500, depTime: '09:00', arrTime: '10:15', duration: '1h 15m', stops: 'Non-stop' },
      { id: '21', flightNo: 'FZ-434', airline: 'FlyDubai', aircraft: 'Boeing 737 MAX 8', source: 'p18', dest: 'p4', category: 'international', classType: 'Economy', cost: 18000, depTime: '13:15', arrTime: '18:10', duration: '3h 25m', stops: 'Non-stop' },
      { id: '22', flightNo: 'CX-712', airline: 'Cathay Pacific', aircraft: 'Airbus A330-300', source: 'p19', dest: 'p5', category: 'international', classType: 'Business', cost: 31000, depTime: '15:20', arrTime: '20:40', duration: '7h 50m', stops: 'Non-stop' },
      { id: '23', flightNo: 'AI-102', airline: 'Air India', aircraft: 'Boeing 777-200LR', source: 'p2', dest: 'p20', category: 'international', classType: 'Business', cost: 45000, depTime: '01:30', arrTime: '11:00', duration: '20h 00m', stops: '1 Stop' },
      { id: '24', flightNo: 'SQ-511', airline: 'Singapore Airlines', aircraft: 'Boeing 787-10', source: 'p5', dest: 'p19', category: 'international', classType: 'Business', cost: 29000, depTime: '23:10', arrTime: '09:20', duration: '7h 40m', stops: '1 Stop (SIN)' },
      { id: '25', flightNo: '6E-901', airline: 'IndiGo', aircraft: 'Airbus A320neo', source: 'p9', dest: 'p7', category: 'domestic', classType: 'Economy', cost: 6500, depTime: '12:45', arrTime: '15:10', duration: '2h 25m', stops: 'Non-stop' }
    ],
    bookings: [
      {
        bookingId: 'AR-BK101',
        pnr: 'AR-7N9X2',
        userId: 'nav@gmail.com',
        flightId: '1',
        flightNo: 'AI-201',
        airline: 'Air India',
        sourceName: 'Hyderabad (HYD)',
        destName: 'South Africa (JNB)',
        flightDate: '2026-11-15',
        depTime: '06:30',
        arrTime: '15:45',
        gate: 'G14',
        terminal: 'T2',
        noOfPeople: 2,
        passengers: [
          { name: 'Naveen Kumar', gender: 'Male', age: 34, seat: '12A', meal: 'Vegetarian Hindu', baggage: '25kg' },
          { name: 'Priya Sharma', gender: 'Female', age: 31, seat: '12B', meal: 'Standard Meal', baggage: '25kg' }
        ],
        seats: ['12A', '12B'],
        costPerPerson: 14000,
        totalCost: 28000,
        status: 'confirmed',
        bookedOn: '2026-10-10 14:30:00',
        paymentAccount: '30552909581',
        checkedIn: false
      }
    ],
    transactions: [
      {
        transactionId: 'TXN-9001',
        bookingId: 'AR-BK101',
        pnr: 'AR-7N9X2',
        date: '2026-10-10 14:30:15',
        amount: 28000,
        fromAccount: '30552909581',
        toAccount: '31120883421',
        type: 'PAYMENT',
        status: 'SUCCESS',
        description: 'Flight Booking Payment for PNR AR-7N9X2'
      }
    ]
  };
}

// Database Read / Write Helpers
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialSeed();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return getInitialSeed();
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

// Ensure DB is initialized
readDb();

// Generate Random 6-char Alpha-numeric PNR
function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = 'AR-';
  for (let i = 0; i < 5; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString(), server: 'Airline Reservation Core v2.0' });
});

// 2. Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username and password' });
  }

  const db = readDb();
  const user = db.users.find(u => u.userId.toLowerCase() === username.trim().toLowerCase() && u.password === password);

  if (user) {
    const { password, ...safeUser } = user;
    return res.json({ success: true, message: 'Login successful', user: safeUser });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your username/password.' });
  }
});

// 3. Authentication: Registration
app.post('/api/auth/register', (req, res) => {
  const { userId, firstName, lastName, gender, dob, password, contactNumber, address, city } = req.body;

  if (!userId || !firstName || !password) {
    return res.status(400).json({ success: false, message: 'User ID, First Name, and Password are required' });
  }

  const db = readDb();
  const existing = db.users.find(u => u.userId.toLowerCase() === userId.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'User ID already exists. Please login or choose another.' });
  }

  const newUser = {
    userId: userId.trim(),
    firstName: firstName.trim(),
    lastName: lastName || '',
    gender: gender || 'Unspecified',
    dob: dob || '',
    password: password,
    contactNumber: contactNumber || '',
    address: address || '',
    city: city || ''
  };

  db.users.push(newUser);
  writeDb(db);

  const { password: _, ...safeUser } = newUser;
  res.json({ success: true, message: 'Registration successful! You can now log in.', user: safeUser });
});

// 4. Airports / Places API
app.get('/api/airports', (req, res) => {
  const db = readDb();
  res.json({ success: true, places: db.places });
});

// 5. Flight Search API
app.get('/api/flights/search', (req, res) => {
  const { source, dest, date, classType, category } = req.query;
  const db = readDb();

  let results = db.flights.map(f => {
    const srcPlace = db.places.find(p => p.id === f.source);
    const dstPlace = db.places.find(p => p.id === f.dest);
    return {
      ...f,
      sourceDetails: srcPlace || { name: f.source, code: f.source },
      destDetails: dstPlace || { name: f.dest, code: f.dest }
    };
  });

  if (source) {
    results = results.filter(f => f.source === source || f.sourceDetails.code.toLowerCase() === source.toLowerCase());
  }

  if (dest) {
    results = results.filter(f => f.dest === dest || f.destDetails.code.toLowerCase() === dest.toLowerCase());
  }

  if (classType && classType !== 'any') {
    results = results.filter(f => f.classType.toLowerCase() === classType.toLowerCase());
  }

  if (category && category !== 'any') {
    results = results.filter(f => f.category.toLowerCase() === category.toLowerCase());
  }

  res.json({
    success: true,
    total: results.length,
    travelDate: date || new Date().toISOString().split('T')[0],
    flights: results
  });
});

// 6. Flight Details & Seat Availability
app.get('/api/flights/:id', (req, res) => {
  const db = readDb();
  const flight = db.flights.find(f => f.id === req.params.id);
  if (!flight) {
    return res.status(404).json({ success: false, message: 'Flight not found' });
  }

  const srcPlace = db.places.find(p => p.id === flight.source);
  const dstPlace = db.places.find(p => p.id === flight.dest);

  // Compute occupied seats from existing active bookings for this flight
  const occupiedSeats = [];
  db.bookings
    .filter(b => b.flightId === flight.id && b.status !== 'cancelled')
    .forEach(b => {
      if (b.seats && Array.isArray(b.seats)) {
        occupiedSeats.push(...b.seats);
      }
    });

  res.json({
    success: true,
    flight: {
      ...flight,
      sourceDetails: srcPlace,
      destDetails: dstPlace,
      occupiedSeats: Array.from(new Set(occupiedSeats))
    }
  });
});

// 7. Bank Accounts: List accounts for payment testing
app.get('/api/bank/accounts', (req, res) => {
  const db = readDb();
  // Return passenger accounts for quick reference
  const accounts = db.accounts.map(a => ({
    accountNumber: a.accountNumber,
    holderName: a.holderName,
    availableBalance: a.balance,
    minBalance: a.minBalance,
    isMerchant: a.isMerchant,
    pinHint: a.pin // Provided for easy test demonstrations
  }));
  res.json({ success: true, accounts });
});

// 8. Flight Booking & Atomic Bank Transaction
app.post('/api/bookings/create', (req, res) => {
  const {
    flightId,
    userId,
    flightDate,
    passengers,
    selectedSeats,
    payment
  } = req.body;

  if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ success: false, message: 'Flight ID and passenger details are required' });
  }

  if (!payment || !payment.accountNumber || !payment.pin) {
    return res.status(400).json({ success: false, message: 'Payment account number and PIN are required' });
  }

  const db = readDb();
  const flight = db.flights.find(f => f.id === String(flightId));
  if (!flight) {
    return res.status(404).json({ success: false, message: 'Flight not found' });
  }

  const numPeople = passengers.length;
  const baseCost = flight.cost * numPeople;
  // Taxes and airport fees: ~12%
  const taxes = Math.round(baseCost * 0.12);
  const totalAmount = baseCost + taxes;

  // Verify Bank Account
  const payerAccount = db.accounts.find(a => a.accountNumber === payment.accountNumber.trim());
  if (!payerAccount) {
    return res.status(400).json({ success: false, message: 'Invalid Bank Account number. Account does not exist.' });
  }

  if (payerAccount.pin !== payment.pin.trim()) {
    return res.status(401).json({ success: false, message: 'Incorrect PIN for the given bank account.' });
  }

  const merchantAccount = db.accounts.find(a => a.accountNumber === '31120883421');
  if (!merchantAccount) {
    return res.status(500).json({ success: false, message: 'Merchant account configuration error.' });
  }

  // Balance Check
  if (payerAccount.balance - totalAmount < payerAccount.minBalance) {
    return res.status(400).json({
      success: false,
      message: `Insufficient funds in account. Required: ₹${totalAmount.toLocaleString()}, Available: ₹${payerAccount.balance.toLocaleString()} (Min balance ₹${payerAccount.minBalance}).`
    });
  }

  // Check seat collisions
  const existingOccupied = [];
  db.bookings
    .filter(b => b.flightId === flight.id && b.status !== 'cancelled')
    .forEach(b => existingOccupied.push(...(b.seats || [])));

  const requestedSeats = selectedSeats || passengers.map(p => p.seat).filter(Boolean);
  const collision = requestedSeats.find(s => existingOccupied.includes(s));
  if (collision) {
    return res.status(409).json({ success: false, message: `Seat ${collision} is already reserved. Please select another seat.` });
  }

  // Atomic Ledger Execution
  payerAccount.balance -= totalAmount;
  merchantAccount.balance += totalAmount;

  const bookingId = 'AR-BK' + (db.bookings.length + 101);
  const pnr = generatePNR();
  const txnId = 'TXN-' + (db.transactions.length + 9001);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const srcPlace = db.places.find(p => p.id === flight.source);
  const dstPlace = db.places.find(p => p.id === flight.dest);

  // Assign passenger seats if not explicit
  const enrichedPassengers = passengers.map((p, idx) => ({
    name: p.name || 'Passenger ' + (idx + 1),
    gender: p.gender || 'Adult',
    age: p.age || 30,
    passport: p.passport || 'N/A',
    seat: p.seat || requestedSeats[idx] || (10 + idx) + 'A',
    meal: p.meal || 'Standard Airline Meal',
    baggage: p.baggage || '15kg Check-in + 7kg Cabin'
  }));

  const newBooking = {
    bookingId,
    pnr,
    userId: userId || 'nav@gmail.com',
    flightId: flight.id,
    flightNo: flight.flightNo,
    airline: flight.airline,
    aircraft: flight.aircraft,
    sourceName: `${srcPlace ? srcPlace.name : flight.source} (${srcPlace ? srcPlace.code : ''})`,
    destName: `${dstPlace ? dstPlace.name : flight.dest} (${dstPlace ? dstPlace.code : ''})`,
    sourceCode: srcPlace ? srcPlace.code : 'AIR',
    destCode: dstPlace ? dstPlace.code : 'AIR',
    flightDate: flightDate || new Date().toISOString().split('T')[0],
    depTime: flight.depTime,
    arrTime: flight.arrTime,
    duration: flight.duration,
    stops: flight.stops,
    gate: 'G' + Math.floor(Math.random() * 20 + 1),
    terminal: 'T' + Math.floor(Math.random() * 3 + 1),
    noOfPeople: numPeople,
    passengers: enrichedPassengers,
    seats: enrichedPassengers.map(p => p.seat),
    costPerPerson: flight.cost,
    taxes,
    totalCost: totalAmount,
    status: 'confirmed',
    bookedOn: now,
    paymentAccount: payerAccount.accountNumber,
    paymentHolder: payerAccount.holderName,
    transactionId: txnId,
    checkedIn: false
  };

  const newTransaction = {
    transactionId: txnId,
    bookingId,
    pnr,
    date: now,
    amount: totalAmount,
    fromAccount: payerAccount.accountNumber,
    toAccount: merchantAccount.accountNumber,
    type: 'PAYMENT',
    status: 'SUCCESS',
    description: `Booking confirmation payment for PNR ${pnr} (${flight.flightNo})`
  };

  db.bookings.unshift(newBooking);
  db.transactions.unshift(newTransaction);
  writeDb(db);

  res.json({
    success: true,
    message: 'Booking confirmed successfully!',
    booking: newBooking,
    transaction: newTransaction,
    remainingBalance: payerAccount.balance
  });
});

// 9. Lookup Booking by PNR or Booking ID
app.get('/api/bookings/lookup', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Please provide a PNR or Booking ID' });
  }

  const db = readDb();
  const q = query.trim().toUpperCase();
  const booking = db.bookings.find(b => b.pnr.toUpperCase() === q || b.bookingId.toUpperCase() === q);

  if (!booking) {
    return res.status(404).json({ success: false, message: `No booking found matching "${query}".` });
  }

  res.json({ success: true, booking });
});

// 10. List Bookings for User
app.get('/api/bookings/user/:userId', (req, res) => {
  const db = readDb();
  const userBookings = db.bookings.filter(b => b.userId.toLowerCase() === req.params.userId.trim().toLowerCase());
  res.json({ success: true, total: userBookings.length, bookings: userBookings });
});

// 11. Web Check-in
app.post('/api/bookings/checkin', (req, res) => {
  const { pnr } = req.body;
  if (!pnr) {
    return res.status(400).json({ success: false, message: 'PNR is required for check-in' });
  }

  const db = readDb();
  const booking = db.bookings.find(b => b.pnr.toUpperCase() === pnr.trim().toUpperCase());
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Cannot check-in for a cancelled booking' });
  }

  booking.checkedIn = true;
  booking.status = 'checked-in';
  writeDb(db);

  res.json({ success: true, message: `Web check-in successful for PNR ${booking.pnr}! Boarding passes are ready.`, booking });
});

// 12. Ticket Cancellation & Automated Bank Refund
app.post('/api/bookings/cancel', (req, res) => {
  const { pnr, bookingId } = req.body;
  if (!pnr && !bookingId) {
    return res.status(400).json({ success: false, message: 'PNR or Booking ID is required for cancellation' });
  }

  const db = readDb();
  const booking = db.bookings.find(b =>
    (pnr && b.pnr.toUpperCase() === pnr.trim().toUpperCase()) ||
    (bookingId && b.bookingId.toUpperCase() === bookingId.trim().toUpperCase())
  );

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Ticket is already cancelled.' });
  }

  // Cancellation Fee Policy: 10% standard airline admin cancellation charge
  const refundAmount = booking.totalCost;
  const merchantAccount = db.accounts.find(a => a.accountNumber === '31120883421');
  const userAccount = db.accounts.find(a => a.accountNumber === booking.paymentAccount);

  if (merchantAccount && userAccount) {
    // Process refund
    merchantAccount.balance -= refundAmount;
    userAccount.balance += refundAmount;

    const refundTxnId = 'TXN-' + (db.transactions.length + 9001);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const refundTransaction = {
      transactionId: refundTxnId,
      bookingId: booking.bookingId,
      pnr: booking.pnr,
      date: now,
      amount: refundAmount,
      fromAccount: merchantAccount.accountNumber,
      toAccount: userAccount.accountNumber,
      type: 'REFUND',
      status: 'SUCCESS',
      description: `Automated Refund for Cancelled Ticket PNR ${booking.pnr}`
    };

    db.transactions.unshift(refundTransaction);
  }

  booking.status = 'cancelled';
  writeDb(db);

  res.json({
    success: true,
    message: `Ticket ${booking.pnr} has been successfully cancelled. ₹${refundAmount.toLocaleString()} has been refunded to Account ${booking.paymentAccount}.`,
    booking,
    refundAmount,
    userAccountBalance: userAccount ? userAccount.balance : null
  });
});

// 13. Transactions & Ledger Audit Log
app.get('/api/bank/transactions', (req, res) => {
  const db = readDb();
  res.json({ success: true, total: db.transactions.length, transactions: db.transactions });
});

// Fallback to Single Page App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`✈️  AIRLINE RESERVATION SYSTEM IS LIVE`);
  console.log(`🚀  Local URL: http://localhost:${PORT}`);
  console.log(`💾  Embedded Database: data/airline_db.json`);
  console.log(`====================================================`);
});
