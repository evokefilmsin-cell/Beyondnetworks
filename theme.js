console.log("theme.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    const themeButton =
        document.getElementById("themeToggle");

    if (!themeButton) return;


    // Check saved theme
    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeButton.textContent = "🌙";

    } else {

        themeButton.textContent = "☀️";

    }


    // Toggle theme
    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");


        const isLight =
            document.body.classList.contains("light-mode");


        if (isLight) {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeButton.textContent = "🌙";

        } else {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeButton.textContent = "☀️";

        }

    });

});
