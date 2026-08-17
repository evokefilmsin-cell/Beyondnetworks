console.log("category.js loaded");

// ======================================
// CATEGORY
// ======================================

const category =
    document.title.split("|")[0].trim();

console.log("Current Category:", category);


// ======================================
// PAGE INITIALIZATION
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadBreakingNews();

    loadFeaturedStory();

    loadTopStories();

    loadLatest();

    loadOpinion();

    loadVideos();

    loadMostRead();

    loadEditorsPicks();

});


// ======================================
// BREAKING NEWS
// ======================================

async function loadBreakingNews(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("title,slug")

        .eq("status","Published")

        .eq("is_breaking",true)

        .order("publish_date",{ascending:false})

        .limit(10);


    if(error){

        console.error("Breaking News Error:", error);

        return;

    }


    const ticker =
        document.getElementById("breakingTicker");


    if(!ticker) return;


    ticker.innerHTML = "";


    data.forEach(article => {

        ticker.innerHTML += `

            <a href="article.html?slug=${article.slug}">

                🔴 ${article.title}

            </a>

        `;

    });

}


// ======================================
// FEATURED STORY
// ======================================

async function loadFeaturedStory(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .eq("is_featured",true)

        .order("publish_date",{ascending:false})

        .limit(1)

        .single();


    if(error){

        console.error("Featured Story Error:", error);

        return;

    }


    // Automatically find correct container
    // Politics → featuredPolitics
    // Business → featuredBusiness
    // Technology → featuredTechnology
    // Sports → featuredSports
    // Entertainment → featuredEntertainment

    const container =
        document.getElementById(
            "featured" + category
        );


    if(!container){

        console.error(
            "Featured container not found:",
            "featured" + category
        );

        return;

    }


    container.innerHTML = `

        <img
            src="${data.featured_image}"
            alt="${data.title}"
        >

        <div class="featured-content">

            <span>
                ${data.category}
            </span>

            <h1>
                ${data.title}
            </h1>

            <p>
                ${data.summary || ""}
            </p>

            <a href="article.html?slug=${data.slug}">
                Read Story →
            </a>

        </div>

    `;

}


// ======================================
// TOP STORIES
// ======================================

async function loadTopStories(){

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category)

        .eq("is_trending",true)

        .order("publish_date",{ascending:false})

        .limit(6);


    if(error){

        console.error(
            "Top Stories Error:",
            error
        );

        return;

    }


    const container =
        document.getElementById("topStories");


    if(!container) return;


    container.innerHTML = "";


    if(!data || data.length === 0){

        container.innerHTML = `

            <p class="no-top-stories">

                No trending stories available.

            </p>

        `;

        return;

    }


    // ==================================
    // FIRST TWO — IMAGES
    // ==================================

    const imageStories =
        data.slice(0,2);


    let imagesHTML = `

        <div class="top-stories-images">

    `;


    imageStories.forEach(article => {

        imagesHTML += `

            <div class="top-story-image">

                <a href="article.html?slug=${article.slug}">

                    <img
                        src="${article.featured_image}"
                        alt="${article.title}"
                    >

                </a>

                <h4>

                    <a href="article.html?slug=${article.slug}">

                        ${article.title}

                    </a>

                </h4>

            </div>

        `;

    });


    imagesHTML += `

        </div>

    `;


    // ==================================
    // REMAINING FOUR — TEXT ONLY
    // ==================================

    const textStories =
        data.slice(2,6);


    let textHTML = `

        <div class="top-stories-text-grid">

    `;


    textStories.forEach(article => {

        textHTML += `

            <div class="top-story-text">

                <h4>

                    <a href="article.html?slug=${article.slug}">

                        ${article.title}

                    </a>

                </h4>

            </div>

        `;

    });


    textHTML += `

        </div>

    `;


    // ==================================
    // INSERT
    // ==================================

    container.innerHTML =
        imagesHTML + textHTML;

}


// ======================================
// REUSABLE SECTION LOADER
// ======================================

async function loadSection(
    targetId,
    filters = {},
    limit = 4
){

    let query = supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("category",category);


    // Apply additional filters

    Object.entries(filters).forEach(
        ([key,value]) => {

            query =
                query.eq(key,value);

        }
    );


    const { data, error } =
        await query

            .order(
                "publish_date",
                {
                    ascending:false
                }
            )

            .limit(limit);


    if(error){

        console.error(
            `${targetId} Error:`,
            error
        );

        return;

    }


    const container =
        document.getElementById(targetId);


    if(!container){

        console.warn(
            "Container not found:",
            targetId
        );

        return;

    }


    container.innerHTML = "";


    if(!data || data.length === 0){

        return;

    }


    data.forEach(article => {

        container.innerHTML += `

            <a
                href="article.html?slug=${article.slug}"
                class="category-card"
            >

                <img
                    src="${article.featured_image}"
                    alt="${article.title}"
                >

                <div class="content">

                    <span>
                        ${article.category}
                    </span>

                    <h3>
                        ${article.title}
                    </h3>

                    <p>
                        ${article.summary || ""}
                    </p>

                </div>

            </a>

        `;

    });

}


// ======================================
// LATEST
// ======================================

function loadLatest(){

    loadSection(

        "latest" + category,

        {},

        4

    );

}


// ======================================
// OPINION
// ======================================

function loadOpinion(){

    loadSection(

        "opinion" + category,

        {
            is_opinion:true
        },

        4

    );

}


// ======================================
// VIDEOS
// ======================================

function loadVideos(){

    loadSection(

        "videos" + category,

        {
            is_video:true
        },

        4

    );

}


// ======================================
// MOST READ
// ======================================

function loadMostRead(){

    loadSection(

        "mostRead" + category,

        {
            is_trending:true
        },

        4

    );

}


// ======================================
// EDITOR'S PICKS
// ======================================

function loadEditorsPicks(){

    loadSection(

        "editor" + category,

        {
            is_editor_pick:true
        },

        4

    );

}
