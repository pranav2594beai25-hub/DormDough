
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// ADD PAGE.............
if (window.location.pathname.includes("add.html")) {

    const amountInput = document.querySelector(".amount-big");
    const noteInput = document.querySelector('input[type="text"]');
    const dateInput = document.querySelector('input[type="date"]');
    const categoryPills = document.querySelectorAll(".cat-pill");
    const saveBtn = document.querySelector(".save-btn");

    let selectedCategory = "";

    // category select 
    categoryPills.forEach(pill => {
        pill.addEventListener("click", () => {

            categoryPills.forEach(p =>{ 
                p.classList.remove("active");
                p.style.backgroundColor='';
                p.style.color='';
            });

            pill.classList.add("active");
            pill.style.backgroundColor='#00c896';
            pill.style.color='black'
            
            selectedCategory = pill.innerText.trim();
        });
    });

    // save expense
    saveBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const amount = Number(amountInput.value);
        const note = noteInput.value;
        const date = dateInput.value;

        if (!amount || !note || !date || !selectedCategory) {
            alert("Please fill all fields");
            return;
        }

        const expense = {
            amount,
            note,
            date,
            category: selectedCategory
        };

        expenses.push(expense);

        localStorage.setItem("expenses", JSON.stringify(expenses));

        alert("Expense Added Successfully!");

    location.href = "index.html";
    });
}

//DASHBOARD PAGE.......
if (window.location.pathname.includes("index.html")) {

    const totalElement = document.querySelector(".hero-amount");

    let totalSpent = 0;

    let food = 0;
    let transport = 0;
    let academic = 0;
    let misc = 0;

    expenses.forEach(exp => {

        totalSpent += exp.amount;

        if (exp.category.includes("Food")) {
            food += exp.amount;
        }

        else if (exp.category.includes("Transport")) {
            transport += exp.amount;
        }

        else if (exp.category.includes("Academic")) {
            academic += exp.amount;
        }

        else if (exp.category.includes("Misc")) {
            misc += exp.amount;
        }

    });
totalElement.innerText = `₹${totalSpent}`;


//budget calculation on the dashboard page
const totalBudget =Number(localStorage.getItem("budget")) || 600;

const remaining = totalBudget - totalSpent;

let percentageUsed;
if(remaining<=0){
    percentageUsed=100
}else{
    percentageUsed = Math.round((totalSpent / totalBudget) * 100);
}


// remaining text
const heroSub = document.querySelector(".hero-sub");
heroSub.innerText =`₹${remaining} remaining · ₹${totalBudget} budget`;

// progress bar
const heroBar = document.querySelector(".hero-bar-fill");
heroBar.style.width = `${percentageUsed}%`

// percentage text
const heroPct = document.querySelector(".hero-pct");

heroPct.innerText =`${percentageUsed}% of budget used`;


    // top pills
    const pillValues = document.querySelectorAll(".b-pill-val");

    pillValues[0].innerText = `₹${food}`;
    pillValues[1].innerText = `₹${transport}`;
    pillValues[2].innerText = `₹${academic}`;
    pillValues[3].innerText = `₹${misc}`;


    //by category 
    const categoryAmounts = document.querySelectorAll(".cat-amt");

    categoryAmounts[0].innerText = `₹${food}`;
    categoryAmounts[1].innerText = `₹${transport}`;
    categoryAmounts[2].innerText = `₹${academic}`;
    categoryAmounts[3].innerText = `₹${misc}`;

    // recent transactions
    const txnList = document.querySelector(".txn-list");

    txnList.innerHTML = "";

    expenses.slice().reverse().forEach(exp => {

        txnList.innerHTML += `
        <div class="txn-item">
            <div class="txn-dot">${getEmoji(exp.category)}</div>

            <div class="txn-info">
                <div class="txn-name">${exp.note}</div>
                <div class="txn-time">${exp.date}</div>
            </div>

            <div class="txn-amt">₹${exp.amount}</div>
        </div>

        `;
    });

}
function getEmoji(category) {

    if (category.includes("Food")) {
        return "🍱";
    }

    if (category.includes("Transport")) {
        return "🚌";
    }

    if (category.includes("Academic")) {
        return "📚";
    }

    return "🛒";
}

//HISTORY PAGE..........
if (window.location.pathname.includes("history.html")) {

    const txnList = document.querySelector(".txn-list");

    const transactionCount =document.querySelector(".header-right");

    txnList.innerHTML = "";

    // total transactions
    transactionCount.innerText =`${expenses.length} transactions`;


    // newest first
    expenses.slice().reverse().forEach(exp => {

        txnList.innerHTML += `

        <div class="txn-item">

            <div class="txn-dot">${getEmoji(exp.category)}</div>

            <div class="txn-info">

                <div class="txn-name">
                    ${exp.note}
                </div>

                <div class="txn-time">
                    ${exp.date} · ${exp.category}
                </div>

            </div>

            <div class="txn-amt">
                ₹${exp.amount}
            </div>

        </div>

        `;
    });

}function getEmoji(category) {

    if (category.includes("Food")) {
        return "🍱";
    }

    else if (category.includes("Transport")) {
        return "🚌";
    }

    else if (category.includes("Academic")) {
        return "📚";
    }

    else {
        return "🛒";
    }

}

//BUDGET PAGE...........
if (window.location.pathname.includes("budget.html")) {

    const budgetInput = document.querySelector(".budget-input");
    const budgetSaveBtn = document.querySelector(".budget-save");

    // load saved budget
    let savedBudget = localStorage.getItem("budget");

    if (savedBudget) {
        budgetInput.value = savedBudget;
    }

    // save budget
    budgetSaveBtn.addEventListener("click", () => {

        const budgetValue = Number(budgetInput.value);

        localStorage.setItem("budget", budgetValue);

        alert("Budget Saved Successfully!");
        window.location.href='budget.html'
    });
    
//category spending
    let food = 0;
    let transport = 0;
    let academic = 0;
    let misc = 0;

    expenses.forEach(exp => {

        if (exp.category.includes("Food")) {
            food += exp.amount;
        }

        else if (exp.category.includes("Transport")) {
            transport += exp.amount;
        }

        else if (exp.category.includes("Academic")) {
            academic += exp.amount;
        }

        else if (exp.category.includes("Misc")) {
            misc += exp.amount;
        }

    });
    
    const spentTexts = document.querySelectorAll(".cat-bud-spent");

    if (spentTexts[0]) {
        spentTexts[0].innerText = `₹${food} spent`;
    }

    if (spentTexts[1]) {
        spentTexts[1].innerText = `₹${transport} spent`;
    }
    if(spentTexts[2]){
        spentTexts[2].innerText=`${academic} spent`
    }


    //monthly budget 
    const totalBudget =Number(localStorage.getItem("budget")) || 6000;

    const totalSpent =food + transport + academic + misc;

    const remaining =totalBudget - totalSpent;

    const budgetInfo =document.querySelector(".budget-info");

    budgetInfo.innerHTML =`✅ You have <strong>₹${remaining} left</strong> this month — <strong>₹${totalSpent}</strong> spent of <strong>₹${totalBudget}</strong> budget`;

}

