/*
 Worksheet HQ starter settings.

 IMPORTANT SECURITY NOTE:
 This is a FRONT-END DEMO password gate, not real authentication.
 Anyone can inspect public JavaScript and discover the password.
 Do not use it to protect real files, customer data, or payments.
 For a real admin panel, use a server-side authentication service/backend.
*/
const SITE_CONFIG = {
  email: "ayaansh3318@gmail.com",
  // Change this for a local demo only. It is NOT secure when deployed publicly.
  adminPassword: "@y@@nsh_jh@$1!",
  products: {
    normal: { name: "Normal", price: 50, checkoutUrl: "" },
    enhanced: { name: "Enhanced", price: 200, checkoutUrl: "" },
    legendary: { name: "Legendary", price: 500, checkoutUrl: "" },
    epic: { name: "Epic", price: 1000, checkoutUrl: "" },
    mega: { name: "Mega", price: 4000, checkoutUrl: "" }
  }
};

const contactLink = document.getElementById("contact-link");
const year = document.getElementById("year");
const toast = document.getElementById("toast");
year.textContent = new Date().getFullYear();
contactLink.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Worksheet HQ enquiry")}`;

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

document.querySelectorAll(".order-button").forEach((button) => {
  button.addEventListener("click", () => {
    const product = SITE_CONFIG.products[button.dataset.product];
    if (!product) return;
    if (product.checkoutUrl && product.checkoutUrl.startsWith("https://")) {
      window.open(product.checkoutUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const subject = `Worksheet HQ order enquiry: ${product.name}`;
    const body = [
      "Hello Worksheet HQ,", "",
      `I am interested in the ${product.name} edition (listed price: ₹${product.price}).`,
      "Grade: ", "Subject: ", "",
      "Please share the available pack details and ordering link.", "", "Thank you."
    ].join("\n");
    if (SITE_CONFIG.email !== "YOUR_EMAIL@example.com") {
      window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      showToast("Setup needed: add your business email in script.js. For automatic sales, add a hosted checkout URL for each product.");
    }
  });
});

/* Admin panel demo: listing creation is stored only in this browser. */
const adminLogin = document.getElementById("admin-login");
const adminTools = document.getElementById("admin-tools");
const adminPassword = document.getElementById("admin-password");
const adminMessage = document.getElementById("admin-message");
const createMessage = document.getElementById("create-message");
const createForm = document.getElementById("create-product-form");
const createdListings = document.getElementById("admin-created-listings");
const listingStorageKey = "worksheetHQDemoListings";

function readCreatedListings() {
  try { return JSON.parse(localStorage.getItem(listingStorageKey) || "[]"); }
  catch { return []; }
}
function writeCreatedListings(items) {
  try {
    localStorage.setItem(listingStorageKey, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function renderCreatedListings() {
  const items = readCreatedListings();
  if (!items.length) {
    createdListings.innerHTML = '<p class="muted-small">No demo listings created in this browser yet.</p>';
    return;
  }
  createdListings.innerHTML = items.map((item, index) => `
    <article class="created-listing">
      <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.grade)} · ${escapeHtml(item.subject)} · ${escapeHtml(item.edition)} · ₹${Number(item.price).toLocaleString("en-IN")}</p></div>
      <button type="button" class="button button-secondary delete-listing" data-index="${index}">Remove</button>
    </article>`).join("");
  createdListings.querySelectorAll(".delete-listing").forEach((button) => {
    button.addEventListener("click", () => {
      const itemsNow = readCreatedListings();
      itemsNow.splice(Number(button.dataset.index), 1);
      writeCreatedListings(itemsNow);
      renderCreatedListings();
    });
  });
}
function unlockAdmin() {
  if (SITE_CONFIG.adminPassword === "CHANGE_THIS_PASSWORD") {
    adminMessage.textContent = "Setup needed: edit adminPassword in script.js before using this demo.";
    return;
  }
  if (adminPassword.value === SITE_CONFIG.adminPassword) {
    adminMessage.textContent = "";
    adminLogin.hidden = true;
    adminTools.hidden = false;
    adminPassword.value = "";
    renderCreatedListings();
  } else {
    adminMessage.textContent = "Password not recognized. Try again.";
    adminPassword.value = "";
    adminPassword.focus();
  }
}
document.getElementById("admin-login-button").addEventListener("click", unlockAdmin);
adminPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockAdmin();
});
document.getElementById("admin-lock-button").addEventListener("click", () => {
  adminTools.hidden = true;
  adminLogin.hidden = false;
  adminPassword.value = "";
  adminMessage.textContent = "Admin panel locked.";
});
createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("new-product-title").value.trim();
  const checkoutUrl = document.getElementById("new-product-checkout").value.trim();
  const price = Number(document.getElementById("new-product-price").value);
  if (!title || !Number.isFinite(price) || price < 0) {
    createMessage.textContent = "Enter a product title and valid price.";
    return;
  }
  if (checkoutUrl && !checkoutUrl.startsWith("https://")) {
    createMessage.textContent = "Checkout URL must start with https://";
    return;
  }
  const item = {
    title,
    grade: document.getElementById("new-product-grade").value,
    subject: document.getElementById("new-product-subject").value,
    edition: document.getElementById("new-product-edition").value,
    price,
    checkoutUrl
  };
  const items = readCreatedListings();
  items.unshift(item);
  if (!writeCreatedListings(items)) {
    createMessage.textContent = "Could not save in this browser. Check browser storage settings.";
    return;
  }
  createMessage.textContent = "Demo listing created in this browser. It is not published for other visitors.";
  createForm.reset();
  document.getElementById("new-product-price").value = "50";
  renderCreatedListings();
});
