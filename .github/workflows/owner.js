// ── AUTH ──────────────────────────────────────────────
const OWNER_CREDS = { user: 'owner', pass: 'rg2024' };

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  if (u === OWNER_CREDS.user && p === OWNER_CREDS.pass) {
    sessionStorage.setItem('rg_owner', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    initDashboard();
  } else {
    document.getElementById('loginError').textContent = '❌ Wrong username or password';
  }
}

function doLogout() {
  sessionStorage.removeItem('rg_owner');
  location.reload();
}

// Auto-login if session exists
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('rg_owner')) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    initDashboard();
  }
});

// ── DATA ──────────────────────────────────────────────
function getAllItems() {
  const custom = JSON.parse(localStorage.getItem('rg_custom_items') || '[]');
  return [...MENU_ITEMS, ...custom];
}

function getStock() {
  return JSON.parse(localStorage.getItem('rg_stock') || '{}');
}

function setStock(id, status) {
  const s = getStock();
  s[id] = status; // 'in' or 'out'
  localStorage.setItem('rg_stock', JSON.stringify(s));
}

function getCustomItems() {
  return JSON.parse(localStorage.getItem('rg_custom_items') || '[]');
}

function saveCustomItems(items) {
  localStorage.setItem('rg_custom_items', JSON.stringify(items));
}

// ── INIT ──────────────────────────────────────────────
function initDashboard() {
  updateStats();
  renderStock();
  renderManage();
}

function updateStats() {
  const items = getAllItems();
  const stock = getStock();
  let avail = 0, out = 0;
  items.forEach(i => {
    if (stock[i.id] === 'out') out++;
    else avail++;
  });
  document.getElementById('statAvail').textContent = avail;
  document.getElementById('statOut').textContent = out;
  document.getElementById('statTotal').textContent = items.length;
  // Storage usage
  try {
    let total = 0;
    for (let k in localStorage) { if (localStorage.hasOwnProperty(k)) total += localStorage[k].length; }
    const pct = Math.round((total / (5 * 1024 * 1024)) * 100);
    const el = document.getElementById('statStorage');
    if (el) {
      el.textContent = pct + '%';
      el.parentElement.style.borderLeft = pct > 80 ? '3px solid #e74c3c' : '3px solid #27ae60';
    }
  } catch(e) {}
}

// ── TABS ──────────────────────────────────────────────
const tabMeta = {
  stock:  { title: 'Stock Manager',  sub: 'Toggle item availability for customers' },
  add:    { title: 'Add New Item',   sub: 'Upload a new food item to the menu' },
  manage: { title: 'All Items',      sub: 'Edit or delete existing menu items' },
};

function showTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.snav').forEach(a => a.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  if (el) el.classList.add('active');
  document.getElementById('tabTitle').textContent = tabMeta[name]?.title || '';
  document.getElementById('tabSub').textContent = tabMeta[name]?.sub || '';
  if (name === 'stock') renderStock();
  if (name === 'manage') renderManage();
}

// ── STOCK MANAGER ─────────────────────────────────────
let stockCat = 'all';

