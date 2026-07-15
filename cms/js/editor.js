// ===========================================
// Beyond Networks CMS
// editor.js
// ===========================================

console.log("✅ editor.js loaded");

// ----------------------------
// Get Form Elements
// ----------------------------

const title = document.getElementById("title");
const slug = document.getElementById("slug");
const summary = document.getElementById("summary");
const category = document.getElementById("category");
const author = document.getElementById("author");
const status = document.getElementById("status");
const seoTitle = document.getElementById("seoTitle");
const metaDescription = document.getElementById("metaDescription");
const publishBtn = document.getElementById("publishBtn");

// ----------------------------
// Auto Generate Slug
// ----------------------------

function createSlug(text){

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g,"")
        .replace(/\s+/g,"-")
        .replace(/--+/g,"-");

}

title.addEventListener("keyup",()=>{

    slug.value=createSlug(title.value);

});

// ----------------------------
// Publish Button
// ----------------------------

publishBtn.addEventListener("click",publishArticle);

// ----------------------------

async function publishArticle(){

    const content=tinymce.get("editor").getContent();

    const article={

        title:title.value,

        slug:slug.value,

        summary:summary.value,

        content:content,

        category:category.value,

        author:author.value,

        status:status.value,

        seo_title:seoTitle.value,

        meta_description:metaDescription.value

    };

    console.log(article);

    alert("Next step: Save to Supabase");

}
