/**
 * ================================================================
 * BRASA BURGER — script.js  v3.0.0
 * Vanilla JS — sem dependências externas
 *
 * MÓDULOS (IIFE):
 *  1.  Utilitários
 *  2.  Navbar
 *  3.  Mobile Menu
 *  4.  Countdown Timer
 *  5.  Scroll Reveal
 *  6.  Filtro do Cardápio
 *  7.  Cart Store
 *  8.  Cart Drawer
 *  9.  Menu Buttons
 * 10.  Easter Egg
 * 11.  Active Nav
 * 12.  Inicialização
 * ================================================================
 */

'use strict';


/* ================================================================
   1. UTILITÁRIOS
================================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

const formatCurrency = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const padZero = (n) => String(n).padStart(2, '0');

const debounce = (fn, delay = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};


/* ================================================================
   2. NAVBAR — Encolhe ao fazer scroll
================================================================ */
const NavbarModule = (() => {
  const navbar = $('#navbar');
  if (!navbar) return { init: () => {} };

  const update = () => navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);

  return {
    init() {
      window.addEventListener('scroll', debounce(update, 50), { passive: true });
      update();
    },
  };
})();


/* ================================================================
   3. MENU MOBILE
================================================================ */
const MobileMenuModule = (() => {
  const toggleBtn  = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const closeLinks = $$('[data-close-menu]');

  if (!toggleBtn || !mobileMenu) return { init: () => {} };

  let isOpen = false;

  const open = () => {
    isOpen = true;
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.add('navbar__toggle--open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.remove('navbar__toggle--open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
    document.body.style.overflow = '';
  };

  return {
    init() {
      toggleBtn.addEventListener('click', () => (isOpen ? close() : open()));
      closeLinks.forEach((link) => link.addEventListener('click', close));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) close();
      });
    },
    open,
    close,
  };
})();


/* ================================================================
   4. COUNTDOWN TIMER
================================================================ */
const CountdownModule = (() => {
  const hoursEl   = $('#countdownHours');
  const minutesEl = $('#countdownMinutes');
  const secondsEl = $('#countdownSeconds');

  if (!hoursEl || !minutesEl || !secondsEl) return { init: () => {} };

  const endTime = new Date(Date.now() + 2.5 * 60 * 60 * 1000);
  let intervalId;

  const update = () => {
    const diff = Math.max(0, endTime - Date.now());
    hoursEl.textContent   = padZero(Math.floor(diff / 3_600_000));
    minutesEl.textContent = padZero(Math.floor((diff % 3_600_000) / 60_000));
    secondsEl.textContent = padZero(Math.floor((diff % 60_000) / 1_000));
    if (diff <= 0) clearInterval(intervalId);
  };

  return {
    init() {
      update();
      intervalId = setInterval(update, 1000);
    },
  };
})();


/* ================================================================
   5. SCROLL REVEAL
   Usa IntersectionObserver — sem eventos de scroll, performance nativa.
================================================================ */
const ScrollRevealModule = (() => {
  const elements = $$('.reveal');
  if (!elements.length) return { init: () => {} };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  return {
    init() {
      // Delay escalonado definido via CSS (nth-child) — sem setTimeout aqui
      elements.forEach((el) => observer.observe(el));
    },
  };
})();


