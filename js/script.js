document.addEventListener("DOMContentLoaded", function () {


  const scrollBtn = document.querySelector(".btn-main");

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      const section = document.querySelector(".categories");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ==============================
  // 🔹 CART SYSTEM
  // ==============================
  let cart = [];

  function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");

    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      cartItems.innerHTML += `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>${item.name} - ${item.price} AF</span>
          <button class="remove-btn btn btn-sm btn-danger" data-index="${index}">❌</button>
        </div>
      `;
    });

    totalPrice.innerText = "مجموع: " + total + " AF";
  }

  document.addEventListener("click", function (e) {

    // 🔥 Add to cart
    if (e.target.closest(".add-btn")) {
      const btn = e.target.closest(".add-btn");

      const card = btn.closest(".product-card");
      const name = card.querySelector("h6").innerText;
      const price = parseInt(card.querySelector("p").innerText);

      cart.push({ name, price });
      renderCart();
    }

    // 🔥 Remove from cart
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.getAttribute("data-index");
      cart.splice(index, 1);
      renderCart();
    }
  });

  // ==============================
  // 🔹 CART TOGGLE
  // ==============================
  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cartPanel");

  if (cartBtn && cartPanel) {
    cartBtn.addEventListener("click", () => {
      cartPanel.classList.toggle("active");
    });
  }


  // ==============================
  // 🔹 FORM VALIDATION (اگر وجود داشت)
  // ==============================
  const form = document.getElementById("checkoutForm");

  if (form) {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const passwordInput = document.getElementById("password");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const addressError = document.getElementById("addressError");
    const passwordError = document.getElementById("passwordError");

    if (nameInput) {
      nameInput.addEventListener("input", () => {
        nameError.textContent =
          nameInput.value.length < 3 ? "نام حداقل ۳ حرف باشد" : "";
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", () => {
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        emailError.textContent =
          !pattern.test(emailInput.value) ? "ایمیل معتبر نیست" : "";
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        phoneError.textContent =
          phoneInput.value.length < 10 ? "شماره معتبر نیست" : "";
      });
    }

    if (addressInput) {
      addressInput.addEventListener("input", () => {
        addressError.textContent =
          addressInput.value.length < 10 ? "آدرس کامل نیست" : "";
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("input", () => {
        const pass = passwordInput.value;

        if (pass.length < 6) {
          passwordError.textContent = "حداقل ۶ کاراکتر";
        } else if (!/[A-Z]/.test(pass)) {
          passwordError.textContent = "یک حرف بزرگ لازم است";
        } else if (!/[0-9]/.test(pass)) {
          passwordError.textContent = "یک عدد لازم است";
        } else {
          passwordError.textContent = "";
        }
      });
    }

    form.addEventListener("submit", function (e) {

      if (
        (nameError && nameError.textContent) ||
        (emailError && emailError.textContent) ||
        (phoneError && phoneError.textContent) ||
        (addressError && addressError.textContent) ||
        (passwordError && passwordError.textContent)
      ) {
        e.preventDefault();
        alert("لطفاً فرم را درست تکمیل کنید ❌");
      } else {
        alert("سفارش با موفقیت ثبت شد ✅");
      }
    });
  }

});

const darkToggle = document.getElementById("darkToggle");

if (darkToggle) {

  // 🔥 اگر قبلاً dark بوده، نگه دار
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkToggle.innerText = "☀️";
  }

  darkToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    // وضعیت
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      darkToggle.innerText = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      darkToggle.innerText = "🌙";
    }

  });

}

//کارت

let cart = [];

document.addEventListener("click", function (e) {

  // =========================
  // 🛒 ADD PRODUCT
  // =========================
  if (e.target.closest(".add-btn")) {

    const card = e.target.closest(".product-card");

    const name = card.querySelector("h6").innerText;

    const priceText = card.querySelector("p").innerText;

    const price = parseInt(priceText);

    // اگر قبلاً وجود داشت
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        name,
        price,
        qty: 1
      });
    }

    renderCart();
    showToast();
  }

  // =========================
  // ➕ INCREASE
  // =========================
  if (e.target.classList.contains("qty-plus")) {

    const index = e.target.dataset.index;

    cart[index].qty++;

    renderCart();
    
  }

  // =========================
  // ➖ DECREASE
  // =========================
  if (e.target.classList.contains("qty-minus")) {

    const index = e.target.dataset.index;

    cart[index].qty--;

    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }

    renderCart();
  }

  // =========================
  // ❌ REMOVE
  // =========================
  if (e.target.classList.contains("remove-btn")) {

    const index = e.target.dataset.index;

    cart.splice(index, 1);

    renderCart();
  }

});


