// ======================================
// Beyond Networks CMS
// media.js
// ======================================

console.log("media.js loaded");

const MEDIA_BUCKET = "news-images";

let allMedia = [];

// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadMedia();

    const uploadInput =
        document.getElementById("mediaUpload");

    const searchInput =
        document.getElementById("mediaSearch");

    if (uploadInput) {
        uploadInput.addEventListener(
            "change",
            handleUpload
        );
    }

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterMedia
        );
    }

});

// ======================================
// LOAD MEDIA
// ======================================

async function loadMedia() {

    const mediaGrid =
        document.getElementById("mediaGrid");

    if (!mediaGrid) return;

    mediaGrid.innerHTML = `
        <div class="text-center p-5 text-secondary">
            Loading media...
        </div>
    `;

    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from(MEDIA_BUCKET)
        .list("", {
            limit: 1000,
            sortBy: {
                column: "created_at",
                order: "desc"
            }
        });

    if (error) {

        console.error(
            "Media loading error:",
            error
        );

        mediaGrid.innerHTML = `
            <div class="alert alert-danger">
                Failed to load media.
            </div>
        `;

        return;
    }

    allMedia = data || [];

    renderMedia(allMedia);
}

// ======================================
// RENDER MEDIA
// ======================================

function renderMedia(mediaList) {

    const mediaGrid =
        document.getElementById("mediaGrid");

    if (!mediaGrid) return;

    mediaGrid.innerHTML = "";

    if (!mediaList.length) {

        mediaGrid.innerHTML = `
            <div class="text-center p-5 text-secondary">
                No media found.
            </div>
        `;

        return;
    }

    mediaList.forEach(file => {

        // Ignore folders
        if (!file.name) return;

        const {
            data: publicData
        } = supabaseClient
            .storage
            .from(MEDIA_BUCKET)
            .getPublicUrl(file.name);

        const imageUrl =
            publicData.publicUrl;

        const fileName =
            file.name;

        const fileSize =
            formatFileSize(file.metadata?.size);

        const uploadedDate =
            file.created_at
                ? new Date(file.created_at)
                    .toLocaleDateString(
                        "en-IN",
                        {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    )
                : "-";

        mediaGrid.innerHTML += `

        <div class="media-card">

            <div class="media-image-wrapper">

                <img
                    src="${imageUrl}"
                    alt="${escapeHtml(fileName)}"
                    class="media-image"
                    onclick="previewMedia('${escapeAttribute(imageUrl)}')"
                >

            </div>

            <div class="media-info">

                <div
                    class="media-name"
                    title="${escapeHtml(fileName)}"
                >
                    ${escapeHtml(fileName)}
                </div>

                <div class="media-details">
                    ${fileSize} • ${uploadedDate}
                </div>

                <div class="media-actions">

                    <button
                        class="btn btn-sm btn-outline-light"
                        onclick="previewMedia('${escapeAttribute(imageUrl)}')"
                    >
                        <i class="bi bi-eye"></i>
                    </button>

                    <button
                        class="btn btn-sm btn-outline-light"
                        onclick="copyMediaUrl('${escapeAttribute(imageUrl)}')"
                    >
                        <i class="bi bi-link-45deg"></i>
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger"
                        onclick="deleteMedia('${escapeAttribute(fileName)}')"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                </div>

            </div>

        </div>

        `;
    });
}

// ======================================
// UPLOAD
// ======================================

async function handleUpload(event) {

    const files =
        Array.from(event.target.files || []);

    if (!files.length) return;

    for (const file of files) {

        if (!file.type.startsWith("image/")) {

            alert(
                `${file.name} is not an image.`
            );

            continue;
        }

        const safeName =
            createUniqueFileName(file.name);

        const {
            error
        } = await supabaseClient
            .storage
            .from(MEDIA_BUCKET)
            .upload(
                safeName,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );

        if (error) {

            console.error(
                "Upload error:",
                error
            );

            alert(
                `Failed to upload ${file.name}: ${error.message}`
            );

            continue;
        }
    }

    event.target.value = "";

    await loadMedia();

}

// ======================================
// CREATE UNIQUE FILE NAME
// ======================================

function createUniqueFileName(originalName) {

    const extension =
        originalName.includes(".")
            ? originalName
                .substring(
                    originalName.lastIndexOf(".")
                )
                .toLowerCase()
            : "";

    const baseName =
        originalName
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

    return `${Date.now()}-${baseName}${extension}`;
}

// ======================================
// SEARCH
// ======================================

function filterMedia() {

    const searchInput =
        document.getElementById("mediaSearch");

    if (!searchInput) return;

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const filtered =
        allMedia.filter(file =>
            file.name
                .toLowerCase()
                .includes(searchTerm)
        );

    renderMedia(filtered);
}

// ======================================
// PREVIEW
// ======================================

function previewMedia(url) {

    const previewImage =
        document.getElementById("previewImage");

    const previewModalElement =
        document.getElementById("mediaPreviewModal");

    if (!previewImage || !previewModalElement) {
        return;
    }

    previewImage.src = url;

    const modal =
        new bootstrap.Modal(
            previewModalElement
        );

    modal.show();
}

// ======================================
// COPY URL
// ======================================

async function copyMediaUrl(url) {

    try {

        await navigator.clipboard.writeText(url);

        alert("Image URL copied.");

    } catch (error) {

        console.error(
            "Copy error:",
            error
        );

        prompt(
            "Copy this image URL:",
            url
        );
    }
}

// ======================================
// DELETE
// ======================================

async function deleteMedia(fileName) {

    const confirmed =
        confirm(
            "Delete this image from the Media Library?"
        );

    if (!confirmed) return;

    const {
        error
    } = await supabaseClient
        .storage
        .from(MEDIA_BUCKET)
        .remove([
            fileName
        ]);

    if (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Failed to delete image: " +
            error.message
        );

        return;
    }

    await loadMedia();
}

// ======================================
// FILE SIZE
// ======================================

function formatFileSize(bytes) {

    if (!bytes) return "-";

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );
    }

    return (
        (bytes / (1024 * 1024)).toFixed(1) +
        " MB"
    );
}

// ======================================
// HTML SAFETY
// ======================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}
