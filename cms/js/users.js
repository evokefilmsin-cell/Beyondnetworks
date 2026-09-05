let currentUser = null;
let currentRole = null;

const usersTableBody = document.getElementById("usersTableBody");
const pageError = document.getElementById("pageError");

const addUserBtn = document.getElementById("addUserBtn");
const userModal = document.getElementById("userModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const userForm = document.getElementById("userForm");
const createBtn = document.getElementById("createBtn");

const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");


// --------------------------------------------------
// START
// --------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
    await checkAdmin();
});


// --------------------------------------------------
// CHECK CURRENT USER
// --------------------------------------------------

async function checkAdmin() {

    try {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();

        if (error || !user) {
            window.location.href = "index.html";
            return;
        }

        currentUser = user;

        const { data: roleData, error: roleError } =
            await supabaseClient
                .from("user_roles")
                .select("role")
                .eq("user_id", user.id)
                .maybeSingle();

        if (roleError) {
            throw roleError;
        }

        if (!roleData || roleData.role !== "admin") {

            pageError.style.display = "block";
            pageError.textContent =
                "You do not have permission to access the Users page.";

            addUserBtn.style.display = "none";

            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        Admin access required.
                    </td>
                </tr>
            `;

            return;
        }

        currentRole = roleData.role;

        await loadUsers();

    } catch (error) {

        console.error(error);

        showPageError(
            error.message || "Unable to verify your permissions."
        );
    }
}


// --------------------------------------------------
// LOAD USERS
// --------------------------------------------------

async function loadUsers() {

    usersTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="loading">
                Loading users...
            </td>
        </tr>
    `;

    try {

        const { data: profiles, error: profileError } =
            await supabaseClient
                .from("user_profiles")
                .select("user_id, full_name, email, role, created_at")
                .order("created_at", {
                    ascending: false
                });

        if (profileError) {
            throw profileError;
        }


        const { data: roles, error: roleError } =
            await supabaseClient
                .from("user_roles")
                .select("user_id, role");

        if (roleError) {
            throw roleError;
        }


        const roleMap = {};

        (roles || []).forEach(item => {
            roleMap[item.user_id] = item.role;
        });


        if (!profiles || profiles.length === 0) {

            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        No users found.
                    </td>
                </tr>
            `;

            return;
        }


        usersTableBody.innerHTML = profiles.map(user => {

            const role =
                roleMap[user.user_id] ||
                user.role ||
                "viewer";

            const displayName =
                user.full_name ||
                "Unnamed User";

            const email =
                user.email ||
                "No email";


            const createdDate =
                user.created_at
                    ? new Date(user.created_at)
                        .toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })
                    : "-";


            return `
                <tr>

                    <td>
                        <div class="user-name">
                            ${escapeHtml(displayName)}
                        </div>

                        <div class="user-email">
                            ${escapeHtml(email)}
                        </div>
                    </td>


                    <td>
                        <span class="role-badge role-${role}">
                            ${formatRole(role)}
                        </span>
                    </td>


                    <td>
                        ${createdDate}
                    </td>


                    <td>

                        ${
                            user.user_id === currentUser.id
                                ? `<span style="color:#666;font-size:12px;">You</span>`
                                : `
                                    <button
                                        class="edit-role-btn"
                                        onclick="editRole('${user.user_id}', '${role}')"
                                    >
                                        Edit Role
                                    </button>
                                `
                        }

                    </td>

                </tr>
            `;

        }).join("");


    } catch (error) {

        console.error(error);

        showPageError(
            error.message || "Unable to load users."
        );
    }
}


// --------------------------------------------------
// ADD USER MODAL
// --------------------------------------------------

addUserBtn.addEventListener("click", () => {

    resetForm();

    userModal.classList.add("active");

});


closeModal.addEventListener("click", closeUserModal);

cancelBtn.addEventListener("click", closeUserModal);


userModal.addEventListener("click", event => {

    if (event.target === userModal) {
        closeUserModal();
    }

});


function closeUserModal() {

    userModal.classList.remove("active");

}


// --------------------------------------------------
// CREATE USER
// --------------------------------------------------

userForm.addEventListener("submit", async event => {

    event.preventDefault();

    hideMessages();

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;


    if (!fullName || !email || !password || !role) {

        showFormError(
            "Please fill in all fields."
        );

        return;
    }


    if (password.length < 6) {

        showFormError(
            "Password must be at least 6 characters."
        );

        return;
    }


    createBtn.disabled = true;
    createBtn.textContent = "Creating...";


    try {

        const { data, error } =
            await supabaseClient.functions.invoke(
                "create-cms-user",
                {
                    body: {
                        full_name: fullName,
                        email: email,
                        password: password,
                        role: role
                    }
                }
            );


        if (error) {
            throw error;
        }


        if (!data || !data.success) {

            throw new Error(
                data?.error ||
                "Unable to create user."
            );
        }


        formSuccess.textContent =
            "User created successfully.";

        formSuccess.style.display = "block";


        userForm.reset();


        await loadUsers();


        setTimeout(() => {

            closeUserModal();

        }, 1200);


    } catch (error) {

        console.error(error);

        showFormError(
            error.message ||
            "Unable to create user."
        );

    } finally {

        createBtn.disabled = false;
        createBtn.textContent = "Create User";

    }

});


// --------------------------------------------------
// EDIT ROLE
// --------------------------------------------------

async function editRole(userId, currentRole) {

    if (!userId) {
        return;
    }


    const newRole = prompt(
        `Enter new role:\n\nadmin\neditor\nreporter\nvideo_editor\nviewer\n\nCurrent role: ${currentRole}`,
        currentRole
    );


    if (!newRole) {
        return;
    }


    const role =
        newRole.trim().toLowerCase();


    const allowedRoles = [
        "admin",
        "editor",
        "reporter",
        "video_editor",
        "viewer"
    ];


    if (!allowedRoles.includes(role)) {

        alert(
            "Invalid role. Please use: admin, editor, reporter, video_editor or viewer."
        );

        return;
    }


    if (userId === currentUser.id) {

        alert(
            "You cannot change your own admin role from here."
        );

        return;
    }


    try {

        const { error } =
            await supabaseClient
                .from("user_roles")
                .update({
                    role: role
                })
                .eq("user_id", userId);


        if (error) {
            throw error;
        }


        // Keep user_profiles.role synchronized
        await supabaseClient
            .from("user_profiles")
            .update({
                role: role
            })
            .eq("user_id", userId);


        await loadUsers();


    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Unable to update role."
        );
    }
}


// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function formatRole(role) {

    return role
        .replace("_", " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showPageError(message) {

    pageError.textContent = message;
    pageError.style.display = "block";
}


function showFormError(message) {

    formError.textContent = message;
    formError.style.display = "block";
}


function hideMessages() {

    formError.style.display = "none";
    formSuccess.style.display = "none";

}


function resetForm() {

    userForm.reset();

    hideMessages();

    document.getElementById("role").value =
        "viewer";

}
