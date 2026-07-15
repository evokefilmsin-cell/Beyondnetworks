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

// ----------------------------
// Publish Article
// ----------------------------

publishBtn.addEventListener("click", publishArticle);

async function publishArticle() {

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

    const { data, error } = await supabase

        .from("articles")

        .insert([article])

        .select();

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Article Published Successfully!");

    console.log(data);

}
