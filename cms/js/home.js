console.log("home.js loaded");

// ======================================
// Load everything after page loads
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedStory();
    loadBreakingNews();
    loadLatestUpdates();
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
