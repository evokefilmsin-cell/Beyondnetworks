// ======================================
// Beyond Networks CMS
// video-editor.js
// ======================================

console.log("CMS video-editor.js loaded");


// ======================================
// VARIABLES
// ======================================

let editor;


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

const brand =
    document.getElementById("brand");

const title =
    document.getElementById("title");

const slug =
    document.getElementById("slug");

const summary =
    document.getElementById("summary");

const category =
    document.getElementById("category");

const author =
    document.getElementById("author");

const tags =
    document.getElementById("tags");

const videoUrl =
    document.getElementById("videoUrl");

const seoTitle =
    document.getElementById("seoTitle");

const metaDescription =
    document.getElementById("metaDescription");

const featuredImage =
    document.getElementById("featuredImage");

const imagePreview =
    document.getElementById("imagePreview");

const publishBtn =
    document.getElementById("publishBtn");

const draftBtn =
    document.getElementById("draftBtn");

const scheduleBtn =
    document.getElementById("scheduleBtn");

const previewBtn =
    document.getElementById("previewBtn");

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


// ======================================
// CKEDITOR
// ======================================

ClassicEditor
.create(
    document.querySelector("#editor"),
    {

        toolbar: [

            "heading",

            "|",

            "bold",
            "italic",
            "underline",

            "|",

            "bulletedList",
            "numberedList",

            "|",

            "link",
            "insertTable",
            "blockQuote",

            "|",

            "undo",
            "redo"

        ]

    }
)

.then(async newEditor => {

    editor = newEditor;


    // If editing an existing video
    if (videoId) {

        await loadVideo(videoId);

    }

})

.catch(error => {

    console.error(
        "CKEditor Error:",
        error
    );

});


// ======================================
// IMAGE PREVIEW
// ======================================

if (featuredImage) {

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

}


// ======================================
// SLUG GENERATOR
// ======================================

function createSlug(text) {

    return text

        .toLowerCase()

        .trim()

        .replace(
            /[^\w\s-]/g,
            ""
        )

        .replace(
            /\s+/g,
            "-"
        )

        .replace(
            /--+/g,
            "-"
        );

}


if (title) {

    title.addEventListener(
        "keyup",
        () => {

            // Only generate automatically
            // when creating a new video

            if (!videoId) {

                slug.value =
                    createSlug(
                        title.value
                    );

            }

        }
    );

}


// ======================================
// LOAD EXISTING VIDEO
// ======================================

async function loadVideo(id) {

    const { data, error } =
        await supabaseClient

            .from("articles")

            .select("*")

            .eq("id", id)

            .eq("is_video", true)

            .single();


    if (error) {

        console.error(
            "Load Video Error:",
            error
        );

        alert(
            "Unable to load video."
        );

        return;

    }


    // ================================
    // BASIC DATA
    // ================================

    title.value =
        data.title || "";


    slug.value =
        data.slug || "";


    summary.value =
        data.summary || "";


    category.value =
        data.category || "News";


    author.value =
        data.author || "";


    tags.value =
        data.tags || "";


    videoUrl.value =
        data.video_url || "";


    brand.value =
        data.brand || "Beyond News";


    seoTitle.value =
        data.seo_title || "";


    metaDescription.value =
        data.meta_description || "";


    // ================================
    // CHECKBOXES
    // ================================

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


    // ================================
    // CONTENT
    // ================================

    editor.setData(
        data.content || ""
    );


    // ================================
    // DATE
    // ================================

    if (data.publish_date) {

        publishDate.value =

            new Date(
                data.publish_date
            )

            .toISOString()
            .slice(0, 16);

    }


    // ================================
    // IMAGE
    // ================================

    if (data.featured_image) {

        imagePreview.src =
            data.featured_image;

        imagePreview.style.display =
            "block";

    }


    // ================================
    // STATUS
    // ================================

    statusInfo.innerHTML = `

        <strong>Status:</strong>

        ${data.status || "Draft"}

    `;

}


// ======================================
// BUTTONS
// ======================================

