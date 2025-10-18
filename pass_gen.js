(function(){
    const lengthEl = document.getElementById('length');
    const lengthValueEl = document.getElementById('lengthValue');
    const upperEl = document.getElementById('upper');
    const lowerEl = document.getElementById('lower');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const avoidAmbiguousEl = document.getElementById('avoidAmbiguous');

    const resultEl = document.getElementById('result');
    const generateBtn = document.getElementById('generate');
    const regenerateBtn = document.getElementById('regenerate');
    const copyBtn = document.getElementById('copy');
    const strengthEl = document.getElementById('strength');

    const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const NUMS = '0123456789';
    const SYMS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    const AMBIGUOUS = 'O0Il1';
    const MIN_LENGTH = 4;
    const MAX_LENGTH = 128;
    const UINT32_RANGE = 4294967296; // 2^32

    function buildCharset() {
        let chars = '';
        if (upperEl.checked) chars += UPPER;
        if (lowerEl.checked) chars += LOWER;
        if (numbersEl.checked) chars += NUMS;
        if (symbolsEl.checked) chars += SYMS;
        if (avoidAmbiguousEl.checked) {
            chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
        }
        return chars;
    }

    function secureRandomIndex(max) {
        // return a uniform integer in [0, max)
        const cryptoObj = window.crypto || window.msCrypto;
        if (cryptoObj && cryptoObj.getRandomValues) {
            // rejection sampling to avoid modulo bias
            const bound = Math.floor(UINT32_RANGE / max) * max;
            const arr = new Uint32Array(1);
            let r;
            do {
                cryptoObj.getRandomValues(arr);
                r = arr[0];
            } while (r >= bound);
            return r % max;
        }
        return Math.floor(Math.random() * max);
    }

    function setResultText(text) {
        if (!resultEl) return;
        if (resultEl.tagName === 'INPUT' || resultEl.tagName === 'TEXTAREA') {
            resultEl.value = text;
        } else {
            resultEl.textContent = text;
        }
    }

    function generatePassword() {
        let length = parseInt(lengthEl.value, 10) || MIN_LENGTH;
        length = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, length));
        const charset = buildCharset();
        if (!charset) {
            setResultText('Please select at least one character set.');
            strengthEl.style.width = '0%';
            if (copyBtn) copyBtn.disabled = true;
            return;
        }
        let password = '';
        // build using secureRandomIndex to avoid bias
        for (let i = 0; i < length; i++) {
            const idx = secureRandomIndex(charset.length);
            password += charset.charAt(idx);
        }

        setResultText(password);
        updateStrength(password);
        if (copyBtn) copyBtn.disabled = !password;
    }

    function updateStrength(pw) {
        // Basic heuristic: length and variety
        let score = Math.min(40, pw.length * 2);
        const sets = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((s, re) => s + (re.test(pw) ? 1 : 0), 0);
        score += sets * 15; // up to +60
        score = Math.max(0, Math.min(100, score));
        strengthEl.style.width = score + '%';
        if (score < 40) strengthEl.style.background = 'linear-gradient(90deg,#ef4444,#f97316)';
        else if (score < 75) strengthEl.style.background = 'linear-gradient(90deg,#f59e0b,#facc15)';
        else strengthEl.style.background = 'linear-gradient(90deg,#34d399,#10b981)';
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = 'Copied ✓';
            setTimeout(() => copyBtn.textContent = 'Copy', 1200);
        } catch (err) {
            // fallback: try document.execCommand with a temporary textarea
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                // keep it out of viewport
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                ta.style.top = '0';
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand && document.execCommand('copy');
                document.body.removeChild(ta);
                if (ok) {
                    copyBtn.textContent = 'Copied ✓';
                    setTimeout(() => copyBtn.textContent = 'Copy', 1200);
                    return;
                }
            } catch (e) {
                // fall through to prompt
            }
            // last resort: show prompt so user can copy manually
            window.prompt('Copy the password (Ctrl+C):', text);
        }
    }

    // wire events
    lengthEl.addEventListener('input', () => {
        // clamp displayed value
        let v = parseInt(lengthEl.value, 10) || MIN_LENGTH;
        v = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, v));
        lengthValueEl.textContent = v;
    });
    generateBtn.addEventListener('click', generatePassword);
    regenerateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', async () => {
        let txt = '';
        if (resultEl.tagName === 'INPUT' || resultEl.tagName === 'TEXTAREA') txt = resultEl.value || '';
        else txt = resultEl.textContent || '';
        if (!txt || txt.startsWith('Please select')) return;
        await copyToClipboard(txt);
    });

    // allow clicking the result to select it for manual copy
    if (resultEl) {
        resultEl.addEventListener('click', () => {
            try {
                if (resultEl.tagName === 'INPUT' || resultEl.tagName === 'TEXTAREA') {
                    resultEl.select();
                } else {
                    const range = document.createRange();
                    range.selectNodeContents(resultEl);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            } catch (e) { /* ignore */ }
        });
    }

    // keyboard shortcut: press G to generate
    document.addEventListener('keydown', (e) => {
        if (e.key && e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            generatePassword();
        }
    });

    // initial setup and generation
    window.addEventListener('load', () => {
        if (lengthValueEl) lengthValueEl.textContent = lengthEl.value;
        if (copyBtn) copyBtn.disabled = true;
        generatePassword();
    });
})();
