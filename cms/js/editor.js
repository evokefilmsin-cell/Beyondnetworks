// ======================================
// Beyond Networks CMS
// editor.js
// ======================================

let editor;

// ----------------------------
// CKEditor
// ----------------------------

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

.then(newEditor=>{

    editor=newEditor;

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

title.addEventListener("keyup",()=>{

    slug.value=createSlug(title.value);

});

// ----------------------------
// Publish
// ----------------------------

publishBtn.addEventListener("click",publishArticle);

async function publishArticle(){

    const content=editor.getData();

    console.log(content);

}
