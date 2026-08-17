// ======================================
// Beyond Networks CMS
// video-editor.js
// ======================================

console.log("video-editor.js loaded");


// ======================================
// EDIT MODE
// ======================================

const params =
    new URLSearchParams(window.location.search);

const videoId =
    params.get("id");


// ======================================
// ELEMENTS
// ======================================

const title =
    document.getElementById("title");

const summary =
    document.getElementById("summary");

const videoUrl =
    document.getElementById("videoUrl");

const videoFile =
    document.getElementById("videoFile");

const videoPreview =
    document.getElementById("videoPreview");

const youtubePreview =
    document.getElementById("youtubePreview");

const videoUploadStatus =
    document.getElementById("videoUploadStatus");

const featuredImage =
    document.getElementById("featuredImage");

const imagePreview =
    document.getElementById("imagePreview");

const author =
    document.getElementById("author");

const slug =
    document.getElementById("slug");

const seoTitle =
    document.getElementById("seoTitle");

const metaDescription =
    document.getElementById("metaDescription");

const category =
    document.getElementById("category");

const brand =
    document.getElementById("brand");

const publishDate =
    document.getElementById("publishDate");

const breakingNews =
    document.getElementById("breakingNews");

const featuredStory =
    document.getElementById("featuredStory");

const trendingStory =
    document.getElementById("trendingStory");

const opinionStory =
    document.getElementById("opinionStory");

const editorPick =
    document.getElementById("editorPick");

const statusInfo =
    document.getElementById("statusInfo");

const pageTitle =
    document.getElementById("pageTitle");

const draftBtn =
    document.getElementById("draftBtn");

const scheduleBtn =
    document.getElementById("scheduleBtn");

const publishBtn =
    document.getElementById("publishBtn");


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (videoId) {

            await loadVideo(videoId);

        }

    }
);


// ======================================
// SLUG
// ======================================

function createSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");

}


title.addEventListener(
    "keyup",
    () => {

        if (!videoId) {

            slug.value =
                createSlug(title.value);

        }

    }
);


// ======================================
// THUMBNAIL PREVIEW
// ======================================

featuredImage.addEventListener(
    "change",
    () => {

        const file =
            featuredImage.files[0];

        if (!file) return;


        imagePreview.src =
            URL.createObjectURL(file);

        imagePreview.style.display =
            "block";

    }
);


// ======================================
// VIDEO FILE PREVIEW
// ======================================

videoFile.addEventListener(
    "change",
    () => {

        const file =
            videoFile.files[0];

        if (!file) return;


        const url =
            URL.createObjectURL(file);


        videoPreview.src =
            url;

        videoPreview.style.display =
            "block";

        youtubePreview.style.display =
            "none";

    }
);


// ======================================
// URL PREVIEW
// ======================================

videoUrl.addEventListener(
    "input",
    () => {

        updateVideoPreview(
            videoUrl.value.trim()
        );

    }
);


// ======================================
// VIDEO PREVIEW FUNCTION
// ======================================

function updateVideoPreview(url) {

    if (!url) {

        videoPreview.style.display =
            "none";

        youtubePreview.style.display =
            "none";

        return;

    }


    const youtubeId =
        getYoutubeId(url);


    // ------------------------------
    // YOUTUBE
    // ------------------------------

    if (youtubeId) {

        videoPreview.pause();

        videoPreview.style.display =
            "none";


        youtubePreview.innerHTML = `

            <div
                style="
                    position:relative;
                    width:100%;
                    padding-bottom:56.25%;
                    height:0;
                    overflow:hidden;
                    border-radius:10px;
                "
            >

                <iframe

                    src="https://www.youtube.com/embed/${youtubeId}"

                    style="
                        position:absolute;
                        top:0;
                        left:0;
                        width:100%;
                        height:100%;
                        border:0;
                    "

                    allowfullscreen

                ></iframe>

            </div>

        `;


        youtubePreview.style.display =
            "block";

        return;

    }


    // ------------------------------
    // DIRECT VIDEO
    // ------------------------------

    youtubePreview.style.display =
        "none";


    videoPreview.src =
        url;

    videoPreview.style.display =
        "block";

}


// ======================================
// YOUTUBE ID
// ======================================

