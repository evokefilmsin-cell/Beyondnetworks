console.log("article.js loaded");

// =======================================
// Get Slug
// =======================================

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// =======================================
// Page Load
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    loadArticle();
    loadBreakingNews();
    loadTrendingSidebar();
    loadLatestSidebar();

});

// =======================================
// ARTICLE
// =======================================

async function loadArticle() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.title = data.title + " | Beyond Networks";

    document.getElementById("pageTitle").textContent =
        data.title + " | Beyond Networks";

    document.getElementById("articleCategory").textContent =
        data.category || "News";

    document.getElementById("articleTitle").textContent =
        data.title;

    if(document.getElementById("articleAuthor")){
        document.getElementById("articleAuthor").textContent =
            data.author || "Beyond News Digital";
    }

    if(document.getElementById("articleDate")){
        document.getElementById("articleDate").textContent =
            new Date(data.publish_date).toLocaleDateString();
    }

    if(document.getElementById("articleImage")){
        document.getElementById("articleImage").src =
            data.featured_image;
    }

    if(document.getElementById("imageCaption")){
        document.getElementById("imageCaption").textContent =
            data.title;
    }

    document.getElementById("articleContent").innerHTML =
        data.content;

    calculateReadTime(data.content);

    loadRelatedStories(data.category, data.id);

}

// =======================================
// READ TIME
// =======================================

function calculateReadTime(content){

    const words =
        content.replace(/<[^>]*>?/gm,'').split(/\s+/).length;

    const minutes =
        Math.max(1, Math.ceil(words/220));

    if(document.getElementById("articleReadTime")){

        document.getElementById("articleReadTime").textContent =
            minutes + " min read";

    }

}

// =======================================
// BREAKING NEWS
// =======================================

async function loadBreakingNews(){

    const { data, error } = await supabaseClient
        .from("articles")
        .select("title,slug")
        .eq("status","Published")
        .eq("is_breaking",true)
        .order("publish_date",{ascending:false});

    if(error){
        console.error(error);
        return;
    }

    const ticker =
        document.getElementById("breakingTicker");

    if(!ticker) return;

    ticker.innerHTML="";

    data.forEach(article=>{

        ticker.innerHTML += `

<a href="article.html?slug=${article.slug}">
🔴 ${article.title}
</a>

`;

    });

}

// =======================================
// TRENDING SIDEBAR
// =======================================

async function loadTrendingSidebar(){

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status","Published")
        .eq("is_trending",true)
        .order("publish_date",{ascending:false})
        .limit(5);

    if(error){
        console.error(error);
        return;
    }

    const sidebar =
        document.getElementById("trendingNewsArticle");

    if(!sidebar) return;

    sidebar.innerHTML="";

    data.forEach(article=>{

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

    });

}

// =======================================
// LATEST SIDEBAR
// =======================================

async function loadLatestSidebar(){

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status","Published")
        .order("publish_date",{ascending:false})
        .limit(5);

    if(error){
        console.error(error);
        return;
    }

    const sidebar =
        document.getElementById("latestNewsArticle");

    if(!sidebar) return;

    sidebar.innerHTML="";

    data.forEach(article=>{

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

    });

}

// =======================================
// RELATED STORIES
// =======================================

async function loadRelatedStories(category,id){

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status","Published")
        .eq("category",category)
        .neq("id",id)
        .order("publish_date",{ascending:false})
        .limit(4);

    if(error){
        console.error(error);
        return;
    }

    const related =
        document.getElementById("relatedStories");

    if(!related) return;

    related.innerHTML="";

    data.forEach(article=>{

        related.innerHTML += `

<article class="card">

<img src="${article.featured_image}" alt="${article.title}">

<div class="content">

<span>${article.category}</span>

<h3>

<a href="article.html?slug=${article.slug}">
${article.title}
</a>

</h3>

<p>${article.summary || ""}</p>

</div>

</article>

`;

    });

}
