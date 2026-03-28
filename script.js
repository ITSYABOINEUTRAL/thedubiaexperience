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

// ==================== CONDITIONAL FIELDS ====================
function handleServiceType() {
    const service = document.getElementById('serviceType').value;
    document.getElementById('livePerformanceGroup').style.display = 'none';
    document.getElementById('studioGroup').style.display = 'none';
    document.getElementById('serviceOtherGroup').style.display = 'none';
    document.getElementById('liveOtherGroup').style.display = 'none';
    document.getElementById('studioOtherGroup').style.display = 'none';

    if (service === 'live') {
        document.getElementById('livePerformanceGroup').style.display = 'block';
    } else if (service === 'studio') {
        document.getElementById('studioGroup').style.display = 'block';
    } else if (service === 'other') {
        document.getElementById('serviceOtherGroup').style.display = 'block';
    }
}

function handleLiveOther() {
    const val = document.getElementById('livePerformancetype').value;
    document.getElementById('liveOtherGroup').style.display = (val === 'other') ? 'block' : 'none';
}

function handleStudioOther() {
    const val = document.getElementById('studioRecordingType').value;
    document.getElementById('studioOtherGroup').style.display = (val === 'other') ? 'block' : 'none';
}

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize conditional fields
    handleServiceType();

    // Attach submit handler safely
    const bookingForm = document.getElementById("bookingForm");
    
    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();   // ← Must be first line

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

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
                    if (rawText.trim()) {
                        result = JSON.parse(rawText);
                    }
                } catch (parseErr) {
                    console.warn("JSON parse failed:", parseErr);
                }

                const isSuccess = response.ok;
                const message = result.message ||
                    (isSuccess 
                        ? "🎉 Booking received successfully! A confirmation email has been sent to your email address. Incase you didn't receive it, please check your spam folder." 
                        : "Something went wrong. Please try again.");

                showNotification(message, isSuccess ? "success" : "error");

                if (isSuccess) {
                    e.target.reset();

                    // Reset conditional fields
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
        });
    } else {
        console.error("Booking form not found in DOM!");
    }
});

// ==================== NOTIFICATION FUNCTION ====================
function showNotification(message, type = "success") {
    const container = document.getElementById("notification-container");
    if (!container) {
        console.error("Notification container not found!");
        alert(message);
        return;
    }

    const notif = document.createElement("div");
    notif.className = `notification ${type}`;
    notif.textContent = message;

    container.appendChild(notif);
    container.classList.add("show");

    // Auto hide after 5 seconds
    setTimeout(() => {
        notif.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        notif.style.opacity = "0";
        notif.style.transform = "translateY(20px)";

        setTimeout(() => {
            notif.remove();
            if (container.children.length === 0) {
                container.classList.remove("show");
            }
        }, 400);
    }, 5000);
}