// =========================
// 🧾 RENDER CART
// =========================
function renderCart() {

  const cartItems = document.getElementById("cartItems");

  const totalPrice = document.getElementById("totalPrice");

  if (!cartItems || !totalPrice) return;

  cartItems.innerHTML = "";

  let total = 0;

  // اگر خالی بود
  if (cart.length === 0) {

    cartItems.innerHTML =
      "<p>🛒 سبد خرید خالی است</p>";

    totalPrice.innerText =
      "جمع کل: 0 AF";

    return;
  }

  // نمایش محصولات
  cart.forEach((item, index) => {

    total += item.price * item.qty;

    cartItems.innerHTML += `

      <div class="mb-3 border-bottom pb-2">

        <strong>${item.name}</strong>

        <p>
          ${item.price} AF × ${item.qty}
        </p>

        <div class="d-flex gap-1">

          <button class="btn btn-sm btn-light qty-minus"
            data-index="${index}">
            −
          </button>

          <button class="btn btn-sm btn-light qty-plus"
            data-index="${index}">
            +
          </button>

          <button class="btn btn-sm btn-danger remove-btn"
            data-index="${index}">
            ❌
          </button>

        </div>

      </div>

    `;
  });

  totalPrice.innerText =
    "جمع کل: " + total + " AF";
}

function showToast() {

  const toast = document.getElementById("toastMessage");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);

}

//بخش قدیمی

document.addEventListener("DOMContentLoaded", function () {

  let cart = [];

  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");

  // ==============================
  // 🛒 RENDER CART
  // ==============================
  function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");

    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";

    let total = 0;

    // 🟡 empty state
    if (cart.length === 0) {
      cartItems.innerHTML = "<p>🛒 سبد خرید خالی است</p>";
      totalPrice.innerText = "جمع کل: 0 AF";
      return;
    }

    cart.forEach((item, index) => {

      total += item.price * item.qty;

      cartItems.innerHTML += `
        <div class="d-flex justify-content-between align-items-center mb-2">

          <div>
            <strong>${item.name}</strong><br>
            ${item.price} AF × ${item.qty}
          </div>

          <div class="d-flex gap-1">

            <button class="btn btn-sm btn-light qty-minus" data-index="${index}">−</button>

            <button class="btn btn-sm btn-light qty-plus" data-index="${index}">+</button>

            <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">❌</button>

          </div>

        </div>
      `;
    });

    totalPrice.innerText = "جمع کل: " + total + " AF";
  }

  // ==============================
  // 🛒 EVENTS
  // ==============================
  document.addEventListener("click", function (e) {

    // ➕ add product
    if (e.target.closest(".btn-main")) {

      const card = e.target.closest(".product-card");
      if (!card) return;

      const name = card.querySelector("h6").innerText;
      const price = parseInt(card.querySelector("p").innerText);

      const existing = cart.find(i => i.name === name);

      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      renderCart();
    }

    // ➖ minus
    if (e.target.classList.contains("qty-minus")) {
      const i = e.target.dataset.index;
      cart[i].qty--;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      renderCart();
    }

    // ➕ plus
    if (e.target.classList.contains("qty-plus")) {
      const i = e.target.dataset.index;
      cart[i].qty++;
      renderCart();
    }

    // ❌ remove
    if (e.target.classList.contains("remove-btn")) {
      const i = e.target.dataset.index;
      cart.splice(i, 1);
      renderCart();
    }

  });

  // ==============================
  // 🛒 OPEN / CLOSE SIDEBAR
  // ==============================
  if (cartBtn && cartPanel && cartOverlay) {

    cartBtn.addEventListener("click", () => {
      cartPanel.classList.add("active");
      cartOverlay.classList.add("active");
    });

    cartOverlay.addEventListener("click", () => {
      cartPanel.classList.remove("active");
      cartOverlay.classList.remove("active");
    });

  }

  // first render
  renderCart();

  document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const cards = document.querySelectorAll(".product-card");

  searchInput.addEventListener("input", function () {

    const value = this.value.trim().toLowerCase();

    cards.forEach(card => {

      const title = card.querySelector("h6")?.innerText.toLowerCase();
      const col = card.closest(".col-lg-3, .col-md-4, .col-6");

      if (!title || !col) return;

      if (value === "") {
        col.style.display = "block";
        return;
      }

      if (title.includes(value)) {
        col.style.display = "block";
      } else {
        col.style.display = "none";
      }

    });

  });

});

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// اضافه کردن به علاقه‌مندی
document.addEventListener("click", function (e) {

  if (e.target.closest(".wishlist-add")) {

    const card = e.target.closest(".product-card");

    const name = card.querySelector("h6").innerText;
    const price = card.querySelector("p").innerText;
    const img = card.querySelector("img").src;

    const item = { name, price, img };

    // جلوگیری از تکراری شدن
    const exists = wishlist.find(p => p.name === name);

    if (!exists) {
      wishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("به علاقه‌مندی اضافه شد ❤️");
    } else {
      alert("قبلاً اضافه شده 🙂");
    }
  }

    if (e.target.classList.contains("remove-wishlist")) {

    const index = e.target.dataset.index;

    wishlist.splice(index, 1);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

    renderWishlist();
  }

});

});

