// ======================================
// Beyond Networks CMS
// editor.js
// ======================================

let editor;
let editorUserRole = null;


// ======================================
// ROLE PERMISSIONS
// ======================================

async function checkEditorPermissions() {

    editorUserRole = await getCurrentUserRole();

    if (!editorUserRole) {
        return false;
    }

    // Viewer cannot create/edit articles
    if (editorUserRole === "viewer") {

        alert(
            "You do not have permission to edit articles."
        );

        window.location.href = "dashboard.html";

        return false;
    }

    // Video Editor cannot use the normal Article Editor
    if (editorUserRole === "video_editor") {

        alert(
            "Video Editors can only manage videos."
        );

        window.location.href = "videos.html";

        return false;
    }

    return true;
}


// ======================================
// EDIT MODE
// ======================================

const params = new URLSearchParams(
    window.location.search
);

const articleId = params.get("id");


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
                "imageUpload",
                "|",
                "undo",
                "redo"
            ]

        }
    )

    .then(async newEditor => {

        editor = newEditor;

        // If editing existing article
        if (articleId) {

            await loadArticle(articleId);

        }

    })

    .catch(error => {

        console.error(
            "CKEditor error:",
            error
        );

    });


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


// --------------------------------------
// SEO
// --------------------------------------

const seoTitle =
    document.getElementById("seoTitle");

const metaDescription =
    document.getElementById("metaDescription");

const canonicalUrl =
    document.getElementById("canonicalUrl");


// --------------------------------------
// SOCIAL MEDIA
// --------------------------------------

const socialTitle =
    document.getElementById("socialTitle");

const socialDescription =
    document.getElementById("socialDescription");


// --------------------------------------
// FEATURED IMAGE
// --------------------------------------

const featuredImage =
    document.getElementById("featuredImage");

const imagePreview =
    document.getElementById("imagePreview");

const featuredImageUrl =
    document.getElementById("featuredImageUrl");


// --------------------------------------
// MEDIA LIBRARY
// --------------------------------------

const chooseMediaBtn =
    document.getElementById("chooseMediaBtn");

const mediaPickerSearch =
    document.getElementById("mediaPickerSearch");

const mediaPickerGrid =
    document.getElementById("mediaPickerGrid");

const mediaPickerModalElement =
    document.getElementById("mediaPickerModal");


// --------------------------------------
// PUBLISHING
// --------------------------------------

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

const statusInfo =
    document.getElementById("statusInfo");


// ======================================
// DEBUG
// ======================================

console.log(
    "Draft button:",
    draftBtn
);

console.log(
    "Schedule button:",
    scheduleBtn
);

console.log(
    "Preview button:",
    previewBtn
);

console.log(
    "Publish button:",
    publishBtn
);


// ======================================
// SLUG GENERATOR
// ======================================

function createSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");

}


// ======================================
// TITLE → SLUG
// ======================================

if (title) {

    title.addEventListener(
        "keyup",
        () => {

            slug.value =
                createSlug(title.value);

        }
    );

}


// ======================================
// MEDIA LIBRARY
// ======================================

let mediaPickerFiles = [];


// --------------------------------------
// Upload New Image
// --------------------------------------

if (featuredImage) {

    featuredImage.addEventListener(
        "change",
        () => {

            const file =
                featuredImage.files[0];

            if (!file) {
                return;
            }

            // Clear Media Library selection
            if (featuredImageUrl) {

                featuredImageUrl.value =
                    "";

            }

            // Show preview
            if (imagePreview) {

                imagePreview.src =
                    URL.createObjectURL(file);

                imagePreview.style.display =
                    "block";

            }

            // Show file name
            const selectedMediaName =
                document.getElementById(
                    "selectedMediaName"
                );

            if (selectedMediaName) {

                selectedMediaName.textContent =
                    file.name;

            }

        }
    );

}


// --------------------------------------
// Open Media Library
// --------------------------------------

if (chooseMediaBtn) {

    chooseMediaBtn.addEventListener(
        "click",
        openMediaPicker
    );

}


// --------------------------------------
// Load Media
// --------------------------------------

