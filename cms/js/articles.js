// ======================================
// Beyond Networks CMS
// articles.js
// ======================================

const table = document.getElementById("articlesTable");

loadArticles();

async function loadArticles() {

    table.innerHTML = `
    <tr>
        <td colspan="8" class="text-center p-5">
            Loading Articles...
        </td>
    </tr>
    `;

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .order("publish_date", {
            ascending: false
        });

    if (error) {

        console.error(error);

        table.innerHTML = `
        <tr>
            <td colspan="8">
                Failed to load articles.
            </td>
        </tr>
        `;

        return;

    }

    table.innerHTML = "";

    data.forEach(article => {

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

Beyond News

</td>

<td>

${article.category}

</td>

<td>

${article.publish_date
? new Date(article.publish_date).toLocaleDateString()
: "-"}

</td>

<td>

<span class="badge ${article.status=="Published"
? "bg-success"
: "bg-warning"}">

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
