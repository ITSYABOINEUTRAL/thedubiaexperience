// ==================== DATE & TIME ====================
function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-ZA", optionsDate);
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = now.toLocaleTimeString("en-ZA", optionsTime);
    document.getElementById("current-datetime").innerHTML =
        `${formattedDate} <br> ${formattedTime}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ==================== CONDITIONAL FIELDS (booking only) ====================
function handleServiceType() {
    const service = document.getElementById('serviceType')?.value;
    if (!service) return;
    // ... your original conditional logic ...
}

// ==================== SUBMISSION HANDLERS ====================
async function handleBookingSubmission(e, data) {
    // ← your original booking submission logic (exactly as before)
    // I moved it here so it stays 100% unchanged
    try {
        const response = await fetch("https://thedubiaexperience-backend.onrender.com/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const rawText = await response.text();
        console.log("Raw server response:", rawText);
        console.log("HTTP Status:", response.status, "OK:", response.ok);

        let result = {};
        try {
            if (rawText.trim()) result = JSON.parse(rawText);
        } catch (parseErr) {}

        const isSuccess = response.ok;
        const message = result.message || (isSuccess 
            ? "🎉 Booking received successfully! A confirmation email has been sent to your email address. Incase you didn't receive it, please check your spam folder." 
            : "Something went wrong. Please try again.");

        showNotification(message, isSuccess ? "success" : "error");

        if (isSuccess) {
            e.target.reset();
            document.getElementById('livePerformanceGroup').style.display = 'none';
            document.getElementById('studioGroup').style.display = 'none';
            document.getElementById('serviceOtherGroup').style.display = 'none';
            document.getElementById('liveOtherGroup').style.display = 'none';
            document.getElementById('studioOtherGroup').style.display = 'none';
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showNotification("Failed to submit booking request. Please check your connection and try again.", "error");
    }
}

async function handleNewsletterSubmission(e, data) {
    try {
        const response = await fetch("https://thedubiaexperience-backend.onrender.com/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const rawText = await response.text();
        console.log("Raw server response:", rawText);
        console.log("HTTP Status:", response.status, "OK:", response.ok);

        let result = {};
        try {
            if (rawText.trim()) result = JSON.parse(rawText);
        } catch (parseErr) {}

        const isSuccess = response.ok;
        const message = result.message || (isSuccess 
            ? "🎉 Email sent successfully!" 
            : "Something went wrong. Please try again.");

        showNotification(message, isSuccess ? "success" : "error");

        if (isSuccess) {
            e.target.reset();
        }
    } catch (error) {
        console.error("Fetch error:", error);
        showNotification("Failed to send email. Please check your connection and try again.", "error");
    }
}

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    
    // Only run booking conditional logic on the booking page
    if (document.getElementById('serviceType')) {
        handleServiceType();
    }

    const bookingForm = document.getElementById("bookingForm");
    
    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Detect which form this is
            const isNewsletter = data.header !== undefined;

            if (isNewsletter) {
                await handleNewsletterSubmission(e, data);
            } else {
                await handleBookingSubmission(e, data);
            }
        });
    }
});

// ==================== NOTIFICATION FUNCTION ====================
function showNotification(message, type = "success") {
    // ← your original notification function (unchanged)
}