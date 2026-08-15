console.log("home.js loaded");

// ======================================
// Load everything after page loads
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedStory();
    loadBreakingNews();
    loadLatestUpdates();
    loadChannels();
    loadTrendingStories();
});

// ======================================
// FEATURED STORY
// ======================================

async function loadFeaturedStory() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .eq("is_featured", true)
        .order("publish_date", { ascending: false })
        .limit(1);

    if (error) {
        console.error("Featured Story Error:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No featured story found");
        return;
    }

    const article = data[0];

    console.log("Featured:", article);

    // Hero Category
    document.getElementById("heroCategory").textContent =
        article.category || "Breaking News";

    // Hero Title
   const title =
    article.title.length > 70
        ? article.title.substring(0, 70) + "..."
        : article.title;

document.getElementById("heroTitle").textContent = title;

    // Hero Summary
    document.getElementById("heroSummary").textContent =
        article.summary || "";

    // Hero Button
    document.getElementById("heroButton").href =
        "article.html?slug=" + article.slug;

    // Hero Background
    if (article.featured_image) {

        document.getElementById("featuredHero").style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.75)),
             url('${article.featured_image}')`;

    }

}

// ======================================
// BREAKING NEWS TICKER
// ======================================

async function loadBreakingNews() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("title, slug")
        .eq("status", "Published")
        .eq("is_breaking", true)
        .order("publish_date", { ascending: false });

    if (error) {
        console.error("Breaking News Error:", error);
        return;
    }

    const ticker = document.getElementById("breakingTicker");

    if (!ticker) return;

    if (!data || data.length === 0) {

        ticker.innerHTML = "No Breaking News";

        return;

    }

    ticker.innerHTML = data.map(article =>

        `<a href="article.html?slug=${article.slug}">
            🔴 ${article.title}
        </a>`

    ).join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

}
// ======================================
// LATEST UPDATES
// ======================================

async function loadLatestUpdates() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("title, category, slug")
        .eq("status", "Published")
        .order("publish_date", { ascending: false })
        .limit(3);

    if (error) {

        console.error("Latest Updates Error:", error);
        return;

    }

    const container = document.getElementById("latestUpdates");

    if (!container) return;

    if (!data || data.length === 0) {

        container.innerHTML = "<p>No latest articles.</p>";
        return;

    }

    container.innerHTML = "";

    data.forEach(article => {

        container.innerHTML += `
            <div class="mini-news">

                <span>${article.category}</span>

                <p>
                    <a href="article.html?slug=${article.slug}">
                        ${article.title}
                    </a>
                </p>

            </div>
        `;

    });

}
// ======================================
// TRENDING STORIES
// ======================================

async function loadTrendingStories() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .eq("is_trending", true)
        .order("publish_date", { ascending: false })
        .limit(3);

    if (error) {
        console.error("Trending Error:", error);
        return;
    }

    const container = document.getElementById("trendingStories");

    if (!container) return;

    if (!data || data.length === 0) {

        container.innerHTML = `
            <p>No Trending Stories</p>
        `;

        return;

    }

    container.innerHTML = "";

    data.forEach(article => {

        container.innerHTML += `

        <div class="mini-news">

            <span>${article.category}</span>

            <p>
                <a href="article.html?slug=${article.slug}">
                    ${article.title}
                </a>
            </p>

        </div>

        `;

    });

}
// ======================================
// LATEST BY CATEGORY
// ======================================

async function loadChannels() {

    const categories = [
        "Politics",
        "Business",
        "Technology",
        "Sports",
        "Entertainment"
    ];

    const container = document.getElementById("channelsContainer");

    if (!container) return;

    container.innerHTML = "";

    for (const category of categories) {

        const { data, error } = await supabaseClient
            .from("articles")
            .select("*")
            .eq("status", "Published")
            .eq("category", category)
            .order("publish_date", { ascending: false })
            .limit(15);

        if (error) {
            console.error(error);
            continue;
        }

        if (!data.length) continue;

        let html = `

<div class="channel-row">

    <div class="channel-header">

        <h3>${category}</h3>

        <a href="${category.toLowerCase()}.html">
            View All →
        </a>

    </div>

    <button class="slider-arrow prev">
        &#10094;
    </button>

    <div class="headline-slider">

`;

        data.forEach(article => {

            html += `

<a class="headline-card"
href="article.html?slug=${article.slug}">

    <span>
        ${article.category}
    </span>

    <h4>
        ${article.title}
    </h4>

    <p>
        ${new Date(article.publish_date).toLocaleDateString()}
    </p>

</a>

`;

        });

        html += `

    </div>

    <button class="slider-arrow next">
        &#10095;
    </button>

</div>

`;

        container.innerHTML += html;

    }

    // Arrow functionality

    document.querySelectorAll(".channel-row").forEach(row=>{

        const slider =
            row.querySelector(".headline-slider");

        row.querySelector(".next").onclick = ()=>{

            slider.scrollBy({
                left:300,
                behavior:"smooth"
            });

        };

        row.querySelector(".prev").onclick = ()=>{

            slider.scrollBy({
                left:-300,
                behavior:"smooth"
            });

        };

    });

}
