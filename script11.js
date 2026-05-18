/* ============================================================
   DormDough — script11_beginner.js

   This file controls all pages:
     - Dashboard (index.html)
     - History   (history.html)
     - Add       (add.html)
     - Budget    (budget.html)
     - Report    (report.html)

   HOW DATA IS SAVED:
   We use localStorage — it's like a small notepad built into
   your browser. Data stays saved even after you close the tab.
   We store data as JSON strings and convert them back when needed.
   ============================================================ */


/* ─── STEP 1: DEFINE WHERE WE STORE DATA ─────────────────── */

// These are the "keys" (names) we use to store data in localStorage.
// Think of them like labels on different drawers in a filing cabinet.
var STORAGE_KEYS = {
  EXPENSES:    'dormdough_expenses',    // stores the list of all expenses
  BUDGET:      'dormdough_budget',      // stores the total monthly budget
  CAT_BUDGETS: 'dormdough_cat_budgets', // stores budgets for each category
};


/* ─── STEP 2: DEFINE EXPENSE CATEGORIES ──────────────────── */

// Each category has:
//   label  → display name shown in the UI
//   icon   → emoji shown next to it
//   color  → main color (used for text and bars)
//   bg     → light background version of the color (used for icons)
var CATEGORIES = {
  food: {
    label: 'Food',
    icon:  '🍱',
    color: '#00c896',
    bg:    'rgba(0,200,150,0.12)'
  },
  transport: {
    label: 'Transport',
    icon:  '🚌',
    color: '#4F8EF7',
    bg:    'rgba(79,142,247,0.12)'
  },
  academic: {
    label: 'Academic',
    icon:  '📚',
    color: '#F5A623',
    bg:    'rgba(245,166,35,0.12)'
  },
  misc: {
    label: 'Misc',
    icon:  '🛒',
    color: '#F26C4F',
    bg:    'rgba(242,108,79,0.12)'
  }
};


/* ─── STEP 3: SEED (PRE-FILL) DEMO DATA ──────────────────── */

