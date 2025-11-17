// ====== SELECT ELEMENTS ======
const inputs = [];
const buttons = document.querySelectorAll(".controls button");
const shuffleBtn = buttons[0];
const resetBtn = buttons[1];
const checkBtn = buttons[2];
const explainBtn = document.querySelector(".Explain-Game button");
const nextLevelBtn = document.querySelector(".next-level button");

const resultText = document.getElementById("resultText");
const resultModal = document.getElementById("resultModal");
const closeModal = document.getElementById("closeModal");
const levelTitle = document.getElementById("levelTitle");

// ====== DEFINE LEVELS ======
const levels = [
    // 3x3 with 1 fixed number
    { 
        explanation: "📘 Level 1:\n• 3x3 grid, center fixed at 5.\n• Fill numbers 1-9 to make magic square.",
        grid: [null,null,null,null,5,null,null,null,null],
        size: 3
    },

    // 3x3 with 2 fixed numbers
    { 
        explanation: "📘 Level 2:\n• 3x3 grid, top-left 8, bottom-right 2 fixed.\n• Complete the magic square.",
        grid: [8,null,null,null,5,null,null,null,2],
        size: 3
    },

    // 4x4 partially fixed
    { 
        explanation: "📘 Level 3:\n• 4x4 grid, few numbers fixed.\n• Fill remaining numbers to make all rows, columns, diagonals sum 34.",
        grid: [1,null,null,null,
               null,null,12,null,
               null,5,null,null,
               null,null,null,16],
        size: 4
    },

    // 3x3 empty
    { 
        explanation: "📘 Level 4:\n• Empty 3x3 grid.\n• Fill numbers 1-9 to make all rows, columns, diagonals sum 15.",
        grid: Array(9).fill(null),
        size: 3
    },

    // 5x5 partially fixed
    { 
        explanation: "📘 Level 5:\n• 5x5 grid with some numbers fixed.\n• Complete the magic square, sum = 65.",
        grid: [17,null,null,null,23,
               null,2,null,20,null,
               null,null,13,null,null,
               null,18,null,7,null,
               12,null,null,null,25],
        size: 5
    },

    // 4x4 empty
    { 
        explanation: "📘 Level 6:\n• Empty 4x4 grid.\n• Fill numbers 1-16 to make magic square, sum = 34.",
        grid: Array(16).fill(null),
        size: 4
    },

    // 9x9 empty
    { 
        explanation: "📘 Level 7:\n• Empty 9x9 grid.\n• Fill numbers 1-81 to make magic square, sum = 369.",
        grid: Array(81).fill(null),
        size: 9
    }
];


let currentLevelIndex = 0;
let levelCompleted = false;

function createGrid(size, fixedNumbers) {
    const gameTable = document.querySelector(".Game-Table");
    gameTable.innerHTML = ""; // clear previous grid

    // dynamic CSS for rows and columns
    gameTable.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameTable.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    const totalBoxes = size * size;
    for(let i = 0; i < totalBoxes; i++){
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.type = "number";

        if(fixedNumbers[i] !== null){
            input.value = fixedNumbers[i];
            input.disabled = true;
            input.dataset.fixed = "true";
        } else {
            input.value = "";
            input.disabled = false;
            input.dataset.fixed = "false";
        }

        div.appendChild(input);
        gameTable.appendChild(div);
    }

    // update inputs array
    inputs.length = 0;
    inputs.push(...Array.from(gameTable.querySelectorAll("input")));

    attachInputValidation();
}



// ====== LOAD LEVEL ======
function loadLevel(index){
    const levelData = levels[index];

    // dynamically create grid
    createGrid(levelData.size, levelData.grid);

    levelTitle.textContent = "Level " + (index + 1);
    levelTitle.dataset.level = index + 1;
    levelCompleted = false;

    resultModal.style.display = "none";
}



// ====== INPUT VALIDATION ======
inputs.forEach(inp => {
    inp.addEventListener("input", () => {

        // skip if empty
        if(inp.value.trim() === "") return;

        const value = Number(inp.value);

        // get max number for current level
        const maxNum = levels[currentLevelIndex].size ** 2;

       
    });
});

function attachInputValidation(){
    inputs.forEach(inp => {
        inp.addEventListener("input", () => {
            if(inp.value.trim() === "") return;

            const value = Number(inp.value);

            // limit according to level size
            const maxNumber = levels[currentLevelIndex].size ** 2;
            if(value < 1 || value > maxNumber){
    inp.value = "";
    showResult(`⚠️ Only numbers 1 to ${maxNumber} are allowed!`); // no password button here
    return;
}

const duplicates = inputs.filter(i => i !== inp && i.value == value);
if(duplicates.length > 0){
    inp.value = "";
    showResult("⚠️ This number is duplicate! Already exists in the box."); // no password button here
}
        });
    });
}


