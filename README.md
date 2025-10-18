# 🔐 Secure Password Generator

A lightweight, **client-side password generator** built with **HTML, CSS, and vanilla JavaScript**.  
It leverages the **browser’s Crypto API** for cryptographically strong randomness (with fallbacks) and offers granular control over password length, character sets, and ambiguity filtering.

---

## 🧩 Project Overview

| File | Purpose |
|------|----------|
| `index.html` | Main UI and input controls |
| `pass_gen.css` | Styling and layout |
| `pass_gen.js` | Core logic: generation, strength meter, clipboard handling |

---

## ⚡ Quick Start

Simply open `index.html` in your browser — no installation required.  
From PowerShell on Windows:

```powershell
Start-Process 'C:\Users\pc\Documents\password_generator\index.html'
```

Runs entirely client-side — **no data ever leaves your browser**.

---

## ✨ Features

* 🧠 Uses `window.crypto.getRandomValues()` for secure, unbiased randomness
* ⚙️ Fallback to `Math.random()` only when Crypto API is unavailable
* 🔠 Select which character sets to include:

	* Uppercase, lowercase, digits, symbols
	* Option to **avoid ambiguous characters** (`O`, `0`, `I`, `l`, `1`)
* 📏 Password length adjustable from **4 to 128**
* 🌈 Real-time strength bar visualization
* 📋 Copy to clipboard with multi-level fallbacks:

	* Native `navigator.clipboard`
	* Legacy `execCommand`
	* Manual copy prompt
* ⌨️ Keyboard shortcut: press **`G`** to instantly generate a new password

---

## 🧭 How to Use

1. Choose your desired length and character sets
2. (Optional) Enable **“Avoid ambiguous characters”**
3. Click **Generate** or press **`G`**
4. Use **Copy** to copy the result or click the password to select it manually

---

## 🧠 Security Notes

* **Primary source:** Browser’s `Crypto.getRandomValues()` ensures secure, unbiased randomness
* **Fallback:** `Math.random()` used only as a last resort (avoid for critical security)
* **Clipboard:** Requires a secure (`https://`) context in modern browsers

	* If access is blocked, the app will gracefully fall back to alternate methods

---

## 🧪 Testing & Verification

| Test              | What to Check                                            |
| ----------------- | -------------------------------------------------------- |
| Character toggles | Verify inclusion/exclusion per selected sets             |
| Strength meter    | Changes dynamically based on length and diversity        |
| Copy behavior     | Works in modern browsers; falls back to prompt otherwise |
| Keyboard shortcut | Press `G` → new password generated                       |

---

## 🧰 Troubleshooting

* ❌ **Copy doesn’t work on `file://` URLs?**
	Serve locally (e.g., with Python):

	```bash
	python -m http.server
	```

	Then open `http://localhost:8000`

* ⚙️ **App doesn’t run?**
	Check DevTools → Console for JS errors.

---

## 🤝 Contributing

Contributions are welcome — especially:

* Accessibility and UX improvements
* Security refinements
* Test automation for `secureRandomIndex()`

If you plan to redistribute, consider adding a `LICENSE` file.

---



## 📄 License

This project is licensed under the MIT License.

   **❤️ Made with love: Zaynab Marzak**


