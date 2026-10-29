# Zpay (Demo)

Scan leh pay theih UPI-style **demo** app. Phone-ah browser atang a kal a, camera hmangin QR tak tak scan theih a ni a, payment fel chiah chuan **ri (sound)** leh **voice** a nei.

> ⚠️ **Hei hi DEMO a ni.** Sum dik tak a kal lo, bank pawh a hmang lo. Balance (₹10,000) leh history zawng zawng i phone browser chhunga mai a dah a ni.
> Google Pay/GPay logo, hming leh design hi hmang suh. Zpay hian a logo leh design a nei ta a ni.

---

## A file te

| File | Eng nge a tih |
|---|---|
| `index.html` | App chhungril (screen hrang hrang) |
| `style.css` | Rawng, design |
| `app.js` | App thawk dan (scan, pay, PIN, sound, history) |
| `qrcode.js` | "My QR" siam nana library (MIT licence) |
| `manifest.json`, `icon.svg` | Phone home screen-ah dah theih nana |

File 7 zawng zawng hi folder chhungah dah lovin, GitHub repository **chhung (root)** ah dah tur a ni.

---

## GitHub-ah upload dan (Beginner guide)

### Step 1 · GitHub account siam
1. <https://github.com> kal la **Sign up** hmet rawh.
2. Email, password leh username (entirna: `lalrina`) dah la verify rawh.

### Step 2 · Repository siam
1. Chhim lamah **+** hmet la **New repository** thlang rawh.
2. **Repository name**: `zpay`
3. **Public** thlang rawh (GitHub Pages free hi Public-ah a hman theih).
4. **Create repository** hmet rawh.

### Step 3 · File upload
1. Repository page-ah **uploading an existing file** link hmet rawh (phone-ah chuan **Add file → Upload files**).
2. File 7 (`index.html`, `style.css`, `app.js`, `qrcode.js`, `manifest.json`, `icon.svg`, `README.md`) thlang la drag/upload rawh.
3. Hnuai lamah **Commit changes** hmet rawh.

> 💡 Zip file i hmuh chuan computer-ah *Extract* hmasa la, a chhunga file te upload rawh. Zip file mah upload suh.

### Step 4 · Website-ah chantir (GitHub Pages)
1. Repository-ah **Settings** → ch. lam **Pages** hmet rawh.
2. **Build and deployment → Source**: *Deploy from a branch*.
3. **Branch**: `main`, folder: `/ (root)` → **Save**.
4. Minute 1–2 nghah rawh. Page refresh la, link a lang ang:
   `https://USERNAME.github.io/zpay/`  (USERNAME = i GitHub username)

### Step 5 · Phone-ah hman
1. Link chu phone **Chrome** (Android) emaw **Safari** (iPhone) ah hawng rawh.
2. Camera permission **Allow** rawh. (Camera chu **HTTPS** ah chauh a thawk — GitHub Pages hi HTTPS a ni e.)
3. **Home screen-ah dah**: Chrome ⋮ → *Add to Home screen* · Safari Share → *Add to Home Screen*.

---

## Test dan

- **Phone pahnih hmang**: A phone-ah *My QR* hawng la, B phone Zpay-in *Scan* rawh → amount dah → PIN **1234** → ✅ *ting!* ri.
- **Phone pakhat chauh**: *Scan* screen-ah **Demo QR** hmet rawh, emaw *Gallery*-ah QR photo thlang rawh.
- **Sum dawn sound test**: *My QR* → *Demo: sum dawn nghal*. Sum a lut a, ri leh voice a awm ang.
- Sound a ri lo chuan phone **silent** a nih loh nan en la, *Me → Sound test* hmet rawh.

**Demo PIN: `1234`** (Me tab-ah i thlak thei).

---

## Mahni duh anga siam

| Thlak duh | Hmun |
|---|---|
| Rawng (color) | `style.css` chung ber `:root` ah `--brand`, `--brand2` |
| Contact hming | `app.js` chung ber `CONTACTS` |
| Bill category | `app.js` `BILLS` |
| Balance (₹10,000) | `app.js` `START_BAL` |
| Pay theih tam ber | `app.js` `MAX_AMOUNT` |

Thlak hnuah GitHub-ah file chu hmet la ✏️ (edit) → *Commit changes*. Minute 1–2 hnuah website a thar ang. Balance reset duh chuan *Me → Demo data reset* hmet rawh.

---

## Harsatna awm chuan

| Harsatna | Dawhtheihna |
|---|---|
| Camera a hawng lo | Link chu `https://` a ni em check rawh. Browser settings-ah Camera *Allow* rawh. In-app browser (WhatsApp, Facebook) ah a thawk lo thei, Chrome/Safari-ah hawng rawh. |
| "Scanner library load theih loh" | Internet check rawh. Chuti chung pawh chuan <https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js> save la `jsQR.js` hming-in repo-ah upload rawh. Chutiang chuan internet-a innghat lo in a thawk ang. |
| Page a thar lo | Minute 2 nghah la, browser-ah hard refresh (Ctrl+Shift+R) emaw tab dang-ah hawng leh rawh. |
| Sound a ri lo | Silent mode off rawh, *Me → Sound test* hmet rawh. iPhone-ah ringer switch en rawh. |
| 404 page | Pages settings-ah branch `main` / root a nih leh `index.html` a chunga awm (folder chhunga lo) check rawh. |

---

## Hmasawn nana (a hnuah)

Demo hi *learning* nana a tha. **Sum tak tak** kalpui nan Zpay hi hmang suh. Sum dik tak kalpui tur chuan:

1. **Payment gateway** hmang (Razorpay, Cashfree, PhonePe PG…) — business registration leh KYC a ngai.
2. UPI app tak tak chuan **NPCI approval**, bank partner leh security audit a ngai a, mimal-in a hlawhtling thei lo.
3. Mi dangte bank detail/OTP/PIN dik tak **la suh**, he demo-ah pawh.

Next step atan chuan *login*, *backend (database)* leh *Razorpay test mode* te zir hi a tha.
