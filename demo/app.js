const state = {
  view: "mini-home",
  loggedIn: false,
  empty: false,
  error: false,
  selectedCategory: "全部",
  sort: "7日销量 ↓",
  search: "",
  currentTopicId: "T1001",
  currentTile: null,
  productDrawerMode: "add",
  tracking: []
};

const topics = [
  { id: "T1001", name: "618消费券补贴", subtitle: "官方百亿补贴", category: "热门专题", status: "已上架", goods: 6 },
  { id: "T1002", name: "低价好物", subtitle: "助力快速出单", category: "低价好物", status: "已上架", goods: 4 },
  { id: "T1003", name: "端午粽情", subtitle: "端午趋势爆品", category: "", status: "已上架", goods: 3 },
  { id: "T1004", name: "智能家居爆款", subtitle: "居家场景精选", category: "智能家居", status: "已下架", goods: 2 }
];

let categories = ["热门专题", "低价好物", "服饰内衣", "个护家清", "智能家居"];

const products = [
  { id: "KS10001", title: "大嘴鳄火山石烤肠40根原味糯玉米味烧烤露营夜宵", price: 56.8, sales: 54000, rate: 12, commission: 6.82, category: "食品", tag: "平台补贴", badge: "大嘴鳄", theme: "sausage" },
  { id: "KS10002", title: "【食者道】炸鸡排半成品香煎鸡扒鸡胸肉空气炸锅食材", price: 32.9, sales: 9600, rate: 15, commission: 4.93, category: "食品", tag: "已获得流量扶持", badge: "食者道", theme: "chicken" },
  { id: "KS10003", title: "流油起沙咸鸭蛋红心熟咸蛋早餐佐餐下饭整箱", price: 19.9, sales: 38000, rate: 25.4, commission: 4.78, category: "食品", tag: "直播返佣", badge: "流油起沙", theme: "egg" },
  { id: "KS10004", title: "小哼猪道地肠五种口味鲜肉制作肉感满满早餐肠", price: 39.9, sales: 26000, rate: 5.84, commission: 2, category: "食品", tag: "直播同款", badge: "抖老板教你赚钱", theme: "ham" },
  { id: "KS10005", title: "四季柔软抽纸整箱家用纸巾母婴可用实惠装", price: 9.9, sales: 52000, rate: 11.19, commission: 0.99, category: "个护", tag: "政策补贴", badge: "快手优选", theme: "paper" },
  { id: "KS10006", title: "南瓜粉糯香甜4.5斤新鲜蔬果母婴辅食粉面香甜", price: 7.9, sales: 15000, rate: 5.7, commission: 0.4, category: "食品", tag: "平台补贴", badge: "真贝贝", theme: "pumpkin" }
];

let tiles = [
  { slot: "主推资源位", cover: "大瓷片", count: "最多 3 条", jump: "商品专题", name: "618大促主推", target: "T1001", updater: "运营A", time: "2026-05-28 12:30" },
  { slot: "次级资源位 1", cover: "小瓷片", count: "1 条", enabled: true, jump: "商品专题", name: "低价好物", target: "T1002", updater: "运营B", time: "2026-05-28 11:20" },
  { slot: "次级资源位 2", cover: "小瓷片", count: "1 条", enabled: true, jump: "小程序路由", name: "爆品榜单入口", target: "/pages/rank/index", updater: "运营B", time: "2026-05-27 19:40" },
  { slot: "次级资源位 3", cover: "小瓷片", count: "1 条", enabled: true, jump: "商品专题", name: "端午粽情", target: "T1003", updater: "运营C", time: "2026-05-27 18:12" },
  { slot: "次级资源位 4", cover: "小瓷片", count: "1 条", enabled: true, jump: "商品专题", name: "智能家居", target: "T1004", updater: "运营D", time: "2026-05-27 16:45" }
];

let mainTileContents = [
  { enabled: true, sort: 1, name: "618大促主推", jump: "商品专题", target: "T1001", creator: "运营A", time: "2026-05-28 12:30" },
  { enabled: false, sort: 2, name: "低价好物轮播", jump: "商品专题", target: "T1002", creator: "-", time: "-" },
  { enabled: false, sort: 3, name: "端午粽情轮播", jump: "商品专题", target: "T1003", creator: "-", time: "-" }
];

