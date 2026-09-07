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
// ----------------------------
// CKEditor
// ----------------------------
// =====================================
// Edit Mode
// =====================================

const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");
ClassicEditor
.create(document.querySelector("#editor"),{

    toolbar:[
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

})

.then(async newEditor => {

    editor = newEditor;

    if(articleId){

        await loadArticle(articleId);

    }


})

.catch(error=>{

    console.error(error);

});

// ----------------------------
// Elements
// ----------------------------
const brand = document.getElementById("brand");
const title=document.getElementById("title");
const slug=document.getElementById("slug");
const summary=document.getElementById("summary");
const category=document.getElementById("category");
const author=document.getElementById("author");
const seoTitle=document.getElementById("seoTitle");
const metaDescription=document.getElementById("metaDescription");
const featuredImage = document.getElementById("featuredImage");
const imagePreview = document.getElementById("imagePreview");
const featuredImageUrl =
    document.getElementById("featuredImageUrl");

const chooseMediaBtn =
    document.getElementById("chooseMediaBtn");

const mediaPickerSearch =
    document.getElementById("mediaPickerSearch");

const mediaPickerGrid =
    document.getElementById("mediaPickerGrid");

const mediaPickerModalElement =
    document.getElementById("mediaPickerModal");
const publishBtn=document.getElementById("publishBtn");
const draftBtn = document.getElementById("draftBtn");
const scheduleBtn = document.getElementById("scheduleBtn");
const previewBtn = document.getElementById("previewBtn");

const publishDate = document.getElementById("publishDate");
const breakingNews = document.getElementById("breakingNews");

const featuredStory = document.getElementById("featuredStory");

const trendingStory = document.getElementById("trendingStory");
const statusInfo = document.getElementById("statusInfo");
console.log(draftBtn);
console.log(scheduleBtn);
console.log(previewBtn);
console.log(publishBtn);
// ----------------------------
// Slug Generator
// ----------------------------
featuredImage.addEventListener("change", () => {

    const file = featuredImage.files[0];

    if (!file) return;

    imagePreview.src = URL.createObjectURL(file);

    imagePreview.style.display = "block";

});
function createSlug(text){

    return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g,"")
    .replace(/\s+/g,"-")
    .replace(/--+/g,"-");

}
// ======================================
// MEDIA LIBRARY
// ======================================

let mediaPickerFiles = [];

// --------------------------------------
// Upload New Image
// --------------------------------------

featuredImage.addEventListener("change", () => {

    const file = featuredImage.files[0];

    if (!file) return;

    // Clear previously selected Media Library image
    if (featuredImageUrl) {
        featuredImageUrl.value = "";
    }

    imagePreview.src =
        URL.createObjectURL(file);

    imagePreview.style.display = "block";

    const selectedMediaName =
        document.getElementById("selectedMediaName");

    if (selectedMediaName) {

        selectedMediaName.textContent =
            file.name;

    }

});


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
        .list("", {
            limit: 1000,
            sortBy: {
                column: "created_at",
                order: "desc"
            }
        });

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

    mediaPickerFiles = data || [];

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

    if (!mediaPickerGrid) return;

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

        if (!file.name) return;

        const {
            data
        } = supabaseClient
            .storage
            .from("news-images")
            .getPublicUrl(file.name);

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
            onclick="selectMediaImage('${escapeMediaUrl(imageUrl)}','${escapeMediaName(file.name)}')"
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
                mediaPickerFiles.filter(file =>
                    file.name
                        .toLowerCase()
                        .includes(search)
                );

            renderMediaPicker(filtered);

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
    featuredImage.value = "";

    // Store selected Media Library URL
    if (featuredImageUrl) {

        featuredImageUrl.value =
            imageUrl;

    }

    // Show preview
    imagePreview.src =
        imageUrl;

    imagePreview.style.display =
        "block";

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
// =====================================
// Load Existing Article
// =====================================

