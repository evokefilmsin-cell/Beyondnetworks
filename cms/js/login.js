document.addEventListener("DOMContentLoaded", async () => {

    // Check if already logged in
    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (session) {
        window.location.href = "dashboard.html";
        return;
    }


    const loginForm =
        document.getElementById("loginForm");

    const loginButton =
        document.getElementById("loginButton");

    const loginError =
        document.getElementById("loginError");

    const loginSuccess =
        document.getElementById("loginSuccess");


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        loginError.style.display = "none";
        loginSuccess.style.display = "none";

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(error);

            loginError.textContent =
                error.message || "Invalid email or password.";

            loginError.style.display = "block";

            loginButton.disabled = false;
            loginButton.textContent = "Login";

            return;
        }


        console.log("Logged in:", data.user);

        loginSuccess.style.display = "block";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);

    });

});
