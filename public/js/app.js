/**
 * AEROSKY AIRLINE RESERVATION SYSTEM - FRONTEND CONTROLLER
 * Full Real-World Airline Flow: Search -> Results -> Pax -> Seat Map -> Payment -> Boarding Pass
 */

// Application State
const state = {
  currentUser: {
    userId: 'nav@gmail.com',
    firstName: 'Naveen',
    lastName: 'Kumar',
    email: 'nav@gmail.com'
  },
  airports: [],
  tripType: 'oneway',
  searchQuery: {},
  selectedFlight: null,
  passengers: [],
  selectedSeats: [],
  currentBooking: null,
  pendingCancelBooking: null,
  accounts: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  initDateDefaults();
  await loadAirports();
  await loadBankAccounts();
  await loadTransactions();
  updateAuthUI();

  // Run initial default search for immediate user experience
  setTimeout(() => {
    const sourceSelect = document.getElementById('searchSource');
    const destSelect = document.getElementById('searchDest');
    if (sourceSelect && destSelect) {
      sourceSelect.value = 'p1';  // Hyderabad
      destSelect.value = 'p21';   // South Africa
    }
  }, 200);
});

function initDateDefaults() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const searchDate = document.getElementById('searchDate');
  if (searchDate) {
    searchDate.value = dateStr;
    searchDate.min = new Date().toISOString().split('T')[0];
  }

  const returnDate = document.getElementById('returnDate');
  if (returnDate) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    returnDate.value = nextWeek.toISOString().split('T')[0];
    returnDate.min = dateStr;
  }
}

// ============================================================================
// NAVIGATION & STEPPER WIZARD
// ============================================================================

function switchNavTab(tabId) {
  document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');

  const navMap = {
    'booking-tab': 'nav-booking',
    'manage-tab': 'nav-manage',
    'bank-tab': 'nav-bank',
    'transactions-tab': 'nav-transactions'
  };

  const navItem = document.getElementById(navMap[tabId]);
  if (navItem) navItem.classList.add('active');

  if (tabId === 'bank-tab') loadBankAccounts();
  if (tabId === 'transactions-tab') loadTransactions();
}

