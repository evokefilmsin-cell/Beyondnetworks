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

const title=document.getElementById("title");
const slug=document.getElementById("slug");
const summary=document.getElementById("summary");
const category=document.getElementById("category");
const author=document.getElementById("author");
const status=document.getElementById("status");
const seoTitle=document.getElementById("seoTitle");
const metaDescription=document.getElementById("metaDescription");
const publishBtn=document.getElementById("publishBtn");

// ----------------------------
// Slug Generator
// ----------------------------

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

    title.value = data.title;

    slug.value = data.slug;

    summary.value = data.summary;

    category.value = data.category;

    author.value = data.author;

    status.value = data.status;

    seoTitle.value = data.seo_title;

    metaDescription.value = data.meta_description;

    editor.setData(data.content);

}
title.addEventListener("keyup",()=>{

    slug.value=createSlug(title.value);

});

// ----------------------------
// Publish
// ----------------------------

// ----------------------------
// Publish Article
// ----------------------------

publishBtn.addEventListener("click", () => {

    console.log("✅ Publish button clicked");

    publishArticle();

});
async function publishArticle() {
    console.log("🚀 publishArticle started");
    const content = editor.getData();

    const article = {

        title: title.value,

        slug: slug.value,

        summary: summary.value,

        content: content,

        category: category.value,

        author: author.value,

        status: status.value,

        featured_image: "",

        seo_title: seoTitle.value,

        meta_description: metaDescription.value,

        is_breaking: false,

        is_featured: false,

        is_trending: false,

        publish_date: new Date(),

        updated_at: new Date()

    };
console.log(article);

    let response;

if(articleId){

    response = await supabaseClient

        .from("articles")

        .update(article)

        .eq("id", articleId)

        .select();

}else{

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

alert(articleId ? "Article Updated!" : "Article Published!");

window.location = "articles.html";

}
