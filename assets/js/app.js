const MareVirtusProducts = {
  "monet-etretat": {
    title: "Клод Моне — «Лодки на пляже в Этрета»",
    price: 4900,
    img: "assets/img/gallery/1.jpg",
    desc: "Репродукция на холсте. Спокойный морской берег Нормандии: лодки на песке, холодное небо и мягкая светлая палитра без лишней перегруженности.",
  },

  "manet-calm-sea": {
    title: "Эдуар Мане — «Морской вид, спокойная погода»",
    price: 5200,
    img: "assets/img/gallery/2.jpg",
    desc: "Репродукция на холсте. Лаконичный морской сюжет с пароходом и парусными судами в Ла-Манше; работа хорошо подходит для светлого интерьера.",
  },

  "cotman-storm": {
    title: "Джон Селл Котман — «Лодки у берега, надвигается шторм»",
    price: 3900,
    img: "assets/img/gallery/3.jpg",
    desc: "Репродукция акварели. Рыбацкая лодка на волнах, низкие облака и ощущение приближающейся непогоды создают выразительное морское настроение.",
  },

  "demuth-bermuda": {
    title: "Чарльз Димут — «Бермудское небо и море с лодками»",
    price: 4200,
    img: "assets/img/gallery/4.jpg",
    desc: "Репродукция акварели на бумаге. Небольшая лёгкая композиция с лодками, прозрачным небом и мягкой курортной атмосферой.",
  },

  "sargent-stowing-sail": {
    title: "Джон Сингер Сарджент — «Уборка паруса»",
    price: 3800,
    img: "assets/img/gallery/5.jpg",
    desc: "Репродукция акварели. Сцена с парусниками в тёплых водах передаёт движение ветра, прозрачность воды и лёгкость морского дня.",
  },

  "bradford-labrador": {
    title: "Уильям Брэдфорд — «Берег Лабрадора»",
    price: 5600,
    img: "assets/img/gallery/6.jpg",
    desc: "Репродукция на холсте. Холодный северный морской пейзаж с детальной проработкой света, дальнего берега и спокойной воды.",
  },
};
const rub = (n) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem("marevirtus_cart") || "{}");
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([id, qty]) => MareVirtusProducts[id] && Number(qty) > 0,
      ),
    );
  } catch (e) {
    return {};
  }
}
const setCart = (cart) => {
  localStorage.setItem("marevirtus_cart", JSON.stringify(cart));
  updateCartBadge();
};
function updateCartBadge() {
  const count = Object.values(getCart()).reduce((a, b) => a + b, 0);
  document
    .querySelectorAll("[data-cart-count]")
    .forEach((el) => (el.textContent = count));
}
function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  setCart(cart);
  toast(`«${MareVirtusProducts[id]?.title || "Работа"}» добавлена в корзину`);
}
function toast(text) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = text;
  Object.assign(t.style, {
    position: "fixed",
    left: "50%",
    bottom: "24px",
    transform: "translateX(-50%)",
    background: "#0a3150",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "999px",
    zIndex: 100,
    boxShadow: "0 15px 35px rgba(0,0,0,.2)",
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function initTheme() {
  const root = document.documentElement;
  let current = root.dataset.theme || "light";
  try {
    current = localStorage.getItem("marevirtus_theme") || current;
  } catch (e) {}
  const apply = (theme) => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  };
  apply(current);
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("marevirtus_theme", next);
      } catch (e) {}
      apply(next);
    });
  });
}