/* ================================================================
   6. FILTRO DO CARDÁPIO
================================================================ */
const MenuFilterModule = (() => {
  const filterBtns = $$('.filter-btn');
  const menuCards  = $$('.menu-card');

  if (!filterBtns.length || !menuCards.length) return { init: () => {} };

  /**
   * Usa um Set para rastrear estado de visibilidade — evita
   * o check frágil "card.style.opacity === '0'" do original.
   * @type {Set<Element>}
   */
  const hiddenCards = new Set();

  const filterByCategory = (category) => {
    menuCards.forEach((card) => {
      const shouldShow = category === 'todos' || card.dataset.category === category;

      if (shouldShow && hiddenCards.has(card)) {
        hiddenCards.delete(card);
        card.style.display   = '';
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';

        // Dois rAF garantem que a transição ocorra após display ser aplicado
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          })
        );
      } else if (!shouldShow && !hiddenCards.has(card)) {
        hiddenCards.add(card);
        card.style.opacity   = '0';
        card.style.transform = 'translateY(10px)';

        setTimeout(() => {
          // Só oculta se ainda estiver no Set (não foi re-exibido antes do timeout)
          if (hiddenCards.has(card)) card.style.display = 'none';
        }, 400);
      }
    });
  };

  const setActiveBtn = (active) => {
    filterBtns.forEach((btn) => {
      const isActive = btn === active;
      btn.classList.toggle('filter-btn--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  };

  return {
    init() {
      filterBtns.forEach((btn) =>
        btn.addEventListener('click', () => {
          setActiveBtn(btn);
          filterByCategory(btn.dataset.filter);
        })
      );
    },
  };
})();


/* ================================================================
   7. CART STORE — Estado isolado + CustomEvents para comunicação
================================================================ */
const CartStore = (() => {
  /** @type {Array<{name: string, price: number, emoji: string, qty: number}>} */
  let items = [];

  const findItem = (name) => items.find((i) => i.name === name);

  const add = (name, price, emoji) => {
    const existing = findItem(name);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ name, price, emoji, qty: 1 });
    }
    dispatchUpdate();
  };

  const changeQty = (index, delta) => {
    if (!items[index]) return;
    items[index].qty += delta;
    if (items[index].qty <= 0) items.splice(index, 1);
    dispatchUpdate();
  };

  const getTotalCount = () => items.reduce((sum, i) => sum + i.qty, 0);
  const getTotalPrice = () => items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const getItems      = () => [...items];

  const buildWhatsAppUrl = () => {
    const phone = '5531999999999';
    let msg = 'Olá! Gostaria de fazer um pedido: 🍔\n\n';
    items.forEach((i) => {
      msg += `${i.emoji} *${i.name}* x${i.qty} — ${formatCurrency(i.price * i.qty)}\n`;
    });
    msg += `\n💰 *Total: ${formatCurrency(getTotalPrice())}*`;
    msg += '\n\nPoderia confirmar a disponibilidade? Obrigado!';
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const dispatchUpdate = () => {
    document.dispatchEvent(
      new CustomEvent('cart:updated', {
        detail: {
          items:      getItems(),
          totalCount: getTotalCount(),
          totalPrice: getTotalPrice(),
        },
      })
    );
  };

  return { add, changeQty, getItems, getTotalCount, getTotalPrice, buildWhatsAppUrl };
})();


/* ================================================================
   8. CART DRAWER
================================================================ */
const CartDrawerModule = (() => {
  const drawer      = $('#cartDrawer');
  const overlay     = $('#cartOverlay');
  const toggleBtn   = $('#cartToggle');
  const closeBtn    = $('#cartClose');
  const itemsEl     = $('#cartItems');
  const emptyEl     = $('#cartEmpty');
  const totalEl     = $('#cartTotal');
  const badgeEl     = $('#cartBadge');
  const checkoutBtn = $('#cartCheckout');

  if (!drawer) return { init: () => {} };

  let isOpen = false;

  const open = () => {
    isOpen = true;
    drawer.classList.add('cart-drawer--open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('cart-overlay--show');
    overlay.setAttribute('aria-hidden', 'false');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    drawer.classList.remove('cart-drawer--open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('cart-overlay--show');
    overlay.setAttribute('aria-hidden', 'true');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const renderItem = (item, index) => `
    <div class="cart-item" role="listitem">
      <span class="cart-item__emoji" aria-hidden="true">${item.emoji}</span>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__price">${formatCurrency(item.price * item.qty)}</p>
      </div>
      <div class="cart-item__qty" role="group" aria-label="Quantidade de ${item.name}">
        <button class="qty-btn" data-index="${index}" data-delta="-1"
          aria-label="Diminuir quantidade de ${item.name}">−</button>
        <span class="cart-item__qty-num" aria-live="polite">${item.qty}</span>
        <button class="qty-btn" data-index="${index}" data-delta="1"
          aria-label="Aumentar quantidade de ${item.name}">+</button>
      </div>
    </div>`;

  /**
   * Renderiza a UI do carrinho.
   * Event delegation no container evita memory leaks por re-adição de listeners.
   */
  const updateUI = ({ items, totalCount, totalPrice }) => {
    badgeEl.textContent   = totalCount;
    badgeEl.style.display = totalCount > 0 ? 'flex' : 'none';
    totalEl.textContent   = formatCurrency(totalPrice);

    if (items.length === 0) {
      itemsEl.innerHTML = '';
      itemsEl.appendChild(emptyEl);
      emptyEl.style.display = 'block';
    } else {
      emptyEl.style.display = 'none';
      itemsEl.innerHTML = `
        <div role="list" aria-label="Itens no carrinho">
          ${items.map(renderItem).join('')}
        </div>`;
    }
  };

  return {
    init() {
      toggleBtn?.addEventListener('click', () => (isOpen ? close() : open()));
      closeBtn?.addEventListener('click', close);
      overlay?.addEventListener('click', close);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) close();
      });

      // Event delegation — um único listener em vez de N (sem memory leak na re-renderização)
      itemsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.qty-btn');
        if (!btn) return;
        CartStore.changeQty(
          parseInt(btn.dataset.index, 10),
          parseInt(btn.dataset.delta, 10)
        );
      });

      document.addEventListener('cart:updated', (e) => updateUI(e.detail));

      checkoutBtn?.addEventListener('click', () => {
        if (CartStore.getItems().length === 0) {
          alert('Adicione pelo menos um item ao carrinho antes de pedir! 🍔');
          return;
        }
        window.open(CartStore.buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
      });

      badgeEl.style.display = 'none';
    },
    open,
    close,
  };
})();


