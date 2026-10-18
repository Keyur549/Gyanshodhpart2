# ✨ નવું (Part 1 Update)
- **⚡ Fast Bonus:** દરેક પ્રશ્નમાં બધા Players માં સૌથી પહેલા સાચો જવાબ આપનારને +1 extra (સાચા +1 ને બદલે કુલ +2). સમય Server ની ઘડિયાળથી, છેલ્લા Tap નો.
- **🃏 4 Power Cards (દરેક Game માં 1 વાર, એક સમયે ફક્ત 1):** 🛡 Shield (ખોટું હોય તો −1 નહિ), ✂️ 50-50 (Card માં 2 ખાનાં ચમકે), 🔄 Change (જવાબ 1 વાર બદલો), 🏆 Bonus Streak.
- **🏆 Bonus Streak:** જે પ્રશ્ને વાપરો ત્યાંથી તમારા Card ના જવાબ વાળા 3 પ્રશ્ન ગણાય (Card માં જવાબ ન હોય તો skip). ત્રણેય સાચા હોય તો +10 Bonus.
- **Winners (કુલ 10):** 1-5 Line, Full House, 3rd/2nd/1st (Overall Champion) Score, Zone Winner. Bonus Winner કાઢી નાખ્યો.
- **Net Score = સાચા − ખોટા + ⚡ Fast + 🏆 Streak.** Result અને Report માં દરેક પ્રશ્ને Card/⚡ દેખાય.
- Phone થી upload: `quiz-app-part1-flat.zip` માં કોઈ folder નથી, બધી files એક જ level પર.

# જ્ઞાન શોધ — Lucky Card Quiz Championship (Standalone App)

Aa ek standalone Node.js app che — koi pan vyakti (Claude account vagar) direct browser thi kholi shake. Real-time sync Socket.IO thi thaay che, data server ni memory ma rahe che (server restart thay to rooms clear thai jaay — jaruriyat hoy to database (jem ke SQLite/MongoDB) add kari shakay).

## Files
- `server.js` — backend (Express + Socket.IO), badhi game logic (questions, cards, timer, claims, winners) ahi che.
- `public/index.html` — landing page (Host/Player link).
- `public/host.html` — Host dashboard.
- `public/player.html` — Player screen.
- `package.json` — dependencies list.

## Locally Run Karva Mate (testing)
```
npm install
npm start
```
Pachi browser ma `http://localhost:3000` kholo.

## Internet Par Free Deploy Karva Mate (koi pan vyakti access kari shake)
Koi pan Node.js hosting chalse. Sauthi sahelu:

### Option 1: Render.com (free tier)
1. https://render.com par sign up karo, GitHub sathe connect karo (aa folder ne GitHub repo banavo).
2. "New Web Service" → repo select karo.
3. Build Command: `npm install`, Start Command: `npm start`.
4. Deploy thaya pachi tamne ek public URL malshe (jem ke `https://your-app.onrender.com`) — e j link badha players ne aapo.

### Option 2: Railway.app / Replit / Glitch
Aa badha pan free/cheap Node hosting aape che — repo/files upload karo, `npm install && npm start` set karo, public URL malshe.

## Players Potana Mobile Internet Thi Kaise Join Kare (Important)

Players e apna mobile ni internet (data/WiFi, ge pan hoy) thi join karva mate, server **internet par publicly accessible** hovo joiye — matlab fakt `localhost:3000` chalse to fakt host na j WiFi/computer par kaam kare, bahar na koi player thi nahi.

Be rasta che:

### Option A — Ek j event mate zadપી (ngrok, no deployment needed)
Jo aa fakt ek j vaar nu event hoy (jem ke temple satsang), sauthi sahelu:
1. `npm install && npm start` — apna laptop/computer par local server chalu karo.
2. https://ngrok.com par free account banavo, ngrok install karo.
3. Navi terminal ma: `ngrok http 3000`
4. Ngrok ek public link aapshe (jem ke `https://abcd1234.ngrok-free.app`) — **aaj link badha players ne aapo** (potana mobile internet thi khali jashe).
5. **Jaruri:** Event pura thata sudhi tamaru laptop/computer chalu ane internet sathe connected rakhvu — ngrok tunnel band thai jashe jo laptop band karo/sleep thay.

### Option B — Permanent Hosting (recurring use mate, laptop ni jarur nahi)
Upar "Render.com" wala steps follow karo — ek vaar deploy karya pachi link kayam chalu rahe, tamaru computer band hoy to pan.

