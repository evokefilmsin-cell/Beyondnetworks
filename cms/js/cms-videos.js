console.log("CMS videos.js loaded");

// ======================================
// CMS VIDEO MANAGEMENT
// ======================================

let allVideos = [];

let profileMap = {};


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadVideos();

    const searchInput =
        document.getElementById("searchVideos");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterVideos
        );

    }


    const statusFilter =
        document.getElementById("statusFilter");

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterVideos
        );

    }


    const categoryFilter =
        document.getElementById("categoryFilter");

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterVideos
        );

    }

});


// ======================================
// LOAD VIDEOS
// ======================================

async function loadVideos() {

    console.log("Loading videos from Supabase...");

    const tableBody =
        document.getElementById("videosTableBody");


    if (!tableBody) {

        console.error(
            "videosTableBody not found"
        );

        return;

    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="8"
                class="text-center py-5">
                Loading videos...
            </td>
        </tr>
    `;


    // ==================================
    // LOAD USER PROFILES
    // ==================================

    const {
        data: profiles,
        error: profileError
    } = await supabaseClient

        .from("user_profiles")

        .select(
            "user_id, full_name, email"
        );


    if (profileError) {

        console.error(
            "Profile loading error:",
            profileError
        );

    }


    profileMap = {};


    if (profiles) {

        profiles.forEach(profile => {

            profileMap[profile.user_id] =
                profile.full_name ||
                profile.email ||
                "Unknown User";

        });

    }


    // ==================================
    // LOAD VIDEOS
    // ==================================

    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("is_video", true)

        .order(
            "publish_date",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Error loading videos:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="text-center text-danger py-5">

                    Failed to load videos.

                    <br>

                    ${escapeHtml(error.message)}

                </td>
            </tr>
        `;

        return;

    }


    allVideos = data || [];


    console.log(
        "Videos loaded:",
        allVideos
    );


    updateStats(allVideos);

    renderVideos(allVideos);

}


// ======================================
// STATS
// ======================================

function updateStats(videos) {

    const total =
        document.getElementById(
            "totalVideos"
        );


    const published =
        document.getElementById(
            "publishedVideos"
        );


    const scheduled =
        document.getElementById(
            "scheduledVideos"
        );


    const drafts =
        document.getElementById(
            "draftVideos"
        );


    if (total) {

        total.textContent =
            videos.length;

    }


    if (published) {

        published.textContent =
            videos.filter(video =>
                video.status === "Published"
            ).length;

    }


    if (scheduled) {

        scheduled.textContent =
            videos.filter(video =>
                video.status === "Scheduled"
            ).length;

    }


    if (drafts) {

        drafts.textContent =
            videos.filter(video =>
                video.status === "Draft"
            ).length;

    }

}


// ======================================
// FILTER
// ======================================

function filterVideos() {

    const searchInput =
        document.getElementById(
            "searchVideos"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "all";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const filteredVideos =
        allVideos.filter(video => {


            const matchesSearch =
                !search ||
                (video.title || "")
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                status === "all" ||
                video.status === status;


            const matchesCategory =
                category === "all" ||
                video.category === category;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );

        });


    renderVideos(filteredVideos);

}


// ======================================
// YOUTUBE THUMBNAIL
// ======================================

function getYouTubeThumbnail(url) {

    if (!url) {
        return "";
    }

    try {

        const parsedUrl = new URL(url);

        let videoId = "";

        // youtube.com/watch?v=VIDEO_ID
        if (
            parsedUrl.hostname.includes("youtube.com") ||
            parsedUrl.hostname.includes("youtube-nocookie.com")
        ) {

            videoId =
                parsedUrl.searchParams.get("v") || "";

            // /shorts/VIDEO_ID
            if (!videoId) {

                const shortsMatch =
                    parsedUrl.pathname.match(
                        /\/shorts\/([^/]+)/i
                    );

                if (shortsMatch) {
                    videoId = shortsMatch[1];
                }

            }

            // /embed/VIDEO_ID
            if (!videoId) {

                const embedMatch =
                    parsedUrl.pathname.match(
                        /\/embed\/([^/]+)/i
                    );

                if (embedMatch) {
                    videoId = embedMatch[1];
                }

            }

            // /live/VIDEO_ID
            if (!videoId) {

                const liveMatch =
                    parsedUrl.pathname.match(
                        /\/live\/([^/]+)/i
                    );

                if (liveMatch) {
                    videoId = liveMatch[1];
                }

            }

        }

        // youtu.be/VIDEO_ID
        if (
            !videoId &&
            parsedUrl.hostname.includes("youtu.be")
        ) {

            videoId =
                parsedUrl.pathname
                    .split("/")
                    .filter(Boolean)[0] || "";

        }

        if (!videoId) {
            return "";
        }

        // Remove any accidental parameters
        videoId =
            videoId.split("?")[0]
                .split("&")[0]
                .trim();

        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    } catch (error) {

        console.error(
            "YouTube thumbnail error:",
            error
        );

        return "";

    }

}

// ======================================
// RENDER VIDEOS
// ======================================