// This runs once on first load to fill in some example expenses.
// It checks: "Do we already have expenses saved?" → if yes, skip.
function seedData() {
  // getExpenses() returns the saved list. If it already has items, stop here.
  if (getExpenses().length > 0) {
    return;
  }

  // Get today's date
  var today = new Date();

  // Create dates for the past few days by subtracting days from today
  var yesterday  = new Date(today); yesterday.setDate(today.getDate() - 1);
  var twoDays    = new Date(today); twoDays.setDate(today.getDate() - 2);
  var threeDays  = new Date(today); threeDays.setDate(today.getDate() - 3);
  var fourDays   = new Date(today); fourDays.setDate(today.getDate() - 4);

  // Helper: converts a Date object to "YYYY-MM-DD" string format
  // Example: new Date() → "2025-05-04"
  function formatDate(dateObject) {
    return dateObject.toISOString().split('T')[0];
  }

  // List of example expenses to pre-load
  var sampleExpenses = [
    { id: uid(), name: 'Chai + snack',    category: 'food',      amount: 35,  date: formatDate(today),     time: '16:30' },
    { id: uid(), name: 'Auto rickshaw',   category: 'transport', amount: 60,  date: formatDate(today),     time: '09:10' },
    { id: uid(), name: 'Photocopy notes', category: 'academic',  amount: 18,  date: formatDate(yesterday), time: '14:15' },
    { id: uid(), name: 'Mess dinner',     category: 'food',      amount: 95,  date: formatDate(yesterday), time: '20:00' },
    { id: uid(), name: 'Tiffin lunch',    category: 'food',      amount: 80,  date: formatDate(twoDays),   time: '13:00' },
    { id: uid(), name: 'Bus pass top-up', category: 'transport', amount: 200, date: formatDate(twoDays),   time: '10:30' },
    { id: uid(), name: 'Stationery',      category: 'academic',  amount: 120, date: formatDate(threeDays), time: '11:00' },
    { id: uid(), name: 'Laundry',         category: 'misc',      amount: 50,  date: formatDate(threeDays), time: '15:45' },
    { id: uid(), name: 'Samosa + coffee', category: 'food',      amount: 45,  date: formatDate(fourDays),  time: '17:00' },
    { id: uid(), name: 'Photocopy',       category: 'academic',  amount: 22,  date: formatDate(fourDays),  time: '12:00' },
    { id: uid(), name: 'Auto to college', category: 'transport', amount: 80,  date: formatDate(fourDays),  time: '08:30' },
    { id: uid(), name: 'Breakfast',       category: 'food',      amount: 60,  date: formatDate(fourDays),  time: '07:30' },
    // Older entries (7–18 days ago) for history and report data
    { id: uid(), name: 'Mess lunch',      category: 'food',      amount: 85,  date: dateFromDaysAgo(7),    time: '13:00' },
    { id: uid(), name: 'Rickshaw',        category: 'transport', amount: 40,  date: dateFromDaysAgo(7),    time: '09:00' },
    { id: uid(), name: 'Lab manual',      category: 'academic',  amount: 180, date: dateFromDaysAgo(8),    time: '10:00' },
    { id: uid(), name: 'Snacks',          category: 'food',      amount: 55,  date: dateFromDaysAgo(9),    time: '16:00' },
    { id: uid(), name: 'Mobile recharge', category: 'misc',      amount: 99,  date: dateFromDaysAgo(10),   time: '11:00' },
    { id: uid(), name: 'Dinner out',      category: 'food',      amount: 220, date: dateFromDaysAgo(10),   time: '20:00' },
    { id: uid(), name: 'Auto',            category: 'transport', amount: 60,  date: dateFromDaysAgo(11),   time: '09:00' },
    { id: uid(), name: 'Notebook',        category: 'academic',  amount: 90,  date: dateFromDaysAgo(12),   time: '10:30' },
    { id: uid(), name: 'Breakfast',       category: 'food',      amount: 50,  date: dateFromDaysAgo(13),   time: '08:00' },
    { id: uid(), name: 'Xerox',           category: 'academic',  amount: 30,  date: dateFromDaysAgo(14),   time: '14:00' },
    { id: uid(), name: 'Bus',             category: 'transport', amount: 30,  date: dateFromDaysAgo(14),   time: '08:30' },
    { id: uid(), name: 'Misc supplies',   category: 'misc',      amount: 75,  date: dateFromDaysAgo(15),   time: '15:00' },
    { id: uid(), name: 'Mess food',       category: 'food',      amount: 110, date: dateFromDaysAgo(15),   time: '12:30' },
    { id: uid(), name: 'Auto ride',       category: 'transport', amount: 50,  date: dateFromDaysAgo(16),   time: '10:00' },
    { id: uid(), name: 'Canteen',         category: 'food',      amount: 65,  date: dateFromDaysAgo(17),   time: '13:00' },
    { id: uid(), name: 'Stationery pack', category: 'academic',  amount: 45,  date: dateFromDaysAgo(18),   time: '11:00' },
  ];

  // Save the sample expenses, a default budget, and default category budgets
  localStorage.setItem(STORAGE_KEYS.EXPENSES,    JSON.stringify(sampleExpenses));
  localStorage.setItem(STORAGE_KEYS.BUDGET,      '6000');
  localStorage.setItem(STORAGE_KEYS.CAT_BUDGETS, JSON.stringify({
    food: 2000, transport: 800, academic: 1500, misc: 700
  }));
}

// Returns a "YYYY-MM-DD" date string for N days ago
// Example: dateFromDaysAgo(3) → date 3 days before today
function dateFromDaysAgo(days) {
  var d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}


/* ─── STEP 4: HELPER / UTILITY FUNCTIONS ─────────────────── */

// Generates a random unique ID for each expense
// Example result: "_k3f2a9bc"
function uid() {
  return '_' + Math.random().toString(36).slice(2, 10);
}

// --- localStorage read/write helpers ---
// These 4 pairs of functions handle reading and saving each type of data.

function getExpenses() {
  // Read the stored expenses string, parse it into an array.
  // If nothing is saved yet, use an empty array '[]' as fallback.
  var stored = localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]';
  return JSON.parse(stored);
}

function saveExpenses(expensesArray) {
  // Convert the array to a string and save it
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expensesArray));
}

function getBudget() {
  // Read budget as a number. Default to 6000 if not set.
  var stored = localStorage.getItem(STORAGE_KEYS.BUDGET) || '6000';
  return parseFloat(stored);
}

function saveBudget(value) {
  localStorage.setItem(STORAGE_KEYS.BUDGET, String(value));
}

function getCatBudgets() {
  // Read category budgets. Default values used if not set yet.
  var defaultValue = '{"food":2000,"transport":800,"academic":1500,"misc":700}';
  var stored = localStorage.getItem(STORAGE_KEYS.CAT_BUDGETS) || defaultValue;
  return JSON.parse(stored);
}

function saveCatBudgets(budgetsObject) {
  localStorage.setItem(STORAGE_KEYS.CAT_BUDGETS, JSON.stringify(budgetsObject));
}