Banne option ma players fakt link kholi, potanu naam/zone/avatar nakhi, Room Code sathe join kari shakse — potana j mobile data/WiFi thi, host na network sathe judાયેલા hova ni jarur nahi.

## Navi Suvidhao
- Player login/OTP nathi — Player sidhu Name + Zone + Room Code nakhi Join kare (Room Code QR/link thi bharaai jaay).
- Same Name + same Zone ek j room ma ek j var join thai shake; same Name alag Zone ma chale.
- Host Lobby ma Room QR dekhay. Reveal pachi Zone-wise score (Best Zone) dekhay; Excel ma 'Winners' ane 'Zones' sheet.
- Question ma photo: line ma `[img:https://...jpg]` umero (sidhi image link).

## Host Login
Default: **User ID:** `admin`, **Password:** `gyan2026`
(Change karva mate `server.js` na top par `HOST_ID`/`HOST_PW` badlo, athva environment variables `HOST_ID`/`HOST_PW` set karo.)

## Navaa Questions Add Karva
Room banavta j "Questions" box ma paste karo, format:
```
તમારો પ્રશ્ન?::સાચો જવાબ
```
(ke `Question - Answer` pan chalse). Khali rakho to built-in 36 questions vaparashe.

## Limitations (Important)
- Data server ni RAM ma j store thay che — server restart/redeploy thay to badhi rooms/results clear thai jaay. Moti event pehla ek dry-run test jarur karo.
- 500+ players ek j samaye connect kare to free-tier hosting (Render free) slow/sleep thai shake — paid tier (nano $ plan) ke thodu vadhare resources vado plan lo jo bahu moti event hoy.
- Speech (audio) browser-based che, so tamara players na phone/browser par Gujarati TTS voice hovi jaruri.

## Scratch Card ની Images (Score Level પ્રમાણે)
Player ને Result પછી Scratch Card મળે છે. Net Score ના Level પ્રમાણે ઉપર એક Image દેખાય છે.
Images આ folder માં છે: `public/scratch/`

| File | Level (Net Score) |
|---|---|
| level1.png | 👑 જ્ઞાન સમ્રાટ (20+) |
| level2.png | 🌟 જ્ઞાન ચેમ્પિયન (15–19) |
| level3.png | ⭐ તેજસ્વી તારલો (10–14) |
| level4.png | 🚀 ઉગતો સિતારો (5–9) |
| level5.png | 🌱 નવું અંકુર (1–4) |
| level6.png | 🔥 સંઘર્ષ યોદ્ધા (0) |
| level7.png | 💪 હિંમતવાન (0 થી ઓછો) |

બદલવા માટે: એ જ નામની (level1.png ... level7.png) નવી Image GitHub માં `public/scratch/` માં Upload કરી જૂની replace કરો. Render ફરી Deploy થશે.
Image કાઢી નાખો તો તે Level માં Image વગર Scratch Card બને છે (કોઈ error નહિ).
સલાહ: ચોરસ કે ગોળ PNG, આશરે 400×400, 300 KB થી નાની.

## Scratch Card ની લાઇનો (Message) બદલવી
બધી લાઇનો `public/scratch/messages.json` માં છે. એ file GitHub માં ખોલી (✏️ Edit) લખાણ બદલો અને Commit કરો. Render ફરી Deploy થશે.
- `levels` માં 7 Level છે (ઉપરથી નીચે). `min` = તે Level માટે ઓછામાં ઓછો Net Score (છેલ્લો Level બાકીના બધા માટે).
- `tier` = નાનું નામ, `head` = મોટી હેડલાઇન, `texts` = પ્રેરણા લાઇનો (એક Player ને એક આવે), `spiritual` = આધ્યાત્મિક લાઇનો.
- `tips` = નીચેની 💡 સલાહો. `{n}` ની જગ્યાએ સંખ્યા આવશે.
- લાઇન ઉમેરવા/કાઢવા માટે `[ ]` ની અંદર `"લખાણ",` રાખો. છેલ્લી લાઇન પછી અલ્પવિરામ ન રાખો અને `" "` (અવતરણ) ન ભૂલો.
- ભૂલ થાય તો (file ખરાબ હોય) game પોતાની built-in લાઇનો વાપરશે, game તૂટશે નહિ.

## Questions ma Photo (public/qimg/)
Photo `public/qimg/` folder ma Upload karo (nanu naam, space vagar, jem ke `q1.jpg`).
Question ni line ma `[img:q1.jpg]` umero. Details: `public/qimg/README.txt`. Namuna: `questions-with-images-sample.txt`.
