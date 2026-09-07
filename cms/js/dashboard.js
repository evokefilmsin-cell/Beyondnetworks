console.log("Dashboard JS loaded");


// ======================================
// INITIALIZE
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboardStats();

    await loadRecentArticles();

    await loadRecentActivity();

    await loadLatestVideo();

    setupDashboardActions();

});


// ======================================
// DASHBOARD STATS
// ======================================

async function loadDashboardStats() {

    try {

        // ----------------------------------
        // TOTAL ARTICLES
        // ----------------------------------

        const {
            count: totalArticles,
            error: totalError
        } = await supabaseClient

            .from("articles")

            .select("id", {
                count: "exact",
                head: true
            })

            .eq("is_video", false);


        if (totalError) {
            console.error(
                "Total articles error:",
                totalError
            );
        }


        setText(
            "totalArticles",
            totalArticles || 0
        );


        // ----------------------------------
        // PUBLISHED
        // ----------------------------------

        const {
            count: published,
            error: publishedError
        } = await supabaseClient

            .from("articles")

            .select("id", {
                count: "exact",
                head: true
            })

            .eq("is_video", false)

            .ilike(
                "status",
                "Published"
            );


        if (publishedError) {
            console.error(
                "Published count error:",
                publishedError
            );
        }


        setText(
            "publishedArticles",
            published || 0
        );


        // ----------------------------------
        // DRAFTS
        // ----------------------------------

        const {
            count: drafts,
            error: draftsError
        } = await supabaseClient

            .from("articles")

            .select("id", {
                count: "exact",
                head: true
            })

            .eq("is_video", false)

            .ilike(
                "status",
                "Draft"
            );


        if (draftsError) {
            console.error(
                "Draft count error:",
                draftsError
            );
        }


        setText(
            "draftArticles",
            drafts || 0
        );


        // ----------------------------------
        // SCHEDULED
        // ----------------------------------

        const {
            count: scheduled,
            error: scheduledError
        } = await supabaseClient

            .from("articles")

            .select("id", {
                count: "exact",
                head: true
            })

            .eq("is_video", false)

            .ilike(
                "status",
                "Scheduled"
            );


        if (scheduledError) {
            console.error(
                "Scheduled count error:",
                scheduledError
            );
        }


        setText(
            "scheduledArticles",
            scheduled || 0
        );


        // ----------------------------------
        // VIDEOS
        // ----------------------------------

        const {
            count: videos,
            error: videosError
        } = await supabaseClient

            .from("articles")

            .select("id", {
                count: "exact",
                head: true
            })

            .eq(
                "is_video",
                true
            );


        if (videosError) {
            console.error(
                "Video count error:",
                videosError
            );
        }


        setText(
            "totalVideos",
            videos || 0
        );


        // ----------------------------------
        // TODAY'S ARTICLES
        // ----------------------------------

        const now =
            new Date();


        const startOfToday =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );


        const startOfTomorrow =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );


        const {
            count: todayArticles,
            error: todayError
        } = await supabaseClient

            .from("articles")

            .select("id", {
                count: "exact",
                head: true
            })

            .eq(
                "is_video",
                false
            )

            .gte(
                "publish_date",
                startOfToday.toISOString()
            )

            .lt(
                "publish_date",
                startOfTomorrow.toISOString()
            );


        if (todayError) {
            console.error(
                "Today's articles error:",
                todayError
            );
        }


        setText(
            "todayArticles",
            todayArticles || 0
        );


    } catch (error) {

        console.error(
            "Dashboard stats error:",
            error
        );

    }

}


// ======================================
// RECENT ARTICLES
// ======================================

