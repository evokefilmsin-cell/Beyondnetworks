async function requireAuth() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error("Auth error:", error);

        window.location.href = "login.html";

        return null;
    }


    if (!session) {

        window.location.href = "login.html";

        return null;
    }


    return session;
}


async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error("Logout error:", error);

        return;
    }

    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", () => {

    requireAuth();

});
