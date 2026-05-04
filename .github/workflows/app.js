// ── CART ──────────────────────────────────────────────
function getCart() { return JSON.parse(localStorage.getItem('rg_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('rg_cart', JSON.stringify(cart)); updateCartBadge(); }

function addToCart(id) {
  const item = MENU_ITEMS.find(i => i.id === id);
  if (!item) return;
  const cart = getCart();
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ ...item, qty: 1 }); }
  saveCart(cart);
  showToast(`✅ ${item.name} added to cart!`);
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── NAVBAR ────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
});
function toggleMenu() { document.getElementById('mobileMenu')?.classList.toggle('open'); }

// ── ITEM CARD ─────────────────────────────────────────
function itemCard(item) {
  const stock = JSON.parse(localStorage.getItem('rg_stock') || '{}');
  const isOut = stock[item.id] === 'out';
  const tagHtml = item.tag ? `<span class="item-tag ${item.tag === 'Best Seller' ? 'tag-hot' : item.tag === 'Premium' ? 'tag-premium' : 'tag-pop'}">${item.tag === 'Best Seller' ? '🔥 ' : '⭐ '}${item.tag}</span>` : '';
  const vegIcon = item.cat === 'veg' ? '<span class="veg-dot veg"></span>' : item.cat === 'nonveg' ? '<span class="veg-dot nonveg"></span>' : '';
  const fallback = item.imgFallback || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=60';
  const outBadge = isOut ? '<span class="out-of-stock-badge">❌ Out of Stock</span>' : '';
  return `
  <div class="item-card ${isOut ? 'item-out' : ''}" data-id="${item.id}">
    <div class="item-img-wrap">
      <img src="${item.img}" alt="${item.name}" loading="lazy"
        onerror="this.onerror=null;this.src='${fallback}'"/>
      ${tagHtml}${vegIcon}${outBadge}
    </div>
    <div class="item-body">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="item-footer">
        <div class="item-meta">
          <span class="item-price">₹${item.price}</span>
          <span class="item-rating">⭐ ${item.rating}</span>
        </div>
        ${isOut
          ? '<button class="btn-add-cart btn-unavail" disabled>Out of Stock</button>'
          : `<button class="btn-add-cart" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i> Add</button>`
        }
      </div>
    </div>
  </div>`;
}

// Include owner-added custom items
function getAllMenuItems() {
  const custom = JSON.parse(localStorage.getItem('rg_custom_items') || '[]');
  const overrides = JSON.parse(localStorage.getItem('rg_overrides') || '{}');
  const base = MENU_ITEMS.map(item => overrides[item.id] ? { ...item, ...overrides[item.id] } : item);
  return [...base, ...custom];
}
function renderPopular() {
  const grid = document.getElementById('popularGrid');
  if (!grid) return;
  const popular = getAllMenuItems().filter(i => i.tag === 'Best Seller' || i.tag === 'Popular').slice(0, 8);
  grid.innerHTML = popular.map(itemCard).join('');
}

// ── MENU PAGE ─────────────────────────────────────────
let currentCategory = 'all';

function setCategory(btn, cat) {
  document.querySelectorAll('.fcat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = cat;
  filterMenu();
}

function filterMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const search = (document.getElementById('globalSearch')?.value || '').toLowerCase();
  const price  = document.getElementById('priceFilter')?.value || 'all';
  const sort   = document.getElementById('sortFilter')?.value || 'default';

  let items = getAllMenuItems().filter(i => {
    const matchCat  = currentCategory === 'all' || i.cat === currentCategory;
    const matchSearch = !search || i.name.toLowerCase().includes(search) || i.desc.toLowerCase().includes(search);
    let matchPrice = true;
    if (price === '0-100')   matchPrice = i.price < 100;
    if (price === '100-200') matchPrice = i.price >= 100 && i.price <= 200;
    if (price === '200-400') matchPrice = i.price > 200 && i.price <= 400;
    if (price === '400+')    matchPrice = i.price > 400;
    return matchCat && matchSearch && matchPrice;
  });

  if (sort === 'price-asc')  items.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a,b) => b.price - a.price);
  if (sort === 'rating')     items.sort((a,b) => b.rating - a.rating);

  const info = document.getElementById('resultsInfo');
  if (info) info.textContent = `Showing ${items.length} item${items.length !== 1 ? 's' : ''}`;

  grid.innerHTML = items.length
    ? items.map(itemCard).join('')
    : `<div class="empty-state"><div>🍽️</div><h3>No items found</h3><p>Try a different search or category</p></div>`;
}

