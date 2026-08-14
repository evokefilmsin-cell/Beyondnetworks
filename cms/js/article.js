console.log("article.js loaded");

// =====================================
// Get Article Slug
// =====================================

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

document.addEventListener("DOMContentLoaded", () => {

    loadArticle();

    loadBreakingNews();

    loadTrendingSidebar();

    loadLatestSidebar();

});

// =====================================
// ARTICLE
// =====================================

async function loadArticle(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("slug", slug)

        .single();

    if(error){

        console.error(error);

        return;

    }

    document.title =
        data.title + " | Beyond Networks";

    document.getElementById("articleImage").src =
        data.featured_image;

    document.getElementById("articleCategory").textContent =
        data.category;

    document.getElementById("articleTitle").textContent =
        data.title;

    document.getElementById("articleSummary").textContent =
        data.summary;

    document.getElementById("articleDate").textContent =
        new Date(data.publish_date).toLocaleDateString();

    document.getElementById("articleContent").innerHTML =
        data.content;

    loadRelatedStories(
        data.category,
        data.id
    );

}
// =====================================
// BREAKING NEWS
// =====================================

async function loadBreakingNews(){

    const { data } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("is_breaking",true)

        .order("publish_date",{ascending:false});

    const ticker =
        document.getElementById("breakingTicker");

    if(!ticker) return;

    ticker.innerHTML =
        data.map(article=>`

<a href="article.html?slug=${article.slug}">

🔴 ${article.title}

</a>

`).join(" &nbsp;&nbsp;&nbsp;&nbsp; ");

}
// =====================================
// TRENDING SIDEBAR
// =====================================

async function loadTrendingSidebar(){

    const { data } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("is_trending",true)

        .limit(5);

    const sidebar =
        document.getElementById("trendingSidebar");

    sidebar.innerHTML="";

    data.forEach(article=>{

        sidebar.innerHTML += `

<div class="mini-news">

<img src="${article.featured_image}">

sidebar.innerHTML += `
<div class="mini-news">

    <img src="${article.featured_image}" alt="${article.title}">

    <div>

        <span class="mini-category">
            ${article.category}
        </span>

        <p>

            <a href="article.html?slug=${article.slug}">
                ${article.title}
            </a>

        </p>

    </div>

</div>
`;

</div>

`;

    });

}
// =====================================
// LATEST SIDEBAR
// =====================================

async function loadLatestSidebar(){

    const { data } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .order("publish_date",{ascending:false})

        .limit(5);

    const sidebar =
        document.getElementById("latestSidebar");

    sidebar.innerHTML="";

    data.forEach(article=>{

        sidebar.innerHTML += `

<div class="mini-news">

<img src="${article.featured_image}">

<p>

<a href="article.html?slug=${article.slug}">

${article.title}

</a>

</p>

</div>

`;

    });

}
// =====================================
// RELATED STORIES
// =====================================

async function loadRelatedStories(category,id){

    const { data } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .neq("id",id)

        .limit(3);

    const related =
        document.getElementById("relatedStories");

    related.innerHTML="";

    data.forEach(article=>{

        related.innerHTML += `

<article class="card">

<img src="${article.featured_image}">

<div class="content">

<span>${article.category}</span>

<h3>

<a href="article.html?slug=${article.slug}">

${article.title}

</a>

</h3>

<p>${article.summary}</p>

</div>

</article>

`;

    });

}