function renderVideos(videos) {

    const tableBody =
        document.getElementById(
            "videosTableBody"
        );


    if (!tableBody) {

        return;

    }


    if (
        !videos ||
        videos.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="text-center py-5 text-muted">

                    No videos found.

                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML = "";


    videos.forEach(video => {


       // ==================================
// THUMBNAIL
// ==================================

const youtubeThumbnail =
    getYouTubeThumbnail(
        video.video_url
    );

const featuredThumbnail =
    video.featured_image || "";

const thumbnail =
    featuredThumbnail ||
    youtubeThumbnail ||
    "";

        // ==================================
        // CREATOR
        // ==================================

        const creatorName =
            video.created_by
                ? (
                    profileMap[
                        video.created_by
                    ] || "Unknown User"
                )
                : "—";


        // ==================================
        // STATUS
        // ==================================

        let statusClass =
            "bg-secondary";


        if (
            video.status === "Published"
        ) {

            statusClass =
                "bg-success";

        }


        if (
            video.status === "Draft"
        ) {

            statusClass =
                "bg-warning text-dark";

        }


        if (
            video.status === "Scheduled"
        ) {

            statusClass =
                "bg-info text-dark";

        }


        // ==================================
        // PUBLISHED DATE
        // ==================================

        const publishDate =
            formatDate(
                video.publish_date
            );


        // ==================================
        // UPDATED DATE
        // ==================================

        const updatedDate =
            formatDate(
                video.updated_at
            );


        // ==================================
        // FLAGS
        // ==================================

        let flags = "";


        if (video.is_featured) {

            flags += `
                <span class="badge bg-warning text-dark me-1">
                    FEATURED
                </span>
            `;

        }


        if (video.is_trending) {

            flags += `
                <span class="badge bg-primary me-1">
                    TRENDING
                </span>
            `;

        }


        if (!flags) {

            flags =
                `<span class="text-muted">—</span>`;

        }


        // ==================================
        // ROW
        // ==================================

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <!-- VIDEO -->

            <td>

                <div
                    class="d-flex align-items-center"
                    style="gap:15px;"
                >

                    <div
                        style="
                            width:140px;
                            height:80px;
                            overflow:hidden;
                            border-radius:8px;
                            background:#222;
                            flex-shrink:0;
                        "
                    >

                        ${
                            thumbnail

                            ?

                            `
                            <img
    src="${thumbnail}"
    alt="${escapeHtml(
        video.title ||
        "Video"
    )}"
    style="
        width:100%;
        height:100%;
        object-fit:cover;
    "
    data-youtube-thumbnail="${youtubeThumbnail}"
    onerror="
        if (
            this.dataset.youtubeThumbnail &&
            this.src !== this.dataset.youtubeThumbnail
        ) {
            this.src = this.dataset.youtubeThumbnail;
        } else {
            this.style.display = 'none';
            this.parentElement.innerHTML = `
                <div
                    style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:28px;
                    "
                >
                    🎥
                </div>
            `;
        }
    "
>
                            `

                            :

                            `
                            <div
                                class="
                                    d-flex
                                    align-items-center
                                    justify-content-center
                                    h-100
                                "
                                style="font-size:28px;"
                            >
                                🎥
                            </div>
                            `
                        }

                    </div>


                    <div>

                        <strong>
                            ${escapeHtml(
                                video.title ||
                                "Untitled Video"
                            )}
                        </strong>


                        <div class="text-muted small mt-1">

                            ${escapeHtml(
                                video.brand ||
                                "Beyond News"
                            )}

                        </div>


                        ${
                            video.video_url
                            ?
                            `
                            <a
                                href="${escapeHtml(
                                    video.video_url
                                )}"
                                target="_blank"
                                rel="noopener"
                                class="small text-info"
                            >
                                Watch Video ↗
                            </a>
                            `
                            :
                            ""
                        }

                    </div>

                </div>

            </td>


            <!-- CATEGORY -->

            <td>

                ${escapeHtml(
                    video.category ||
                    "—"
                )}

            </td>


            <!-- CREATED BY -->

            <td>

                <strong>
                    ${escapeHtml(
                        creatorName
                    )}
                </strong>

            </td>


            <!-- PUBLISHED -->

            <td>

                ${publishDate}

            </td>


            <!-- UPDATED -->

            <td>

                ${updatedDate}

            </td>


            <!-- FLAGS -->

            <td>

                ${flags}

            </td>


            <!-- STATUS -->

            <td>

                <span
                    class="badge ${statusClass}"
                >

                    ${escapeHtml(
                        video.status ||
                        "Draft"
                    )}

                </span>

            </td>


            <!-- ACTIONS -->

            <td class="text-end">

                <button
                    class="
                        btn
                        btn-sm
                        btn-outline-light
                        me-1
                        edit-btn
                    "
                    onclick="
                        editVideo('${video.id}')
                    "
                    title="Edit Video"
                >

                    <i class="bi bi-pencil"></i>

                </button>


                <button
                    class="
                        btn
                        btn-sm
                        btn-outline-danger
                        delete-btn
                    "
                    onclick="
                        deleteVideo('${video.id}')
                    "
                    title="Delete Video"
                >

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    // Re-apply role permissions
    if (
        typeof applyPagePermissions ===
        "function"
    ) {

        applyPagePermissions();

    }

}


// ======================================
// DATE FORMAT
// ======================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "—";

    }


    return new Date(
        dateValue
    ).toLocaleString(
        "en-IN",
        {
            timeZone:
                "Asia/Kolkata",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit",

            hour12:
                true
        }
    );

}


// ======================================
// EDIT
// ======================================

function editVideo(id) {

    window.location.href =
        `video-editor.html?id=${id}`;

}


// ======================================
// DELETE
// ======================================

async function deleteVideo(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this video?"
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } = await supabaseClient

        .from("articles")

        .delete()

        .eq("id", id);


    if (error) {

        console.error(
            "Delete video error:",
            error
        );


        alert(
            "Failed to delete video:\n" +
            error.message
        );

        return;

    }


    alert(
        "Video deleted successfully."
    );


    loadVideos();

}


// ======================================
// HTML ESCAPE
// ======================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
