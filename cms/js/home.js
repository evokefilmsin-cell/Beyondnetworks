console.log("home.js loaded");

// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedStory();

    loadBreakingNews();

});
async function loadFeaturedStory() {

    const { data, error } = await supabaseClient

        .from("articles")
        .select("*")
        .eq("is_featured", true)
        .eq("status", "Published")
        .order("publish_date", { ascending: false })
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No featured article found");
        return;
    }
async function loadBreakingNews() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("title,slug")
        .eq("status", "Published")
        .eq("is_breaking", true)
        .order("publish_date", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const ticker = document.getElementById("breakingTicker");

    if (!ticker) return;

    if (!data || data.length === 0) {
        ticker.innerHTML = "No Breaking News";
        return;
    }

    ticker.innerHTML = data.map(article => `
        <a href="article.html?slug=${article.slug}">
            🔴 ${article.title}
        </a>
    `).join("&nbsp;&nbsp;&nbsp;&nbsp;");
}
    const article = data[0];

    console.log(article);

    // -------------------------
    // Update Hero
    // -------------------------
document.getElementById("heroCategory").textContent =
    article.category;

document.getElementById("heroTitle").textContent =
    article.title;

document.getElementById("heroSummary").textContent =
    article.summary;

document.getElementById("heroButton").href =
    "article.html?slug=" + article.slug;

if(article.featured_image){

    document.getElementById("featuredHero").style.backgroundImage =
        `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.75)), url('${article.featured_image}')`;

}
}
