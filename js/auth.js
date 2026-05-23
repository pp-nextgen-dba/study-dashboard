const CORRECT_PIN = "9999";
const SESSION_KEY = "study_dashboard_auth";

export function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function requireAuth() {
    return new Promise((resolve) => {
        if (isAuthenticated()) {
            resolve();
            return;
        }

        const overlay = document.createElement("div");
        overlay.id = "pinOverlay";
        overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;";
        overlay.innerHTML = `
            <div style="background:#fff;border-radius:8px;padding:32px;text-align:center;min-width:260px;box-shadow:0 4px 20px rgba(0,0,0,0.2);">
                <h3 style="margin:0 0 8px;color:#222;">Enter PIN to Edit</h3>
                <p style="margin:0 0 16px;color:#555;font-size:14px;">This page requires a PIN to make changes.</p>
                <input id="pinInput" type="password" maxlength="10" placeholder="PIN"
                    style="width:100%;padding:10px;font-size:18px;text-align:center;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;letter-spacing:4px;">
                <p id="pinError" style="color:#dc3545;font-size:13px;margin:8px 0 0;min-height:18px;"></p>
                <button id="pinSubmit"
                    style="margin-top:12px;width:100%;padding:10px;background:#0d6efd;color:#fff;border:none;border-radius:4px;font-size:15px;cursor:pointer;">
                    Unlock
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        const input = overlay.querySelector("#pinInput");
        const error = overlay.querySelector("#pinError");
        const btn   = overlay.querySelector("#pinSubmit");

        const attempt = () => {
            if (input.value === CORRECT_PIN) {
                sessionStorage.setItem(SESSION_KEY, "1");
                overlay.remove();
                resolve();
            } else {
                error.textContent = "Incorrect PIN. Please try again.";
                input.value = "";
                input.focus();
            }
        };

        btn.addEventListener("click", attempt);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") attempt(); });
        input.focus();
    });
}
