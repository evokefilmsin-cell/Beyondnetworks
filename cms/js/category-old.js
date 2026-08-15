console.log("category.js loaded");

// =====================================
// Detect Current Category
// =====================================

const page =
    window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

const category =
    page.charAt(0).toUpperCase() +
    page.slice(1);

console.log("Category:", category);

// =====================================
// Load Page
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadCategoryHero();

    loadCategoryArticles();

});

// =====================================
// HERO
// =====================================

async function loadCategoryHero(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .order("publish_date",{ascending:false})

        .limit(1);

    if(error){

        console.error(error);

        return;

    }

    if(!data || data.length===0){

        return;

    }

    const article=data[0];

    document.getElementById("categoryName").textContent =
        article.category;

    document.getElementById("featuredTitle").textContent =
        article.title;

    document.getElementById("featuredSummary").textContent =
        article.summary;

    document.getElementById("featuredButton").href =
        "article.html?slug="+article.slug;

    if(article.featured_image){

        document.getElementById("categoryHero").style.backgroundImage =
        `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.75)),
        url('${article.featured_image}')`;

    }

}

// =====================================
// ARTICLES
// =====================================

async function loadCategoryArticles(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .order("publish_date",{ascending:false});

    if(error){

        console.error(error);

        return;

    }

    const container =
        document.getElementById("categoryArticles");

    if(!container) return;

    container.innerHTML="";

    data.forEach(article=>{

        container.innerHTML += `

<article class="card">

<img src="${article.featured_image}" alt="">

<div class="content">

<span>

${article.category}

</span>

<h3>

<a href="article.html?slug=${article.slug}">

${article.title}

</a>

</h3>

<p>

${article.summary}

</p>

</div>

</article>

`;

    });

}
