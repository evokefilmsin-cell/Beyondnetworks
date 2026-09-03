document.addEventListener("DOMContentLoaded", async () => {

    // Check if already logged in
    const {
        data: { session },
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
        console.error("Session error:", sessionError);
    }

    if (session) {
        window.location.href = "dashboard.html";
        return;
    }


    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("loginError");


    if (!loginForm) {
        console.error("Login form not found.");
        return;
    }


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        // Clear previous error
        if (loginError) {
            loginError.style.display = "none";
            loginError.textContent = "";
        }


        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


        if (error) {

            console.error("Login error:", error);

            if (loginError) {
                loginError.textContent =
                    error.message || "Invalid email or password.";

                loginError.style.display = "block";
            } else {
                alert(error.message || "Invalid email or password.");
            }

            loginButton.disabled = false;
            loginButton.textContent = "Login";

            return;
        }


        console.log("Login successful:", data.user);

        loginButton.textContent = "Login successful...";


        // Go to CMS dashboard
        window.location.href = "dashboard.html";

    });

});