function initNav() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }
}
function initSlider() {
  const slides = [...document.querySelectorAll(".slide")];
  if (!slides.length) return;
  let i = 0;
  const show = (idx) => {
    slides.forEach((s) => s.classList.remove("active"));
    slides[idx].classList.add("active");
  };
  document.querySelector("[data-slide-next]")?.addEventListener("click", () => {
    i = (i + 1) % slides.length;
    show(i);
  });
  document.querySelector("[data-slide-prev]")?.addEventListener("click", () => {
    i = (i - 1 + slides.length) % slides.length;
    show(i);
  });
  setInterval(() => {
    i = (i + 1) % slides.length;
    show(i);
  }, 5200);
}
function initGallery() {
  document
    .querySelectorAll("[data-add-to-cart]")
    .forEach((btn) =>
      btn.addEventListener("click", () => addToCart(btn.dataset.addToCart)),
    );
  const search = document.querySelector("#gallerySearch");
  const category = document.querySelector("#galleryCategory");
  const sort = document.querySelector("#gallerySort");
  const grid = document.querySelector("#catalogGrid");
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".product-card")];
  function filter() {
    const q = (search?.value || "").toLowerCase();
    const cat = category?.value || "all";
    cards.forEach((card) => {
      const okText = card.textContent.toLowerCase().includes(q);
      const okCat = cat === "all" || card.dataset.category === cat;
      card.style.display = okText && okCat ? "" : "none";
    });
    const visible = cards.filter((c) => c.style.display !== "none");
    if (sort?.value === "price-asc")
      visible.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    if (sort?.value === "price-desc")
      visible.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    visible.forEach((c) => grid.appendChild(c));
  }
  [search, category, sort].forEach((el) =>
    el?.addEventListener("input", filter),
  );
  document
    .querySelectorAll("[data-open-modal]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        openProductModal(btn.dataset.openModal),
      ),
    );
  document
    .querySelector(".modal-close")
    ?.addEventListener("click", () =>
      document.querySelector(".modal")?.classList.remove("open"),
    );
  document.querySelector(".modal")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal"))
      e.currentTarget.classList.remove("open");
  });
}
function openProductModal(id) {
  const p = MareVirtusProducts[id];
  const modal = document.querySelector(".modal");
  if (!p || !modal) return;
  modal.querySelector(".modal-title").textContent = p.title;
  modal.querySelector(".modal-img").src = p.img;
  const desc = modal.querySelector(".modal-description");
  if (desc)
    desc.textContent =
      p.desc ||
      "Картина доступна для покупки через демонстрационную корзину. После заявки менеджер галереи уточнит способ доставки и оплаты.";
  modal.querySelector(".modal-price").textContent = rub(p.price);
  modal.querySelector(".modal-add").onclick = () => addToCart(id);
  modal.classList.add("open");
}
function initCart() {
  const container = document.querySelector("#cartContainer");
  if (!container) return;
  function render() {
    const cart = getCart();
    const ids = Object.keys(cart).filter((id) => MareVirtusProducts[id]);
    if (!ids.length) {
      container.innerHTML = `<div class="empty-cart"><h3>Корзина пуста</h3><p>Добавьте картины из галереи, чтобы оформить заказ.</p><a class="btn" href="gallery.html">Перейти в галерею</a></div>`;
      return;
    }
    let total = 0;
    const rows = ids
      .map((id) => {
        const p = MareVirtusProducts[id];
        const qty = cart[id];
        const sum = p.price * qty;
        total += sum;
        return `<tr><td><strong>${p.title}</strong></td><td>${rub(p.price)}</td><td><div class="qty-control"><button data-dec="${id}">−</button><span>${qty}</span><button data-inc="${id}">+</button></div></td><td><strong>${rub(sum)}</strong></td><td><button class="btn ghost small" data-remove="${id}">Удалить</button></td></tr>`;
      })
      .join("");
    container.innerHTML = `<table class="cart-table"><thead><tr><th>Картина</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th></tr></thead><tbody>${rows}</tbody></table><div class="cart-summary soft-card"><h3>Итого к оплате</h3><p class="price">${rub(total)}</p><p>Онлайн-оплата подключается после интеграции с CMS. Сейчас доступна демонстрационная заявка.</p><button class="btn" id="checkoutBtn">Оформить заказ</button></div>`;
    container.querySelectorAll("[data-inc]").forEach(
      (b) =>
        (b.onclick = () => {
          cart[b.dataset.inc]++;
          setCart(cart);
          render();
        }),
    );
    container.querySelectorAll("[data-dec]").forEach(
      (b) =>
        (b.onclick = () => {
          cart[b.dataset.dec]--;
          if (cart[b.dataset.dec] <= 0) delete cart[b.dataset.dec];
          setCart(cart);
          render();
        }),
    );
    container.querySelectorAll("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          delete cart[b.dataset.remove];
          setCart(cart);
          render();
        }),
    );
    container.querySelector("#checkoutBtn").onclick = () => {
      setCart({});
      render();
      toast("Заявка на покупку отправлена. Менеджер свяжется с вами.");
    };
  }
  render();
}
function initCalendar() {
  const grid = document.querySelector("#eventsCalendar");
  if (!grid) return;
  const names = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const days = [
    "",
    "",
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];
  const eventDays = [7, 14, 21, 28];
  grid.innerHTML =
    names.map((n) => `<span class="day-name">${n}</span>`).join("") +
    days
      .map(
        (d) =>
          `<span class="${!d ? "muted " : ""}${eventDays.includes(d) ? "event-day" : ""}">${d || "·"}</span>`,
      )
      .join("");
}
function initForms() {
  const captchaEl = document.querySelector("[data-captcha-question]");
  const captchaInput = document.querySelector("#captchaAnswer");
  const form = document.querySelector("#contactForm");
  let answer = 0;
  if (captchaEl) {
    const a = Math.ceil(Math.random() * 8) + 1,
      b = Math.ceil(Math.random() * 7) + 1;
    answer = a + b;
    captchaEl.textContent = `${a} + ${b} =`;
  }
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    if (captchaInput && Number(captchaInput.value) !== answer) {
      status.textContent = "Проверьте captcha: ответ неверный.";
      status.style.color = "#b12b2b";
      return;
    }
    status.textContent =
      "Спасибо! Сообщение отправлено в демонстрационном режиме.";
    status.style.color = "#0878bf";
    form.reset();
  });
  document.querySelector("#subscribeForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("Подписка оформлена");
  });
}
function initChat() {
  const toggle = document.querySelector(".chat-toggle");
  const panel = document.querySelector(".chat-panel");
  const input = document.querySelector("#chatInput");
  const send = document.querySelector("#chatSend");
  const messages = document.querySelector(".chat-messages");
  if (!toggle || !panel) return;
  toggle.onclick = () => panel.classList.toggle("open");
  function sendMessage() {
    if (!input.value.trim()) return;
    messages.insertAdjacentHTML(
      "beforeend",
      `<div class="message user">${input.value}</div>`,
    );
    input.value = "";
    setTimeout(() => {
      messages.insertAdjacentHTML(
        "beforeend",
        `<div class="message">Спасибо! Куратор галереи ответит в ближайшее время.</div>`,
      );
      messages.scrollTop = messages.scrollHeight;
    }, 500);
  }
  send.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initSlider();
  initGallery();
  initCart();
  initCalendar();
  initForms();
  initChat();
  updateCartBadge();
});
