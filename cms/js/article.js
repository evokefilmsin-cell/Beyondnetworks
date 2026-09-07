// ======================================
// Beyond Networks
// article.js
// ======================================

console.log("article.js loaded");


// ======================================
// GET SLUG
// ======================================

const params =
    new URLSearchParams(
        window.location.search
    );

const slug =
    params.get("slug");


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadArticle();

        loadBreakingNews();

        loadTrendingSidebar();

        loadLatestSidebar();

    }
);


// ======================================
// ARTICLE
// ======================================

async function loadArticle() {

    if (!slug) {

        console.error(
            "No article slug found in URL."
        );

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("slug", slug)

        .single();


    if (error) {

        console.error(
            "Article loading error:",
            error
        );

        return;

    }


    if (!data) {

        console.error(
            "Article not found."
        );

        return;

    }


    // ==================================
    // SEO / SOCIAL METADATA
    // ==================================

    updateSEOMetadata(data);


    // ==================================
    // CATEGORY
    // ==================================

    const articleCategory =
        document.getElementById(
            "articleCategory"
        );


    if (articleCategory) {

        articleCategory.textContent =
            data.category || "News";

    }


    // ==================================
    // TITLE
    // ==================================

    const articleTitle =
        document.getElementById(
            "articleTitle"
        );


    if (articleTitle) {

        articleTitle.textContent =
            data.title || "";

    }


    // ==================================
    // AUTHOR
    // ==================================

    const articleAuthor =
        document.getElementById(
            "articleAuthor"
        );


    if (articleAuthor) {

        articleAuthor.textContent =
            data.author ||
            "Beyond News Digital";

    }


    // ==================================
    // PUBLISHED DATE
    // ==================================

    const articleDate =
        document.getElementById(
            "articleDate"
        );


    if (
        articleDate &&
        data.publish_date
    ) {

        articleDate.textContent =
            new Date(
                data.publish_date
            ).toLocaleString(
                "en-IN",
                {
                    timeZone:
                        "Asia/Kolkata",

                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    hour12:
                        true
                }
            );

    }


    // ==================================
    // UPDATED DATE
    // ==================================

    const articleUpdated =
        document.getElementById(
            "articleUpdated"
        );


    if (
        articleUpdated &&
        data.updated_at
    ) {

        articleUpdated.textContent =
            "Last Updated: " +
            new Date(
                data.updated_at
            ).toLocaleString(
                "en-IN",
                {
                    timeZone:
                        "Asia/Kolkata",

                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    hour12:
                        true
                }
            );

    }


    // ==================================
    // FEATURED IMAGE
    // ==================================

    const image =
        document.getElementById(
            "articleImage"
        );


    if (image) {

        if (data.featured_image) {

            image.src =
                data.featured_image;

        }

        image.alt =
            data.title ||
            "Beyond Networks";

    }


    // ==================================
    // IMAGE CAPTION
    // ==================================

    const imageCaption =
        document.getElementById(
            "imageCaption"
        );


    if (imageCaption) {

        imageCaption.textContent =
            data.title ||
            "Featured Image";

    }


    // ==================================
    // ARTICLE CONTENT
    // ==================================

    const articleContent =
        document.getElementById(
            "articleContent"
        );


    if (articleContent) {

        articleContent.innerHTML =
            data.content || "";

    }


    // ==================================
    // READ TIME
    // ==================================

    calculateReadTime(
        data.content || ""
    );


    // ==================================
    // RELATED STORIES
    // ==================================

    loadRelatedStories(
        data.category,
        data.id
    );

}


// ======================================
// SEO / SOCIAL METADATA
// ======================================

function updateSEOMetadata(data) {

    // ----------------------------------
    // SEO TITLE
    // ----------------------------------

    const seoTitle =
        (
            data.seo_title ||
            data.title ||
            "Beyond Networks"
        ).trim();


    // ----------------------------------
    // META DESCRIPTION
    // ----------------------------------

    const metaDescription =
        (
            data.meta_description ||
            data.summary ||
            ""
        ).trim();


    // ----------------------------------
    // SOCIAL TITLE
    // ----------------------------------

    const socialTitle =
        (
            data.social_title ||
            seoTitle
        ).trim();


    // ----------------------------------
    // SOCIAL DESCRIPTION
    // ----------------------------------

    const socialDescription =
        (
            data.social_description ||
            metaDescription
        ).trim();


    // ----------------------------------
    // ARTICLE URL
    // ----------------------------------

    const articleUrl =
        window.location.href;


    // ----------------------------------
    // CANONICAL URL
    // ----------------------------------

    const canonicalUrl =
        (
            data.canonical_url ||
            articleUrl
        ).trim();


    // ----------------------------------
    // SOCIAL IMAGE
    // ----------------------------------

    const socialImage =
        (
            data.featured_image ||
            ""
        ).trim();


    // ==================================
    // PAGE TITLE
    // ==================================

    document.title =
        seoTitle +
        " | Beyond Networks";


    // Existing hidden/page title element
    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (pageTitle) {

        pageTitle.textContent =
            document.title;

    }


    // ==================================
    // META DESCRIPTION
    // ==================================

    setMetaTag(
        "name",
        "description",
        metaDescription
    );


    // ==================================
    // CANONICAL
    // ==================================

    setCanonicalUrl(
        canonicalUrl
    );


    // ==================================
    // OPEN GRAPH
    // ==================================

    setMetaTag(
        "property",
        "og:type",
        "article"
    );


    setMetaTag(
        "property",
        "og:title",
        socialTitle
    );


    setMetaTag(
        "property",
        "og:description",
        socialDescription
    );


    setMetaTag(
        "property",
        "og:url",
        canonicalUrl
    );


    if (socialImage) {

        setMetaTag(
            "property",
            "og:image",
            socialImage
        );

    }


    setMetaTag(
        "property",
        "og:site_name",
        "Beyond Networks"
    );


    // ==================================
    // ARTICLE OG INFORMATION
    // ==================================

    if (data.author) {

        setMetaTag(
            "property",
            "article:author",
            data.author
        );

    }


    if (data.category) {

        setMetaTag(
            "property",
            "article:section",
            data.category
        );

    }


    if (data.publish_date) {

        setMetaTag(
            "property",
            "article:published_time",
            data.publish_date
        );

    }


    if (data.updated_at) {

        setMetaTag(
            "property",
            "article:modified_time",
            data.updated_at
        );

    }


    // ==================================
    // X / TWITTER
    // ==================================

    setMetaTag(
        "name",
        "twitter:card",
        "summary_large_image"
    );


    setMetaTag(
        "name",
        "twitter:title",
        socialTitle
    );


    setMetaTag(
        "name",
        "twitter:description",
        socialDescription
    );


    if (socialImage) {

        setMetaTag(
            "name",
            "twitter:image",
            socialImage
        );

    }


    console.log(
        "SEO metadata updated:",
        {
            seoTitle,
            metaDescription,
            socialTitle,
            socialDescription,
            canonicalUrl,
            socialImage
        }
    );

}


// ======================================
// SET META TAG
// ======================================

function setMetaTag(
    attribute,
    attributeValue,
    content
) {

    if (!content) {
        return;
    }


    let tag =
        document.head.querySelector(
            `meta[${attribute}="${attributeValue}"]`
        );


    if (!tag) {

        tag =
            document.createElement(
                "meta"
            );

        tag.setAttribute(
            attribute,
            attributeValue
        );

        document.head.appendChild(
            tag
        );

    }


    tag.setAttribute(
        "content",
        content
    );

}


// ======================================
// SET CANONICAL URL
// ======================================

function setCanonicalUrl(url) {

    if (!url) {
        return;
    }


    let canonical =
        document.head.querySelector(
            'link[rel="canonical"]'
        );


    if (!canonical) {

        canonical =
            document.createElement(
                "link"
            );

        canonical.setAttribute(
            "rel",
            "canonical"
        );

        document.head.appendChild(
            canonical
        );

    }


    canonical.setAttribute(
        "href",
        url
    );

}


// ======================================
// READ TIME
// ======================================

function calculateReadTime(content) {

    const text =
        content
            .replace(
                /<[^>]*>?/gm,
                ""
            )
            .trim();


    const words =
        text
            ? text.split(/\s+/).length
            : 0;


    const minutes =
        Math.max(
            1,
            Math.ceil(
                words / 220
            )
        );


    const articleReadTime =
        document.getElementById(
            "articleReadTime"
        );


    if (articleReadTime) {

        articleReadTime.textContent =
            minutes +
            " min read";

    }

}


// ======================================
// BREAKING NEWS
// ======================================

async function loadBreakingNews() {

    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select(
            "title,slug"
        )

        .eq(
            "status",
            "Published"
        )

        .eq(
            "is_breaking",
            true
        )

        .order(
            "publish_date",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Breaking news error:",
            error
        );

        return;

    }


    const ticker =
        document.getElementById(
            "breakingTicker"
        );


    if (!ticker) {
        return;
    }


    ticker.innerHTML =
        "";


    data.forEach(
        article => {

            ticker.innerHTML += `

                <a href="article.html?slug=${encodeURIComponent(article.slug)}">
                    🔴 ${article.title}
                </a>

            `;

        }
    );

}


