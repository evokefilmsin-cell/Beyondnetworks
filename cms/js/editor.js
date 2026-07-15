// =========================================
// Beyond Networks CMS
// Article Editor
// =========================================

console.log("✅ Editor Loaded");

// -----------------------------------------
// DOM Elements
// -----------------------------------------

const articleForm = document.getElementById("articleForm");

const title = document.getElementById("title");
const summary = document.getElementById("summary");
const category = document.getElementById("category");
const author = document.getElementById("author");
const featuredImage = document.getElementById("featuredImage");

const editor = document.getElementById("editor");

const publishBtn = document.getElementById("publishBtn");

// -----------------------------------------
// Generate Slug
// -----------------------------------------

function generateSlug(text){

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g,"")
        .replace(/\s+/g,"-")
        .replace(/-+/g,"-");

}

// Preview

title.addEventListener("input",()=>{

    console.log(generateSlug(title.value));

});
