// ======================================
// Beyond Networks CMS
// articles.js
// ======================================

console.log("articles.js loaded");

const table = document.getElementById("articlesTable");
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const filterBtn = document.getElementById("filterBtn");
console.log(table);

loadArticles();

async function loadArticles() {

    table.innerHTML = `
    <tr>
        <td colspan="9" class="text-center p-5">
            Loading Articles...
        </td>
    </tr>
    `;

    // ----------------------------
    // Load User Profiles
    // ----------------------------

    const {
        data: profiles,
        error: profileError
    } = await supabaseClient
        .from("user_profiles")
        .select("user_id, full_name, email");

    if (profileError) {

        console.error("Profile loading error:", profileError);

    }

    // Create a quick lookup:
    // user ID → user name

    const profileMap = {};

    if (profiles) {

        profiles.forEach(profile => {

            profileMap[profile.user_id] =
                profile.full_name || profile.email || "Unknown User";

        });

    }

    // ----------------------------
    // Load Articles
    // ----------------------------

    let query = supabaseClient
        .from("articles")
        .select("*");

    // Search

    if (searchInput.value.trim() !== "") {

        query = query.ilike(
            "title",
            `%${searchInput.value.trim()}%`
        );

    }

    // Brand

    if (brandFilter.value !== "All Brands") {

        query = query.eq(
            "brand",
            brandFilter.value
        );

    }

    // Category

    if (categoryFilter.value !== "Category") {

        query = query.eq(
            "category",
            categoryFilter.value
        );

    }

    // Status

    if (statusFilter.value !== "Status") {

        query = query.eq(
            "status",
            statusFilter.value
        );

    }

    query = query.order(
        "publish_date",
        { ascending: false }
    );

    const { data, error } = await query;

    if (error) {

        console.error(error);

        table.innerHTML = `
        <tr>
            <td colspan="9">
                Failed to load articles.
            </td>
        </tr>
        `;

        return;

    }

    table.innerHTML = "";

    data.forEach(article => {

        const creatorName =
            article.created_by
                ? profileMap[article.created_by] || "Unknown User"
                : "-";

        table.innerHTML += `

<tr>

<td>
<input type="checkbox">
</td>

<td>

<img
src="${article.featured_image || '../images/logo.png'}"
width="70"
style="border-radius:8px;">

</td>

<td>

<strong>${article.title}</strong>

</td>

<td>

${article.is_breaking
? '<span class="badge bg-danger me-1">LIVE</span>'
: ''}

${article.is_featured
? '<span class="badge bg-warning text-dark me-1">FEATURED</span>'
: ''}

${article.is_trending
? '<span class="badge bg-primary">TRENDING</span>'
: ''}

${article.is_opinion
? '<span class="badge bg-info me-1">OPINION</span>'
: ''}

${article.is_video
? '<span class="badge bg-dark me-1">VIDEO</span>'
: ''}

${article.is_editor_pick
? '<span class="badge bg-success">EDITOR PICK</span>'
: ''}

</td>

<td>

${article.brand || "Beyond News"}

</td>

<td>

${article.category}

</td>

<td>

<strong>${creatorName}</strong>

</td>

<td>

${article.publish_date
? new Date(article.publish_date).toLocaleDateString()
: "-"}

</td>

<td>

<span class="badge ${
article.status === "Published"
? "bg-success"
: article.status === "Draft"
? "bg-warning text-dark"
: "bg-primary"
}">

${article.status}

</span>

</td>

<td>

<button
class="btn btn-sm btn-outline-light"
onclick="editArticle('${article.id}')">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-sm btn-outline-danger"
onclick="deleteArticle('${article.id}')">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

    });

}
// ----------------------------
// Delete
// ----------------------------

async function deleteArticle(id){

    if(!confirm("Delete this article?"))
        return;

    const { error } = await supabaseClient

        .from("articles")

        .delete()

        .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    loadArticles();

}

// ----------------------------
// Edit
// ----------------------------

function editArticle(id){

    window.location =
        "article-editor.html?id="+id;

}
searchInput.addEventListener("input", loadArticles);

brandFilter.addEventListener("change", loadArticles);

categoryFilter.addEventListener("change", loadArticles);

statusFilter.addEventListener("change", loadArticles);

filterBtn.addEventListener("click", loadArticles);
