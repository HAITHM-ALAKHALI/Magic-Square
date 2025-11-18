const explainBtn = document.querySelector(".explain-btn");
    const explainModal = document.querySelector("#explainModal");
    const closeExplain = document.querySelector("#closeExplain");

    explainBtn.addEventListener("click", () => {
        explainModal.style.display = "flex";
    });

    closeExplain.addEventListener("click", () => {
        explainModal.style.display = "none";
    });
