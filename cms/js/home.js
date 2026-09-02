console.log("home.js loaded");

// ======================================
// LOAD EVERYTHING AFTER PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedStory();
    loadBreakingNews();
    loadLatestUpdates();
    loadChannels();
    loadTrendingStories();
    loadFeaturedCoverage();

});

// ======================================
// FEATURED HERO + TOP STORIES
// ======================================

async function loadFeaturedStory() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .order("publish_date", { ascending: false })
        .limit(12);


    if (error) {

        console.error(
            "Hero Stories Error:",
            error
        );

        return;

    }


    if (!data || data.length === 0) {

        console.log(
            "No published stories found"
        );

        return;

    }


    // ==================================
    // MAIN HERO
    // ==================================

    const featured =
        data.find(article =>
            article.is_featured === true
        ) || data[0];


    const heroCategory =
        document.getElementById(
            "heroCategory"
        );

    const heroTitle =
        document.getElementById(
            "heroTitle"
        );

    const heroSummary =
        document.getElementById(
            "heroSummary"
        );

    const heroButton =
        document.getElementById(
            "heroButton"
        );

    const hero =
        document.getElementById(
            "featuredHero"
        );


    if (heroCategory) {

        heroCategory.textContent =
            featured.category || "News";

    }


    if (heroTitle) {

        heroTitle.textContent =
            featured.title || "";

    }


    if (heroSummary) {

        heroSummary.textContent =
            featured.summary || "";

    }


    if (heroButton) {

        heroButton.href =
            "article.html?slug=" +
            featured.slug;

    }


    if (
        hero &&
        featured.featured_image
    ) {

        hero.style.backgroundImage =
            `linear-gradient(
                rgba(0,0,0,.50),
                rgba(0,0,0,.78)
            ),
            url('${featured.featured_image}')`;

    }


    // ==================================
    // REMOVE HERO FROM OTHER STORIES
    // ==================================

    const otherStories =
        data.filter(article =>
            article.id !== featured.id
        );


    // ==================================
    // SIDE STORY 1
    // IMAGE + HEADLINE
    // ==================================

    const side1 =
        document.getElementById(
            "heroSideStory1"
        );


    if (
        side1 &&
        otherStories[0]
    ) {

        const article =
            otherStories[0];


        side1.href =
            "article.html?slug=" +
            article.slug;


        side1.innerHTML = `

            <img
                src="${article.featured_image || 'images/logo.png'}"
                alt="${article.title || ''}"
            >

            <div class="hero-side-content">

                <span>
                    ${article.category || "News"}
                </span>

                <h3>
                    ${article.title || ""}
                </h3>

            </div>

        `;

    }


    // ==================================
    // SIDE STORY 2
    // HEADLINE ONLY
    // ==================================

    const side2 =
        document.getElementById(
            "heroSideStory2"
        );


    if (
        side2 &&
        otherStories[1]
    ) {

        const article =
            otherStories[1];


        side2.href =
            "article.html?slug=" +
            article.slug;


        side2.innerHTML = `

            <div class="hero-side-content">

                <span>
                    ${article.category || "News"}
                </span>

                <h3>
                    ${article.title || ""}
                </h3>

            </div>

        `;

    }


    // ==================================
    // SIDE STORY 3
    // HEADLINE ONLY
    // ==================================

    const side3 =
        document.getElementById(
            "heroSideStory3"
        );


    if (
        side3 &&
        otherStories[2]
    ) {

        const article =
            otherStories[2];


        side3.href =
            "article.html?slug=" +
            article.slug;


        side3.innerHTML = `

            <div class="hero-side-content">

                <span>
                    ${article.category || "News"}
                </span>

                <h3>
                    ${article.title || ""}
                </h3>

            </div>

        `;

    }


    // ==================================
    // MORE TOP STORIES
    // ==================================

    const moreStories =
        document.getElementById(
            "moreTopStories"
        );


    if (!moreStories) return;


    moreStories.innerHTML = "";


    // Stories 4, 5, 6 and 7
    // after the hero + 3 side stories

    const topStories =
        otherStories.slice(3, 7);


    topStories.forEach(article => {

        moreStories.innerHTML += `

            <a
                href="article.html?slug=${article.slug}"
                class="more-top-story-card">

                <img
                    src="${article.featured_image || 'images/logo.png'}"
                    alt="${article.title || ''}"
                >

                <div class="story-content">

                    <span>
                        ${article.category || "News"}
                    </span>

                    <h3>
                        ${article.title || ""}
                    </h3>

                </div>

            </a>

        `;

    });

}


