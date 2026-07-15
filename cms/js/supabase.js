const SUPABASE_URL = "https://whmggwjufriglxaxjbkq.supabase.co";

const SUPABASE_KEY = "sb_publishable_Nvfn2bxE1LIX6oo1Zijs2g_Ra58yZzP";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
console.log("✅ Beyond Networks CMS Connected to Supabase");