function getYoutubeId(url) {

    const match =
        url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
        );


    return match
        ? match[1]
        : null;

}


// ======================================
// LOAD EXISTING VIDEO
// ======================================

async function loadVideo(id) {

    console.log(
        "Loading video:",
        id
    );


    const { data, error } =
        await supabaseClient

            .from("articles")

            .select("*")

            .eq("id", id)

            .eq("is_video", true)

            .single();


    if (error) {

        console.error(error);

        alert(
            "Unable to load video."
        );

        return;

    }


    if (!data) return;


    // ==================================
    // PAGE
    // ==================================

    pageTitle.textContent =
        "Edit Video";


    // ==================================
    // BASIC
    // ==================================

    title.value =
        data.title || "";


    summary.value =
        data.summary || "";


    slug.value =
        data.slug || "";


    author.value =
        data.author || "";


    category.value =
        data.category || "News";


    brand.value =
        data.brand || "Beyond News";


    seoTitle.value =
        data.seo_title || "";


    metaDescription.value =
        data.meta_description || "";


    // ==================================
    // VIDEO
    // ==================================

    videoUrl.value =
        data.video_url || "";


    if (data.video_url) {

        updateVideoPreview(
            data.video_url
        );

    }


    // ==================================
    // THUMBNAIL
    // ==================================

    if (data.featured_image) {

        imagePreview.src =
            data.featured_image;

        imagePreview.style.display =
            "block";

    }


    // ==================================
    // OPTIONS
    // ==================================

    breakingNews.checked =
        !!data.is_breaking;


    featuredStory.checked =
        !!data.is_featured;


    trendingStory.checked =
        !!data.is_trending;


    opinionStory.checked =
        !!data.is_opinion;


    editorPick.checked =
        !!data.is_editor_pick;


    // ==================================
    // DATE
    // ==================================

    if (data.publish_date) {

        const date =
            new Date(
                data.publish_date
            );


        publishDate.value =
            date
                .toISOString()
                .slice(0, 16);

    }


    // ==================================
    // STATUS
    // ==================================

    statusInfo.innerHTML = `

        <strong>Status:</strong>

        ${escapeHtml(data.status)}

    `;

}


// ======================================
// BUTTONS
// ======================================

draftBtn.addEventListener(
    "click",
    () => {

        saveVideo("Draft");

    }
);


scheduleBtn.addEventListener(
    "click",
    () => {

        saveVideo("Scheduled");

    }
);


publishBtn.addEventListener(
    "click",
    () => {

        saveVideo("Published");

    }
);


// ======================================
// SAVE VIDEO
// ======================================

