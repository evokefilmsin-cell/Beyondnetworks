console.log("videos.js loaded");

// ======================================
// INITIAL LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedVideo();

    loadLatestVideos();

    loadCategoryVideos("videosPolitics", "Politics");
    loadCategoryVideos("videosBusiness", "Business");
    loadCategoryVideos("videosTechnology", "Technology");
    loadCategoryVideos("videosSports", "Sports");
    loadCategoryVideos("videosEntertainment", "Entertainment");

});


// ======================================
// FEATURED VIDEO
// ======================================

async function loadFeaturedVideo() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .eq("is_video", true)
        .eq("is_featured", true)
        .order("publish_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {

        console.error("Featured Video Error:", error);

        return;

    }

    const container =
        document.getElementById("featuredVideo");

    if (!container) return;

    if (!data) {

        container.innerHTML = `
            <p>No featured video available.</p>
        `;

        return;

    }

    container.innerHTML = `

        <article class="featured-video-card">

            <a href="article.html?slug=${data.slug}">

                <img
                    src="${data.featured_image || ""}"
                    alt="${data.title}"
                >

            </a>

            <div class="featured-video-content">

                <span>${data.category}</span>

                <h1>

                    <a href="article.html?slug=${data.slug}">

                        ${data.title}

                    </a>

                </h1>

                <p>

                    ${data.summary || ""}

                </p>

                <a
                    href="article.html?slug=${data.slug}"
                    class="read-story">

                    Watch Video →

                </a>

            </div>

        </article>

    `;

}


// ======================================
// LATEST VIDEOS
// ======================================

async function loadLatestVideos() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .eq("is_video", true)
        .order("publish_date", { ascending: false })
        .limit(4);

    if (error) {

        console.error("Latest Videos Error:", error);

        return;

    }

    const container =
        document.getElementById("latestVideos");

    if (!container) return;

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <p>No videos available.</p>
        `;

        return;

    }

    data.forEach(article => {

        container.innerHTML += `

            <div class="top-story-image">

                <a href="article.html?slug=${article.slug}">

                    <img
                        src="${article.featured_image || ""}"
                        alt="${article.title}"
                    >

                </a>

                <h4>

                    <a href="article.html?slug=${article.slug}">

                        ${article.title}

                    </a>

                </h4>

            </div>

        `;

    });

}


// ======================================
// CATEGORY VIDEOS
// ======================================

async function loadCategoryVideos(targetId, categoryName) {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .eq("is_video", true)
        .eq("category", categoryName)
        .order("publish_date", { ascending: false })
        .limit(4);

    if (error) {

        console.error(
            `${categoryName} Videos Error:`,
            error
        );

        return;

    }

    const container =
        document.getElementById(targetId);

    if (!container) return;

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <p class="no-videos">
                No ${categoryName} videos available.
            </p>
        `;

        return;

    }

    data.forEach(article => {

        container.innerHTML += `

            <a
                href="article.html?slug=${article.slug}"
                class="category-card">

                <img
                    src="${article.featured_image || ""}"
                    alt="${article.title}"
                >

                <div class="content">

                    <span>${article.category}</span>

                    <h3>

                        ${article.title}

                    </h3>

                    <p>

                        ${article.summary || ""}

                    </p>

                </div>

            </a>

        `;

    });

}