const viewMeta = {
  "mini-home": ["小程序：首页瓷片区", "在现有快手选品首页金刚区下方增加 1 大 + 4 小运营瓷片区。"],
  "mini-list": ["小程序：专题列表", "展示已上架专题集合，分类作为筛选项，未登录用户可浏览。"],
  "mini-detail": ["小程序：专题详情", "登录后浏览专题货盘，支持排序、批量添加货架和商品动作归因。"],
  "admin-tiles": ["后台：运营瓷片配置", "按内容平铺管理瓷片配置，内容分别展示在主推资源位或次级资源位壳子中。"],
  "admin-topics": ["后台：商品专题管理", "管理专题列表、专题分类入口、上下架和删除。"],
  "admin-edit": ["后台：专题新增/编辑", "维护专题基础信息和专题货盘，支持三种货盘组建方式。"]
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function track(type, payload = {}) {
  const event = {
    type,
    time: new Date().toLocaleString(),
    user: state.loggedIn ? "user_10086" : "anonymous_device",
    ...payload
  };
  state.tracking.unshift(event);
  renderTracking();
}

function switchView(view) {
  state.view = view;
  $all(".view").forEach(el => el.classList.toggle("active", el.id === view));
  $all(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  $("#viewTitle").textContent = viewMeta[view][0];
  $("#viewDesc").textContent = viewMeta[view][1];
  render();
}

function openModal(id) {
  $("#" + id).classList.remove("hidden");
}

function closeOverlays() {
  $all(".modal-mask, .drawer").forEach(el => el.classList.add("hidden"));
}

function requireLogin(next) {
  if (state.loggedIn) {
    next();
    return;
  }
  state.pendingAfterLogin = next;
  openModal("loginModal");
}

function renderTileZone() {
  const zone = $("#tileZone");
  if (state.error) {
    zone.innerHTML = "";
    zone.style.display = "none";
    return;
  }
  zone.style.display = "grid";
  const [big, ...small] = tiles;
  zone.innerHTML = `
    <button class="big-tile" data-tile="${big.slot}">
      <strong>${big.name}</strong>
      <span>主推资源位 · ${big.count}轮播</span>
      <span>${big.jump}：${big.target}</span>
    </button>
    <div class="small-grid">
      ${small.map(tile => `
        <button class="small-tile" data-tile="${tile.slot}">
          <strong>${tile.name}</strong>
          <span>${tile.jump}</span>
        </button>
      `).join("")}
    </div>
  `;
  $all("[data-tile]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tile = tiles.find(item => item.slot === btn.dataset.tile);
      state.currentTile = tile;
      track("瓷片点击", { tileSlot: tile.slot, tileContent: tile.name, jumpType: tile.jump, target: tile.target });
      if (tile.jump === "小程序路由") {
        showToast(`跳转小程序路由：${tile.target}`);
        return;
      }
      const topic = topics.find(item => item.id === tile.target);
      if (!topic || topic.status !== "已上架") {
        showToast("内容已失效或专题已下架");
        return;
      }
      state.currentTopicId = topic.id;
      requireLogin(() => {
        track("专题访问", { topicId: topic.id, topicName: topic.name, sourceType: "瓷片区", sourceTile: tile.name });
        switchView("mini-detail");
      });
    });
  });
}

function renderProducts(containerSelector, items, actions = false) {
  const container = $(containerSelector);
  if (state.error) {
    container.innerHTML = `<div class="error" style="grid-column:1/-1">商品列表接口失败，请重试</div>`;
    return;
  }
  if (!items.length || state.empty) {
    container.innerHTML = `<div class="empty" style="grid-column:1/-1">${state.search ? "未找到相关商品" : "暂无商品"}</div>`;
    return;
  }
  container.innerHTML = items.map(product => `
    <div class="ks-product-card">
      <div class="ks-product-img ${product.theme}">
        <span class="ks-badge">${product.badge}</span>
        <strong>${productImageText(product)}</strong>
      </div>
      <h4>${product.title}</h4>
      <div class="ks-price-line">
        <span class="ks-price">¥${product.price}</span>
        <span class="ks-sales">7日销量：${formatSales(product.sales)}</span>
      </div>
      <div class="ks-commission-line">
        <b>高佣 ${product.rate}%</b>
        <b>佣 ¥${product.commission}</b>
      </div>
      <div class="ks-channel">快手优选官方频道 0分</div>
      ${actions ? `
      <div class="product-actions">
        <button data-product-click="${product.id}">点击</button>
        <button data-shelf="${product.id}">加货架</button>
        <button data-copy="${product.id}">复制</button>
      </div>` : ""}
    </div>
  `).join("");
  if (actions) bindProductActions();
}