// Returns only the expenses from the current month and year
function currentMonthExpenses() {
  var now = new Date();
  var allExpenses = getExpenses();

  // filter() keeps only items where the function returns true
  var thisMonthOnly = allExpenses.filter(function(expense) {
    var expenseDate = new Date(expense.date);
    var sameMonth = expenseDate.getMonth() === now.getMonth();
    var sameYear  = expenseDate.getFullYear() === now.getFullYear();
    return sameMonth && sameYear;
  });

  return thisMonthOnly;
}

// Adds up spending totals per category from a list of expenses
// Returns an object like: { food: 350, transport: 120, academic: 80, misc: 50 }
function totalsBy(expenses) {
  var totals = { food: 0, transport: 0, academic: 0, misc: 0 };

  expenses.forEach(function(expense) {
    // Only add if the category exists in our totals object
    if (totals[expense.category] !== undefined) {
      totals[expense.category] += expense.amount;
    }
  });

  return totals;
}

// Formats a number as Indian Rupees
// Example: fmt(1500) → "₹1,500"
function fmt(number) {
  return '₹' + number.toLocaleString('en-IN');
}

// Shortcut for document.querySelector — selects the first matching element
// Example: qs('.hero-amount') is the same as document.querySelector('.hero-amount')
function qs(selector) {
  return document.querySelector(selector);
}

// Shortcut for document.querySelectorAll — selects ALL matching elements
function qsa(selector) {
  return document.querySelectorAll(selector);
}

// Safely escapes text so it can't accidentally run as HTML
// Protects against XSS (a security issue where user text could inject code)
function esc(text) {
  var tempDiv = document.createElement('div');
  tempDiv.textContent = text;  // textContent treats it as plain text
  return tempDiv.innerHTML;    // innerHTML then gives the safe version
}

// Converts "HH:MM" (24-hour) time to "H:MM am/pm" format
// Example: fmtTime("14:30") → "2:30 pm"
function fmtTime(timeStr) {
  if (!timeStr) return '';

  var parts = timeStr.split(':');
  var hours   = Number(parts[0]);
  var minutes = Number(parts[1]);

  var ampm = hours >= 12 ? 'pm' : 'am';
  var hour12 = hours % 12 || 12; // converts 0 → 12, 13 → 1, etc.

  // padStart(2, '0') ensures minutes are always 2 digits: "5" → "05"
  return hour12 + ':' + String(minutes).padStart(2, '0') + ' ' + ampm;
}

// Returns a human-friendly label for a date string
// Example: today → "Today", yesterday → "Yesterday", older → "3 May"
function relativeDate(dateStr) {
  var today     = new Date().toISOString().split('T')[0];
  var yesterday = dateFromDaysAgo(1);

  if (dateStr === today)     return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  // Otherwise return a short date like "3 May"
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short'
  });
}

// Returns a formatted date label with extra detail for Today/Yesterday
// Example: "Today — 4 May" or just "3 May"
function formatDateLabel(dateStr) {
  var label    = relativeDate(dateStr);
  var dateObj  = new Date(dateStr);
  var dayMonth = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  if (label === 'Today' || label === 'Yesterday') {
    return label + ' — ' + dayMonth;
  }
  return dayMonth;
}

// Shows a small popup message at the bottom of the screen
// Disappears after about 2 seconds
function showToast(message, color) {
  // Default color if none provided
  if (!color) {
    color = '#F5A623';
  }

  // Check if a toast element already exists; if not, create one
  var toast = document.getElementById('dd-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dd-toast';

    // Style it as a small floating pill at the bottom of the screen
    toast.style.cssText = [
      'position: fixed',
      'bottom: 110px',
      'left: 50%',
      'transform: translateX(-50%)',
      'color: #0f1323',
      'font-weight: 700',
      'font-size: 13px',
      'padding: 10px 22px',
      'border-radius: 50px',
      'z-index: 9999',
      'transition: opacity 0.4s',
      'pointer-events: none',
      'white-space: nowrap',
      'box-shadow: 0 4px 20px rgba(0,0,0,0.4)',
      "font-family: 'Syne', sans-serif"
    ].join(';');

    document.body.appendChild(toast);
  }

  // Update and show the toast
  toast.style.background = color;
  toast.textContent      = message;
  toast.style.opacity    = '1';

  // Cancel any previous hide timer, then set a new one to hide after 2.2s
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.style.opacity = '0';
  }, 2200);
}


