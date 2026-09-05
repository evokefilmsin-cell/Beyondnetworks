// ======================================================
// BEYOND NETWORKS CMS AUTH + ROLE PERMISSIONS
// ======================================================

let cmsCurrentUser = null;
let currentUserRole = null;


// ======================================================
// GET CURRENT SESSION
// ======================================================

async function requireAuth() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Auth error:", error);
        window.location.href = "index.html";
        return null;
    }

    if (!session) {
        window.location.href = "index.html";
        return null;
    }

    cmsCurrentUser = session.user;

    return session;
}


// ======================================================
// GET CURRENT USER ROLE
// ======================================================

async function getCurrentUserRole() {

    if (currentUserRole) {
        return currentUserRole;
    }

  if (!cmsCurrentUser) {

        const session = await requireAuth();

        if (!session) {
            return null;
        }
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id", cmsCurrentUser.id)
        .maybeSingle();


    if (error) {

        console.error(
            "Role lookup error:",
            error
        );

        return null;
    }


    currentUserRole =
        data?.role || "viewer";


    return currentUserRole;
}


// ======================================================
// CHECK ROLE
// ======================================================

async function hasRole(role) {

    const currentRole =
        await getCurrentUserRole();

    return currentRole === role;
}


// ======================================================
// CHECK IF USER HAS ONE OF THE ROLES
// ======================================================

async function hasAnyRole(roles) {

    const currentRole =
        await getCurrentUserRole();

    return roles.includes(currentRole);
}


// ======================================================
// REQUIRE SPECIFIC ROLES
// ======================================================

async function requireRole(allowedRoles) {

    const role =
        await getCurrentUserRole();


    if (!role) {
        return false;
    }


    if (!allowedRoles.includes(role)) {

        alert(
            "You do not have permission to access this page."
        );

        window.location.href =
            "dashboard.html";

        return false;
    }


    return true;
}


// ======================================================
// PAGE PERMISSIONS
// ======================================================

async function applyPagePermissions() {

    const role =
        await getCurrentUserRole();


    if (!role) {
        return;
    }


    // ------------------------------------------
    // SIDEBAR LINKS
    // ------------------------------------------

    const links =
        document.querySelectorAll(".sidebar a");


    links.forEach(link => {

        const href =
            link.getAttribute("href");


        if (!href) {
            return;
        }


        // USERS
        if (
            href === "users.html" &&
            role !== "admin"
        ) {
            link.style.display = "none";
        }


        // NEW ARTICLE
        if (
            href === "article-editor.html" &&
            ![
                "admin",
                "editor",
                "reporter"
            ].includes(role)
        ) {
            link.style.display = "none";
        }


        // VIDEOS
        if (
            href === "videos.html" &&
            ![
                "admin",
                "editor",
                "video_editor",
                "viewer"
            ].includes(role)
        ) {
            link.style.display = "none";
        }


        // MEDIA
        // Everyone can view media for now.


        // CATEGORIES
        // Everyone can view categories for now.


    });


    // ------------------------------------------
    // QUICK ACTIONS
    // ------------------------------------------

    const actions =
        document.querySelectorAll(".action");


    actions.forEach(action => {

        const text =
            action.innerText.toLowerCase();


        // Create Article
        if (
            text.includes("create article") &&
            ![
                "admin",
                "editor",
                "reporter"
            ].includes(role)
        ) {
            action.style.display = "none";
        }


        // Upload Video
        if (
            text.includes("upload video") &&
            ![
                "admin",
                "editor",
                "video_editor"
            ].includes(role)
        ) {
            action.style.display = "none";
        }


    });


    // ------------------------------------------
    // PUBLISH BUTTONS
    // ------------------------------------------

    const publishButtons =
        document.querySelectorAll(
            ".publish-btn, [data-action='publish']"
        );


    if (
        ![
            "admin",
            "editor",
            "video_editor"
        ].includes(role)
    ) {

        publishButtons.forEach(button => {
            button.style.display = "none";
        });

    }


    // ------------------------------------------
    // DELETE BUTTONS
    // ------------------------------------------

    const deleteButtons =
        document.querySelectorAll(
            ".delete-btn, [data-action='delete']"
        );


    if (role !== "admin") {

        deleteButtons.forEach(button => {
            button.style.display = "none";
        });

    }


    // ------------------------------------------
    // USERS PAGE
    // ------------------------------------------

    if (
        window.location.pathname
            .toLowerCase()
            .endsWith("/users.html")
    ) {

        if (role !== "admin") {

            document.body.innerHTML = `
                <div style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#0f0f0f;
                    color:#fff;
                    font-family:Arial,sans-serif;
                    text-align:center;
                    padding:30px;
                ">

                    <div>

                        <h1 style="font-size:28px;">
                            Access Denied
                        </h1>

                        <p style="
                            color:#888;
                            margin-top:10px;
                        ">
                            Admin access is required
                            to manage CMS users.
                        </p>

                        <button
                            onclick="window.location.href='dashboard.html'"
                            style="
                                margin-top:20px;
                                padding:11px 18px;
                                border:0;
                                border-radius:6px;
                                background:#e50914;
                                color:#fff;
                                cursor:pointer;
                            "
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>
            `;

            return;
        }
    }

}


// ======================================================
// LOGOUT
// ======================================================

async function logout() {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return;
    }


    window.location.href =
        "index.html";
}


// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const session =
            await requireAuth();


        if (!session) {
            return;
        }


        await getCurrentUserRole();

        await applyPagePermissions();

    }
);