function productImageText(product) {
  const map = {
    sausage: "脆皮鲜嫩 肉质紧实",
    chicken: "金黄酥脆 高蛋白",
    egg: "流油起沙",
    ham: "鲜肉制作 肉感满满",
    paper: "持久锁香",
    pumpkin: "粉糯香甜"
  };
  return map[product.theme] || "快手优选";
}

function formatSales(sales) {
  if (sales >= 10000) return `${(sales / 10000).toFixed(sales % 10000 ? 1 : 0)}w+`;
  return `${sales}+`;
}

function bindProductActions() {
  $all("[data-product-click]").forEach(btn => btn.onclick = () => {
    const product = products.find(item => item.id === btn.dataset.productClick);
    track("专题商品点击", productPayload(product));
    showToast("已记录商品点击");
  });
  $all("[data-shelf]").forEach(btn => btn.onclick = () => {
    const product = products.find(item => item.id === btn.dataset.shelf);
    track("专题添加货架", productPayload(product));
    showToast("已添加货架");
  });
  $all("[data-copy]").forEach(btn => btn.onclick = () => {
    const product = products.find(item => item.id === btn.dataset.copy);
    const resultType = Number(product.id.replace("KS", "")) % 2 === 0 ? "口令" : "商品ID";
    track("复制ID/口令", { ...productPayload(product), copyResultType: resultType });
    showToast(`已复制${resultType}`);
  });
}

function productPayload(product) {
  const topic = getCurrentTopic();
  return {
    topicId: topic.id,
    topicName: topic.name,
    productId: product.id,
    productName: product.title,
    sourceType: state.currentTile ? "瓷片区" : "通用Banner/其他",
    sourceTile: state.currentTile?.name || "-"
  };
}

function getCurrentTopic() {
  return topics.find(item => item.id === state.currentTopicId) || topics[0];
}

function renderTopicList() {
  const bar = $("#categoryBar");
  if (state.error) {
    bar.innerHTML = "";
    $("#topicList").innerHTML = `<div class="error">专题列表接口失败，下拉刷新或点击重试</div>`;
    return;
  }
  bar.style.display = categories.length ? "flex" : "none";
  const displayCategories = ["全部", ...categories];
  bar.innerHTML = displayCategories.map(cat => `<button class="${state.selectedCategory === cat ? "active" : ""}" data-cat="${cat}">${cat}</button>`).join("");
  $all("[data-cat]").forEach(btn => btn.onclick = () => {
    state.selectedCategory = btn.dataset.cat;
    renderTopicList();
  });
  let list = topics.filter(topic => topic.status === "已上架");
  if (state.selectedCategory !== "全部") list = list.filter(topic => topic.category === state.selectedCategory);
  if (state.empty) list = [];
  $("#topicList").innerHTML = list.length ? list.map(topic => `
    <button class="topic-card" data-topic="${topic.id}">
      <h3>${topic.name}</h3>
      <p>${topic.subtitle}${topic.category ? ` · ${topic.category}` : " · 未分类"}</p>
      <div class="preview-products">
        ${products.slice(0, 3).map(p => `<div class="preview"><div></div><b>¥${p.price}</b><br><span>高佣${p.rate}%</span></div>`).join("")}
      </div>
    </button>
  `).join("") : `<div class="empty">${state.selectedCategory !== "全部" ? "当前分类暂无专题" : "暂无专题"}</div>`;
  $all("[data-topic]").forEach(card => card.onclick = () => {
    const topic = topics.find(item => item.id === card.dataset.topic);
    state.currentTopicId = topic.id;
    requireLogin(() => {
      track("专题访问", { topicId: topic.id, topicName: topic.name, sourceType: "通用Banner/其他", sourceTile: "-" });
      switchView("mini-detail");
    });
  });
}