if (draftBtn) {

    draftBtn.addEventListener(
        "click",
        () => {

            saveVideo("Draft");

        }
    );

}


if (scheduleBtn) {

    scheduleBtn.addEventListener(
        "click",
        () => {

            saveVideo("Scheduled");

        }
    );

}


if (publishBtn) {

    publishBtn.addEventListener(
        "click",
        () => {

            saveVideo("Published");

        }
    );

}


if (previewBtn) {

    previewBtn.addEventListener(
        "click",
        previewVideo
    );

}


// ======================================
// SAVE VIDEO
// ======================================

async function saveVideo(status) {

    console.log(
        "Saving video:",
        status
    );


    // ================================
    // VALIDATION
    // ================================

    if (!title.value.trim()) {

        alert(
            "Please enter a video title."
        );

        return;

    }


    if (!category.value) {

        alert(
            "Please select a category."
        );

        return;

    }


    if (!videoUrl.value.trim()) {

        alert(
            "Please enter the video URL."
        );

        return;

    }


    // ================================
    // CONTENT
    // ================================

    const content =
        editor
            ? editor.getData()
            : "";


    // ================================
    // IMAGE
    // ================================

    let imageUrl =
        videoId
            ? imagePreview.src
            : "";


    // ================================
    // PUBLISH DATE
    // ================================

    let publishTime = null;


    if (status === "Published") {

        publishTime =
            new Date().toISOString();

    }


    if (status === "Scheduled") {

        if (!publishDate.value) {

            alert(
                "Please choose a publish date."
            );

            return;

        }


        publishTime =
            new Date(
                publishDate.value
            ).toISOString();

    }


    // ================================
    // UPLOAD THUMBNAIL
    // ================================

    if (
        featuredImage &&
        featuredImage.files.length > 0
    ) {

        const file =
            featuredImage.files[0];


        const fileName =
            Date.now() +
            "-" +
            file.name;


        const {
            error: uploadError
        } = await supabaseClient

            .storage

            .from("news-images")

            .upload(
                fileName,
                file
            );


        if (uploadError) {

            console.error(
                uploadError
            );

            alert(
                uploadError.message
            );

            return;

        }


        const { data } =
            supabaseClient

                .storage

                .from("news-images")

                .getPublicUrl(
                    fileName
                );


        imageUrl =
            data.publicUrl;

    }


    // ================================
    // ARTICLE OBJECT
    // ================================

    const video = {

        title:
            title.value.trim(),

        slug:
            slug.value.trim(),

        summary:
            summary.value,

        content:
            content,

        brand:
            brand.value,

        category:
            category.value,

        author:
            author.value,

        tags:
            tags.value,

        video_url:
            videoUrl.value.trim(),

        status:
            status,

        featured_image:
            imageUrl,

        seo_title:
            seoTitle.value,

        meta_description:
            metaDescription.value,

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
            publishTime,

        updated_at:
            new Date()

    };


    console.log(
        "Video object:",
        video
    );


    // ================================
    // INSERT / UPDATE
    // ================================

    let response;


    if (videoId) {

        response =
            await supabaseClient

                .from("articles")

                .update(video)

                .eq("id", videoId)

                .select();

    }

    else {

        response =
            await supabaseClient

                .from("articles")

                .insert([video])

                .select();

    }


    const {
        data,
        error
    } = response;


    console.log(
        "Saved:",
        data
    );


    console.log(
        "Error:",
        error
    );


    if (error) {

        alert(
            error.message
        );

        return;

    }


    // ================================
    // SUCCESS
    // ================================

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


    window.location =
        "videos.html";

}


// ======================================
// PREVIEW
// ======================================

function previewVideo() {

    const video = {

        title:
            title.value,

        summary:
            summary.value,

        content:
            editor
                ? editor.getData()
                : "",

        category:
            category.value,

        author:
            author.value,

        videoUrl:
            videoUrl.value,

        image:
            imagePreview.src,

        publishDate:
            publishDate.value

    };


    localStorage.setItem(

        "previewVideo",

        JSON.stringify(video)

    );


    window.open(

        "video-preview.html",

        "_blank"

    );

}
