console.log("home.js loaded");

// Wait until page loads
document.addEventListener("DOMContentLoaded", loadFeaturedStory);

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