/* ─── STEP 5: FIGURE OUT WHICH PAGE WE'RE ON ─────────────── */

// location.pathname gives the URL path, e.g. "/pages/history.html"
// We take the last part after the final "/" to get just the filename
var currentFilename = location.pathname.split('/').pop() || 'index.html';

var page; // will be set to one of: 'dashboard', 'history', 'add', 'budget', 'report'

if (currentFilename === '' || currentFilename === 'index.html') {
  page = 'dashboard';
} else if (currentFilename === 'history.html') {
  page = 'history';
} else if (currentFilename === 'add.html') {
  page = 'add';
} else if (currentFilename === 'budget.html') {
  page = 'budget';
} else if (currentFilename === 'report.html') {
  page = 'report';
} else {
  page = 'dashboard'; // fallback
}


/* ─── STEP 6: START THE APP WHEN THE PAGE LOADS ──────────── */

// DOMContentLoaded fires when the HTML is fully loaded and ready.
// We wait for this before touching any HTML elements.
document.addEventListener('DOMContentLoaded', function() {
  seedData(); // Fill in demo data if this is the first visit

  // Run the correct setup function based on the current page
  if (page === 'dashboard') initDashboard();
  if (page === 'history')   initHistory();
  if (page === 'add')       initAdd();
  if (page === 'budget')    initBudget();
  if (page === 'report')    initReport();
});


/* ═══════════════════════════════════════════════════════════
   DASHBOARD PAGE  (index.html)
   Shows total spending, category breakdown, bar chart,
   and the 5 most recent transactions.
═══════════════════════════════════════════════════════════ */

function initDashboard() {
  var expenses  = currentMonthExpenses();
  var totals    = totalsBy(expenses);
  var budget    = getBudget();

  // Add up all category totals to get the overall total spent
  var total     = totals.food + totals.transport + totals.academic + totals.misc;
  var remaining = Math.max(0, budget - total); // can't go below 0

  // Calculate what % of budget has been used (max 100%)
  var pct = Math.min(100, Math.round((total / budget) * 100));

  // --- Update the hero section at the top ---
  qs('.hero-amount').textContent       = fmt(total);
  qs('.hero-sub').textContent          = fmt(remaining) + ' remaining · ' + fmt(budget) + ' budget';
  qs('.hero-bar-fill').style.width     = pct + '%';
  qs('.hero-pct').textContent          = pct + '% of budget used';

  // --- Update the 4 budget pills (one per category) ---
  var pills   = qsa('.b-pill');
  var catKeys = ['food', 'transport', 'academic', 'misc'];

  pills.forEach(function(pill, index) {
    var key = catKeys[index];
    if (!key) return;
    pill.querySelector('.b-pill-val').textContent = fmt(totals[key]);
  });

  // --- Update the category cards (with mini progress bars) ---
  var catBudgets = getCatBudgets();

  catKeys.forEach(function(key) {
    // Map category key to the CSS class name used in HTML
    var cssClass;
    if (key === 'transport') {
      cssClass = 'trans';
    } else if (key === 'academic') {
      cssClass = 'acad';
    } else {
      cssClass = key; // 'food' and 'misc' match directly
    }

    var card = qs('.cat-card.cat-' + cssClass);
    if (!card) return;

    card.querySelector('.cat-amt').textContent = fmt(totals[key]);

    var catBudgetLimit = catBudgets[key] || budget / 4; // fallback: divide total budget by 4
    var catPct = Math.min(100, Math.round((totals[key] / catBudgetLimit) * 100));
    card.querySelector('.mini-fill').style.width = catPct + '%';
  });

  // --- Build the 7-day bar chart and recent transactions list ---
  buildDailyChart(expenses);
  buildRecentTxns(expenses);
}

