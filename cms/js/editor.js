// ======================================
// Beyond Networks CMS
// editor.js
// ======================================

let editor;

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

    imagePreview.src = data.featured_image;

    imagePreview.style.display = "block";

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
async function saveArticle(status) {

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
    let imageUrl = articleId
    ? imagePreview.src
    : "";
let publishTime = null;

    if (status === "Published") {

        publishTime = new Date().toISOString();

    }

    if (status === "Scheduled") {

        if (!publishDate.value) {

            alert("Please choose a publish date.");

            return;

        }

        publishTime = publishDate.value;

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
