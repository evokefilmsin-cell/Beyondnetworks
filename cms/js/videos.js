console.log("videos.js loaded");

// ======================================
// VIDEOS PAGE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedVideo();

    loadLatestVideos();

    loadLatestVideosGrid();

    loadCategoryVideos("Politics", "videosPolitics");
    loadCategoryVideos("Business", "videosBusiness");
    loadCategoryVideos("Technology", "videosTechnology");
    loadCategoryVideos("Sports", "videosSports");
    loadCategoryVideos("Entertainment", "videosEntertainment");

});
// ======================================
// LATEST VIDEOS GRID
// ======================================

async function loadLatestVideosGrid() {

    const container =
        document.getElementById("videosLatest");

    if (!container) {

        console.warn("videosLatest container not found");

        return;

    }

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status", "Published")

        .eq("is_video", true)

        .order("publish_date", {
            ascending: false
        })

        .limit(5);

    if (error) {

        console.error("Latest videos grid error:", error);

        container.innerHTML = `
            <p>Unable to load videos.</p>
        `;

        return;

    }

    renderVideos(container, data);

}
// ======================================
// YOUTUBE THUMBNAIL
// ======================================

function getYouTubeId(url) {

    if (!url) return null;

    try {

        const parsed = new URL(url);

        // youtube.com/watch?v=
        if (parsed.hostname.includes("youtube.com")) {

            return parsed.searchParams.get("v");

        }

        // youtu.be/VIDEO_ID
        if (parsed.hostname.includes("youtu.be")) {

            return parsed.pathname.replace("/", "");

        }

    } catch (error) {

        console.error("Invalid YouTube URL:", url);

    }

    return null;

}


function getYouTubeThumbnail(url) {

    const videoId = getYouTubeId(url);

    if (!videoId) return "";

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

}


// ======================================
// FEATURED VIDEO
// ======================================

async function loadFeaturedVideo() {

    const container =
        document.getElementById("featuredVideo");

    if (!container) {

        console.warn("featuredVideo container not found");

        return;

    }

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status", "Published")

        .eq("is_video", true)

        .order("publish_date", {
            ascending: false
        })

        .limit(1);

    if (error) {

        console.error("Featured video error:", error);

        container.innerHTML = `
            <p>Unable to load video.</p>
        `;

        return;

    }

    if (!data || data.length === 0) {

        container.innerHTML = `
            <p>No videos available.</p>
        `;

        return;

    }

    const video = data[0];

    const thumbnail =
        video.featured_image ||
        getYouTubeThumbnail(video.video_url);

    container.innerHTML = `

        <article class="video-featured-card">

            <a href="video.html?slug=${video.slug}">

                <div class="video-thumbnail">

                    <img
                        src="${thumbnail}"
                        alt="${video.title}"
                    >

                    <span class="play-button">▶</span>

                </div>

            </a>

            <div class="video-content">

                <span class="video-category">
                    ${video.category}
                </span>

                <h1>
                    ${video.title}
                </h1>

                <p>
                    ${video.summary || ""}
                </p>

            </div>

        </article>

    `;

}

// ======================================
// LATEST VIDEOS SIDEBAR
// ======================================

async function loadLatestVideos() {

    const container =
        document.getElementById("latestVideos");

    if (!container) {

        console.warn("latestVideos container not found");

        return;

    }

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status", "Published")

        .eq("is_video", true)

        .order("publish_date", {
            ascending: false
        })

        .limit(4);

    if (error) {

        console.error("Latest videos error:", error);

        container.innerHTML = `
            <p>Unable to load videos.</p>
        `;

        return;

    }

    renderLatestSidebar(container, data);

}

// ======================================
// CATEGORY VIDEOS
// ======================================

async function loadCategoryVideos(
    category,
    containerId
) {

    const container =
        document.getElementById(containerId);

    if (!container) {

        console.warn(
            `${containerId} container not found`
        );

        return;

    }

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status", "Published")

        .eq("is_video", true)

        .eq("category", category)

        .order("publish_date", {
            ascending: false
        })

        .limit(4);

    if (error) {

        console.error(
            `${category} videos error:`,
            error
        );

        return;

    }

    renderVideos(container, data);

}

// ======================================
// LATEST VIDEO SIDEBAR RENDER
// ======================================

function renderLatestSidebar(container, videos) {

    if (!videos || videos.length === 0) {

        container.innerHTML = `
            <p class="no-videos">
                No videos available.
            </p>
        `;

        return;

    }

    container.innerHTML = "";

    videos.forEach(video => {

        const thumbnail =
            video.featured_image ||
            getYouTubeThumbnail(video.video_url);

        container.innerHTML += `

            <a
                href="video.html?slug=${encodeURIComponent(video.slug)}"
                class="latest-video-item"
            >

                <div class="latest-video-thumb">

                    <img
                        src="${thumbnail}"
                        alt="${video.title}"
                    >

                    <span class="latest-play">
                        ▶
                    </span>

                </div>

                <div class="latest-video-info">

                    <h3>
                        ${video.title}
                    </h3>

                    <span>
                        ${video.category}
                    </span>

                </div>

            </a>

        `;

    });

}
// ======================================
// RENDER VIDEO CARDS
// ======================================

function renderVideos(container, videos) {

    if (!videos || videos.length === 0) {

        container.innerHTML = `
            <p class="no-videos">
                No videos available.
            </p>
        `;

        return;

    }

    container.innerHTML = "";

    videos.forEach(video => {

        const thumbnail =
            video.featured_image ||
            getYouTubeThumbnail(video.video_url);

        container.innerHTML += `

            <a
                href="video.html?slug=${video.slug}"
                class="video-card"
            >

                <div class="video-card-image">

                    <img
                        src="${thumbnail}"
                        alt="${video.title}"
                    >

                    <span class="play-button">
                        ▶
                    </span>

                </div>

                <div class="video-card-content">

                    <span>
                        ${video.category}
                    </span>

                    <h3>
                        ${video.title}
                    </h3>

                    <p>
                        ${video.summary || ""}
                    </p>

                </div>

            </a>

        `;

    });

}