async function loadArticle(id){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("id", id)

        .single();
if(error){

    console.error(error);

    return;

}

if(data.publish_date){

    publishDate.value =
        new Date(data.publish_date)
        .toISOString()
        .slice(0,16);

}

    title.value = data.title;

    slug.value = data.slug;

    summary.value = data.summary;

    category.value = data.category;

    author.value = data.author;
    breakingNews.checked = data.is_breaking;

featuredStory.checked = data.is_featured;

trendingStory.checked = data.is_trending;
    brand.value = data.brand || "Beyond News";

    statusInfo.innerHTML = `
<strong>Status:</strong> ${data.status}`;

    seoTitle.value = data.seo_title;

    metaDescription.value = data.meta_description;

    editor.setData(data.content);
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
title.addEventListener("keyup",()=>{

    slug.value=createSlug(title.value);

});

// ----------------------------
// Publish
// ----------------------------

// ----------------------------
draftBtn.addEventListener("click", () => {
    console.log("Draft clicked");
    saveArticle("Draft");
});

scheduleBtn.addEventListener("click", () => {
    console.log("Schedule clicked");
    saveArticle("Scheduled");
});

publishBtn.addEventListener("click", () => {
    console.log("Publish clicked");
    saveArticle("Published");
});

previewBtn.addEventListener("click", previewArticle);


// ======================================
// APPLY EDITOR PERMISSIONS
// ======================================

async function applyEditorPermissions() {

    const allowed = await checkEditorPermissions();

    if (!allowed) {
        return;
    }

    // Reporter = draft only
    if (editorUserRole === "reporter") {

        if (publishBtn) {
            publishBtn.style.display = "none";
        }

        if (scheduleBtn) {
            scheduleBtn.style.display = "none";
        }

        // Reporter can only save drafts
        if (draftBtn) {
            draftBtn.textContent = "Save Draft";
        }
    }

    // Admin / Editor can publish
    if (
        editorUserRole === "admin" ||
        editorUserRole === "editor"
    ) {

        if (publishBtn) {
            publishBtn.style.display = "";
        }

        if (scheduleBtn) {
            scheduleBtn.style.display = "";
        }
    }
}


// ======================================
// SAVE ARTICLE
// ======================================

async function saveArticle(status) {

    // Make sure role is known
    if (!editorUserRole) {
        editorUserRole = await getCurrentUserRole();
    }

    // ----------------------------------
    // REPORTER RESTRICTION
    // ----------------------------------

    if (editorUserRole === "reporter") {

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

    if (editorUserRole === "viewer") {

        alert(
            "You do not have permission to edit articles."
        );

        return;
    }


    // ----------------------------------
    // VIDEO EDITOR RESTRICTION
    // ----------------------------------

    if (editorUserRole === "video_editor") {

        alert(
            "Video Editors cannot create normal articles."
        );

        return;
    }


    console.log("🚀 saveArticle started");

    // Get currently logged-in CMS user
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {

        alert("You must be logged in to create an article.");

        window.location.href = "index.html";

        return;
    }

    console.log("Logged-in user:", user.id);

    const content = editor.getData();
    let imageUrl = "";

if (featuredImageUrl && featuredImageUrl.value) {

    // Existing image selected from Media Library
    imageUrl = featuredImageUrl.value;

} else if (
    articleId &&
    imagePreview.src &&
    imagePreview.src !== window.location.href
) {

    // Existing article image
    imageUrl = imagePreview.src;

}
let publishTime = null;

    if (status === "Published") {

        publishTime = new Date().toISOString();

    }

    if (status === "Scheduled") {

    if (!publishDate.value) {

        alert("Please choose a publish date.");

        return;

    }

    // datetime-local is entered in the user's local time (IST).
    // Convert that local time to UTC before saving to Supabase.
    publishTime = new Date(
        publishDate.value
    ).toISOString();

}
if (featuredImage.files.length > 0) {

    const file = featuredImage.files[0];

    const fileName =
        Date.now() + "-" + file.name;

    const { error: uploadError } =
        await supabaseClient.storage
            .from("news-images")
            .upload(fileName, file);

    if (uploadError) {

        alert(uploadError.message);

        return;

    }

    const { data } =
        supabaseClient.storage
            .from("news-images")
            .getPublicUrl(fileName);

    imageUrl = data.publicUrl;

}
statusInfo.innerHTML = `
<strong>Status:</strong> ${status}
`;
    const article = {

        title: title.value,

        slug: slug.value,

        summary: summary.value,

        content: content,

        brand: brand.value,

        category: category.value,

        author: author.value,
        created_by: user.id,
        status: status,

        featured_image: imageUrl,
        
        seo_title: seoTitle.value,

        meta_description: metaDescription.value,

        is_breaking: breakingNews.checked,

is_featured: featuredStory.checked,

is_trending: trendingStory.checked,

        publish_date: publishTime,

        updated_at: new Date()

    };
console.log(article);

    let response;

if(articleId){

    // Editing an existing article
    // Keep the original created_by
    const updateArticle = { ...article };

    delete updateArticle.created_by;

    response = await supabaseClient

        .from("articles")

        .update(updateArticle)

        .eq("id", articleId)

        .select();

}else{

    // Creating a new article
    response = await supabaseClient

        .from("articles")

        .insert([article])

        .select();

}

const { data, error } = response;
console.log(data);
console.log(error);
if(error){

    alert(error.message);

    return;

}

if(status==="Draft"){

    alert("Draft saved successfully.");

}

if(status==="Scheduled"){

    alert("Article scheduled successfully.");

}

if(status==="Published"){

    alert("Article published successfully.");

}

window.location = "articles.html";

}
function previewArticle(){

    const article = {

        title: title.value,

        summary: summary.value,

        content: editor.getData(),

        category: category.value,

        author: author.value,

        seoTitle: seoTitle.value,

        metaDescription: metaDescription.value,

        image: imagePreview.src,

        publishDate: publishDate.value

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

document.addEventListener("DOMContentLoaded", async () => {

    await applyEditorPermissions();

});