// ======================================
// TRENDING SIDEBAR
// ======================================

async function loadTrendingSidebar() {

    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select("*")

        .eq(
            "status",
            "Published"
        )

        .eq(
            "is_trending",
            true
        )

        .order(
            "publish_date",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Trending news error:",
            error
        );

        return;

    }


    const sidebar =
        document.getElementById(
            "trendingNewsArticle"
        );


    if (!sidebar) {
        return;
    }


    sidebar.innerHTML =
        "";


    data.forEach(
        article => {

            sidebar.innerHTML += `

                <div class="mini-news">

                    <img
                        src="${article.featured_image || ""}"
                        alt="${article.title || ""}"
                    >

                    <div>

                        <div class="mini-content">

                            <span class="mini-category">
                                ${article.category || "News"}
                            </span>

                            <h4 class="mini-title">

                                <a
                                    href="article.html?slug=${encodeURIComponent(article.slug)}"
                                >
                                    ${article.title || ""}
                                </a>

                            </h4>

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


// ======================================
// LATEST SIDEBAR
// ======================================

async function loadLatestSidebar() {

    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select("*")

        .eq(
            "status",
            "Published"
        )

        .order(
            "publish_date",
            {
                ascending: false
            }
        )

        .limit(8);


    if (error) {

        console.error(
            "Latest news error:",
            error
        );

        return;

    }


    const sidebar =
        document.getElementById(
            "latestNewsArticle"
        );


    if (!sidebar) {
        return;
    }


    sidebar.innerHTML =
        "";


    data.forEach(
        article => {

            sidebar.innerHTML += `

                <div class="mini-news">

                    <a
                        href="article.html?slug=${encodeURIComponent(article.slug)}"
                    >

                        <img
                            src="${article.featured_image || ""}"
                            alt="${article.title || ""}"
                            class="mini-thumb"
                        >

                        <span class="mini-category">
                            ${article.category || "News"}
                        </span>

                        <h4 class="mini-title">
                            ${article.title || ""}
                        </h4>

                    </a>

                </div>

            `;

        }
    );

}


// ======================================
// RELATED STORIES
// ======================================

async function loadRelatedStories(
    category,
    id
) {

    if (!category || !id) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select("*")

        .eq(
            "status",
            "Published"
        )

        .eq(
            "category",
            category
        )

        .neq(
            "id",
            id
        )

        .order(
            "publish_date",
            {
                ascending: false
            }
        )

        .limit(8);


    if (error) {

        console.error(
            "Related stories error:",
            error
        );

        return;

    }


    const related =
        document.getElementById(
            "relatedStories"
        );


    if (!related) {
        return;
    }


    related.innerHTML =
        "";


    data.forEach(
        article => {

            related.innerHTML += `

                <article class="card">

                    <img
                        src="${article.featured_image || ""}"
                        alt="${article.title || ""}"
                    >

                    <div class="content">

                        <span>
                            ${article.category || "News"}
                        </span>

                        <h3>

                            <a
                                href="article.html?slug=${encodeURIComponent(article.slug)}"
                            >
                                ${article.title || ""}
                            </a>

                        </h3>

                        <p>
                            ${article.summary || ""}
                        </p>

                    </div>

                </article>

            `;

        }
    );

}