// Draws a bar chart showing spending for the last 7 days
function buildDailyChart(expenses) {
  var chart = qs('.bar-chart');
  if (!chart) return;

  chart.innerHTML = ''; // clear any old bars

  var numberOfDays = 7;
  var columns = []; // will hold { dayName, amount, dateKey } for each day
  var maxAmount = 0; // we'll use this to scale bar heights

  // Loop from 6 days ago up to today (i = 6, 5, 4, ... 0)
  for (var i = numberOfDays - 1; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);

    var dateKey = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
    var dayName = d.toLocaleDateString('en-IN', { weekday: 'short' }); // "Mon", "Tue", etc.

    // Get all expenses on this specific day and sum them
    var dayExpenses = expenses.filter(function(expense) {
      return expense.date === dateKey;
    });
    var dayTotal = dayExpenses.reduce(function(sum, expense) {
      return sum + expense.amount;
    }, 0);

    if (dayTotal > maxAmount) maxAmount = dayTotal;

    columns.push({ dayName: dayName, amount: dayTotal, dateKey: dateKey });
  }

  // Colors to cycle through for each bar
  var barColors = ['#00c896', '#4F8EF7', '#F5A623', '#F26C4F', '#9b59b6', '#e74c3c', '#1abc9c'];

  // Create and append each bar column
  columns.forEach(function(col, index) {
    // Height is a % of the tallest bar. Min 4% so flat days still show.
    var heightPct = maxAmount > 0
      ? Math.max(4, Math.round((col.amount / maxAmount) * 100))
      : 4;

    var color = barColors[index % barColors.length];

    var barColumn = document.createElement('div');
    barColumn.className = 'bar-col';
    barColumn.innerHTML =
      '<div class="bar-wrap">' +
        '<div class="bar" style="height:' + heightPct + '%;background-color:' + color + ';" title="' + fmt(col.amount) + '"></div>' +
      '</div>' +
      '<div class="bar-day">' + col.dayName + '</div>';

    chart.appendChild(barColumn);
  });
}

// Builds the list of the 5 most recent transactions on the dashboard
function buildRecentTxns(expenses) {
  var list = qs('.txn-list');
  if (!list) return;

  list.innerHTML = ''; // clear existing items

  // Sort all expenses by date+time (newest first), then keep only the top 5
  var sorted = expenses.slice().sort(function(a, b) {
    return (b.date + b.time).localeCompare(a.date + a.time);
  });
  var recent = sorted.slice(0, 5);

  if (recent.length === 0) {
    list.innerHTML = '<div style="padding:20px;color:#aaa;text-align:center;font-size:13px">No transactions yet</div>';
    return;
  }

  recent.forEach(function(expense) {
    // Get category info, fall back to 'misc' if unknown
    var cat   = CATEGORIES[expense.category] || CATEGORIES.misc;
    var label = relativeDate(expense.date);
    if (expense.time) {
      label += ', ' + fmtTime(expense.time);
    }

    var item = document.createElement('div');
    item.className = 'txn-item';
    item.innerHTML =
      '<div class="txn-dot" style="background:' + cat.bg + '">' + cat.icon + '</div>' +
      '<div class="txn-info">' +
        '<div class="txn-name">' + esc(expense.name) + '</div>' +
        '<div class="txn-time">' + label + '</div>' +
      '</div>' +
      '<div class="txn-amt" style="color:' + cat.color + '">' + fmt(expense.amount) + '</div>';

    list.appendChild(item);
  });
}


/* ═══════════════════════════════════════════════════════════
   HISTORY PAGE  (history.html)
   Shows all expenses grouped by date, with delete buttons.
═══════════════════════════════════════════════════════════ */

function initHistory() {
  // Get all expenses, sorted newest first
  var allExpenses = getExpenses().sort(function(a, b) {
    return (b.date + b.time).localeCompare(a.date + a.time);
  });

  // Show total count in the header
  var headerRight = qs('.header-right');
  if (headerRight) {
    headerRight.textContent = allExpenses.length + ' transactions';
  }

  // Group expenses by date into an object
  // Example: { "2025-05-04": [expense1, expense2], "2025-05-03": [expense3] }
  var groups = {};
  allExpenses.forEach(function(expense) {
    if (!groups[expense.date]) {
      groups[expense.date] = []; // create an empty array for this date
    }
    groups[expense.date].push(expense);
  });

  // Get the page container and remove any old date groups
  var screen = qs('.screen');
  qsa('.date-group, .txn-list').forEach(function(el) {
    el.remove();
  });

  // If there are no expenses at all, show an empty message
  if (allExpenses.length === 0) {
    var emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'padding:40px;text-align:center;color:#aaa;font-size:14px';
    emptyMsg.textContent = 'No transactions yet. Add your first expense!';
    screen.appendChild(emptyMsg);
    return;
  }

  // Get all date keys and sort them newest first
  var sortedDates = Object.keys(groups).sort(function(a, b) {
    return b.localeCompare(a); // reverse alphabetical = newest first
  });

  // For each date, create a section with a label and its transactions
  sortedDates.forEach(function(dateKey) {
    // Create the date label (e.g. "Today — 4 May")
    var dateGroup = document.createElement('div');
    dateGroup.className = 'date-group';
    dateGroup.innerHTML = '<div class="date-lbl">' + formatDateLabel(dateKey) + '</div>';
    screen.appendChild(dateGroup);

    // Create the list of transactions for this date
    var list = document.createElement('div');
    list.className = 'txn-list';

    groups[dateKey].forEach(function(expense) {
      var cat  = CATEGORIES[expense.category] || CATEGORIES.misc;
      var item = document.createElement('div');
      item.className     = 'txn-item';
      item.style.cursor  = 'pointer';
      item.dataset.id    = expense.id;

      item.innerHTML =
        '<div class="txn-dot" style="background:' + cat.bg + '">' + cat.icon + '</div>' +
        '<div class="txn-info">' +
          '<div class="txn-name">' + esc(expense.name) + '</div>' +
          '<div class="txn-time">' + fmtTime(expense.time) + ' · ' + cat.label + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<div class="txn-amt" style="color:' + cat.color + '">' + fmt(expense.amount) + '</div>' +
          '<button onclick="deleteExpense(\'' + expense.id + '\',this)" ' +
            'style="background:rgba(255,80,80,0.15);border:none;border-radius:6px;padding:4px 8px;color:#ff5050;cursor:pointer;font-size:12px">✕</button>' +
        '</div>';

      list.appendChild(item);
    });

    screen.appendChild(list);
  });
}

