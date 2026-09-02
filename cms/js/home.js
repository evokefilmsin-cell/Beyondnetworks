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

// ======================================
// DYNAMIC HERO + SIDE STORIES
// ======================================

async function loadFeaturedStory() {

    const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("status", "Published")
        .order("publish_date", {
            ascending: false
        })
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
    // HERO STORIES
    // ==================================

    let heroStories =
        data.filter(article =>
            article.is_featured === true
        );


    /*
       If there are fewer than 5 featured
       stories, fill the remaining slides
       with latest published stories.
    */

    if (heroStories.length < 5) {

        const additionalStories =
            data.filter(article =>
                !heroStories.some(
                    featured =>
                        featured.id === article.id
                )
            );

        heroStories = [
            ...heroStories,
            ...additionalStories
        ].slice(0, 5);

    } else {

        heroStories =
            heroStories.slice(0, 5);

    }


    // ==================================
    // BUILD HERO SLIDES
    // ==================================

    const heroSlides =
        document.getElementById(
            "heroSlides"
        );

    const heroDots =
        document.getElementById(
            "heroDots"
        );


    if (!heroSlides) return;


    heroSlides.innerHTML = "";


    if (heroDots) {

        heroDots.innerHTML = "";

    }


    heroStories.forEach(
        (article, index) => {

            const image =
                article.featured_image ||
                "images/logo.png";


            const slide =
                document.createElement("div");


            slide.className =
                "hero-slide" +
                (index === 0
                    ? " active"
                    : "");


            slide.style.backgroundImage =
                `linear-gradient(
                    rgba(0,0,0,.35),
                    rgba(0,0,0,.80)
                ),
                url("${image}")`;


            slide.innerHTML = `

                <div class="hero-content">

                    <p class="tag">

                        ${article.category || "NEWS"}

                    </p>


                    <h1>

                        ${article.title || ""}

                    </h1>


                    <p class="subtitle">

                        ${article.summary || ""}

                    </p>


                    <a
                        href="article.html?slug=${article.slug}"
                        class="button">

                        Read Story

                    </a>

                </div>

            `;


            heroSlides.appendChild(
                slide
            );


            // ==================================
            // DOT
            // ==================================

            if (heroDots) {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.className =
                    "hero-dot" +
                    (index === 0
                        ? " active"
                        : "");


                dot.setAttribute(
                    "aria-label",
                    `Go to story ${index + 1}`
                );


                dot.onclick = () => {

                    showHeroSlide(index);

                };


                heroDots.appendChild(
                    dot
                );

            }

        }
    );


    // ==================================
    // HERO SLIDER
    // ==================================

    let currentHeroIndex = 0;


    function showHeroSlide(index) {

        const slides =
            document.querySelectorAll(
                ".hero-slide"
            );


        const dots =
            document.querySelectorAll(
                ".hero-dot"
            );


        if (!slides.length) return;


        currentHeroIndex =
            (index + slides.length)
            % slides.length;


        slides.forEach(slide => {

            slide.classList.remove(
                "active"
            );

        });


        dots.forEach(dot => {

            dot.classList.remove(
                "active"
            );

        });


        slides[currentHeroIndex]
            .classList.add("active");


        if (dots[currentHeroIndex]) {

            dots[currentHeroIndex]
                .classList.add("active");

        }

    }


    const nextButton =
        document.getElementById(
            "heroNext"
        );


    const prevButton =
        document.getElementById(
            "heroPrev"
        );


    if (nextButton) {

        nextButton.onclick = () => {

            showHeroSlide(
                currentHeroIndex + 1
            );

        };

    }


    if (prevButton) {

        prevButton.onclick = () => {

            showHeroSlide(
                currentHeroIndex - 1
            );

        };

    }


    // Automatically change hero

    if (heroStories.length > 1) {

        setInterval(() => {

            showHeroSlide(
                currentHeroIndex + 1
            );

        }, 6000);

    }


    // ==================================
    // SIDE STORIES
    // ==================================

    const sideStories =
        data.filter(article =>
            !heroStories.some(
                hero =>
                    hero.id === article.id
            )
        );


    // ==================================
    // SIDE STORY 1
    // IMAGE
    // ==================================

    if (sideStories[0]) {

        const article =
            sideStories[0];


        const card =
            document.getElementById(
                "heroSideStory1"
            );


        const image =
            document.getElementById(
                "heroSideImage1"
            );


        const category =
            document.getElementById(
                "heroSideCategory1"
            );


        const title =
            document.getElementById(
                "heroSideTitle1"
            );


        const time =
            document.getElementById(
                "heroSideTime1"
            );


        if (card) {

            card.href =
                "article.html?slug=" +
                article.slug;

        }


        if (image) {

            image.src =
                article.featured_image ||
                "images/logo.png";

            image.alt =
                article.title || "";

        }


        if (category) {

            category.textContent =
                article.category ||
                "NEWS";

        }


        if (title) {

            title.textContent =
                article.title || "";

        }


        if (time) {

            time.textContent =
                formatStoryTime(
                    article.publish_date
                );

        }

    }


    // ==================================
    // SIDE STORY 2
    // ==================================

    if (sideStories[1]) {

        populateSideStory(
            "heroSideStory2",
            "heroSideCategory2",
            "heroSideTitle2",
            "heroSideTime2",
            sideStories[1]
        );

    }


    // ==================================
    // SIDE STORY 3
    // ==================================

    if (sideStories[2]) {

        populateSideStory(
            "heroSideStory3",
            "heroSideCategory3",
            "heroSideTitle3",
            "heroSideTime3",
            sideStories[2]
        );

    }


    // ==================================
    // MORE TOP STORIES
    // ==================================

    const moreTopStories =
        document.getElementById(
            "moreTopStories"
        );


    if (!moreTopStories) return;


    moreTopStories.innerHTML = "";


    /*
       Use stories after:

       5 hero stories
       + 3 side stories

       = More Top Stories
    */

    const moreStories =
        sideStories.slice(3, 8);


    moreStories.forEach(article => {

        moreTopStories.innerHTML += `

            <a
                href="article.html?slug=${article.slug}"
                class="more-top-story-card">

                <img
                    src="${article.featured_image || 'images/logo.png'}"
                    alt="${article.title || ''}"
                >

                <div class="story-content">

                    <span>
                        ${article.category || "NEWS"}
                    </span>

                    <h3>
                        ${article.title || ""}
                    </h3>

                    <small>
                        ${formatStoryTime(
                            article.publish_date
                        )}
                    </small>

                </div>

            </a>

        `;

    });

}


// ======================================
// SIDE STORY HELPER
// ======================================

function populateSideStory(
    cardId,
    categoryId,
    titleId,
    timeId,
    article
) {

    const card =
        document.getElementById(cardId);


    const category =
        document.getElementById(categoryId);


    const title =
        document.getElementById(titleId);


    const time =
        document.getElementById(timeId);


    if (card) {

        card.href =
            "article.html?slug=" +
            article.slug;

    }


    if (category) {

        category.textContent =
            article.category ||
            "NEWS";

    }


    if (title) {

        title.textContent =
            article.title || "";

    }


    if (time) {

        time.textContent =
            formatStoryTime(
                article.publish_date
            );

    }

}


// ======================================
// STORY TIME
// ======================================

function formatStoryTime(date) {

    if (!date) return "";


    const published =
        new Date(date);


    const now =
        new Date();


    const diff =
        Math.floor(
            (now - published) /
            60000
        );


    if (diff < 60) {

        return `${Math.max(
            diff,
            1
        )}m ago`;

    }


    const hours =
        Math.floor(diff / 60);


    if (hours < 24) {

        return `${hours}h ago`;

    }


    const days =
        Math.floor(hours / 24);


    return `${days}d ago`;

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
