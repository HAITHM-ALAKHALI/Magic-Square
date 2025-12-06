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
    { 
        explanation: "📘 Level 1:\n• 3x3 grid, center fixed at 5.\n• Fill remaining numbers to make all rows, columns, diagonals sum 15.",
        grid: [null,null,null,null,5,null,null,null,null],
        size: 3

        /*
        2  7  6
        9  5  1
        4  3  8

        */

    },
    { 
        explanation: "📘 Level 2:\n• 3x3 grid, top-left 8, bottom-right 2 fixed.\n• Fill remaining numbers to make all rows, columns, diagonals sum 15.",
        grid: [8,null,null,null,null,null,null,null,2],
        size: 3
    },
    { 
        explanation: "📘 Level 3:\n• 4x4 grid, few numbers fixed.\n• Fill remaining numbers to make all rows, columns, diagonals sum 34.",
        grid: [1,null,null,null,
               12,null,null,null,
               null,10,null,null,
               null,null,null,16],
        size: 4

            /*  16   2   3  13
        5  11  10   8
        9   7   6  12
        4  14  15   1
 */

    },
    { 
        explanation: "📘 Level 4:\n• Empty 3x3 grid.\n• Fill numbers 1-9 to make all rows, columns, diagonals sum 15.",
        grid: Array(9).fill(null),
        size: 3
    },
    { 
        explanation: "📘 Level 5:\n• 5x5 grid with some numbers fixed.\n• Complete the magic square, sum = 65.",
        grid: [17,null,null,null,15,
               null,5,null,14,null,
               null,null,13,null,null,
               null,12,null,21,null,
               11,null,null,null,9],
        size: 5

        /*
        17  24   1   8  15
        23   5   7  14  16
        4   6  13  20  22
        10  12  19  26  3
        11  18  25  2   9
        */

    },
    { 
        explanation: "📘 Level 6:\n• Empty 4x4 grid.\n• Fill numbers 1-16 to make magic square, sum = 34.",
        grid: Array(16).fill(null),
        size: 4
    },
    { 
        explanation: "📘 Level 7:\n• Empty 9x9 grid.\n• Fill numbers 1-81 to make magic square, sum = 369.",
        grid: Array(81).fill(null),
        size: 9

        /* 
        1   62  63  64  65  66  67  68  69
        70  2   3   4   5   6   7   8   9
        10  71  11  12  13  14  15  16  17
        18  19  72  20  21  22  23  24  25
        26  27  28  73   29  30  31  32  33
        34  35  36  37  74   38  39  40  41
        42  43  44  45  46  75   47  48  49
        50  51  52  53  54  55  76   56  57
        58  59  60  61  62  63  64  65   77

        */

    }
];

let currentLevelIndex = 0;
let levelCompleted = false;

// ====== CREATE GRID ======
function createGrid(size, fixedNumbers) {
    const gameTable = document.querySelector(".Game-Table");
    gameTable.innerHTML = "";

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

    inputs.length = 0;
    inputs.push(...Array.from(gameTable.querySelectorAll("input")));
    attachInputValidation();
}

// ====== LOAD LEVEL ======
function loadLevel(index){
    const levelData = levels[index];
    createGrid(levelData.size, levelData.grid);
    levelTitle.textContent = "Level " + (index + 1);
    levelTitle.dataset.level = index + 1;
    levelCompleted = false;
    resultModal.style.display = "none";
}

// ====== INPUT VALIDATION ======
function attachInputValidation(){
    inputs.forEach(inp => {
        inp.addEventListener("change", () => {
            const valueStr = inp.value.trim();
            if(valueStr === "") return;

            const value = Number(valueStr);
            const maxNumber = levels[currentLevelIndex].size ** 2;

            if(isNaN(value) || value < 1 || value > maxNumber){
                inp.value = "";
                showResult(`⚠️ Only numbers 1 to ${maxNumber} are allowed!`);
                return;
            }

            const duplicates = inputs.filter(i => i !== inp && i.value == value);
            if(duplicates.length > 0){
                inp.value = "";
                showResult("⚠️ This number is duplicate! Already exists in the box.");
            }
        });
    });
}