// Deletes an expense by its ID after asking for confirmation
function deleteExpense(id, btn) {
  if (!confirm('Delete this expense?')) return;

  // Filter out the expense with this ID
  var remaining = getExpenses().filter(function(expense) {
    return expense.id !== id;
  });

  saveExpenses(remaining);
  initHistory(); // Re-render the history page
}

// Make deleteExpense available globally so the inline onclick= in HTML can find it
window.deleteExpense = deleteExpense;


/* ═══════════════════════════════════════════════════════════
   ADD EXPENSE PAGE  (add.html)
   Lets the user type in a new expense and save it.
═══════════════════════════════════════════════════════════ */

function initAdd() {
  var selectedCategory = 'food'; // default selected category

  // Set today's date as the default value for the date input
  var dateInput = qs('input[type="date"]');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // --- Set up category pill buttons ---
  var pills = qsa('.cat-pill');

  pills.forEach(function(pill) {
    // Figure out which category this pill is for based on its text
    var pillText = pill.textContent.trim().toLowerCase();
    var cat = 'misc'; // default

    if (pillText.includes('food'))      cat = 'food';
    if (pillText.includes('transport')) cat = 'transport';
    if (pillText.includes('academic'))  cat = 'academic';

    pill.dataset.cat = cat; // store the category on the element

    // Highlight the default category pill on load
    if (cat === selectedCategory) {
      activatePill(pill);
    }

    // When a pill is clicked: update the selection
    pill.addEventListener('click', function() {
      selectedCategory = cat;

      // Remove highlight from all pills, then add it to the clicked one
      pills.forEach(function(p) { deactivatePill(p); });
      activatePill(pill);
    });
  });

  // --- Amount input: only allow numbers and decimals ---
  var amountInput = qs('.amount-big');
  if (amountInput) {
    amountInput.setAttribute('type', 'text');
    amountInput.setAttribute('inputmode', 'decimal'); // shows number keyboard on mobile

    amountInput.addEventListener('input', function() {
      // Remove any character that isn't a digit or a dot
      amountInput.value = amountInput.value.replace(/[^0-9.]/g, '');
    });
  }

  // --- Save button ---
  var saveBtn = qs('.save-btn');
  if (saveBtn) {
    // If the button is inside an <a> tag, prevent the link from navigating away
    var parentLink = saveBtn.closest('a');
    if (parentLink) {
      parentLink.addEventListener('click', function(event) {
        event.preventDefault();
      });
    }

    saveBtn.addEventListener('click', function(event) {
      event.preventDefault();

      // Read the amount value
      var amount = amountInput ? parseFloat(amountInput.value) : 0;

      // Read the description (name) value
      var nameInput = qs('.field input[type="text"]');
      var name = nameInput ? nameInput.value.trim() : '';

      // Read the selected date
      var date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

      // Validate: amount must be a positive number
      if (!amount || amount <= 0) {
        showToast('Please enter a valid amount ₹');
        return;
      }

      // Validate: description can't be empty
      if (!name) {
        showToast('Please describe what you spent on');
        return;
      }

      // Build the new expense object
      var now = new Date();
      var newExpense = {
        id:       uid(),
        name:     name,
        category: selectedCategory,
        amount:   amount,
        date:     date || now.toISOString().split('T')[0],
        time:     now.toTimeString().slice(0, 5), // e.g. "14:35"
      };

      // Add to the saved list
      var expenses = getExpenses();
      expenses.push(newExpense);
      saveExpenses(expenses);

      // Show success and redirect to dashboard after a short delay
      showToast('Expense saved! 💸', '#00c896');
      setTimeout(function() {
        location.href = 'index.html';
      }, 800);
    });
  }
}