// ======================================
// BREAKING NEWS TICKER
// ======================================

async function loadBreakingNews() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("title, slug")
        .eq("status", "Published")
        .eq("is_breaking", true)
        .order("publish_date", { ascending: false });

    if (error) {

        console.error(
            "Breaking News Error:",
            error
        );

        return;

    }

    const ticker =
        document.getElementById("breakingTicker");

    if (!ticker) return;


    if (!data || data.length === 0) {

        ticker.innerHTML =
            "No Breaking News";

        return;

    }


    ticker.innerHTML = data.map(article =>

        `<a href="article.html?slug=${article.slug}">
            🔴 ${article.title}
        </a>`

    ).join(
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    );

}


// ======================================
// LATEST UPDATES
// ======================================

async function loadLatestUpdates() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("title, category, slug")
        .eq("status", "Published")
        .order("publish_date", { ascending: false })
        .limit(10);

    if (error) {

        console.error(
            "Latest Updates Error:",
            error
        );

        return;

    }


    const container =
        document.getElementById("latestUpdates");

    if (!container) return;


    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No latest articles.</p>";

        return;

    }


    container.innerHTML = "";


    data.forEach(article => {

        container.innerHTML += `

            <div class="mini-news">

                <span>
                    ${article.category || "News"}
                </span>

                <p>

                    <a href="article.html?slug=${article.slug}">
                        ${article.title}
                    </a>

                </p>

            </div>

        `;

    });

}


// ======================================
// TRENDING STORIES
// ======================================