// ====== SHUFFLE FUNCTION ======
function shuffleGrid() {
    const n = levels[currentLevelIndex].size;
    let allNumbers = Array.from({length: n*n}, (_, i) => i+1);

    // remove fixed numbers
    const usedNumbers = inputs
        .filter(inp => inp.disabled)
        .map(inp => Number(inp.value));
    allNumbers = allNumbers.filter(n => !usedNumbers.includes(n));

    // shuffle
    allNumbers.sort(() => Math.random() - 0.5);

    // fill editable inputs
    let index = 0;
    inputs.forEach(inp => {
        if(!inp.disabled){
            inp.value = allNumbers[index];
            index++;
        }
    });
}

// ====== RESET FUNCTION ======
function resetGrid(){
    loadLevel(currentLevelIndex);
}

// ====== SHOW MODAL ======
function showResult(msg, allowPassword = false) {
    resultText.textContent = msg;

    const resultBox = resultModal.querySelector("#resultBox");

    // remove old password input/button
    const oldInputs = resultBox.querySelectorAll("#passwordInput, #submitPassword, #passwordBtn");
    oldInputs.forEach(e => e.remove());

    if(allowPassword) {
        const passwordBtn = document.createElement("button");
        passwordBtn.id = "passwordBtn";
        passwordBtn.textContent = "Enter Password";
        passwordBtn.style.marginLeft = "10px";

        passwordBtn.onclick = () => {
            // remove old inputs
            const oldInputs2 = resultBox.querySelectorAll("#passwordInput, #submitPassword");
            oldInputs2.forEach(e => e.remove());

            const passwordInput = document.createElement("input");
            passwordInput.type = "password";
            passwordInput.placeholder = "Password";
            passwordInput.id = "passwordInput";
            passwordInput.style.marginLeft = "10px";
            passwordInput.style.width = "120px";

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.id = "submitPassword";
            submitBtn.style.marginLeft = "5px";

            submitBtn.onclick = () => {
                if(passwordInput.value === "NOVA"){ // <-- your password
                    currentLevelIndex++;
                    if(currentLevelIndex >= levels.length){
                        showResult("🎉 Congratulations! You finished all levels!");
                    } else {
                        loadLevel(currentLevelIndex);
                        resultModal.style.display = "none";
                    }
                } else {
                    alert("❌ Wrong password!");
                }
            };

            resultBox.appendChild(passwordInput);
            resultBox.appendChild(submitBtn);
        };

        resultBox.appendChild(passwordBtn);
    }

    resultModal.style.display = "flex";
}


// close modal
closeModal.onclick = () => resultModal.style.display = "none";
window.onclick = e => {
    if(e.target === resultModal) resultModal.style.display = "none";
};


closeModal.onclick = () => resultModal.style.display = "none";
window.onclick = e => {
    if(e.target === resultModal) resultModal.style.display = "none";
};

// ====== EXPLAIN FUNCTION ======
function explainGame(){
    showResult(levels[currentLevelIndex].explanation);
}

// ====== CHECK MAGIC SQUARE ======
function checkMagicSquare() {
    const size = levels[currentLevelIndex].size;
    const values = inputs.map(i => Number(i.value));
    if(values.some(v => isNaN(v) || v === 0)){
        return showResult("⚠️ Fill all boxes first!");
    }

    // build matrix dynamically
    const m = [];
    for(let r = 0; r < size; r++){
        m.push(values.slice(r*size, (r+1)*size));
    }

    // row sums
    const rowSums = m.map(row => row.reduce((a,b)=>a+b,0));
    // column sums
    const colSums = Array.from({length:size}, (_,c) => m.reduce((sum,row)=>sum+row[c],0));
    // diagonal sums
    const diagSums = [
        m.reduce((sum,row,r)=>sum+row[r],0),
        m.reduce((sum,row,r)=>sum+row[size-1-r],0)
    ];

    const allSums = [...rowSums, ...colSums, ...diagSums];
    const valid = allSums.every(s => s === allSums[0]);

    const resultMessage = 
        (valid ? "✅ Perfect! This IS a Magic Square." : "❌ Not a Magic Square.") +
        `\n\nRow Sums: ${rowSums.join(" | ")}` +
        `\n\nColumn Sums: ${colSums.join(" | ")}` +
        `\n\nDiagonals: ${diagSums.join(" | ")}`;

    showResult(resultMessage);

    if(valid){
        levelCompleted = true;
        showResult(resultMessage + "\n\n🎉 Level completed! Click 'Next Level' to continue.");
    }
}

// ====== NEXT LEVEL BUTTON ======
nextLevelBtn.addEventListener("click", () => {
    if(levelCompleted){
        currentLevelIndex++;
        if(currentLevelIndex >= levels.length){
            showResult("🎉 Congratulations! You finished all levels!");
        } else {
            loadLevel(currentLevelIndex);
        }
    } else {
        showResult("⚠️ Complete the current level first!", true); // <--- password button appears here
    }
});



// ====== EVENT LISTENERS ======
shuffleBtn.addEventListener("click", shuffleGrid);
resetBtn.addEventListener("click", resetGrid);
checkBtn.addEventListener("click", checkMagicSquare);
explainBtn.addEventListener("click", explainGame);

// ====== INITIAL LOAD ======
loadLevel(currentLevelIndex);