// Highlights a category pill with its category color
function activatePill(pill) {
  var cat   = pill.dataset.cat || 'misc';
  var color = CATEGORIES[cat] ? CATEGORIES[cat].color : '#00c896';
  pill.style.background = color;
  pill.style.color      = '#0f1323';
}

// Resets a category pill to the default (unselected) look
function deactivatePill(pill) {
  pill.style.background = '#1E2235';
  pill.style.color      = 'white';
}


/* ═══════════════════════════════════════════════════════════
   BUDGET PAGE  (budget.html)
   Lets the user set a total monthly budget and per-category limits.
═══════════════════════════════════════════════════════════ */

function initBudget() {
  var expenses   = currentMonthExpenses();
  var totals     = totalsBy(expenses);
  var budget     = getBudget();
  var catBudgets = getCatBudgets();

  // Total amount spent this month
  var total     = totals.food + totals.transport + totals.academic + totals.misc;
  var remaining = Math.max(0, budget - total);

  // --- Fill in the main budget input ---
  var mainInput = qs('.budget-input');
  if (mainInput) {
    mainInput.value = budget;
  }

  // --- Show status: over budget or under budget ---
  var infoEl = qs('.budget-info');
  if (infoEl) {
    if (total > budget) {
      infoEl.style.color = '#ff5050';
      infoEl.innerHTML   = '⚠️ Over budget by <strong>' + fmt(total - budget) + '</strong> — spent ' + fmt(total) + ' of ' + fmt(budget) + ' budget';
    } else {
      infoEl.style.color = '#00c896';
      infoEl.innerHTML   = '✅ You have <strong>' + fmt(remaining) + ' left</strong> this month — ' + fmt(total) + ' spent of ' + fmt(budget) + ' budget';
    }
  }

  // --- Save button for main budget ---
  var saveBtn = qs('.budget-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      var val = parseFloat(mainInput ? mainInput.value : 0);
      if (!val || val <= 0) {
        showToast('Enter a valid budget');
        return;
      }
      saveBudget(val);
      showToast('Budget updated! 🎯', '#00c896');
      initBudget(); // re-render the page with new values
    });
  }

  // --- Build category budget cards ---
  var catList = qs('.cat-budget-list');
  if (catList) {
    catList.innerHTML = ''; // clear existing cards

    Object.keys(CATEGORIES).forEach(function(key) {
      var cat      = CATEGORIES[key];
      var spent    = totals[key] || 0;
      var limit    = catBudgets[key] || 0;
      var overCat  = spent > limit && limit > 0; // true if over the category limit

      var card = document.createElement('div');
      card.className = 'cat-bud-card';

      card.innerHTML =
        '<div class="cat-bud-icon" style="background:' + cat.bg + '">' + cat.icon + '</div>' +
        '<div class="cat-bud-info">' +
          '<div class="cat-bud-name">' + cat.label + '</div>' +
          '<div class="cat-bud-spent" style="font-size:12px;color:' + (overCat ? '#ff5050' : '#aaa') + ';margin-top:2px">' +
            fmt(spent) + ' spent' + (overCat ? ' ⚠️' : '') +
          '</div>' +
        '</div>' +
        '<div class="cat-bud-input-wrap">' +
          '<span class="cat-bud-prefix">₹</span>' +
          '<input class="cat-bud-input" type="number" value="' + limit + '" inputmode="numeric" data-cat="' + key + '"/>' +
        '</div>';

      catList.appendChild(card);
    });

    // When any category input changes, save the new limit automatically
    catList.addEventListener('change', function(event) {
      // Only respond if the changed element is a category input
      if (!event.target.matches('.cat-bud-input')) return;

      var changedCat = event.target.dataset.cat;
      var newValue   = parseFloat(event.target.value || 0);

      var currentBudgets   = getCatBudgets();
      currentBudgets[changedCat] = newValue;
      saveCatBudgets(currentBudgets);

      showToast(CATEGORIES[changedCat].label + ' budget updated', '#00c896');
      initBudget(); // re-render
    });
  }
}


/* ═══════════════════════════════════════════════════════════
   REPORT PAGE  (report.html)
   Shows a monthly summary with charts and a share button.
═══════════════════════════════════════════════════════════ */

