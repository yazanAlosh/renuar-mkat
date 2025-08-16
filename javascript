let items = JSON.parse(localStorage.getItem("items")) || [];
const hostPassword = "1234";

function setMsg(text, type="info") {
  const msg = document.getElementById("msg");
  msg.textContent = text;
  msg.style.color = type === "err" ? "red" : "#555";
}

// بحث محلي
function searchLocal() {
  const q = document.getElementById("code").value.trim();
  if (!q) return setMsg("נא להזין מק״ט או שם", "err");
  const item = items.find(i => i.sku === q || i.name.includes(q));
  if (item) {
    setMsg(🛍 ${item.name} – ₪${item.price});
    if (item.link) {
      document.getElementById("frame").src = item.link;
    }
  } else {
    setMsg("לא נמצאה תוצאה");
  }
}

// رابط רשמי של רנואר
function renUrl(c) {
  return "https://www.renuar.co.il/catalogsearch/result/?q=" + encodeURIComponent(c);
}

function searchRenuar() {
  const q = document.getElementById("code").value.trim();
  if (!q) return setMsg("נא להזין מק״ט", "err");
  document.getElementById("frame").src = renUrl(q);
  setMsg("טוען תוצאות...");
}

function openNew() {
  const q = document.getElementById("code").value.trim();
  if (!q) return setMsg("נא להזין מק״ט", "err");
  window.open(renUrl(q), "_blank");
}

// ماسح بالكاميرا
async function scanCode() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const barcodeDetector = new BarcodeDetector({ formats: ["ean_13","code_128"] });
    const img = await imageCapture.grabFrame();
    const codes = await barcodeDetector.detect(img);
    if (codes.length) {
      document.getElementById("code").value = codes[0].rawValue;
      setMsg("📸 קוד נסרק: " + codes[0].rawValue);
    } else {
      setMsg("לא זוהה ברקוד");
    }
    track.stop();
  } catch (e) {
    console.error(e);
    setMsg("מצלמה לא נתמכת", "err");
  }
}

// Host
function loginHost() {
  const pass = document.getElementById("host-pass").value;
  if (pass === hostPassword) {
    document.getElementById("host-area").style.display = "block";
  } else {
    alert("סיסמה שגויה");
  }
}

function addItem() {
  const sku = document.getElementById("sku").value.trim();
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const link = document.getElementById("link").value.trim();
  if (!sku || !name || !price) return alert("מלא את כל השדות");
  items.push({ sku, name, price, link });
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
}

function renderItems() {
  const list = document.getElementById("items");
  list.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.textContent = ${i.sku} – ${i.name} – ₪${i.price};
    list.appendChild(li);
  });
}
renderItems();
