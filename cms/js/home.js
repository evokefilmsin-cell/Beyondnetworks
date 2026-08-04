// =====================================
// Beyond Networks Homepage
// home.js
// =====================================

async function loadHeroSlider() {

    const heroSlider = document.getElementById("heroSlider");

    heroSlider.innerHTML = `
        <div style="padding:80px;text-align:center;">
            Loading Featured Stories...
        </div>
    `;

    const { data, error } = await supabaseClient

        .from("articles")

        .select("*")

        .eq("status","Published")

        .eq("is_featured",true)

        .order("publish_date",{ascending:false})

        .limit(5);

    if(error){

        console.error(error);

        heroSlider.innerHTML = `
            <div style="padding:80px;text-align:center;">
                Failed to load featured stories.
            </div>
        `;

        return;

    }

    if(data.length===0){

        heroSlider.innerHTML = `
            <div style="padding:80px;text-align:center;">
                No Featured Stories
            </div>
        `;

        return;

    }

    heroSlider.innerHTML="";

    data.forEach((article,index)=>{

        heroSlider.innerHTML += `

<div
class="hero-slide ${index===0 ? "active":""}"

style="
background-image:
linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.75)),
url('${article.featured_image}');
">

<div class="hero-content">

<p class="tag">

${article.category}

</p>

<h1>

${article.title}

</h1>

<p class="subtitle">

${article.summary}

</p>

<a
href="article.html?id=${article.id}"
class="button">

Read Story

</a>

</div>

</div>

`;

    });

}

loadHeroSlider();
