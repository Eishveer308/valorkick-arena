const registrationOpen = true;
const SUPABASE_URL = "https://krqurvsnizqmcanxkqgx.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtycXVydnNuaXpxbWNhbnhrcWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODI5NzMsImV4cCI6MjA5ODE1ODk3M30.5goaKpsObHY7wUjJI12Cmof3voiZuyg70r1I2ELjaFE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("registrationForm");
if (!registrationOpen) {
    form.style.display = "none";
    document.getElementById("registrationClosed").style.display = "block";
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const paymentFile = document.getElementById("payment").files[0];

if (!paymentFile) {
    alert("Please upload the payment screenshot.");
    return;
}

const fileName = Date.now() + "_" + paymentFile.name;

const { data: uploadData, error: uploadError } =
await supabaseClient.storage
    .from("payments")
    .upload(fileName, paymentFile);

if (uploadError) {
    console.error(uploadError);
    alert("Payment screenshot upload failed!");
    return;
}

const { error: dbError } = await supabaseClient
    .from("registrations")
    .insert([
        {
            name: document.getElementById("name").value,
            age: Number(document.getElementById("age").value),
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            city: document.getElementById("city").value,
            platform: document.getElementById("platform").value,
            gameid: document.getElementById("gameid").value,
            payment_url: fileName
        }
    ]);

if (dbError) {
    console.error(dbError);
    alert("Registration failed!");
    return;
}

alert("🎉 Registration Successful! We will verify your payment and contact you shortly.");

form.reset();

});