// ── HOME SEARCH ───────────────────────────────────────
function globalSearchFn() {
  const q = document.getElementById('globalSearch')?.value.trim();
  if (q) window.location.href = `menu.html?search=${encodeURIComponent(q)}`;
}

// ── CART PAGE ─────────────────────────────────────────
function renderCart() {
  const wrap = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if (!wrap) return;

  const cart = getCart();
  if (cart.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><div>🛒</div><h3>Your cart is empty</h3><p>Add some delicious food!</p><a href="menu.html" class="btn-primary" style="margin-top:16px">Browse Menu</a></div>`;
    if (summary) summary.innerHTML = '';
    return;
  }

  wrap.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60'"/>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-price">₹${item.price} each</span>
      </div>
      <div class="qty-ctrl">
        <button onclick="changeQty(${item.id},-1)"><i class="fas fa-minus"></i></button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id},1)"><i class="fas fa-plus"></i></button>
      </div>
      <div class="cart-item-total">₹${item.price * item.qty}</div>
      <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
    </div>`).join('');

  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 300 ? 0 : 40;
  const total = subtotal + delivery;

  if (summary) summary.innerHTML = `
    <div class="summary-box">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? '<span class="free">FREE</span>' : '₹' + delivery}</span></div>
      ${delivery > 0 ? `<p class="free-note">Add ₹${300 - subtotal} more for free delivery</p>` : '<p class="free-note green">🎉 You got free delivery!</p>'}
      <div class="summary-row total-row"><span>Total</span><span>₹${total}</span></div>
      <button class="btn-primary" style="width:100%;margin-top:16px" onclick="openCheckout()">
        <i class="fas fa-lock"></i> Proceed to Checkout
      </button>
      <a href="menu.html" class="btn-outline" style="width:100%;margin-top:10px;display:block;text-align:center">+ Add More Items</a>
    </div>`;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  showToast('Item removed from cart');
}

// ── CHECKOUT ──────────────────────────────────────────
const OWNER_WA = '916301685293';

function openCheckout() {
  const cart = getCart();
  if (!cart.length) return;
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 300 ? 0 : 40;
  const el = document.getElementById('coTotal');
  if (el) el.innerHTML = `<span>Total Payable</span><strong>₹${subtotal + delivery}</strong>`;
  document.getElementById('checkoutModal')?.classList.add('show');
}

function closeCheckout() { document.getElementById('checkoutModal')?.classList.remove('show'); }

function placeOrder(e) {
  e.preventDefault();
  const name    = document.getElementById('coName').value.trim();
  const phone   = document.getElementById('coPhone').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'Cash on Delivery';
  const note    = document.getElementById('coNote').value.trim();
  const cart    = getCart();

  const lines = cart.map(i => `  • ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 300 ? 0 : 40;
  const now = new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' });

  const msg =
    `🌟 *R & G FOOD EXPRESS*\n` +
    `🛎️ *NEW ORDER RECEIVED!*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Customer:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `📍 *Address:* ${address}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🍽️ *Items:*\n${lines}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🚚 Delivery: ₹${delivery}\n` +
    `💰 *Total: ₹${subtotal + delivery}*\n` +
    `💳 *Payment:* ${payment}\n` +
    (note ? `📝 *Note:* ${note}\n` : '') +
    `⏰ *Time:* ${now}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ Please confirm & prepare!`;

  const waUrl = `https://wa.me/${OWNER_WA}?text=${encodeURIComponent(msg)}`;

  closeCheckout();
  document.getElementById('successMsg').innerHTML =
    `<strong>${name}</strong>, your order is confirmed!<br/>We'll call <strong>${phone}</strong> shortly.`;
  document.getElementById('waFallback').href = waUrl;
  document.getElementById('successModal')?.classList.add('show');

  // Clear cart
  saveCart([]);
  renderCart();

  setTimeout(() => window.open(waUrl, '_blank'), 700);
}

function closeSuccess() {
  document.getElementById('successModal')?.classList.remove('show');
  window.location.href = 'menu.html';
}

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeCheckout();
    document.getElementById('successModal')?.classList.remove('show');
  }
});

// Handle search param on menu page
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const s = params.get('search');
  if (s) {
    const el = document.getElementById('globalSearch');
    if (el) { el.value = s; filterMenu(); }
  }
});
