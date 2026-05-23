// SHA-256 hash of the PIN. Generated with: crypto.subtle.digest("SHA-256", new TextEncoder().encode("9999"))
// To change the PIN, replace this hash with the SHA-256 of the new PIN.
const CORRECT_PIN_HASH = "4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5";
const SESSION_KEY = "study_dashboard_auth";

async function hashPin(pin) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

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

        const attempt = async () => {
            const hash = await hashPin(input.value);
            if (hash === CORRECT_PIN_HASH) {
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
