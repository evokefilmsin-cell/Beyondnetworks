console.log("category.js loaded");

// ======================================
// CATEGORY
// ======================================

const category =
    document.title.split("|")[0].trim();

document.addEventListener("DOMContentLoaded", () => {

    loadBreakingNews();

    loadFeaturedStory();

    loadTrendingStories();

});

// ======================================
// BREAKING NEWS
// ======================================

async function loadBreakingNews(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("title,slug")

        .eq("status","Published")

        .eq("is_breaking",true)

        .order("publish_date",{ascending:false})

        .limit(10);

    if(error){

        console.error(error);

        return;

    }

    const ticker =
        document.getElementById("breakingTicker");

    if(!ticker) return;

    ticker.innerHTML = "";

    data.forEach(article=>{

        ticker.innerHTML += `

<a href="article.html?slug=${article.slug}">

🔴 ${article.title}

</a>

`;

    });

}

// ======================================
// FEATURED STORY
// ======================================

async function loadFeaturedStory(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .eq("is_featured",true)

        .order("publish_date",{ascending:false})

        .limit(1)

        .single();

    if(error){

        console.error(error);

        return;

    }

    const container =
        document.getElementById("featuredPolitics");

    if(!container) return;

    container.innerHTML = `

<img src="${data.featured_image}">

<div class="featured-content">

<span>${data.category}</span>

<h1>

${data.title}

</h1>

<p>

${data.summary || ""}

</p>

<a href="article.html?slug=${data.slug}">

Read Story →

</a>

</div>

`;

}

// ======================================
// TRENDING
// ======================================

async function loadTrendingStories(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .eq("is_trending",true)

        .order("publish_date",{ascending:false})

        .limit(5);

    if(error){

        console.error(error);

        return;

    }

    const container =
        document.getElementById("politicsTrending");

    if(!container) return;

    container.innerHTML="";

    data.forEach(article=>{

        container.innerHTML += `

<div class="trending-item">

<img
src="${article.featured_image}"
alt="${article.title}">

<div>

<span>

${article.category}

</span>

<h4>

<a href="article.html?slug=${article.slug}">

${article.title}

</a>

</h4>

</div>

</div>

`;

    });

}