function renderDetail() {
  const topic = getCurrentTopic();
  $("#detailTitle").textContent = topic.name;
  $("#detailCoverTitle").textContent = topic.name;
  const sorts = ["最新上架", "7日销量 ↓", "佣金率 ↓"];
  $("#miniSorts").innerHTML = sorts.map(sort => `<button class="${state.sort === sort ? "active" : ""}" data-sort="${sort}">${sort}</button>`).join("");
  $all("[data-sort]").forEach(btn => btn.onclick = () => {
    state.sort = btn.dataset.sort;
    track("专题商品排序", { topicId: topic.id, sort: state.sort });
    renderDetail();
  });
  let list = [...products];
  if (state.sort.startsWith("7日销量")) list.sort((a, b) => b.sales - a.sales);
  if (state.sort.startsWith("佣金率")) list.sort((a, b) => b.rate - a.rate);
  $("#batchShelf").disabled = !list.length || state.empty || state.error;
  renderProducts("#detailProducts", list, true);
}

function renderTileTable() {
  const table = $("#tileTable");
  if (state.error) {
    table.innerHTML = `<tr><td><div class="error">列表接口失败，请重试</div></td></tr>`;
    return;
  }
  const mainRows = mainTileContents.map((content, index) => ({
    ...content,
    slot: "主推资源位",
    contentNo: `主推内容 ${index + 1}`,
    updater: content.creator,
    mainIndex: index
  }));
  const secondaryRows = tiles.slice(1).map(tile => ({
    ...tile,
    contentNo: tile.name,
    enabled: tile.enabled,
    updater: tile.updater,
    mainIndex: null
  }));
  const contentRows = [...mainRows, ...secondaryRows];
  const rows = state.empty
    ? contentRows.map(row => ({ ...row, name: "待配置", target: "-", updater: "-", time: "-", enabled: false }))
    : contentRows;
  table.innerHTML = `
    <thead><tr><th>所属资源位</th><th>内容名称</th><th>封面图</th><th>跳转地址</th><th>启用</th><th>最近更新人</th><th>最近更新时间</th><th>操作</th></tr></thead>
    <tbody>
      ${rows.map((content, index) => `
        <tr class="${content.enabled ? "" : "disabled-row"}">
          <td><b>${content.slot}</b>${content.mainIndex !== null ? `<small class="content-order">轮播排序 0${content.sort}</small>` : ""}</td>
          <td>${content.name}</td>
          <td><div class="thumb ${content.slot === "主推资源位" ? "" : "square"}"></div></td>
          <td>${content.jump} / ${content.target}</td>
          <td>${content.mainIndex !== null ? `<label class="switch" title="${content.enabled ? "关闭该主推内容" : "开启该主推内容"}"><input type="checkbox" ${content.enabled ? "checked" : ""} data-toggle-main="${content.mainIndex}"><span></span></label>` : "--"}</td>
          <td><span class="operator-avatar">${content.updater.slice(-1)}</span>${content.updater} <small class="staff-state">${content.updater === "运营A" ? "离职" : "在职"}</small></td>
          <td>${content.time}</td>
          <td><button data-edit-content="${index}">编辑</button><button data-click-content="${index}">查看明细</button></td>
        </tr>
      `).join("")}
    </tbody>
  `;
  $all("[data-edit-content]").forEach(btn => btn.onclick = () => {
    const content = contentRows[Number(btn.dataset.editContent)];
    if (content.mainIndex !== null) openMainContentEdit(content.mainIndex);
    else openTileEdit(tiles.findIndex(tile => tile.slot === content.slot));
  });
  $all("[data-click-content]").forEach(btn => btn.onclick = () => {
    const content = contentRows[Number(btn.dataset.clickContent)];
    renderClickLogs(content, `${content.slot} / ${content.name}`);
    openModal("tileClickModal");
  });
  $all("[data-toggle-main]").forEach(input => input.onchange = () => {
    const index = Number(input.dataset.toggleMain);
    if (!input.checked && mainTileContents.filter(item => item.enabled).length === 1) {
      showToast("主推资源位至少保留一条开启内容");
      renderTileTable();
      return;
    }
    mainTileContents[index].enabled = input.checked;
    syncMainTileSummary();
    renderTileZone();
    renderTileTable();
    showToast(input.checked ? "主推内容已开启" : "主推内容已关闭");
  });
}

