console.log("CMS videos.js loaded");

// ======================================
// CMS VIDEO MANAGEMENT
// ======================================

let allVideos = [];


// ======================================
// LOAD WHEN PAGE OPENS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadVideos();

    // Search
    const searchInput = document.getElementById("searchVideos");

    if (searchInput) {
        searchInput.addEventListener("input", filterVideos);
    }

    // Status filter
    const statusFilter = document.getElementById("statusFilter");

    if (statusFilter) {
        statusFilter.addEventListener("change", filterVideos);
    }

    // Category filter
    const categoryFilter = document.getElementById("categoryFilter");

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterVideos);
    }

});


// ======================================
// LOAD VIDEOS FROM SUPABASE
// ======================================

async function loadVideos() {

    console.log("Loading videos from Supabase...");

    const tableBody =
        document.getElementById("videosTableBody");

    if (!tableBody) {

        console.error("videosTableBody not found");

        return;

    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-5">
                Loading videos...
            </td>
        </tr>
    `;


    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("is_video", true)

        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Error loading videos:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger py-5">
                    Failed to load videos.
                    <br>
                    ${error.message}
                </td>
            </tr>
        `;

        return;

    }


    console.log("Videos loaded:", data);

    allVideos = data || [];


    updateStats(allVideos);

    renderVideos(allVideos);

}


// ======================================
// UPDATE STATISTICS
// ======================================

function updateStats(videos) {

    const totalVideos =
        document.getElementById("totalVideos");

    const publishedVideos =
        document.getElementById("publishedVideos");

    const draftVideos =
        document.getElementById("draftVideos");


    if (totalVideos) {

        totalVideos.textContent =
            videos.length;

    }


    if (publishedVideos) {

        publishedVideos.textContent =
            videos.filter(video =>
                video.status === "Published"
            ).length;

    }


    if (draftVideos) {

        draftVideos.textContent =
            videos.filter(video =>
                video.status === "Draft"
            ).length;

    }

}


// ======================================
// FILTER VIDEOS
// ======================================

function filterVideos() {

    const searchInput =
        document.getElementById("searchVideos");

    const statusFilter =
        document.getElementById("statusFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
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


            // Search title
            const matchesSearch =
                !search ||
                (video.title || "")
                    .toLowerCase()
                    .includes(search);


            // Status
            const matchesStatus =
                status === "all" ||
                video.status === status;


            // Category
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
// RENDER VIDEO TABLE
// ======================================

function renderVideos(videos) {

    const tableBody =
        document.getElementById("videosTableBody");


    if (!tableBody) {

        console.error("videosTableBody not found");

        return;

    }


    if (!videos || videos.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="text-center py-5 text-muted"
                >
                    No videos found.
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML = "";


    videos.forEach(video => {


        // ----------------------------------
        // Thumbnail
        // ----------------------------------

        let thumbnail =
            video.featured_image || "";


        // ----------------------------------
        // Status badge
        // ----------------------------------

        let statusClass =
            "bg-secondary";


        if (video.status === "Published") {

            statusClass =
                "bg-success";

        }

        if (video.status === "Draft") {

            statusClass =
                "bg-warning text-dark";

        }

        if (video.status === "Scheduled") {

            statusClass =
                "bg-info text-dark";

        }


        // ----------------------------------
        // Publish date
        // ----------------------------------

        let publishDate =
            "—";


        if (video.publish_date) {

            publishDate =
                new Date(video.publish_date)
                    .toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    });

        }


        // ----------------------------------
        // Featured
        // ----------------------------------

        const featured =
            video.is_featured
                ? "⭐ Yes"
                : "—";


        // ----------------------------------
        // Create row
        // ----------------------------------

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div
                    class="d-flex align-items-center"
                    style="gap: 15px;"
                >

                    <div
                        style="
                            width:120px;
                            height:70px;
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
                                alt="${escapeHtml(video.title || "Video")}"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:cover;
                                "
                            >
                            `

                            :

                            `
                            <div
                                class="d-flex
                                       align-items-center
                                       justify-content-center
                                       h-100"
                            >
                                🎥
                            </div>
                            `
                        }

                    </div>


                    <div>

                        <strong>
                            ${escapeHtml(video.title || "Untitled")}
                        </strong>

                        <div
                            class="text-muted small"
                        >
                            ${escapeHtml(video.brand || "Beyond News")}
                        </div>

                    </div>

                </div>

            </td>


            <td>

                ${escapeHtml(video.category || "—")}

            </td>


            <td>

                <span
                    class="badge ${statusClass}"
                >

                    ${escapeHtml(video.status || "Draft")}

                </span>

            </td>


            <td>

                ${publishDate}

            </td>


            <td>

                ${featured}

            </td>


            <td class="text-end">

                <button
                    class="btn btn-sm btn-outline-light me-1"
                    onclick="editVideo('${video.id}')"
                    title="Edit"
                >

                    <i class="bi bi-pencil"></i>

                </button>


                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="deleteVideo('${video.id}')"
                    title="Delete"
                >

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================
// EDIT VIDEO
// ======================================

function editVideo(id) {

    window.location.href =
        `video-editor.html?id=${id}`;

}


// ======================================
// DELETE VIDEO
// ======================================

async function deleteVideo(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this video?"
        );


    if (!confirmed) {

        return;

    }


    const { error } =
        await supabaseClient

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


    alert("Video deleted successfully.");


    loadVideos();

}


// ======================================
// HTML ESCAPE
// ======================================

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
