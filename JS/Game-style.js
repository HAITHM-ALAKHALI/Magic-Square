// 1️⃣ اختر كل divs داخل Game-Table
const cells = Array.from(document.querySelectorAll(".Game-Table div"));

// 2️⃣ اختر عناصر التحكم من HTML
const userInput = document.querySelector(".controls input");
const buttons = document.querySelectorAll(".controls button");

const shuffleBtn = buttons[0];
const resetBtn = buttons[1];
const checkBtn = buttons[2];

// 3️⃣ وظيفة لإدخال الرقم في الخانة عند النقر
function insertNumber(index) {
    const value = userInput.value;
    if (!value) return alert("⚠️ Enter a number first!");
    cells[index].textContent = value;
}

// ربط كل خانة بالحدث
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => insertNumber(index));
});

// 4️⃣ وظيفة Shuffle
function shuffleGrid() {
    let nums = [1,2,3,4,5,6,7,8,9];
    nums.sort(() => Math.random() - 0.5);
    cells.forEach((cell, i) => cell.textContent = nums[i]);
}

// 5️⃣ وظيفة Reset
function resetGrid() {
    cells.forEach(c => c.textContent = "");
    userInput.value = "";
}

// 6️⃣ وظيفة Check Magic Square
function checkMagic() {
    const arr = cells.map(c => parseInt(c.textContent));

    // تحقق من وجود أي خانة فارغة
    if (arr.some(v => isNaN(v))) {
        return alert("⚠️ Please fill all cells before checking!");
    }

    // حساب مجموع الصفوف، الأعمدة، والقطريات
    const sums = [
        arr[0]+arr[1]+arr[2], // صف 1
        arr[3]+arr[4]+arr[5], // صف 2
        arr[6]+arr[7]+arr[8], // صف 3
        arr[0]+arr[3]+arr[6], // عمود 1
        arr[1]+arr[4]+arr[7], // عمود 2
        arr[2]+arr[5]+arr[8], // عمود 3
        arr[0]+arr[4]+arr[8], // قطر رئيسي
        arr[2]+arr[4]+arr[6]  // قطر ثانوي
    ];

    const allEqual = sums.every(v => v === sums[0]);

    // عرض النتيجة مع مجموع كل صف وعمود وقطر
    alert((allEqual ? "✅ It is a Magic Square!\n\n" : "❌ Not a Magic Square!\n\n") +
          "Row sums:\n" +
          sums[0] + " | " + sums[1] + " | " + sums[2] + "\n" +
          "Column sums:\n" +
          sums[3] + " | " + sums[4] + " | " + sums[5] + "\n" +
          "Diagonals:\n" +
          sums[6] + " | " + sums[7]);
}

// 7️⃣ ربط الأزرار بالوظائف
shuffleBtn.addEventListener("click", shuffleGrid);
resetBtn.addEventListener("click", resetGrid);
checkBtn.addEventListener("click", checkMagic);