async function saveVideo(status) {

    console.log(
        "Saving video:",
        status
    );


    // ==================================
    // VALIDATION
    // ==================================

    if (!title.value.trim()) {

        alert(
            "Please enter a video title."
        );

        return;

    }


    if (
        !videoUrl.value.trim() &&
        !videoFile.files.length &&
        !videoId
    ) {

        alert(
            "Please add a video URL or upload a video."
        );

        return;

    }


    // ==================================
    // BUTTON STATE
    // ==================================

    const clickedButton =
        status === "Draft"
            ? draftBtn
            : status === "Scheduled"
                ? scheduleBtn
                : publishBtn;


    clickedButton.disabled =
        true;


    clickedButton.innerHTML =
        "Saving...";


    try {


        // ==================================
        // VIDEO URL
        // ==================================

        let finalVideoUrl =
            videoUrl.value.trim();


        // ==================================
        // EXISTING VIDEO
        // ==================================

        if (
            !finalVideoUrl &&
            videoId
        ) {

            const { data } =
                await supabaseClient

                    .from("articles")

                    .select("video_url")

                    .eq("id", videoId)

                    .single();


            if (data) {

                finalVideoUrl =
                    data.video_url || "";

            }

        }


        // ==================================
        // UPLOAD VIDEO
        // ==================================

        if (videoFile.files.length > 0) {

            const file =
                videoFile.files[0];


            videoUploadStatus.innerHTML = `

                <div class="text-warning">

                    Uploading video...

                </div>

            `;


            const fileName =
                Date.now() +
                "-" +
                file.name
                    .replace(/\s+/g, "-");


            const {
                error: uploadError
            } = await supabaseClient.storage

                .from("news-videos")

                .upload(
                    fileName,
                    file,
                    {
                        cacheControl: "3600",
                        upsert: false
                    }
                );


            if (uploadError) {

                throw uploadError;

            }


            const {
                data: publicData
            } =
                supabaseClient.storage

                    .from("news-videos")

                    .getPublicUrl(
                        fileName
                    );


            finalVideoUrl =
                publicData.publicUrl;


            videoUploadStatus.innerHTML = `

                <div class="text-success">

                    Video uploaded successfully.

                </div>

            `;

        }


        // ==================================
        // PUBLISH DATE
        // ==================================

        let finalPublishDate =
            null;


        if (status === "Published") {

            finalPublishDate =
                new Date().toISOString();

        }


        if (status === "Scheduled") {

            if (!publishDate.value) {

                alert(
                    "Please select a publish date."
                );

                return;

            }


            finalPublishDate =
                new Date(
                    publishDate.value
                ).toISOString();

        }


        // ==================================
        // IMAGE
        // ==================================

        let imageUrl =
            imagePreview.src || "";


        if (
            imageUrl.startsWith(
                "blob:"
            )
        ) {

            imageUrl = "";

        }


        if (
            featuredImage.files.length > 0
        ) {

            const file =
                featuredImage.files[0];


            const fileName =
                Date.now() +
                "-" +
                file.name
                    .replace(/\s+/g, "-");


            const {
                error: uploadError
            } =
                await supabaseClient.storage

                    .from("news-images")

                    .upload(
                        fileName,
                        file,
                        {
                            cacheControl: "3600",
                            upsert: false
                        }
                    );


            if (uploadError) {

                throw uploadError;

            }


            const {
                data: publicData
            } =
                supabaseClient.storage

                    .from("news-images")

                    .getPublicUrl(
                        fileName
                    );


            imageUrl =
                publicData.publicUrl;

        }


        // ==================================
        // ARTICLE DATA
        // ==================================

        const article = {

            title:
                title.value.trim(),

            slug:
                slug.value.trim() ||
                createSlug(title.value),

            summary:
                summary.value.trim(),

            content:
                summary.value.trim(),

            featured_image:
                imageUrl,

            video_url:
                finalVideoUrl,

            category:
                category.value,

            author:
                author.value.trim(),

            brand:
                brand.value,

            status:
                status,

            is_video:
                true,

            is_breaking:
                breakingNews.checked,

            is_featured:
                featuredStory.checked,

            is_trending:
                trendingStory.checked,

            is_opinion:
                opinionStory.checked,

            is_editor_pick:
                editorPick.checked,

            publish_date:
                finalPublishDate,

            seo_title:
                seoTitle.value.trim(),

            meta_description:
                metaDescription.value.trim(),

            updated_at:
                new Date().toISOString()

        };


        console.log(
            "Saving article:",
            article
        );


        // ==================================
        // UPDATE / INSERT
        // ==================================

        let response;


        if (videoId) {

            response =
                await supabaseClient

                    .from("articles")

                    .update(article)

                    .eq("id", videoId)

                    .select();

        } else {

            response =
                await supabaseClient

                    .from("articles")

                    .insert([
                        article
                    ])

                    .select();

        }


        // ==================================
        // ERROR
        // ==================================

        if (response.error) {

            throw response.error;

        }


        // ==================================
        // SUCCESS
        // ==================================

        if (status === "Draft") {

            alert(
                "Video draft saved successfully."
            );

        }


        if (status === "Scheduled") {

            alert(
                "Video scheduled successfully."
            );

        }


        if (status === "Published") {

            alert(
                "Video published successfully."
            );

        }


        window.location.href =
            "videos.html";


    } catch (error) {

        console.error(
            "Video save error:",
            error
        );


        alert(
            "Failed to save video:\n\n" +
            error.message
        );


    } finally {

        clickedButton.disabled =
            false;


        clickedButton.innerHTML =

            status === "Draft"
                ? '<i class="bi bi-file-earmark"></i> Save Draft'
                : status === "Scheduled"
                    ? '<i class="bi bi-clock"></i> Schedule Video'
                    : '<i class="bi bi-send"></i> Publish Video';

    }

}


// ======================================
// ESCAPE HTML
// ======================================

function escapeHtml(value) {

    if (!value) return "";


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