async function loadTrendingStories() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .eq("is_trending", true)
        .order("publish_date", { ascending: false })
        .limit(10);

    if (error) {

        console.error(
            "Trending Error:",
            error
        );

        return;

    }


    const container =
        document.getElementById("trendingStories");

    if (!container) return;


    if (!data || data.length === 0) {

        container.innerHTML = `
            <p>No Trending Stories</p>
        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(article => {

        container.innerHTML += `

            <div class="mini-news">

                <span>
                    ${article.category || "News"}
                </span>

                <p>

                    <a href="article.html?slug=${article.slug}">
                        ${article.title}
                    </a>

                </p>

            </div>

        `;

    });

}


// ======================================
// LATEST BY CATEGORY
// ======================================

async function loadChannels() {

    const categories = [
        "Politics",
        "Business",
        "Technology",
        "Sports",
        "Entertainment"
    ];


    const container =
        document.getElementById("channelsContainer");

    if (!container) return;


    container.innerHTML = "";


    for (const category of categories) {

        const { data, error } = await supabaseClient
            .from("articles")
            .select("*")
            .eq("status", "Published")
            .eq("category", category)
            .order("publish_date", {
                ascending: false
            })
            .limit(15);


        if (error) {

            console.error(
                `${category} error:`,
                error
            );

            continue;

        }


        if (!data || !data.length) continue;


        let html = `

            <div class="channel-row">

                <div class="channel-header">

                    <h3>
                        ${category}
                    </h3>

                    <a href="${category.toLowerCase()}.html">
                        View All →
                    </a>

                </div>


                <button class="slider-arrow prev">
                    &#10094;
                </button>


                <div class="headline-slider">

        `;


        data.forEach(article => {

            html += `

                <a
                    class="headline-card"
                    href="article.html?slug=${article.slug}"
                >

                    <span>
                        ${article.category}
                    </span>

                    <h4>
                        ${article.title}
                    </h4>

                    <p>
                        ${new Date(
                            article.publish_date
                        ).toLocaleDateString()}
                    </p>

                </a>

            `;

        });


        html += `

                </div>


                <button class="slider-arrow next">
                    &#10095;
                </button>

            </div>

        `;


        container.innerHTML += html;

    }


    // ==================================
    // CATEGORY SLIDER ARROWS
    // ==================================

    document
        .querySelectorAll(".channel-row")
        .forEach(row => {

            const slider =
                row.querySelector(
                    ".headline-slider"
                );


            const next =
                row.querySelector(".next");


            const prev =
                row.querySelector(".prev");


            if (next) {

                next.onclick = () => {

                    slider.scrollBy({
                        left: 300,
                        behavior: "smooth"
                    });

                };

            }


            if (prev) {

                prev.onclick = () => {

                    slider.scrollBy({
                        left: -300,
                        behavior: "smooth"
                    });

                };

            }

        });

}


// ======================================
// FEATURED COVERAGE
// ======================================

async function loadFeaturedCoverage() {

    const container =
        document.getElementById(
            "featuredCoverage"
        );

    if (!container) {

        console.warn(
            "featuredCoverage container not found"
        );

        return;

    }


    /*
        Each card represents a section.

        We first look for articles marked
        is_featured = true.

        If there aren't enough featured
        articles, we fall back to the
        latest published articles.
    */

    const sections = [

        {
            name: "Beyond Politics",
            category: "Politics",
            link: "politics.html"
        },

        {
            name: "Beyond Entertainment",
            category: "Entertainment",
            link: "entertainment.html"
        },

        {
            name: "Beyond Talks",
            category: "Videos",
            link: "videos.html"
        },

        {
            name: "Beyond Sports",
            category: "Sports",
            link: "sports.html"
        }

    ];


    container.innerHTML = "";


    for (const section of sections) {

        let articles = [];


        // ==================================
        // FIRST: FEATURED ARTICLES
        // ==================================

        const { data: featuredData, error: featuredError } =
            await supabaseClient
                .from("articles")
                .select("*")
                .eq("status", "Published")
                .eq("category", section.category)
                .eq("is_featured", true)
                .order("publish_date", {
                    ascending: false
                })
                .limit(5);


        if (
            !featuredError &&
            featuredData &&
            featuredData.length > 0
        ) {

            articles = featuredData;

        }


        // ==================================
        // FALLBACK: LATEST ARTICLES
        // ==================================

        if (articles.length === 0) {

            const { data: latestData, error: latestError } =
                await supabaseClient
                    .from("articles")
                    .select("*")
                    .eq("status", "Published")
                    .eq("category", section.category)
                    .order("publish_date", {
                        ascending: false
                    })
                    .limit(5);


            if (
                !latestError &&
                latestData
            ) {

                articles = latestData;

            }

        }


        // ==================================
        // NO STORIES
        // ==================================

        if (!articles.length) {

            continue;

        }


        // ==================================
        // CREATE CARD
        // ==================================

        const card =
            document.createElement("a");

        card.className =
            "show-card";


        card.href =
            `${section.link}?slug=${articles[0].slug}`;


        container.appendChild(card);


        // ==================================
        // CARD CONTENT
        // ==================================

        let currentIndex = 0;


        function updateCard() {

    const article =
        articles[currentIndex];

    const image =
        article.featured_image ||
        "images/logo.png";


    // Fade out current story
    card.classList.add("coverage-changing");


    setTimeout(() => {

        card.innerHTML = `

            <img
                src="${image}"
                alt="${article.title || section.name}"
            >

            <div class="show-overlay">

                <span>
                    ${section.name}
                </span>

                <h3>
                    ${article.title || "Latest Story"}
                </h3>

            </div>

        `;

        card.href =
            `article.html?slug=${article.slug}`;


        // Fade in after new image loads
        const newImage =
            card.querySelector("img");

        if (newImage) {

            newImage.onload = () => {

                card.classList.remove(
                    "coverage-changing"
                );

            };

        } else {

            card.classList.remove(
                "coverage-changing"
            );

        }

    }, 500);

}


        updateCard();


        // ==================================
        // AUTOMATIC STORY CHANGE
        // ==================================

        if (articles.length > 1) {

            setInterval(() => {

                currentIndex =
                    (currentIndex + 1)
                    % articles.length;

                updateCard();

            }, 5000);

        }

    }

}