async function openMediaPicker() {

    if (!mediaPickerModalElement) {
        return;
    }

    if (mediaPickerGrid) {

        mediaPickerGrid.innerHTML = `
            <div class="text-center text-secondary p-4">
                Loading media...
            </div>
        `;

    }


    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from("news-images")
        .list(
            "",
            {
                limit: 1000,
                sortBy: {
                    column: "created_at",
                    order: "desc"
                }
            }
        );


    if (error) {

        console.error(
            "Media loading error:",
            error
        );

        if (mediaPickerGrid) {

            mediaPickerGrid.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load media.
                </div>
            `;

        }

        return;
    }


    mediaPickerFiles =
        data || [];


    renderMediaPicker(
        mediaPickerFiles
    );


    const modal =
        new bootstrap.Modal(
            mediaPickerModalElement
        );


    modal.show();

}


// --------------------------------------
// Render Media Picker
// --------------------------------------

function renderMediaPicker(files) {

    if (!mediaPickerGrid) {
        return;
    }

    mediaPickerGrid.innerHTML = "";


    if (!files.length) {

        mediaPickerGrid.innerHTML = `
            <div class="text-center text-secondary p-4">
                No images found.
            </div>
        `;

        return;
    }


    files.forEach(file => {

        if (!file.name) {
            return;
        }


        const {
            data
        } = supabaseClient
            .storage
            .from("news-images")
            .getPublicUrl(
                file.name
            );


        const imageUrl =
            data.publicUrl;


        mediaPickerGrid.innerHTML += `

        <div
            class="media-picker-item"
            style="
                background:#16181a;
                border:1px solid #343a40;
                border-radius:10px;
                overflow:hidden;
                cursor:pointer;
                transition:0.2s;
            "
            onclick="selectMediaImage(
                '${escapeMediaUrl(imageUrl)}',
                '${escapeMediaName(file.name)}'
            )"
        >

            <img
                src="${imageUrl}"
                alt="${file.name}"
                style="
                    width:100%;
                    height:130px;
                    object-fit:cover;
                    display:block;
                "
            >

            <div
                style="
                    padding:8px;
                    color:#fff;
                    font-size:13px;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                "
                title="${file.name}"
            >
                ${file.name}
            </div>

        </div>

        `;

    });

}


// --------------------------------------
// Search Media
// --------------------------------------

if (mediaPickerSearch) {

    mediaPickerSearch.addEventListener(
        "input",
        () => {

            const search =
                mediaPickerSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                mediaPickerFiles.filter(
                    file =>
                        file.name
                            .toLowerCase()
                            .includes(search)
                );


            renderMediaPicker(
                filtered
            );

        }
    );

}


// --------------------------------------
// Select Existing Image
// --------------------------------------

function selectMediaImage(
    imageUrl,
    fileName
) {

    // Clear direct file upload
    if (featuredImage) {

        featuredImage.value = "";

    }


    // Store Media Library URL
    if (featuredImageUrl) {

        featuredImageUrl.value =
            imageUrl;

    }


    // Show preview
    if (imagePreview) {

        imagePreview.src =
            imageUrl;

        imagePreview.style.display =
            "block";

    }


    // Show file name
    const selectedMediaName =
        document.getElementById(
            "selectedMediaName"
        );


    if (selectedMediaName) {

        selectedMediaName.textContent =
            fileName;

    }


    // Close modal
    if (mediaPickerModalElement) {

        const modal =
            bootstrap.Modal.getInstance(
                mediaPickerModalElement
            );


        if (modal) {

            modal.hide();

        }

    }

}


// --------------------------------------
// Safe Values
// --------------------------------------

function escapeMediaUrl(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


function escapeMediaName(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// ======================================
// LOAD EXISTING ARTICLE
// ======================================

async function loadArticle(id) {

    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("id", id)

        .single();


    if (error) {

        console.error(
            "Article loading error:",
            error
        );

        return;

    }


    // ----------------------------------
    // Publish Date
    // ----------------------------------

    if (data.publish_date) {

        publishDate.value =
            new Date(
                data.publish_date
            )
            .toISOString()
            .slice(0, 16);

    }


    // ----------------------------------
    // Basic Article Fields
    // ----------------------------------

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


    brand.value =
        data.brand || "Beyond News";


    // ----------------------------------
    // Homepage Options
    // ----------------------------------

    breakingNews.checked =
        !!data.is_breaking;


    featuredStory.checked =
        !!data.is_featured;


    trendingStory.checked =
        !!data.is_trending;


    // ----------------------------------
    // Status
    // ----------------------------------

    statusInfo.innerHTML = `
        <strong>Status:</strong>
        ${data.status || "Draft"}
    `;


    // ----------------------------------
    // SEO
    // ----------------------------------

    seoTitle.value =
        data.seo_title || "";


    metaDescription.value =
        data.meta_description || "";


    canonicalUrl.value =
        data.canonical_url || "";


    // ----------------------------------
    // SOCIAL MEDIA
    // ----------------------------------

    socialTitle.value =
        data.social_title || "";


    socialDescription.value =
        data.social_description || "";


    // ----------------------------------
    // CKEDITOR CONTENT
    // ----------------------------------

    editor.setData(
        data.content || ""
    );


    // ----------------------------------
    // FEATURED IMAGE
    // ----------------------------------

    if (data.featured_image) {

        imagePreview.src =
            data.featured_image;


        imagePreview.style.display =
            "block";


        if (featuredImageUrl) {

            featuredImageUrl.value =
                data.featured_image;

        }


        const selectedMediaName =
            document.getElementById(
                "selectedMediaName"
            );


        if (selectedMediaName) {

            selectedMediaName.textContent =
                "Existing featured image";

        }

    }

}


// ======================================
// PUBLISH BUTTONS
// ======================================

if (draftBtn) {

    draftBtn.addEventListener(
        "click",
        () => {

            console.log(
                "Draft clicked"
            );

            saveArticle("Draft");

        }
    );

}


if (scheduleBtn) {

    scheduleBtn.addEventListener(
        "click",
        () => {

            console.log(
                "Schedule clicked"
            );

            saveArticle("Scheduled");

        }
    );

}


if (publishBtn) {

    publishBtn.addEventListener(
        "click",
        () => {

            console.log(
                "Publish clicked"
            );

            saveArticle("Published");

        }
    );

}


if (previewBtn) {

    previewBtn.addEventListener(
        "click",
        previewArticle
    );

}


// ======================================
// APPLY EDITOR PERMISSIONS
// ======================================

async function applyEditorPermissions() {

    const allowed =
        await checkEditorPermissions();


    if (!allowed) {

        return;

    }


    // ----------------------------------
    // REPORTER
    // ----------------------------------

    if (
        editorUserRole === "reporter"
    ) {

        if (publishBtn) {

            publishBtn.style.display =
                "none";

        }


        if (scheduleBtn) {

            scheduleBtn.style.display =
                "none";

        }


        if (draftBtn) {

            draftBtn.textContent =
                "Save Draft";

        }

    }


    // ----------------------------------
    // ADMIN / EDITOR
    // ----------------------------------

    if (
        editorUserRole === "admin" ||
        editorUserRole === "editor"
    ) {

        if (publishBtn) {

            publishBtn.style.display =
                "";

        }


        if (scheduleBtn) {

            scheduleBtn.style.display =
                "";

        }

    }

}


// ======================================
// SAVE ARTICLE
// ======================================

async function saveArticle(status) {


    // ----------------------------------
    // Make sure role is known
    // ----------------------------------

    if (!editorUserRole) {

        editorUserRole =
            await getCurrentUserRole();

    }


    // ----------------------------------
    // REPORTER RESTRICTION
    // ----------------------------------

    if (
        editorUserRole === "reporter"
    ) {

        if (status !== "Draft") {

            alert(
                "Reporters can only save draft articles."
            );

            return;

        }

    }


    // ----------------------------------
    // VIEWER RESTRICTION
    // ----------------------------------

    if (
        editorUserRole === "viewer"
    ) {

        alert(
            "You do not have permission to edit articles."
        );

        return;

    }


    // ----------------------------------
    // VIDEO EDITOR RESTRICTION
    // ----------------------------------

    if (
        editorUserRole === "video_editor"
    ) {

        alert(
            "Video Editors cannot create normal articles."
        );

        return;

    }


    console.log(
        "🚀 saveArticle started"
    );


    // ----------------------------------
    // CURRENT USER
    // ----------------------------------

    const {
        data: {
            user
        },
        error: userError
    } = await supabaseClient
        .auth
        .getUser();


    if (
        userError ||
        !user
    ) {

        alert(
            "You must be logged in to create an article."
        );

        window.location.href =
            "index.html";

        return;

    }


    console.log(
        "Logged-in user:",
        user.id
    );


    // ----------------------------------
    // CONTENT
    // ----------------------------------

    const content =
        editor.getData();


    // ----------------------------------
    // IMAGE
    // ----------------------------------

    let imageUrl = "";


    if (
        featuredImageUrl &&
        featuredImageUrl.value
    ) {

        // Existing Media Library image

        imageUrl =
            featuredImageUrl.value;

    }

    else if (
        articleId &&
        imagePreview &&
        imagePreview.src &&
        imagePreview.src !==
            window.location.href
    ) {

        // Existing article image

        imageUrl =
            imagePreview.src;

    }


    // ----------------------------------
    // PUBLISH TIME
    // ----------------------------------

    let publishTime = null;


    // Published immediately
    if (
        status === "Published"
    ) {

        publishTime =
            new Date().toISOString();

    }


    // Scheduled
    if (
        status === "Scheduled"
    ) {

        if (!publishDate.value) {

            alert(
                "Please choose a publish date."
            );

            return;

        }


        // Convert local datetime to UTC
        publishTime =
            new Date(
                publishDate.value
            ).toISOString();

    }


    // ----------------------------------
    // UPLOAD NEW FEATURED IMAGE
    // ----------------------------------

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

            alert(
                uploadError.message
            );

            return;

        }


        const {
            data
        } = supabaseClient
            .storage
            .from("news-images")
            .getPublicUrl(
                fileName
            );


        imageUrl =
            data.publicUrl;

    }


    // ----------------------------------
    // UPDATE STATUS DISPLAY
    // ----------------------------------

    statusInfo.innerHTML = `
        <strong>Status:</strong>
        ${status}
    `;


    // ==================================
    // ARTICLE OBJECT
    // ==================================

    const article = {

        title:
            title.value,

        slug:
            slug.value,

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

        created_by:
            user.id,

        status:
            status,

        featured_image:
            imageUrl,

        // --------------------------------
        // SEO
        // --------------------------------

        seo_title:
            seoTitle.value.trim(),

        meta_description:
            metaDescription.value.trim(),

        canonical_url:
            canonicalUrl.value.trim(),

        // --------------------------------
        // SOCIAL MEDIA
        // --------------------------------

        social_title:
            socialTitle.value.trim(),

        social_description:
            socialDescription.value.trim(),

        // --------------------------------
        // HOMEPAGE
        // --------------------------------

        is_breaking:
            breakingNews.checked,

        is_featured:
            featuredStory.checked,

        is_trending:
            trendingStory.checked,

        // --------------------------------
        // PUBLISH
        // --------------------------------

        publish_date:
            publishTime,

        updated_at:
            new Date()

    };


    console.log(
        "Article to save:",
        article
    );


    // ==================================
    // INSERT / UPDATE
    // ==================================

    let response;


    if (articleId) {

        // --------------------------------
        // EDIT EXISTING ARTICLE
        // --------------------------------

        const updateArticle =
            {
                ...article
            };


        // Keep original created_by
        delete updateArticle.created_by;


        response =
            await supabaseClient

                .from("articles")

                .update(
                    updateArticle
                )

                .eq(
                    "id",
                    articleId
                )

                .select();

    }

    else {

        // --------------------------------
        // CREATE NEW ARTICLE
        // --------------------------------

        response =
            await supabaseClient

                .from("articles")

                .insert([
                    article
                ])

                .select();

    }


    const {
        data,
        error
    } = response;


    console.log(
        "Saved article:",
        data
    );

    console.log(
        "Save error:",
        error
    );


    // ==================================
    // ERROR
    // ==================================

    if (error) {

        console.error(
            "Article save error:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    // ==================================
    // SUCCESS
    // ==================================

    if (
        status === "Draft"
    ) {

        alert(
            "Draft saved successfully."
        );

    }


    if (
        status === "Scheduled"
    ) {

        alert(
            "Article scheduled successfully."
        );

    }


    if (
        status === "Published"
    ) {

        alert(
            "Article published successfully."
        );

    }


    // Return to Articles
    window.location =
        "articles.html";

}


// ======================================
// PREVIEW ARTICLE
// ======================================

function previewArticle() {

    const article = {

        title:
            title.value,

        summary:
            summary.value,

        content:
            editor.getData(),

        category:
            category.value,

        author:
            author.value,

        // --------------------------------
        // SEO
        // --------------------------------

        seoTitle:
            seoTitle.value,

        metaDescription:
            metaDescription.value,

        canonicalUrl:
            canonicalUrl.value,

        // --------------------------------
        // SOCIAL
        // --------------------------------

        socialTitle:
            socialTitle.value,

        socialDescription:
            socialDescription.value,

        // --------------------------------
        // IMAGE
        // --------------------------------

        image:
            imagePreview.src,

        publishDate:
            publishDate.value

    };


    localStorage.setItem(
        "previewArticle",
        JSON.stringify(article)
    );


    window.open(
        "article-preview.html",
        "_blank"
    );

}


// ======================================
// INITIALIZE EDITOR PERMISSIONS
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await applyEditorPermissions();

    }
);
