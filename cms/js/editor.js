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

    // Validation
    if(title.value.trim() === ""){
        alert("Please enter an article title.");
        title.focus();
        return;
    }

    if(category.value.trim() === ""){
        alert("Please select a category.");
        return;
    }

    const content = editor.getData();

    if(content.trim() === ""){
        alert("Article content cannot be empty.");
        return;
    }

    const article = {

        title: title.value.trim(),

        slug: slug.value.trim(),

        summary: summary.value.trim(),

        content: content,

        category: category.value,

        author: author.value.trim(),

        status: status.value,

        seo_title: seoTitle.value.trim(),

        meta_description: metaDescription.value.trim()

    };

    console.log("Publishing Article...");
    console.log(article);

    const { data, error } = await supabase
.from("articles")
.insert([article]);

}

}