function syncMainTileSummary() {
  const enabled = mainTileContents.filter(item => item.enabled);
  tiles[0].name = enabled[0]?.name || "待配置";
  tiles[0].target = enabled[0]?.target || "-";
  tiles[0].count = "最多 3 条";
}

function openMainContentEdit(index) {
  const content = mainTileContents[index];
  state.editMainContentIndex = index;
  state.editTileIndex = null;
  $("#tileEditTitle").textContent = `主推资源位内容配置：第 ${index + 1} 条`;
  $("#tileNameInput").value = content.name;
  $("#tileJumpType").value = content.jump;
  $("#tileTargetInput").value = content.target;
  $("#tileSortInput").value = content.sort;
  openModal("tileEditModal");
}

function openTileEdit(index) {
  const tile = tiles[index];
  state.editTileIndex = index;
  state.editMainContentIndex = null;
  $("#tileEditTitle").textContent = `瓷片内容配置：${tile.slot}`;
  $("#tileNameInput").value = tile.name;
  $("#tileJumpType").value = tile.jump;
  $("#tileTargetInput").value = tile.target;
  $("#tileSortInput").value = index === 0 ? "1" : "";
  openModal("tileEditModal");
}

function renderClickLogs(tile, scope = "") {
  $("#clickLogTable").innerHTML = `
    <thead><tr><th>用户</th><th>点击时间</th><th>瓷片位</th><th>跳转地址</th></tr></thead>
    <tbody>
      <tr><td><span class="user-avatar">甜</span><b>甜不辣</b><br><small>机构ID：2134234　▣</small></td><td>2026-05-28 13:20</td><td>${scope || tile.slot}</td><td>${tile.jump} / ${tile.name}</td></tr>
      <tr><td><span class="user-avatar">选</span><b>选品达人</b><br><small>机构ID：8452190　▣</small></td><td>2026-05-28 13:12</td><td>${scope || tile.slot}</td><td>${tile.jump} / ${tile.name}</td></tr>
    </tbody>
  `;
}

function renderTopicTable() {
  const keyword = $("#topicKeyword")?.value || "";
  const status = $("#topicStatus")?.value || "";
  let list = topics.filter(topic => (!keyword || topic.name.includes(keyword) || topic.id.includes(keyword)) && (!status || topic.status === status));
  if (state.error) {
    $("#topicTable").innerHTML = `<tr><td><div class="error">列表接口失败，请重试</div></td></tr>`;
    return;
  }
  if (state.empty) list = [];
  $("#topicTable").innerHTML = list.length ? `
    <thead><tr><th>专题ID</th><th>专题名称</th><th>封面</th><th>专题分类</th><th>商品数量</th><th>状态</th><th>最近更新人</th><th>最近更新时间</th><th>操作</th></tr></thead>
    <tbody>${list.map(topic => `
      <tr><td>${topic.id}</td><td>${topic.name}</td><td><div class="thumb"></div></td><td>${topic.category || "未分类"}</td><td>${topic.goods}</td><td><span class="tag status-${topic.status}">● ${topic.status}</span></td><td><span class="operator-avatar">运</span>运营A <small class="staff-state">在职</small></td><td>2026-05-28 14:30</td><td><button data-view-target="admin-edit">编辑</button><button>${topic.status === "已上架" ? "下架" : "上架"}</button><button class="danger-link">删除</button></td></tr>
    `).join("")}</tbody>` : `<tr><td><div class="empty">暂无专题 / 无匹配专题</div></td></tr>`;
}

