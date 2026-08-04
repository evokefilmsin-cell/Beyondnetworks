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

    document.getElementById("heroCategory").innerText =
        article.category || "Breaking News";

    document.getElementById("heroTitle").innerText =
        article.title;

    document.getElementById("heroSummary").innerText =
        article.summary || "";

    document.getElementById("heroButton").href =
        "article-preview.html?id=" + article.id;

    if(article.featured_image){

        document.getElementById("featuredHero").style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.75)), url('${article.featured_image}')`;

    }

}