function initReport() {
  var expenses = currentMonthExpenses();
  var totals   = totalsBy(expenses);
  var budget   = getBudget();
  var total    = totals.food + totals.transport + totals.academic + totals.misc;
  var saved    = Math.max(0, budget - total);

  // --- Show total spent ---
  var totalEl = qs('.report-total');
  if (totalEl) {
    totalEl.textContent = fmt(total) + ' spent';
  }

  // --- Show saved or over-budget message ---
  var savedEl = qs('.report-saved');
  if (savedEl) {
    if (total > budget) {
      savedEl.style.color = '#ff5050';
      savedEl.textContent = '⚠️ Over budget by ' + fmt(total - budget) + ' from ' + fmt(budget) + ' budget';
    } else {
      savedEl.textContent = '💰 Saved ' + fmt(saved) + ' from ' + fmt(budget) + ' budget';
    }
  }

  // --- Build horizontal bar chart (one row per category) ---
  var hbarChart = qs('.hbar-chart');
  if (hbarChart) {
    hbarChart.innerHTML = '';

    // Find the highest-spending category to scale bars against
    var allCatValues = Object.keys(CATEGORIES).map(function(key) { return totals[key] || 0; });
    var maxCatAmount = Math.max.apply(null, allCatValues.concat([1])); // at least 1 to avoid ÷0

    Object.keys(CATEGORIES).forEach(function(key) {
      var cat    = CATEGORIES[key];
      var amount = totals[key] || 0;
      var pct    = Math.round((amount / maxCatAmount) * 100);

      var row = document.createElement('div');
      row.className = 'hbar-row';
      row.innerHTML =
        '<div class="hbar-head">' +
          '<div class="hbar-label">' + cat.icon + ' ' + cat.label + '</div>' +
          '<div class="hbar-val" style="color:' + cat.color + '">' + fmt(amount) + '</div>' +
        '</div>' +
        '<div class="hbar-bg">' +
          '<div class="hbar-fill" style="width:' + pct + '%;background-color:' + cat.color + ';transition:width 0.6s ease"></div>' +
        '</div>';

      hbarChart.appendChild(row);
    });
  }

  // --- Build breakdown list (sorted by most spent first) ---
  var breakdown = qs('.breakdown-card');
  if (breakdown) {
    breakdown.innerHTML = '';
    var totalForPct = total || 1; // avoid dividing by zero

    // Sort category keys from highest spend to lowest
    var sortedKeys = Object.keys(CATEGORIES).sort(function(a, b) {
      return (totals[b] || 0) - (totals[a] || 0);
    });

    sortedKeys.forEach(function(key) {
      var cat    = CATEGORIES[key];
      var amount = totals[key] || 0;
      var pct    = Math.round((amount / totalForPct) * 100);

      var row = document.createElement('div');
      row.className = 'bk-row';
      row.innerHTML =
        '<div class="bk-dot" style="background-color:' + cat.color + '"></div>' +
        '<div class="bk-name">' + cat.icon + ' ' + cat.label + '</div>' +
        '<div class="bk-amt">' + fmt(amount) + '</div>' +
        '<div class="bk-pct">' + pct + '%</div>';

      breakdown.appendChild(row);
    });
  }

  // --- Share / Copy report button ---
  var shareBtn = qs('.share-btn');
  if (shareBtn) {
    shareBtn.onclick = function(event) {
      event.preventDefault();

      // Build the report as plain text lines
      var monthLabel = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
      var lines = [
        'DormDough Monthly Report',
        'Month: ' + monthLabel,
        'Total Spent: ' + fmt(total),
        'Budget: ' + fmt(budget),
        total <= budget
          ? 'Saved: ' + fmt(saved) + ' 💰'
          : 'Over by: ' + fmt(total - budget) + ' ⚠️',
        '',
      ];

      // Add one line per category
      Object.keys(CATEGORIES).forEach(function(key) {
        lines.push(CATEGORIES[key].icon + ' ' + CATEGORIES[key].label + ': ' + fmt(totals[key] || 0));
      });

      lines.push('');
      lines.push('Sent via DormDough 🎓');

      var reportText = lines.join('\n');

      // Use the native Share API if available (mobile), else copy to clipboard
      if (navigator.share) {
        navigator.share({ title: 'DormDough Report', text: reportText });
      } else {
        navigator.clipboard.writeText(reportText).then(function() {
          showToast('Report copied to clipboard! 📋', '#00c896');
        });
      }
    };
  }
}