/* ================================================================
   9. MENU BUTTONS — Event delegation no grid do cardápio
================================================================ */
const MenuButtonsModule = (() => {
  const menuGrid = $('#menuGrid');
  if (!menuGrid) return { init: () => {} };

  return {
    init() {
      menuGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-pedir');
        if (!btn) return;

        const { name, price, emoji } = btn.dataset;
        if (!name || !price) return;

        CartStore.add(name, parseFloat(price), emoji || '🍔');
        CartDrawerModule.open();

        // Feedback visual temporário
        const originalHTML   = btn.innerHTML;
        btn.innerHTML        = '<i class="fa-solid fa-check" aria-hidden="true"></i> Adicionado!';
        btn.style.background = '#4ade80';
        btn.disabled         = true;

        setTimeout(() => {
          btn.innerHTML        = originalHTML;
          btn.style.background = '';
          btn.disabled         = false;
        }, 1500);
      });
    },
  };
})();


/* ================================================================
   10. EASTER EGG — Clicar 5× no hambúrguer do hero
================================================================ */
const EasterEggModule = (() => {
  const burger = $('#heroBurger');
  if (!burger) return { init: () => {} };

  let clickCount = 0;
  let resetTimer;

  return {
    init() {
      burger.addEventListener('click', () => {
        clickCount++;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { clickCount = 0; }, 3000);

        if (clickCount >= 5) {
          clickCount = 0;
          burger.classList.add('hero__burger--crazy');
          console.log(
            '%c🍔 Easter Egg encontrado! Hambúrguer no limite! 🔥',
            'font-size: 18px; font-weight: bold; color: #E63946;'
          );
          setTimeout(() => burger.classList.remove('hero__burger--crazy'), 2000);
        }
      });
    },
  };
})();


/* ================================================================
   11. ACTIVE NAV — Destaca link da seção visível
   Usa classe CSS em vez de style inline — mais correto e performático.
================================================================ */
const ActiveNavModule = (() => {
  const navLinks = $$('.navbar__link');
  const sections = $$('section[id]');

  if (!navLinks.length || !sections.length) return { init: () => {} };

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('navbar__link--active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  return {
    init() {
      sections.forEach((s) => observer.observe(s));
    },
  };
})();


/* ================================================================
   12. INICIALIZAÇÃO — Ponto de entrada único
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const modules = [
    ['NavbarModule',       NavbarModule],
    ['MobileMenuModule',   MobileMenuModule],
    ['CountdownModule',    CountdownModule],
    ['ScrollRevealModule', ScrollRevealModule],
    ['MenuFilterModule',   MenuFilterModule],
    ['CartDrawerModule',   CartDrawerModule],
    ['MenuButtonsModule',  MenuButtonsModule],
    ['EasterEggModule',    EasterEggModule],
    ['ActiveNavModule',    ActiveNavModule],
  ];

  modules.forEach(([name, mod]) => {
    try {
      mod.init();
    } catch (err) {
      console.warn(`[${name}] Erro na inicialização:`, err);
    }
  });
});