function goToStep(stepNumber) {
  // Hide all wizard steps
  for (let i = 1; i <= 6; i++) {
    const stepEl = document.getElementById(`step${i}`);
    if (stepEl) stepEl.style.display = 'none';

    const nodeEl = document.getElementById(`stepNode${i}`);
    if (nodeEl) {
      nodeEl.classList.remove('active');
      if (i < stepNumber) {
        nodeEl.classList.add('completed');
      } else {
        nodeEl.classList.remove('completed');
      }
    }

    const connEl = document.getElementById(`conn${i}`);
    if (connEl) {
      if (i < stepNumber) {
        connEl.classList.add('completed');
      } else {
        connEl.classList.remove('completed');
      }
    }
  }

  const activeStep = document.getElementById(`step${stepNumber}`);
  if (activeStep) activeStep.style.display = 'block';

  const activeNode = document.getElementById(`stepNode${stepNumber}`);
  if (activeNode) activeNode.classList.add('active');

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function setTripType(type, btn) {
  state.tripType = type;
  document.querySelectorAll('.trip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const returnGroup = document.getElementById('returnDateGroup');
  if (returnGroup) {
    returnGroup.style.display = type === 'roundtrip' ? 'flex' : 'none';
  }
}

// ============================================================================
// STEP 1: LOAD AIRPORTS & FLIGHT SEARCH
// ============================================================================

async function loadAirports() {
  try {
    const res = await fetch('/api/airports');
    const data = await res.json();
    if (data.success && data.places) {
      state.airports = data.places;
      populateAirportSelects(data.places);
    }
  } catch (err) {
    showToast('Failed to load airport directory', 'error');
  }
}

function populateAirportSelects(places) {
  const sourceSelect = document.getElementById('searchSource');
  const destSelect = document.getElementById('searchDest');

  if (!sourceSelect || !destSelect) return;

  sourceSelect.innerHTML = '<option value="">Select Origin Airport...</option>';
  destSelect.innerHTML = '<option value="">Select Destination Airport...</option>';

  places.forEach(p => {
    const optText = `${p.name} (${p.code}) - ${p.country}`;
    sourceSelect.innerHTML += `<option value="${p.id}">${optText}</option>`;
    destSelect.innerHTML += `<option value="${p.id}">${optText}</option>`;
  });
}

async function handleFlightSearch(e) {
  e.preventDefault();

  const source = document.getElementById('searchSource').value;
  const dest = document.getElementById('searchDest').value;
  const date = document.getElementById('searchDate').value;
  const classType = document.getElementById('searchCabin').value;
  const pax = parseInt(document.getElementById('searchPax').value) || 1;

  if (source === dest) {
    showToast('Origin and Destination airports cannot be identical.', 'error');
    return;
  }

  state.searchQuery = { source, dest, date, classType, pax };

  const btn = document.getElementById('btnSearchSubmit');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Searching Radar...';
  btn.disabled = true;

  try {
    const query = new URLSearchParams({ source, dest, date, classType });
    const res = await fetch(`/api/flights/search?${query.toString()}`);
    const data = await res.json();

    if (data.success) {
      renderFlightResults(data.flights, pax, date);
      goToStep(2);
    } else {
      showToast('Error searching flights: ' + data.message, 'error');
    }
  } catch (err) {
    showToast('Failed to connect to flight server.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ============================================================================
// STEP 2: RENDER FLIGHT RESULTS
// ============================================================================

function renderFlightResults(flights, pax, travelDate) {
  const container = document.getElementById('flightResultsContainer');
  const summaryText = document.getElementById('searchSummaryText');

  if (!container) return;

  if (flights.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.25rem; margin-bottom: 0.5rem; color: #fff;">No direct flights found for this route</p>
        <p>Try searching popular routes like <strong>Hyderabad (HYD) to South Africa (JNB)</strong> or <strong>Goa (GOI) to Hong Kong (HKG)</strong>.</p>
        <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="loadAllAvailableFlights()">Browse All Flights</button>
      </div>
    `;
    summaryText.innerText = '0 flights found';
    return;
  }

  summaryText.innerText = `${flights.length} flights available for ${travelDate} (${pax} Passenger${pax > 1 ? 's' : ''})`;

  let html = '';
  flights.forEach(f => {
    const totalCost = f.cost * pax;
    html += `
      <div class="flight-card">
        <div class="airline-meta">
          <div class="airline-badge">${f.airline.substring(0, 2).toUpperCase()}</div>
          <div class="airline-details">
            <h4>${f.airline}</h4>
            <p>${f.flightNo} • ${f.aircraft}</p>
            <span class="badge ${f.classType === 'Business' ? 'badge-warning' : 'badge-info'}" style="margin-top: 0.35rem;">
              ${f.classType} Class
            </span>
          </div>
        </div>

        <div class="flight-timeline">
          <div class="time-city">
            <h3>${f.depTime}</h3>
            <p>${f.sourceDetails.name} (${f.sourceDetails.code})</p>
          </div>

          <div class="flight-duration">
            <span>${f.duration}</span>
            <div class="duration-line">
              <span class="duration-plane">✈</span>
            </div>
            <span style="color: var(--accent-success);">${f.stops}</span>
          </div>

          <div class="time-city">
            <h3>${f.arrTime}</h3>
            <p>${f.destDetails.name} (${f.destDetails.code})</p>
          </div>
        </div>

        <div class="flight-price-action">
          <div class="price-tag">₹${totalCost.toLocaleString()}</div>
          <div class="price-sub">₹${f.cost.toLocaleString()} / person + taxes</div>
          <button class="btn btn-primary" onclick="selectFlight('${f.id}')">
            Select Flight →
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function loadAllAvailableFlights() {
  try {
    const res = await fetch('/api/flights/search');
    const data = await res.json();
    if (data.success) {
      renderFlightResults(data.flights, state.searchQuery.pax || 1, state.searchQuery.date || 'Flexible');
    }
  } catch (err) {
    showToast('Failed to load flights', 'error');
  }
}

// ============================================================================
// STEP 3: SELECT FLIGHT & PASSENGER INFORMATION
// ============================================================================

async function selectFlight(flightId) {
  try {
    const res = await fetch(`/api/flights/${flightId}`);
    const data = await res.json();

    if (!data.success) {
      showToast('Could not fetch flight details', 'error');
      return;
    }

    state.selectedFlight = data.flight;

    // Mini summary in header
    const summary = document.getElementById('selectedFlightMiniSummary');
    if (summary) {
      summary.innerHTML = `<strong>${data.flight.airline} ${data.flight.flightNo}</strong> | ${data.flight.sourceDetails.code} → ${data.flight.destDetails.code} | ${data.flight.depTime}`;
    }

    renderPassengerInputs(state.searchQuery.pax || 1);
    goToStep(3);
  } catch (err) {
    showToast('Error selecting flight', 'error');
  }
}

function renderPassengerInputs(paxCount) {
  const container = document.getElementById('passengerFormsList');
  if (!container) return;

  let html = '';
  for (let i = 1; i <= paxCount; i++) {
    const isFirst = i === 1;
    const defaultName = isFirst && state.currentUser ? `${state.currentUser.firstName} ${state.currentUser.lastName}` : '';

    html += `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h4 style="color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">${i}</span>
          Passenger ${i} ${isFirst ? '(Primary Traveler)' : ''}
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group">
            <label>Title</label>
            <select class="input-box pax-title" required>
              <option value="Mr">Mr.</option>
              <option value="Ms">Ms.</option>
              <option value="Mrs">Mrs.</option>
              <option value="Dr">Dr.</option>
            </select>
          </div>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" class="input-box pax-name" placeholder="As printed on Govt ID" value="${defaultName}" required>
          </div>

          <div class="form-group">
            <label>Gender</label>
            <select class="input-box pax-gender" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Age</label>
            <input type="number" class="input-box pax-age" min="1" max="110" value="30" required>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Passport / Govt ID</label>
            <input type="text" class="input-box pax-id" placeholder="ID or Passport No" value="P9482710">
          </div>

          <div class="form-group">
            <label>Meal Preference</label>
            <select class="input-box pax-meal">
              <option value="Standard Meal">Standard Airline Meal</option>
              <option value="Vegetarian Hindu (AVML)">Vegetarian Hindu (AVML)</option>
              <option value="Asian Vegetarian">Asian Vegetarian</option>
              <option value="Jain Meal (VJML)">Jain Meal (VJML)</option>
              <option value="Vegan Meal (VGML)">Vegan Meal (VGML)</option>
              <option value="Child Meal (CHML)">Child Meal (CHML)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Baggage Allowance</label>
            <select class="input-box pax-baggage">
              <option value="15kg Check-in + 7kg Cabin">15kg Check-in + 7kg Cabin (Standard)</option>
              <option value="25kg Check-in + 7kg Cabin">25kg Check-in + 7kg Cabin (+₹1,200)</option>
              <option value="35kg Check-in + 10kg Cabin">35kg Check-in + 10kg Cabin (+₹2,400)</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function handlePassengerDetails(e) {
  e.preventDefault();

  const titles = document.querySelectorAll('.pax-title');
  const names = document.querySelectorAll('.pax-name');
  const genders = document.querySelectorAll('.pax-gender');
  const ages = document.querySelectorAll('.pax-age');
  const ids = document.querySelectorAll('.pax-id');
  const meals = document.querySelectorAll('.pax-meal');
  const baggages = document.querySelectorAll('.pax-baggage');

  state.passengers = [];
  for (let i = 0; i < names.length; i++) {
    state.passengers.push({
      title: titles[i].value,
      name: `${titles[i].value}. ${names[i].value.trim()}`,
      gender: genders[i].value,
      age: parseInt(ages[i].value) || 28,
      passport: ids[i].value.trim() || 'N/A',
      meal: meals[i].value,
      baggage: baggages[i].value,
      seat: null
    });
  }

  renderSeatMap();
  goToStep(4);
}

// ============================================================================
// STEP 4: INTERACTIVE AIRCRAFT SEAT MAP
// ============================================================================

function renderSeatMap() {
  const cabin = document.getElementById('aircraftCabin');
  const instruction = document.getElementById('seatSelectionInstruction');
  if (!cabin) return;

  const paxCount = state.passengers.length;
  instruction.innerText = `Please select exactly ${paxCount} seat${paxCount > 1 ? 's' : ''} for your passenger party.`;

  state.selectedSeats = [];
  updateSelectedSeatsUI();

  const occupiedList = (state.selectedFlight && state.selectedFlight.occupiedSeats) || ['2A', '4C', '5D', '8F'];

  let html = '';
  const rows = 12; // 12 rows of aircraft seating
  const seatColsLeft = ['A', 'B', 'C'];
  const seatColsRight = ['D', 'E', 'F'];

  for (let r = 1; r <= rows; r++) {
    const isFirstClass = r <= 2;
    const isExitRow = r === 6;

    html += `
      <div class="seat-row">
        <div class="row-label">${r}</div>

        <div class="seat-cluster">
          ${seatColsLeft.map(col => {
            const seatId = `${r}${col}`;
            const isOccupied = occupiedList.includes(seatId);
            return `
              <div class="seat ${isOccupied ? 'occupied' : ''} ${isFirstClass ? 'first-class' : ''}" 
                   id="seat-${seatId}" 
                   onclick="toggleSeatSelection('${seatId}')"
                   title="${seatId} ${isFirstClass ? '(Premium Class)' : ''}">
                ${col}
              </div>
            `;
          }).join('')}
        </div>

        <div class="seat-aisle">
          ${isExitRow ? '<span style="font-size: 0.65rem; color: var(--accent-gold);">EXIT</span>' : '↕'}
        </div>

        <div class="seat-cluster">
          ${seatColsRight.map(col => {
            const seatId = `${r}${col}`;
            const isOccupied = occupiedList.includes(seatId);
            return `
              <div class="seat ${isOccupied ? 'occupied' : ''} ${isFirstClass ? 'first-class' : ''}" 
                   id="seat-${seatId}" 
                   onclick="toggleSeatSelection('${seatId}')"
                   title="${seatId} ${isFirstClass ? '(Premium Class)' : ''}">
                ${col}
              </div>
            `;
          }).join('')}
        </div>

        <div class="row-label">${r}</div>
      </div>
    `;
  }

  cabin.innerHTML = html;
}

function toggleSeatSelection(seatId) {
  const seatEl = document.getElementById(`seat-${seatId}`);
  if (!seatEl || seatEl.classList.contains('occupied')) return;

  const paxCount = state.passengers.length;

  if (state.selectedSeats.includes(seatId)) {
    // Deselect
    state.selectedSeats = state.selectedSeats.filter(s => s !== seatId);
    seatEl.classList.remove('selected');
  } else {
    // Select
    if (state.selectedSeats.length >= paxCount) {
      showToast(`You have already selected ${paxCount} seats for your party. Deselect one first.`, 'info');
      return;
    }
    state.selectedSeats.push(seatId);
    seatEl.classList.add('selected');
  }

  updateSelectedSeatsUI();
}

function updateSelectedSeatsUI() {
  const summaryBox = document.getElementById('selectedSeatsSummary');
  const confirmBtn = document.getElementById('btnConfirmSeats');
  const paxCount = state.passengers.length;

  if (state.selectedSeats.length === 0) {
    summaryBox.innerHTML = `No seats picked yet. Click on available seats in the aircraft (Need: <strong>${paxCount}</strong>).`;
    confirmBtn.disabled = true;
  } else {
    summaryBox.innerHTML = `
      <div style="display: flex; flex-wrap: gap: 0.5rem; margin-bottom: 0.5rem;">
        ${state.selectedSeats.map(s => `<span class="badge badge-info" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">Seat ${s}</span>`).join(' ')}
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted);">
        ${state.selectedSeats.length} of ${paxCount} seats selected.
      </p>
    `;
    confirmBtn.disabled = (state.selectedSeats.length !== paxCount);
  }
}

function proceedToPayment() {
  if (state.selectedSeats.length !== state.passengers.length) {
    showToast(`Please choose seats for all ${state.passengers.length} passengers.`, 'error');
    return;
  }

  // Assign seats to passengers
  state.passengers.forEach((p, idx) => {
    p.seat = state.selectedSeats[idx];
  });

  setupPaymentSummary();
  goToStep(5);
}

// ============================================================================
// STEP 5: BANK PAYMENT GATEWAY
// ============================================================================

async function setupPaymentSummary() {
  const paxCount = state.passengers.length;
  const baseRate = state.selectedFlight.cost;
  const baseTotal = baseRate * paxCount;
  const taxes = Math.round(baseTotal * 0.12);
  const grandTotal = baseTotal + taxes;

  document.getElementById('summaryPaxCount').innerText = paxCount;
  document.getElementById('summaryBaseFare').innerText = `₹${baseTotal.toLocaleString()}`;
  document.getElementById('summaryTaxes').innerText = `₹${taxes.toLocaleString()}`;
  document.getElementById('summaryTotalCost').innerText = `₹${grandTotal.toLocaleString()}`;

  // Populate accounts in dropdown
  await loadBankAccounts();
  const select = document.getElementById('payAccountSelect');
  if (select && state.accounts.length > 0) {
    select.innerHTML = '<option value="">Select a Passenger Account for Payment...</option>';
    state.accounts
      .filter(a => !a.isMerchant)
      .forEach(a => {
        select.innerHTML += `
          <option value="${a.accountNumber}">
            ${a.holderName} (Acc: ${a.accountNumber}) — Bal: ₹${a.availableBalance.toLocaleString()}
          </option>
        `;
      });

    // Auto-select first account (e.g. y.saikrishna)
    const firstAcc = state.accounts.find(a => !a.isMerchant);
    if (firstAcc) {
      select.value = firstAcc.accountNumber;
      autoFillAccount(firstAcc.accountNumber);
    }
  }
}

function autoFillAccount(accNum) {
  const acc = state.accounts.find(a => a.accountNumber === accNum);
  const accInput = document.getElementById('payAccountNum');
  const pinInput = document.getElementById('payPinNum');
  const hintNotice = document.getElementById('pinHintNotice');

  if (acc) {
    accInput.value = acc.accountNumber;
    pinInput.value = acc.pinHint;
    hintNotice.innerHTML = `Test Account PIN pre-filled: <strong>${acc.pinHint}</strong> (Available: ₹${acc.availableBalance.toLocaleString()})`;
  } else {
    accInput.value = '';
    pinInput.value = '';
    hintNotice.innerText = '';
  }
}

async function handlePaymentSubmission(e) {
  e.preventDefault();

  const accountNumber = document.getElementById('payAccountNum').value.trim();
  const pin = document.getElementById('payPinNum').value.trim();

  if (!accountNumber || !pin) {
    showToast('Please enter your account number and PIN', 'error');
    return;
  }

  const btn = document.getElementById('btnPayNow');
  btn.innerHTML = 'Connecting to Core Bank...';
  btn.disabled = true;

  try {
    const payload = {
      flightId: state.selectedFlight.id,
      userId: (state.currentUser && state.currentUser.userId) || 'nav@gmail.com',
      flightDate: state.searchQuery.date || new Date().toISOString().split('T')[0],
      passengers: state.passengers,
      selectedSeats: state.selectedSeats,
      payment: { accountNumber, pin }
    };

    const res = await fetch('/api/bookings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      state.currentBooking = data.booking;
      showToast('Payment Authorized! Ticket Confirmed.', 'success');
      renderBoardingPasses(data.booking);
      goToStep(6);
      loadBankAccounts();
      loadTransactions();
    } else {
      showToast(data.message || 'Payment failed.', 'error');
    }
  } catch (err) {
    showToast('Network error during payment execution.', 'error');
  } finally {
    btn.innerHTML = 'Authorize & Pay Now';
    btn.disabled = false;
  }
}

// ============================================================================
// STEP 6: DIGITAL BOARDING PASS RENDERING
// ============================================================================

function renderBoardingPasses(booking) {
  const container = document.getElementById('confirmedBoardingPasses');
  if (!container) return;

  let html = '';
  booking.passengers.forEach(pax => {
    html += `
      <div class="boarding-pass">
        <!-- Main Pass Section -->
        <div class="pass-main">
          <div class="pass-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="brand-icon" style="width: 38px; height: 38px;">
                <svg viewBox="0 0 24 24" fill="#fff" style="width: 20px; height: 20px;"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              </div>
              <div>
                <h3 style="color: #fff; font-size: 1.15rem; font-weight: 800;">${booking.airline.toUpperCase()}</h3>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${booking.aircraft}</span>
              </div>
            </div>

            <div class="pass-pnr-badge">
              PNR: ${booking.pnr}
            </div>
          </div>

          <div class="pass-flight-route">
            <div>
              <div class="city-code">${booking.sourceCode}</div>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">${booking.sourceName}</p>
              <h4 style="color: #fff; font-size: 1.25rem; margin-top: 0.35rem;">${booking.depTime}</h4>
            </div>

            <div style="text-align: center; color: var(--primary-light);">
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">${booking.duration}</span>
              <div style="font-size: 1.5rem;">✈</div>
              <span class="badge badge-success" style="font-size: 0.7rem;">${booking.stops}</span>
            </div>

            <div style="text-align: right;">
              <div class="city-code">${booking.destCode}</div>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">${booking.destName}</p>
              <h4 style="color: #fff; font-size: 1.25rem; margin-top: 0.35rem;">${booking.arrTime}</h4>
            </div>
          </div>

          <div class="pass-details-grid">
            <div class="detail-item">
              <span>Passenger</span>
              <strong>${pax.name}</strong>
            </div>
            <div class="detail-item">
              <span>Flight No</span>
              <strong>${booking.flightNo}</strong>
            </div>
            <div class="detail-item">
              <span>Date</span>
              <strong>${booking.flightDate}</strong>
            </div>
            <div class="detail-item">
              <span>Seat</span>
              <strong style="color: var(--accent); font-size: 1.25rem;">${pax.seat}</strong>
            </div>
            <div class="detail-item">
              <span>Gate</span>
              <strong>${booking.gate}</strong>
            </div>
            <div class="detail-item">
              <span>Terminal</span>
              <strong>${booking.terminal}</strong>
            </div>
            <div class="detail-item">
              <span>Meal</span>
              <strong>${pax.meal}</strong>
            </div>
            <div class="detail-item">
              <span>Baggage</span>
              <strong>${pax.baggage.split(' ')[0]}</strong>
            </div>
          </div>
        </div>

        <!-- Perforated Tear-off Stub Section -->
        <div class="pass-stub">
          <div style="text-align: center; width: 100%;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Boarding Pass</div>
            <h4 style="color: #fff; font-size: 1.1rem; margin: 0.25rem 0;">${booking.airline}</h4>
            <div style="font-size: 0.8rem; color: var(--accent); font-family: var(--font-mono);">${booking.pnr}</div>
          </div>

          <div style="text-align: center; margin: 1rem 0;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">SEAT</div>
            <div style="font-size: 2rem; font-weight: 800; color: #fff; font-family: var(--font-mono);">${pax.seat}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Gate ${booking.gate}</div>
          </div>

          <div class="barcode-box" style="width: 100%;">
            <div class="barcode-mock"></div>
            <span style="font-size: 0.65rem; color: #333; font-family: var(--font-mono);">${booking.pnr}-${pax.seat}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function resetToNewBooking() {
  state.selectedFlight = null;
  state.passengers = [];
  state.selectedSeats = [];
  state.currentBooking = null;
  goToStep(1);
}

// ============================================================================
// TAB 2: MANAGE BOOKINGS, WEB CHECK-IN & CANCELLATION
// ============================================================================

async function searchBooking() {
  const query = document.getElementById('lookupQuery').value.trim();
  if (!query) {
    showToast('Please enter a PNR or Booking ID', 'error');
    return;
  }

  const resultsArea = document.getElementById('manageResultsArea');
  resultsArea.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">Searching reservation registry...</p>';

  try {
    const res = await fetch(`/api/bookings/lookup?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.success) {
      renderManageBookingCard(data.booking);
    } else {
      resultsArea.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <p style="font-size: 1.1rem; color: #fff;">${data.message}</p>
          <p style="margin-top: 0.5rem;">Verify the 6-character PNR code (e.g. <strong>AR-7N9X2</strong>).</p>
        </div>
      `;
    }
  } catch (err) {
    showToast('Failed to retrieve booking', 'error');
  }
}

async function loadMyBookings() {
  const userId = (state.currentUser && state.currentUser.userId) || 'nav@gmail.com';
  const resultsArea = document.getElementById('manageResultsArea');
  resultsArea.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">Loading bookings for ' + userId + '...</p>';

  try {
    const res = await fetch(`/api/bookings/user/${encodeURIComponent(userId)}`);
    const data = await res.json();

    if (data.success && data.bookings.length > 0) {
      resultsArea.innerHTML = '';
      data.bookings.forEach(b => {
        resultsArea.innerHTML += createManageBookingHTML(b);
      });
    } else {
      resultsArea.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <p style="color: #fff;">No reservations found for ${userId}.</p>
          <button class="btn btn-primary" style="margin-top: 1rem;" onclick="switchNavTab('booking-tab')">Book a Flight Now</button>
        </div>
      `;
    }
  } catch (err) {
    showToast('Failed to load user bookings', 'error');
  }
}

function renderManageBookingCard(booking) {
  const resultsArea = document.getElementById('manageResultsArea');
  resultsArea.innerHTML = createManageBookingHTML(booking);
}

function createManageBookingHTML(b) {
  const isCancelled = b.status === 'cancelled';
  const isCheckedIn = b.checkedIn || b.status === 'checked-in';

  return `
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.75rem; margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
        <div>
          <span class="badge ${isCancelled ? 'badge-danger' : (isCheckedIn ? 'badge-success' : 'badge-info')}" style="margin-bottom: 0.5rem;">
            ${b.status.toUpperCase()}
          </span>
          <h3 style="color: #fff; font-size: 1.35rem;">${b.airline} (${b.flightNo})</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">PNR: <strong style="color: var(--accent);">${b.pnr}</strong> | Booked: ${b.bookedOn}</p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 1.4rem; font-weight: 800; color: #fff; font-family: var(--font-mono);">₹${b.totalCost.toLocaleString()}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Paid via Acc ${b.paymentAccount}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; padding: 1rem 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); margin-bottom: 1.25rem;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">ROUTE</span>
          <div style="color: #fff; font-weight: 600;">${b.sourceName} → ${b.destName}</div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">FLIGHT DATE</span>
          <div style="color: #fff; font-weight: 600;">${b.flightDate}</div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">SEATS</span>
          <div style="color: var(--accent); font-weight: 700;">${(b.seats || []).join(', ')}</div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">PASSENGERS</span>
          <div style="color: #fff; font-weight: 600;">${b.noOfPeople} Pax</div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        ${!isCancelled && !isCheckedIn ? `
          <button class="btn btn-secondary" onclick="doWebCheckIn('${b.pnr}')">
            ✈️ Web Check-in
          </button>
        ` : ''}

        ${!isCancelled ? `
          <button class="btn btn-secondary" onclick="viewExistingBoardingPass('${b.pnr}')">
            🎫 View Boarding Pass
          </button>
          <button class="btn btn-danger" onclick="promptCancelBooking('${b.pnr}', '${b.totalCost}')">
            Cancel Ticket & Refund
          </button>
        ` : `
          <span style="color: var(--accent-danger); font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem;">
            Refund credited to Account ${b.paymentAccount}
          </span>
        `}
      </div>
    </div>
  `;
}

async function doWebCheckIn(pnr) {
  try {
    const res = await fetch('/api/bookings/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pnr })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      searchBooking();
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Failed to complete check-in', 'error');
  }
}

async function viewExistingBoardingPass(pnr) {
  try {
    const res = await fetch(`/api/bookings/lookup?query=${encodeURIComponent(pnr)}`);
    const data = await res.json();
    if (data.success) {
      switchNavTab('booking-tab');
      renderBoardingPasses(data.booking);
      goToStep(6);
    }
  } catch (err) {
    showToast('Error loading boarding pass', 'error');
  }
}

function promptCancelBooking(pnr, amount) {
  state.pendingCancelBooking = pnr;
  document.getElementById('cancelModalDetails').innerText = 
    `Are you sure you want to cancel ticket with PNR ${pnr}? ₹${parseInt(amount).toLocaleString()} will be automatically refunded back to your bank account immediately.`;
  openModal('cancelModal');
}

async function executeTicketCancellation() {
  const pnr = state.pendingCancelBooking;
  if (!pnr) return;

  const btn = document.getElementById('btnConfirmCancel');
  btn.innerHTML = 'Processing Refund...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/bookings/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pnr })
    });
    const data = await res.json();

    if (data.success) {
      closeModal('cancelModal');
      showToast(data.message, 'success');
      searchBooking();
      loadBankAccounts();
      loadTransactions();
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Failed to cancel ticket', 'error');
  } finally {
    btn.innerHTML = 'Yes, Cancel & Refund';
    btn.disabled = false;
  }
}

// ============================================================================
// TAB 3: BANK ACCOUNTS OVERVIEW
// ============================================================================

async function loadBankAccounts() {
  try {
    const res = await fetch('/api/bank/accounts');
    const data = await res.json();
    if (data.success) {
      state.accounts = data.accounts;
      renderBankAccountsTable(data.accounts);
    }
  } catch (err) {
    console.error('Failed to load accounts', err);
  }
}

function renderBankAccountsTable(accounts) {
  const tbody = document.getElementById('bankAccountsTableBody');
  if (!tbody) return;

  let html = '';
  accounts.forEach(a => {
    html += `
      <tr>
        <td><strong>${a.holderName}</strong></td>
        <td><code>${a.accountNumber}</code></td>
        <td>
          <span class="badge ${a.isMerchant ? 'badge-warning' : 'badge-info'}">
            ${a.isMerchant ? 'AIRLINE RECIPIENT' : 'PASSENGER'}
          </span>
        </td>
        <td><strong style="color: var(--accent); font-family: var(--font-mono);">₹${a.availableBalance.toLocaleString()}</strong></td>
        <td><code>${a.pinHint}</code></td>
        <td>
          ${!a.isMerchant ? `
            <button class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="useAccountForPayment('${a.accountNumber}')">
              Pay with This
            </button>
          ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Merchant Account</span>'}
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function useAccountForPayment(accNum) {
  switchNavTab('booking-tab');
  goToStep(5);
  autoFillAccount(accNum);
  const select = document.getElementById('payAccountSelect');
  if (select) select.value = accNum;
  showToast(`Account ${accNum} selected for payment checkout.`, 'info');
}

// ============================================================================
// TAB 4: AUDIT LEDGER / TRANSACTIONS
// ============================================================================

async function loadTransactions() {
  try {
    const res = await fetch('/api/bank/transactions');
    const data = await res.json();
    if (data.success) {
      renderTransactionsTable(data.transactions);
    }
  } catch (err) {
    console.error('Failed to load transactions', err);
  }
}

function renderTransactionsTable(transactions) {
  const tbody = document.getElementById('transactionsTableBody');
  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No transactions recorded yet.</td></tr>';
    return;
  }

  let html = '';
  transactions.forEach(t => {
    const isRefund = t.type === 'REFUND';
    html += `
      <tr>
        <td><code>${t.transactionId}</code></td>
        <td>${t.date}</td>
        <td>
          <span class="badge ${isRefund ? 'badge-success' : 'badge-info'}">
            ${t.type}
          </span>
        </td>
        <td><strong style="color: ${isRefund ? 'var(--accent-success)' : '#fff'}; font-family: var(--font-mono);">₹${t.amount.toLocaleString()}</strong></td>
        <td><code>${t.fromAccount}</code></td>
        <td><code>${t.toAccount}</code></td>
        <td><strong style="color: var(--accent);">${t.pnr || t.bookingId}</strong></td>
        <td>
          <span class="badge badge-success">${t.status}</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// ============================================================================
// AUTHENTICATION & MODALS
// ============================================================================

function updateAuthUI() {
  const authGuest = document.getElementById('authGuest');
  const authUser = document.getElementById('authUser');
  const userName = document.getElementById('userNameDisplay');
  const avatar = document.getElementById('avatarInitial');

  if (state.currentUser) {
    authGuest.style.display = 'none';
    authUser.style.display = 'flex';
    userName.innerText = `${state.currentUser.firstName} ${state.currentUser.lastName}`;
    avatar.innerText = state.currentUser.firstName.charAt(0).toUpperCase();
  } else {
    authGuest.style.display = 'flex';
    authUser.style.display = 'none';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      state.currentUser = data.user;
      updateAuthUI();
      closeModal('loginModal');
      showToast(`Welcome back, ${data.user.firstName}!`, 'success');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Login failed. Check server.', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName = document.getElementById('regLastName').value.trim();
  const userId = document.getElementById('regUserId').value.trim();
  const password = document.getElementById('regPassword').value;
  const contactNumber = document.getElementById('regContact').value.trim();
  const city = document.getElementById('regCity').value.trim();

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, userId, password, contactNumber, city })
    });
    const data = await res.json();

    if (data.success) {
      state.currentUser = data.user;
      updateAuthUI();
      closeModal('registerModal');
      showToast('Registration complete! Welcome aboard AeroSky.', 'success');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Registration request failed.', 'error');
  }
}

function logout() {
  state.currentUser = null;
  updateAuthUI();
  showToast('Logged out successfully.', 'info');
}

function showUserProfile() {
  if (state.currentUser) {
    showToast(`Signed in as ${state.currentUser.userId}`, 'info');
  }
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${icons[type] || '✈️'}</span>
    <span style="font-size: 0.9rem; line-height: 1.4;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