// ====== SHUFFLE FUNCTION ======
function shuffleGrid() {
    const n = levels[currentLevelIndex].size;
    let allNumbers = Array.from({length: n*n}, (_, i) => i+1);
    const usedNumbers = inputs.filter(inp => inp.disabled).map(inp => Number(inp.value));
    allNumbers = allNumbers.filter(n => !usedNumbers.includes(n));

    allNumbers.sort(() => Math.random() - 0.5);

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

    const oldInputs = resultBox.querySelectorAll("#passwordInput, #submitPassword, #passwordBtn");
    oldInputs.forEach(e => e.remove());

    if(allowPassword) {
        const passwordBtn = document.createElement("button");
        passwordBtn.id = "passwordBtn";
        passwordBtn.textContent = "Enter Password";
        passwordBtn.style.marginLeft = "10px";

        passwordBtn.onclick = () => {
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
                if(passwordInput.value === "NOVA"){
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

    if(msg.includes("finished all levels")){
    const homeBtn = document.createElement("button");
    homeBtn.textContent = "Return to Home";
    homeBtn.style.marginLeft = "10px";

    homeBtn.onclick = () => {
        window.location.href = "../index.html";
    };

    resultBox.appendChild(homeBtn);
}

    resultBox.appendChild(homeBtn);
    }

// ====== CLOSE MODAL ======
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

    // read values, but keep empty as null for the initial check
    const rawValues = inputs.map(i => i.value.trim() === "" ? null : i.value.trim());

    // check if all boxes are empty
    const allEmpty = rawValues.every(v => v === null);

    // If all boxes empty AND there are no fixed numbers in the level -> ask user to fill
    if (allEmpty) {
        showResult("⚠️ You should fill the grid!");
        return;
    }

    // convert values to numbers treating empty as 0 for sum calculations
    const values = rawValues.map(v => v === null ? 0 : Number(v));

    // build matrix dynamically
    const m = [];
    for (let r = 0; r < size; r++) {
        m.push(values.slice(r * size,//row
                             (r + 1) * size));//column
    }

    // row sums (empty counted as 0)
    const rowSums = m.map(row => row.reduce((a, b) => a + b, 0));
    // column sums
    const colSums = Array.from({ length: size }, (_, c) => m.reduce((sum, row) => sum + row[c], 0));
    // diagonal sums
    const diagSums = [
        m.reduce((sum, row, r) => sum + row[r], 0),
        m.reduce((sum, row, r) => sum + row[size - 1 - r], 0)
    ];

    const allSums = [...rowSums, ...colSums, ...diagSums];//... Spread operator, spreads the elements of an array into individual elements

    // determine validity: all sums equal AND every cell is filled (no nulls)
    const allSumsEqual = allSums.every(s => s === allSums[0]);
    const allFilled = rawValues.every(v => v !== null);
    const valid = allSumsEqual && allFilled;

    let resultMessage = "";
    if (valid) {
        resultMessage += "✅ Perfect! This IS a Magic Square.\n\n";
        resultMessage += `Row Sums: ${rowSums.join(" | ")}\n`;
        resultMessage += `Column Sums: ${colSums.join(" | ")}\n`;
        resultMessage += `Diagonals: ${diagSums.join(" | ")}\n\n`;
        resultMessage += "🎉 Level completed! Click 'Next Level' to continue.";
        levelCompleted = true;
        showResult(resultMessage);
        return;
    }

    // Not fully valid: show partial sums (works even with some empty cells)
    resultMessage += "⚠️ Incomplete or Not a Magic Square yet.\n\n";
    resultMessage += `Row Sums: ${rowSums.join(" | ")}\n`;
    resultMessage += `Column Sums: ${colSums.join(" | ")}\n`;
    resultMessage += `Diagonals: ${diagSums.join(" | ")}`;

    showResult(resultMessage);
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
        showResult("⚠️ Finish the level first to unlock next.", true);
    }
});

// ====== EVENT LISTENERS ======
shuffleBtn.addEventListener("click", shuffleGrid);
resetBtn.addEventListener("click", resetGrid);
checkBtn.addEventListener("click", checkMagicSquare);
explainBtn.addEventListener("click", explainGame);

// ====== INITIAL LOAD ======
loadLevel(currentLevelIndex);
