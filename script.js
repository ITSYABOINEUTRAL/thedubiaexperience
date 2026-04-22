// ==================== DATE & TIME ====================
function updateDateTime() {
    const now = new Date();

    const optionsDate = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const formattedDate = now.toLocaleDateString("en-ZA", optionsDate);

    const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    const formattedTime = now.toLocaleTimeString("en-ZA", optionsTime);

    const dateTimeElement = document.getElementById("current-datetime");

    if (dateTimeElement) {
        dateTimeElement.innerHTML = `${formattedDate} <br> ${formattedTime}`;
    }
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ==================== CONDITIONAL FIELDS ====================
function handleServiceType() {
    const service = document.getElementById("serviceType")?.value;

    const liveGroup = document.getElementById("livePerformanceGroup");
    const studioGroup = document.getElementById("studioGroup");
    const serviceOtherGroup = document.getElementById("serviceOtherGroup");

    if (!service) return;

    if (liveGroup) liveGroup.style.display = service === "live" ? "block" : "none";
    if (studioGroup) studioGroup.style.display = service === "studio" ? "block" : "none";
    if (serviceOtherGroup) serviceOtherGroup.style.display = service === "other" ? "block" : "none";
}

function handleLiveOther() {
    const liveType = document.getElementById("livePerformancetype")?.value;
    const liveOtherGroup = document.getElementById("liveOtherGroup");
    if (!liveOtherGroup) return;
    liveOtherGroup.style.display = liveType === "other" ? "block" : "none";
}

function handleStudioOther() {
    const studioType = document.getElementById("studioRecordingType")?.value;
    const studioOtherGroup = document.getElementById("studioOtherGroup");
    if (!studioOtherGroup) return;
    studioOtherGroup.style.display = studioType === "other" ? "block" : "none";
}

// ==================== IMPROVED NOTIFICATION (now appends to body) ====================
// ==================== IMPROVED NOTIFICATION (Centered Pop-up) ====================
function showNotification(message, type = "success") {
    console.log(`🔔 Notification triggered: ${message} (${type})`);

    // 1. Find or create the overlay container
    let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }

    // 2. Create the notification box
    const notification = document.createElement("div");
    // Apply the classes defined in your style.css
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div style="margin-bottom: 10px;">${message}</div>
        <div style="font-size: 12px; opacity: 0.7;">(Click to dismiss)</div>
    `;

    // 3. Clear any old notifications and add the new one
    container.innerHTML = ""; 
    container.appendChild(notification);

    // 4. Show the container (triggers the flex display and animation)
    container.classList.add("show");

    // 5. Dismiss Logic
    const dismiss = () => {
        container.classList.remove("show");
        // Small delay to allow the fade-out if you add one later
        setTimeout(() => { notification.remove(); }, 300);
    };

    // Click to dismiss
    notification.addEventListener("click", dismiss);

    // Auto-dismiss after 5 seconds
    setTimeout(dismiss, 5000);
}
// ==================== BOOKING SUBMISSION ====================
async function handleBookingSubmission(e, data) {
    try {
        console.log("Submitting booking:", data);

        const response = await fetch("https://thedubiaexperience-backend.onrender.com/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Booking response:", result);

        showNotification(
            result.message || "🎉 Booking received successfully! A confirmation email has been sent to your email address.",
            response.ok ? "success" : "error"
        );

        if (response.ok) {
            e.target.reset();
            ["livePerformanceGroup", "studioGroup", "serviceOtherGroup", "liveOtherGroup", "studioOtherGroup"]
                .forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = "none";
                });
        }
    } catch (error) {
        console.error("Booking error:", error);
        showNotification("Failed to submit booking request.", "error");
    }
}

// ==================== NEWSLETTER SUBMISSION ====================
async function handleNewsletterSubmission(e, data) {
    try {
        console.log("Submitting email:", data);

        const response = await fetch("https://thedubiaexperience-backend.onrender.com/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Email response:", result);

        showNotification(
            result.message || "🎉 Email sent successfully!",
            response.ok ? "success" : "error"
        );

        if (response.ok) {
            e.target.reset();
        }
    } catch (error) {
        console.error("Email error:", error);
        showNotification("Failed to send email.", "error");
    }
}

// ==================== MAIN ====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded fired - script.js loaded successfully");

    if (document.getElementById("serviceType")) {
        console.log("Booking page detected - initializing conditional fields");
        handleServiceType();
    }

    const bookingForm = document.getElementById("bookingForm");
    const newsletterForm = document.getElementById("newsletterForm");

    if (bookingForm) {
        console.log("Booking form found - attaching submit listener");
        bookingForm.addEventListener("submit", async (e) => {
            console.log("🚀 Booking form submitted");
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            await handleBookingSubmission(e, data);
        });
    } else {
        console.log("No bookingForm on this page");
    }

    if (newsletterForm) {
        console.log("Newsletter form found - attaching submit listener");
        newsletterForm.addEventListener("submit", async (e) => {
            console.log("🚀 Newsletter form submitted");
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            await handleNewsletterSubmission(e, data);
        });
    } else {
        console.log("No newsletterForm on this page");
    }
});