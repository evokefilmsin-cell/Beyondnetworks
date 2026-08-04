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

        .limit(1)

        .single();

    if (error) {

        console.log("No featured article found");

        return;

    }

    console.log(data);

}