function renderSelectProductTable() {
  const selectedMode = state.productDrawerMode === "selected";
  $("#selectProductTable").innerHTML = `
    <thead><tr>${selectedMode ? "" : "<th>选择</th>"}<th>商品信息</th><th>价格</th><th>佣金率</th><th>服务费率</th><th>昨日销量</th><th>7日销量</th><th>标签</th>${selectedMode ? "<th>操作</th>" : ""}</tr></thead>
    <tbody>${products.map(product => `
      <tr>${selectedMode ? "" : '<td><input type="checkbox" checked></td>'}<td><div class="product-cell"><div class="thumb square"></div><span>${product.title}<small>${product.id}　快手优选店铺</small></span></div></td><td>¥${product.price}</td><td>${product.rate}%</td><td>8%</td><td>${Math.round(product.sales / 7)}</td><td>${product.sales}</td><td>${product.tag}</td>${selectedMode ? '<td><button class="danger-link">移除</button></td>' : ""}</tr>
    `).join("")}</tbody>
  `;
}

function prepareProductDrawer(mode) {
  state.productDrawerMode = mode;
  const selectedMode = mode === "selected";
  $("#productDrawerTitle").textContent = selectedMode ? "已选商品计划" : "添加商品计划";
  $("#productListTitle").textContent = selectedMode ? "已选商品计划列表" : "商品计划列表";
  $("#productFilterGrid").classList.toggle("hidden", selectedMode);
  $("#selectAllProducts").classList.toggle("hidden", selectedMode);
  $("#addSelectedProducts").classList.toggle("hidden", selectedMode);
  renderSelectProductTable();
}

function renderCategories() {
  $("#categoryManageList").innerHTML = categories.map((cat, index) => `
    <div class="category-item">
      <span>☰</span>
      <b>${cat}</b>
      <button class="ghost" data-edit-cat="${index}">编辑</button>
      <button class="ghost" data-delete-cat="${index}">删除</button>
    </div>
  `).join("") || `<div class="empty">暂无专题分类</div>`;
  $all("[data-delete-cat]").forEach(btn => btn.onclick = () => {
    const cat = categories[Number(btn.dataset.deleteCat)];
    const count = topics.filter(topic => topic.category === cat).length;
    if (confirm(`该专题分类已关联 ${count} 个专题，确认要删除吗？`)) {
      categories = categories.filter(item => item !== cat);
      renderCategories();
      showToast("分类已删除，关联专题建议变为未分类");
    }
  });
  $all("[data-edit-cat]").forEach(btn => btn.onclick = () => {
    const index = Number(btn.dataset.editCat);
    const next = prompt("编辑专题分类名称", categories[index]);
    if (!next) return;
    if (categories.includes(next) && next !== categories[index]) {
      showToast("分类名称重复");
      return;
    }
    categories[index] = next;
    renderCategories();
  });
}

function renderTracking() {
  const list = $("#trackingList");
  if (!state.tracking.length) {
    list.innerHTML = `<div class="empty">暂无埋点记录，请先点击瓷片、专题或商品操作</div>`;
    return;
  }
  list.innerHTML = state.tracking.map(event => `
    <div class="tracking-item">
      <b>${event.type}</b>
      <span>${event.time} · ${event.user}</span>
      <pre>${JSON.stringify(event, null, 2)}</pre>
    </div>
  `).join("");
}

function render() {
  renderTileZone();
  renderProducts(".mini-products", products.slice(0, 4));
  renderTopicList();
  renderDetail();
  renderTileTable();
  renderTopicTable();
  renderSelectProductTable();
  renderCategories();
  renderTracking();
}