function setStockCat(btn, cat) {
  document.querySelectorAll('#tab-stock .fcat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  stockCat = cat;
  renderStock();
}

function renderStock() {
  const grid = document.getElementById('stockGrid');
  const search = document.getElementById('stockSearch')?.value.toLowerCase() || '';
  const stock = getStock();
  let items = getAllItems().filter(i => {
    const matchCat = stockCat === 'all' || i.cat === stockCat;
    const matchSearch = !search || i.name.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  grid.innerHTML = items.map(item => {
    const isOut = stock[item.id] === 'out';
    return `
    <div class="stock-card ${isOut ? 'out' : ''}">
      <div class="stock-img">
        <img src="${item.img}" alt="${item.name}"
          onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60'"/>
        <span class="stock-badge ${isOut ? 'badge-out' : 'badge-in'}">
          ${isOut ? '❌ Out of Stock' : '✅ Available'}
        </span>
      </div>
      <div class="stock-info">
        <h4>${item.name}</h4>
        <span class="cat-pill cat-${item.cat}">${catLabel(item.cat)}</span>
        <span class="stock-price">₹${item.price}</span>
      </div>
      <div class="stock-toggle">
        <label class="toggle-switch">
          <input type="checkbox" ${!isOut ? 'checked' : ''}
            onchange="toggleStock(${item.id}, this.checked)"/>
          <span class="toggle-slider"></span>
        </label>
        <small>${isOut ? 'Mark Available' : 'Mark Out of Stock'}</small>
      </div>
    </div>`;
  }).join('');

  updateStats();
}

function toggleStock(id, isAvailable) {
  setStock(id, isAvailable ? 'in' : 'out');
  renderStock();
  renderManage();
  showToastOwner(isAvailable ? '✅ Marked as Available' : '❌ Marked as Out of Stock');
}

// ── ADD ITEM ──────────────────────────────────────────
let newImgData = null;

function previewImg(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    // Compress image before storing to avoid localStorage quota error
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Max 400px wide, maintain aspect ratio
      const maxW = 400;
      const scale = Math.min(1, maxW / img.width);
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Compress to JPEG at 60% quality — keeps size under ~30KB
      newImgData = canvas.toDataURL('image/jpeg', 0.6);
      document.getElementById('imgPreview').src = newImgData;
      document.getElementById('imgPreview').style.display = 'block';
      document.getElementById('uploadPlaceholder').style.display = 'none';
      // Show compressed size
      const kb = Math.round((newImgData.length * 3/4) / 1024);
      showToastOwner(`📷 Image ready (${kb} KB)`);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function addItem(e) {
  e.preventDefault();
  if (!newImgData) { showToastOwner('⚠️ Please upload an image', true); return; }

  // Check available storage before saving
  const custom = getCustomItems();
  const allItems = getAllItems();
  const newId = Math.max(...allItems.map(i => i.id), 100) + 1;

  const item = {
    id: newId,
    name: document.getElementById('newName').value.trim(),
    cat: document.getElementById('newCat').value,
    price: parseInt(document.getElementById('newPrice').value),
    rating: 4.5,
    tag: document.getElementById('newTag').value,
    desc: document.getElementById('newDesc').value.trim(),
    img: newImgData,
    custom: true
  };

  // Estimate size
  const newData = JSON.stringify([...custom, item]);
  const estimatedKB = Math.round(newData.length / 1024);
  if (estimatedKB > 4000) {
    showToastOwner('⚠️ Storage nearly full! Delete old items first.', true);
    return;
  }

  custom.push(item);
  try {
    saveCustomItems(custom);
    showToastOwner(`✅ "${item.name}" added to menu!`);
    resetForm();
    updateStats();
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToastOwner('⚠️ Storage full! Try a smaller image.', true);
    } else {
      showToastOwner('❌ Error saving item. Try again.', true);
    }
  }
}

function resetForm() {
  document.getElementById('newName').value = '';
  document.getElementById('newCat').value = '';
  document.getElementById('newPrice').value = '';
  document.getElementById('newTag').value = '';
  document.getElementById('newDesc').value = '';
  document.getElementById('newImg').value = '';
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('uploadPlaceholder').style.display = 'flex';
  newImgData = null;
}

// ── MANAGE / ALL ITEMS ────────────────────────────────
function renderManage() {
  const tbody = document.getElementById('manageBody');
  const search = document.getElementById('manageSearch')?.value.toLowerCase() || '';
  const stock = getStock();
  const items = getAllItems().filter(i => !search || i.name.toLowerCase().includes(search));

  tbody.innerHTML = items.map(item => {
    const isOut = stock[item.id] === 'out';
    const isCustom = item.custom;
    return `
    <tr class="${isOut ? 'row-out' : ''}">
      <td><img src="${item.img}" class="table-thumb"
        onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=60'"/></td>
      <td><strong>${item.name}</strong>${item.tag ? `<span class="item-tag tag-hot" style="font-size:.65rem;padding:2px 8px;margin-left:6px">${item.tag}</span>` : ''}</td>
      <td><span class="cat-pill cat-${item.cat}">${catLabel(item.cat)}</span></td>
      <td><strong>₹${item.price}</strong></td>
      <td>
        <span class="status-pill ${isOut ? 'status-out' : 'status-in'}">
          ${isOut ? '❌ Out of Stock' : '✅ Available'}
        </span>
      </td>
      <td class="action-btns">
        <button class="act-btn edit" onclick="openEdit(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="act-btn toggle-btn ${isOut ? 'btn-green' : 'btn-orange'}"
          onclick="toggleStock(${item.id}, ${isOut})" title="${isOut ? 'Mark Available' : 'Mark Out of Stock'}">
          <i class="fas fa-${isOut ? 'check' : 'ban'}"></i>
        </button>
        ${isCustom ? `<button class="act-btn del" onclick="openDelete(${item.id},'${item.name}')" title="Delete"><i class="fas fa-trash"></i></button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

// ── EDIT ──────────────────────────────────────────────
function openEdit(id) {
  const item = getAllItems().find(i => i.id === id);
  if (!item) return;
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = item.name;
  document.getElementById('editPrice').value = item.price;
  document.getElementById('editTag').value = item.tag || '';
  document.getElementById('editDesc').value = item.desc;
  document.getElementById('editModal').classList.add('show');
}

function closeEdit() { document.getElementById('editModal').classList.remove('show'); }

function saveEdit() {
  const id = parseInt(document.getElementById('editId').value);
  const custom = getCustomItems();
  const customIdx = custom.findIndex(i => i.id === id);

  const updates = {
    name:  document.getElementById('editName').value.trim(),
    price: parseInt(document.getElementById('editPrice').value),
    tag:   document.getElementById('editTag').value,
    desc:  document.getElementById('editDesc').value.trim(),
  };

  if (customIdx >= 0) {
    Object.assign(custom[customIdx], updates);
    saveCustomItems(custom);
  } else {
    // Store overrides for base items
    const overrides = JSON.parse(localStorage.getItem('rg_overrides') || '{}');
    overrides[id] = updates;
    localStorage.setItem('rg_overrides', JSON.stringify(overrides));
  }

  closeEdit();
  renderManage();
  renderStock();
  showToastOwner('✅ Item updated!');
}

// ── DELETE ────────────────────────────────────────────
let pendingDeleteId = null;

function openDelete(id, name) {
  pendingDeleteId = id;
  document.getElementById('deleteMsg').textContent = `Are you sure you want to delete "${name}"?`;
  document.getElementById('confirmDeleteBtn').onclick = confirmDelete;
  document.getElementById('deleteModal').classList.add('show');
}

function closeDelete() { document.getElementById('deleteModal').classList.remove('show'); }

function confirmDelete() {
  const custom = getCustomItems().filter(i => i.id !== pendingDeleteId);
  saveCustomItems(custom);
  closeDelete();
  renderManage();
  renderStock();
  updateStats();
  showToastOwner('🗑️ Item deleted');
}

// ── HELPERS ───────────────────────────────────────────
function catLabel(cat) {
  return { veg:'🥦 Veg', nonveg:'🍗 Non-Veg', sweets:'🧁 Sweets', juices:'🧃 Juices', desserts:'🍨 Desserts' }[cat] || cat;
}

function showToastOwner(msg, warn = false) {
  let t = document.getElementById('ownerToast');
  if (!t) { t = document.createElement('div'); t.id = 'ownerToast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'owner-toast show' + (warn ? ' warn' : '');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.id === 'editModal') closeEdit();
  if (e.target.id === 'deleteModal') closeDelete();
});
