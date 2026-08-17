console.log("CMS videos.js loaded");

let allVideos = [];


// ======================================
// INITIAL LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadVideos();

    setupFilters();

});


// ======================================
// LOAD VIDEOS
// ======================================

async function loadVideos() {

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("is_video", true)

        .order("publish_date", {
            ascending: false
        });


    if (error) {

        console.error(
            "Videos Load Error:",
            error
        );

        return;

    }


    allVideos = data || [];

    renderVideos(allVideos);

}


// ======================================
// RENDER
// ======================================

function renderVideos(videos) {

    const table =
        document.getElementById("videosTable");


    if (!table) return;


    table.innerHTML = "";


    if (!videos || videos.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;">

                    No videos found.

                </td>

            </tr>

        `;

        return;

    }


    videos.forEach(video => {

        const date =
            video.publish_date
                ? new Date(video.publish_date)
                    .toLocaleDateString()
                : "-";


        table.innerHTML += `

            <tr>

                <!-- THUMBNAIL -->

                <td>

                    ${
                        video.featured_image

                        ?

                        `
                        <img
                            src="${video.featured_image}"
                            alt="${video.title}"
                            style="
                                width:90px;
                                height:55px;
                                object-fit:cover;
                                border-radius:6px;
                            "
                        >
                        `

                        :

                        `
                        <div>
                            No Image
                        </div>
                        `
                    }

                </td>


                <!-- TITLE -->

                <td>

                    <strong>

                        ${video.title}

                    </strong>

                </td>


                <!-- CATEGORY -->

                <td>

                    ${video.category || "-"}

                </td>


                <!-- STATUS -->

                <td>

                    <span class="status-badge">

                        ${video.status || "-"}

                    </span>

                </td>


                <!-- FEATURED -->

                <td>

                    ${
                        video.is_featured
                        ? "✓"
                        : "—"
                    }

                </td>


                <!-- TRENDING -->

                <td>

                    ${
                        video.is_trending
                        ? "✓"
                        : "—"
                    }

                </td>


                <!-- DATE -->

                <td>

                    ${date}

                </td>


                <!-- ACTIONS -->

                <td>

                    <a
                        href="video-editor.html?id=${video.id}"
                        class="btn-small">

                        Edit

                    </a>


                    <button
                        class="btn-danger-small"
                        onclick="deleteVideo('${video.id}')">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


// ======================================
// FILTERS
// ======================================

function setupFilters() {

    const search =
        document.getElementById("videoSearch");

    const category =
        document.getElementById("videoCategory");

    const status =
        document.getElementById("videoStatus");


    function applyFilters() {

        const searchValue =
            search.value
                .toLowerCase()
                .trim();


        const categoryValue =
            category.value;


        const statusValue =
            status.value;


        const filtered =
            allVideos.filter(video => {

                const matchesSearch =
                    !searchValue ||

                    (
                        video.title || ""
                    )
                    .toLowerCase()
                    .includes(searchValue);


                const matchesCategory =
                    !categoryValue ||

                    video.category ===
                    categoryValue;


                const matchesStatus =
                    !statusValue ||

                    video.status ===
                    statusValue;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            });


        renderVideos(filtered);

    }


    search.addEventListener(
        "input",
        applyFilters
    );


    category.addEventListener(
        "change",
        applyFilters
    );


    status.addEventListener(
        "change",
        applyFilters
    );

}


// ======================================
// DELETE VIDEO
// ======================================

async function deleteVideo(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this video?"
        );


    if (!confirmed) return;


    const { error } =
        await supabaseClient

            .from("articles")

            .delete()

            .eq("id", id);


    if (error) {

        console.error(
            "Delete Video Error:",
            error
        );

        alert(
            "Unable to delete video."
        );

        return;

    }


    alert(
        "Video deleted successfully."
    );


    loadVideos();

}
