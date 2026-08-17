// ======================================
// Beyond Networks CMS
// videos.js
// ======================================

console.log("videos.js loaded");


// ======================================
// GLOBAL
// ======================================

let allVideos = [];


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadVideos();

    const search =
        document.getElementById("searchVideos");

    const statusFilter =
        document.getElementById("statusFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");


    if (search) {

        search.addEventListener("input", filterVideos);

    }


    if (statusFilter) {

        statusFilter.addEventListener("change", filterVideos);

    }


    if (categoryFilter) {

        categoryFilter.addEventListener("change", filterVideos);

    }

});


// ======================================
// LOAD VIDEOS
// ======================================

async function loadVideos() {

    const { data, error } = await supabaseClient

        .from("articles")

        .select(`
            id,
            title,
            slug,
            summary,
            featured_image,
            video_url,
            category,
            author,
            status,
            is_featured,
            is_trending,
            is_breaking,
            is_video,
            publish_date,
            created_at
        `)

        .eq("is_video", true)

        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Videos loading error:",
            error
        );

        const tbody =
            document.getElementById(
                "videosTableBody"
            );

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center text-danger py-5"
                >

                    Failed to load videos.

                </td>

            </tr>

        `;

        return;

    }


    allVideos = data || [];


    updateStats(allVideos);

    renderVideos(allVideos);

}


// ======================================
// STATS
// ======================================

function updateStats(videos) {

    const total =
        videos.length;


    const published =
        videos.filter(
            video =>
                video.status === "Published"
        ).length;


    const drafts =
        videos.filter(
            video =>
                video.status === "Draft"
        ).length;


    const totalElement =
        document.getElementById(
            "totalVideos"
        );


    const publishedElement =
        document.getElementById(
            "publishedVideos"
        );


    const draftElement =
        document.getElementById(
            "draftVideos"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (publishedElement) {

        publishedElement.textContent =
            published;

    }


    if (draftElement) {

        draftElement.textContent =
            drafts;

    }

}


// ======================================
// RENDER
// ======================================

function renderVideos(videos) {

    const tbody =
        document.getElementById(
            "videosTableBody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (!videos.length) {

        tbody.innerHTML = `

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


    videos.forEach(video => {

        const row =
            document.createElement("tr");


        // ==================================
        // IMAGE
        // ==================================

        const image =
            video.featured_image
                ? video.featured_image
                : "https://via.placeholder.com/120x70?text=Video";


        // ==================================
        // STATUS
        // ==================================

        let statusClass =
            "secondary";


        if (video.status === "Published") {

            statusClass = "success";

        }

        if (video.status === "Draft") {

            statusClass = "secondary";

        }

        if (video.status === "Scheduled") {

            statusClass = "warning";

        }


        // ==================================
        // DATE
        // ==================================

        let publishDate =
            "—";


        if (video.publish_date) {

            publishDate =
                new Date(
                    video.publish_date
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        row.innerHTML = `

            <td>

                <div
                    class="d-flex align-items-center"
                    style="min-width:280px;"
                >

                    <img
                        src="${image}"
                        alt="${escapeHtml(video.title)}"
                        style="
                            width:110px;
                            height:65px;
                            object-fit:cover;
                            border-radius:8px;
                            margin-right:15px;
                        "
                    >


                    <div>

                        <div
                            class="fw-semibold"
                            style="max-width:250px;"
                        >

                            ${escapeHtml(video.title)}

                        </div>


                        <small class="text-muted">

                            ${escapeHtml(video.author || "No author")}

                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span class="badge bg-dark">

                    ${escapeHtml(video.category || "News")}

                </span>

            </td>


            <td>

                <span
                    class="badge bg-${statusClass}"
                >

                    ${escapeHtml(video.status)}

                </span>

            </td>


            <td>

                ${publishDate}

            </td>


            <td>

                ${
                    video.is_featured
                        ? "⭐"
                        : "—"
                }

            </td>


            <td class="text-end">

                <div class="btn-group">


                    <button
                        class="btn btn-sm btn-outline-light"
                        onclick="viewVideo('${video.id}')"
                        title="View"
                    >

                        <i class="bi bi-eye"></i>

                    </button>


                    <button
                        class="btn btn-sm btn-outline-light"
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


                </div>

            </td>

        `;


        tbody.appendChild(row);

    });

}


// ======================================
// FILTER
// ======================================

function filterVideos() {

    const search =
        document.getElementById(
            "searchVideos"
        ).value
        .toLowerCase()
        .trim();


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filtered =
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


    renderVideos(filtered);

}


// ======================================
// EDIT
// ======================================

function editVideo(id) {

    window.location.href =
        `video-editor.html?id=${id}`;

}


// ======================================
// VIEW
// ======================================

function viewVideo(id) {

    const video =
        allVideos.find(
            item => item.id === id
        );


    if (!video) return;


    if (video.video_url) {

        window.open(
            video.video_url,
            "_blank"
        );

        return;

    }


    alert(
        "No video URL available."
    );

}


// ======================================
// DELETE
// ======================================

async function deleteVideo(id) {

    const video =
        allVideos.find(
            item => item.id === id
        );


    if (!video) return;


    const confirmed =
        confirm(
            `Delete "${video.title}"?`
        );


    if (!confirmed) return;


    const { error } =
        await supabaseClient

            .from("articles")

            .delete()

            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Failed to delete video: " +
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
// ESCAPE HTML
// ======================================

function escapeHtml(value) {

    if (!value) return "";


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