async function loadRecentArticles() {

    const tbody =
        document.getElementById(
            "recentArticlesTable"
        );


    if (!tbody) return;


    tbody.innerHTML = `

        <tr>
            <td
                colspan="5"
                class="text-center"
            >
                Loading recent articles...
            </td>
        </tr>

    `;


    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select(`
            id,
            title,
            slug,
            category,
            status,
            is_video,
            publish_date,
            updated_at
        `)

        .eq(
            "is_video",
            false
        )

        .order(
            "updated_at",
            {
                ascending: false
            }
        )

        .limit(8);


    if (error) {

        console.error(
            "Recent articles error:",
            error
        );


        tbody.innerHTML = `

            <tr>
                <td
                    colspan="5"
                    class="text-center text-danger"
                >
                    Failed to load articles.
                </td>
            </tr>

        `;

        return;

    }


    if (!data || data.length === 0) {

        tbody.innerHTML = `

            <tr>
                <td
                    colspan="5"
                    class="text-center text-secondary"
                >
                    No articles found.
                </td>
            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    data.forEach(article => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <a
                    href="article-editor.html?id=${encodeURIComponent(article.id)}"
                    style="
                        color:inherit;
                        text-decoration:none;
                        font-weight:600;
                    "
                >
                    ${escapeHtml(article.title)}
                </a>

            </td>


            <td>
                ${escapeHtml(article.category || "-")}
            </td>


            <td>

                ${getStatusBadge(article.status)}

            </td>


            <td>
                ${formatDate(article.publish_date)}
            </td>


            <td>
                ${formatDate(article.updated_at)}
            </td>

        `;


        tbody.appendChild(row);

    });

}


// ======================================
// RECENT ACTIVITY
// ======================================