function bindEvents() {
  $all(".nav-item").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));
  document.body.addEventListener("click", event => {
    const target = event.target.closest("[data-view-target]");
    if (target) switchView(target.dataset.viewTarget);
    const opener = event.target.closest("[data-open]");
    if (opener) {
      if (opener.dataset.open === "productSelectModal") prepareProductDrawer(opener.dataset.productMode || "add");
      openModal(opener.dataset.open);
    }
    if (event.target.closest("[data-close]")) closeOverlays();
  });
  $("#loginSwitch").addEventListener("change", e => {
    state.loggedIn = e.target.checked;
    showToast(state.loggedIn ? "已切换为登录态" : "已切换为未登录态");
  });
  $("#emptySwitch").addEventListener("change", e => {
    state.empty = e.target.checked;
    render();
  });
  $("#errorSwitch").addEventListener("change", e => {
    state.error = e.target.checked;
    render();
  });
  $("#resetBtn").addEventListener("click", () => {
    Object.assign(state, { loggedIn: false, empty: false, error: false, selectedCategory: "全部", sort: "7日销量 ↓", search: "", currentTile: null, tracking: [] });
    $("#loginSwitch").checked = false;
    $("#emptySwitch").checked = false;
    $("#errorSwitch").checked = false;
    showToast("已重置演示数据");
    render();
  });
  $("#confirmLogin").addEventListener("click", () => {
    state.loggedIn = true;
    $("#loginSwitch").checked = true;
    closeOverlays();
    showToast("登录成功");
    const next = state.pendingAfterLogin;
    state.pendingAfterLogin = null;
    if (next) next();
  });
  $("#batchShelf").addEventListener("click", () => {
    const topic = getCurrentTopic();
    track("专题批量添加货架", {
      topicId: topic.id,
      topicName: topic.name,
      batchScope: "当前排序条件命中的商品集合",
      successCount: 4,
      failCount: 1,
      sourceType: state.currentTile ? "瓷片区" : "通用Banner/其他",
      sourceTile: state.currentTile?.name || "-"
    });
    showToast("批量添加完成：成功 4 个，失败 1 个");
  });
  $("#saveTileEdit").addEventListener("click", () => {
    const name = $("#tileNameInput").value.trim();
    const target = $("#tileTargetInput").value.trim();
    if (!name || !target) {
      showToast("请补齐必填字段");
      return;
    }
    if (state.editMainContentIndex !== null && state.editMainContentIndex !== undefined) {
      const index = state.editMainContentIndex;
      mainTileContents[index] = {
        ...mainTileContents[index],
        name,
        target,
        jump: $("#tileJumpType").value,
        sort: Number($("#tileSortInput").value) || index + 1,
        creator: "当前用户",
        time: "2026-05-28 14:30"
      };
      syncMainTileSummary();
    } else {
      const index = state.editTileIndex;
      tiles[index] = { ...tiles[index], name, target, jump: $("#tileJumpType").value, time: "2026-05-28 14:30", updater: "当前用户" };
    }
    closeOverlays();
    render();
    showToast("瓷片内容已保存");
  });
  $("#manualPlanTab").addEventListener("click", () => switchPlanTab("manual"));
  $("#autoPlanTab").addEventListener("click", () => switchPlanTab("auto"));
  $("#openCategoryDrawer").addEventListener("click", () => openModal("categoryDrawer"));
  $("#addCategory").addEventListener("click", () => {
    const name = prompt("请输入专题分类名称");
    if (!name) return;
    if (categories.includes(name)) {
      showToast("分类名称重复");
      return;
    }
    categories.push(name);
    renderCategories();
  });
  $("#searchTopicBtn").addEventListener("click", renderTopicTable);
  $("#resetTopicBtn").addEventListener("click", () => {
    $("#topicKeyword").value = "";
    $("#topicStatus").value = "";
    renderTopicTable();
  });
  $("#saveDraft").addEventListener("click", () => showToast("已保存草稿"));
  $("#publishTopic").addEventListener("click", () => showToast(state.empty ? "专题货盘至少需要 1 个有效商品" : "已保存并上架"));
  $("#addSelectedProducts").addEventListener("click", () => { closeOverlays(); showToast("已加入选中商品"); });
  $("#conditionAdd").addEventListener("click", () => { closeOverlays(); showToast("已按条件加入商品，形成固定货盘"); });
  $("#excelImport").addEventListener("click", () => { closeOverlays(); showToast("导入完成：成功 3 条，失败 2 条"); });
}

function switchPlanTab(type) {
  const manual = type === "manual";
  $("#manualPlanTab").classList.toggle("active", manual);
  $("#autoPlanTab").classList.toggle("active", !manual);
  $("#manualPlanContent").classList.toggle("hidden", !manual);
  $("#autoPlanContent").classList.toggle("hidden", manual);
}

bindEvents();
render();
