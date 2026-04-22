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

    if (liveGroup) {
        liveGroup.style.display = service === "live" ? "block" : "none";
    }

    if (studioGroup) {
        studioGroup.style.display = service === "studio" ? "block" : "none";
    }

    if (serviceOtherGroup) {
        serviceOtherGroup.style.display = service === "other" ? "block" : "none";
    }
}


// ==================== NOTIFICATION FUNCTION ====================
function showNotification(message, type = "success") {
    const container = document.getElementById("notification-container");

    if (!container) {
        alert(message);
        return;
    }

    const notification = document.createElement("div");

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 16px 20px;
        border-radius: 10px;
        color: white;
        font-family: Poppins, sans-serif;
        font-size: 14px;
        max-width: 380px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        background: ${type === "success" ? "#16a34a" : "#dc2626"};
    `;

    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}


// ==================== BOOKING SUBMISSION ====================
async function handleBookingSubmission(e, data) {
    try {
        console.log("Submitting booking:", data);

        const response = await fetch("https://thedubiaexperience-backend.onrender.com/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("Booking response:", result);

        showNotification(
            result.message || "Booking submitted successfully!",
            response.ok ? "success" : "error"
        );

        if (response.ok) {
            e.target.reset();

            [
                "livePerformanceGroup",
                "studioGroup",
                "serviceOtherGroup",
                "liveOtherGroup",
                "studioOtherGroup"
            ].forEach(id => {
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("Email response:", result);

        showNotification(
            result.message || "Email sent successfully!",
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
    if (document.getElementById("serviceType")) {
        handleServiceType();
    }

    const bookingForm = document.getElementById("bookingForm");
    const newsletterForm = document.getElementById("newsletterForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            await handleBookingSubmission(e, data);
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            await handleNewsletterSubmission(e, data);
        });
    }
});