async function loadRecentActivity() {

    const container =
        document.getElementById(
            "recentActivity"
        );


    if (!container) return;


    container.innerHTML = `
        <div class="text-secondary">
            Loading activity...
        </div>
    `;


    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select(`
            id,
            title,
            status,
            is_video,
            created_at,
            updated_at
        `)

        .order(
            "updated_at",
            {
                ascending: false
            }
        )

        .limit(6);


    if (error) {

        console.error(
            "Recent activity error:",
            error
        );


        container.innerHTML = `
            <div class="text-danger">
                Failed to load activity.
            </div>
        `;

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="text-secondary">
                No recent activity.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(item => {

        const isVideo =
            item.is_video === true;


        const icon =
            isVideo
                ? "🎥"
                : "📰";


        const action =
            item.status &&
            item.status.toLowerCase() === "published"

                ? "published"

                : item.status &&
                  item.status.toLowerCase() === "scheduled"

                    ? "scheduled"

                    : item.status &&
                      item.status.toLowerCase() === "draft"

                        ? "saved as draft"

                        : "updated";


        const activity =
            document.createElement("div");


        activity.style.cssText = `
            padding:14px 0;
            border-bottom:1px solid rgba(255,255,255,0.08);
        `;


        activity.innerHTML = `

            <div
                style="
                    display:flex;
                    gap:12px;
                    align-items:flex-start;
                "
            >

                <div
                    style="
                        font-size:22px;
                        width:32px;
                    "
                >
                    ${icon}
                </div>


                <div>

                    <div
                        style="
                            font-weight:600;
                            line-height:1.4;
                        "
                    >

                        ${escapeHtml(item.title)}

                    </div>


                    <div
                        style="
                            font-size:13px;
                            color:#888;
                            margin-top:4px;
                        "
                    >

                        ${isVideo ? "Video" : "Article"}
                        ${action}
                        ·
                        ${formatRelativeTime(item.updated_at)}

                    </div>

                </div>

            </div>

        `;


        container.appendChild(activity);

    });

}


// ======================================
// LATEST VIDEO
// ======================================

async function loadLatestVideo() {

    const container =
        document.getElementById(
            "latestVideo"
        );


    if (!container) return;


    const {
        data,
        error
    } = await supabaseClient

        .from("articles")

        .select(`
            id,
            title,
            video_url,
            featured_image,
            publish_date
        `)

        .eq(
            "is_video",
            true
        )

        .ilike(
            "status",
            "Published"
        )

        .order(
            "publish_date",
            {
                ascending: false
            }
        )

        .limit(1);


    if (error) {

        console.error(
            "Latest video error:",
            error
        );

        return;

    }


    if (!data || data.length === 0) {

        container.innerHTML = `

            <div class="text-secondary">
                No published videos yet.
            </div>

        `;

        return;

    }


    const video =
        data[0];


    const thumbnail =
        video.featured_image ||
        getYouTubeThumbnail(
            video.video_url
        );


    container.innerHTML = `

        <a
            href="video-editor.html?id=${encodeURIComponent(video.id)}"
            style="
                text-decoration:none;
                color:inherit;
            "
        >

            ${
                thumbnail

                ? `
                    <img
                        src="${thumbnail}"
                        alt="${escapeHtml(video.title)}"
                        style="
                            width:100%;
                            aspect-ratio:16/9;
                            object-fit:cover;
                            border-radius:12px;
                        "
                        onerror="this.style.display='none'"
                    >
                `

                : `
                    <div
                        style="
                            width:100%;
                            aspect-ratio:16/9;
                            border-radius:12px;
                            background:#222;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:40px;
                        "
                    >
                        🎥
                    </div>
                `
            }


            <h3
                style="
                    margin-top:15px;
                "
            >
                ${escapeHtml(video.title)}
            </h3>


            <p
                style="
                    color:#888;
                    margin:0;
                "
            >
                ${formatDate(video.publish_date)}
            </p>

        </a>

    `;

}


// ======================================
// QUICK ACTIONS
// ======================================

function setupDashboardActions() {

    const newArticle =
        document.querySelector(
            ".publish-btn"
        );


    if (newArticle) {

        newArticle.addEventListener(
            "click",
            () => {

                window.location.href =
                    "article-editor.html";

            }
        );

    }


    const actions =
        document.querySelectorAll(
            ".action"
        );


    if (actions.length >= 4) {

        actions[0].onclick = () => {
            window.location.href =
                "article-editor.html";
        };


        actions[1].onclick = () => {
            window.location.href =
                "video-editor.html";
        };


        actions[2].onclick = () => {
            window.location.href =
                "media.html";
        };


        actions[3].onclick = () => {
            window.location.href =
                "categories.html";
        };

    }

}


// ======================================
// STATUS BADGE
// ======================================

function getStatusBadge(status) {

    const value =
        String(status || "")
            .toLowerCase();


    if (value === "published") {

        return `
            <span
                style="
                    background:#198754;
                    padding:5px 9px;
                    border-radius:5px;
                    font-size:12px;
                "
            >
                Published
            </span>
        `;

    }


    if (value === "scheduled") {

        return `
            <span
                style="
                    background:#ffc107;
                    color:#111;
                    padding:5px 9px;
                    border-radius:5px;
                    font-size:12px;
                "
            >
                Scheduled
            </span>
        `;

    }


    return `
        <span
            style="
                background:#6c757d;
                padding:5px 9px;
                border-radius:5px;
                font-size:12px;
            "
        >
            Draft
        </span>
    `;

}


// ======================================
// DATE
// ======================================

function formatDate(date) {

    if (!date) return "-";


    return new Date(date)
        .toLocaleString(
            "en-IN",
            {
                timeZone:
                    "Asia/Kolkata",

                day:"2-digit",

                month:"2-digit",

                year:"numeric",

                hour:"2-digit",

                minute:"2-digit",

                hour12:true
            }
        );

}


// ======================================
// RELATIVE TIME
// ======================================

function formatRelativeTime(date) {

    if (!date) return "";


    const now =
        new Date();


    const then =
        new Date(date);


    const seconds =
        Math.floor(
            (now - then) / 1000
        );


    if (seconds < 60) {

        return "just now";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `${minutes} min ago`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours} hr ago`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return `${days} day${days > 1 ? "s" : ""} ago`;

    }


    return formatDate(date);

}


// ======================================
// YOUTUBE THUMBNAIL
// ======================================

function getYouTubeThumbnail(url) {

    if (!url) return "";


    try {

        const parsed =
            new URL(url);


        let videoId = "";


        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            videoId =
                parsed.pathname
                    .replace("/", "");

        }


        else if (
            parsed.searchParams.has("v")
        ) {

            videoId =
                parsed.searchParams.get("v");

        }


        else {

            const parts =
                parsed.pathname
                    .split("/")
                    .filter(Boolean);


            const index =
                parts.findIndex(
                    part =>
                        [
                            "shorts",
                            "embed",
                            "live"
                        ].includes(part)
                );


            if (index !== -1) {

                videoId =
                    parts[index + 1] || "";

            }

        }


        if (!videoId) return "";


        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    } catch {

        return "";

    }

}


// ======================================
// TEXT
// ======================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// ======================================
// HTML ESCAPE
// ======================================

function escapeHtml(value) {

    return String(value || "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
