const fs = require('fs');

const W = 3000;
const H = 3600;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const out = [];
function tag(name, attrs = {}, body = '') {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(' ');
  out.push(`<${name}${a ? ' ' + a : ''}>${body}</${name}>`);
}
function rect(x, y, w, h, fill = '#fff', stroke = '#d0d5dd', r = 12, sw = 1) {
  tag('rect', { x, y, width: w, height: h, rx: r, ry: r, fill, stroke, 'stroke-width': sw });
}
function line(x1, y1, x2, y2, stroke = '#d0d5dd', sw = 1) {
  tag('line', { x1, y1, x2, y2, stroke, 'stroke-width': sw });
}
function text(x, y, s, size = 18, fill = '#1f2937', weight = 400, anchor = 'start') {
  tag('text', {
    x, y,
    'font-family': 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
    'font-size': size,
    fill,
    'font-weight': weight,
    'text-anchor': anchor
  }, esc(s));
}
function multiText(x, y, lines, size = 16, fill = '#475467', gap = 24, weight = 400) {
  lines.forEach((l, i) => text(x, y + i * gap, l, size, fill, weight));
}
function pill(x, y, w, h, label, active = false) {
  rect(x, y, w, h, active ? '#2563eb' : '#f2f4f7', active ? '#2563eb' : '#e5e7eb', 10);
  text(x + w / 2, y + h / 2 + 7, label, 17, active ? '#fff' : '#344054', 600, 'middle');
}
function button(x, y, w, h, label, primary = false) {
  rect(x, y, w, h, primary ? '#2563eb' : '#fff', primary ? '#2563eb' : '#d0d5dd', 8);
  text(x + w / 2, y + h / 2 + 6, label, 16, primary ? '#fff' : '#344054', 600, 'middle');
}
function field(x, y, w, h, label, value = '') {
  text(x, y - 8, label, 14, '#667085');
  rect(x, y, w, h, '#fff', '#d0d5dd', 6);
  text(x + 14, y + h / 2 + 5, value || '请输入/请选择', 15, value ? '#344054' : '#98a2b3');
}
function card(x, y, w, h, title, subtitle = '', fill = '#fff') {
  rect(x, y, w, h, fill, '#e5e7eb', 12);
  text(x + 18, y + 32, title, 19, '#1f2937', 700);
  if (subtitle) text(x + 18, y + 58, subtitle, 15, '#667085');
}

function phoneFrame(x, y, title) {
  rect(x, y, 375, 812, '#f8fafc', '#101828', 32, 2);
  rect(x + 14, y + 14, 347, 784, '#f3f6fb', '#e5e7eb', 24);
  text(x + 187.5, y - 22, title, 22, '#101828', 700, 'middle');
}
function mobileHeader(x, y, title, red = false) {
  rect(x + 14, y + 14, 347, 68, red ? '#ff174b' : '#ffffff', red ? '#ff174b' : '#e5e7eb', 24);
  text(x + 36, y + 57, '‹', 34, red ? '#fff' : '#344054', 500);
  text(x + 187, y + 55, title, 20, red ? '#fff' : '#101828', 700, 'middle');
}
function productCard(x, y, w = 158, h = 220) {
  rect(x, y, w, h, '#fff', '#e5e7eb', 14);
  rect(x + 10, y + 10, w - 20, 106, '#fee2e2', '#fecaca', 10);
  text(x + 18, y + 140, '快手商品卡片', 16, '#101828', 700);
  text(x + 18, y + 166, '¥19.9  7日销', 14, '#475467');
  text(x + 18, y + 191, '高佣 25.4%', 14, '#ff5a1f', 700);
}

function phoneHome(x, y) {
  phoneFrame(x, y, '小程序-快手选品首页');
  rect(x + 14, y + 14, 347, 225, '#ffb020', '#ffb020', 24);
  text(x + 34, y + 58, '抖老板', 25, '#fff', 800);
  rect(x + 32, y + 82, 311, 36, '#fff7ed', '#fff7ed', 18);
  text(x + 56, y + 106, '输入商品名称/ID/链接/口令搜索', 15, '#344054');
  text(x + 68, y + 190, '现有顶部/营销区域', 30, '#fff', 800);
  rect(x + 28, y + 226, 319, 88, '#fff', '#e5e7eb', 18);
  ['账号管理', '爆单提醒', '文案检测', '爆品榜单', '工具箱'].forEach((t, i) => {
    rect(x + 44 + i * 61, y + 245, 42, 42, '#e0e7ff', '#dbeafe', 14);
    text(x + 65 + i * 61, y + 300, t, 12, '#344054', 600, 'middle');
  });
  text(x + 28, y + 340, '新增：运营瓷片区', 16, '#2563eb', 700);
  rect(x + 28, y + 352, 142, 160, '#fff7ed', '#fb923c', 12, 2);
  text(x + 99, y + 425, '大瓷片', 22, '#c2410c', 800, 'middle');
  text(x + 99, y + 455, '1-3条轮播', 14, '#c2410c', 700, 'middle');
  [[184,352],[263,352],[184,434],[263,434]].forEach(([dx, dy], i) => {
    rect(x + dx, y + dy, 69, 78, '#eef2ff', '#818cf8', 10);
    text(x + dx + 34, y + dy + 44, `小${i + 1}`, 18, '#4338ca', 800, 'middle');
  });
  pill(x + 24, y + 534, 88, 36, '综合推荐', true);
  pill(x + 120, y + 534, 70, 36, '3日热销');
  pill(x + 198, y + 534, 72, 36, '低价好物');
  text(x + 292, y + 558, '全部  ≡', 16, '#344054', 600);
  productCard(x + 26, y + 590);
  productCard(x + 192, y + 590);
  rect(x + 14, y + 754, 347, 44, '#fff', '#e5e7eb', 0);
  text(x + 72, y + 783, '首页', 14, '#2563eb', 700, 'middle');
  text(x + 187, y + 783, '订单助手', 14, '#667085', 600, 'middle');
  text(x + 302, y + 783, '个人中心', 14, '#667085', 600, 'middle');
}

function phoneTopicList(x, y) {
  phoneFrame(x, y, '小程序-商品专题列表页');
  mobileHeader(x, y, '商品专题', true);
  rect(x + 14, y + 82, 347, 160, '#ff174b', '#ff174b', 0);
  text(x + 42, y + 165, '爆品热门专题', 32, '#fff', 900);
  text(x + 45, y + 205, '优质好货  打包带走', 20, '#fff7ed', 800);
  rect(x + 14, y + 236, 347, 72, '#fff', '#fff', 22);
  pill(x + 28, y + 254, 86, 36, '热门专题', true);
  pill(x + 120, y + 254, 74, 36, '玩具乐器');
  pill(x + 200, y + 254, 74, 36, '服饰内衣');
  text(x + 285, y + 279, '智能家...', 15, '#667085', 600);
  card(x + 26, y + 326, 323, 170, '618消费券补贴', '官方百亿补贴', '#f0f9ff');
  productPreview(x + 44, y + 397);
  card(x + 26, y + 518, 323, 170, '低价好物', '助力快速出单', '#ecfdf3');
  productPreview(x + 44, y + 589);
  card(x + 26, y + 710, 323, 74, '端午粽情', '端午趋势爆品', '#f5f3ff');
}
function productPreview(x, y) {
  for (let i = 0; i < 3; i++) {
    rect(x + i * 98, y, 82, 58, ['#fed7aa', '#bbf7d0', '#fecdd3'][i], '#e5e7eb', 8);
    text(x + i * 98, y + 83, ['¥19.9', '¥39.9', '¥14.9'][i], 15, '#101828', 700);
    text(x + i * 98, y + 108, ['高佣25%', '高佣5.8%', '高佣31%'][i], 13, '#ff5a1f', 700);
  }
}

function phoneTopicDetail(x, y) {
  phoneFrame(x, y, '小程序-商品专题详情页');
  mobileHeader(x, y, '618消费券补贴', true);
  rect(x + 28, y + 100, 319, 42, '#ec1d3d', '#ec1d3d', 22);
  text(x + 56, y + 127, '请输入要查询的内容', 16, '#fff', 700);
  rect(x + 14, y + 156, 347, 220, '#ff344f', '#ff344f', 0);
  text(x + 42, y + 282, '专题头图', 42, '#fff', 900);
  text(x + 44, y + 320, '创建/编辑专题时配置', 18, '#fff7ed', 700);
  rect(x + 14, y + 370, 347, 72, '#fff', '#fff', 22);
  pill(x + 28, y + 390, 58, 34, '最新');
  pill(x + 92, y + 390, 74, 34, '7日销量', true);
  pill(x + 172, y + 390, 64, 34, '佣金率');
  pill(x + 242, y + 390, 52, 34, '价格');
  button(x + 297, y + 388, 54, 38, '批量', true);
  productCard(x + 24, y + 462, 158, 220);
  productCard(x + 194, y + 462, 158, 220);
  rect(x + 24, y + 704, 328, 60, '#fff', '#fde68a', 10);
  text(x + 42, y + 730, '标注：商品卡片复用现有快手商品卡片组件', 15, '#92400e', 700);
  text(x + 42, y + 752, '点击/加货架/复制/批量操作均记录专题归因', 13, '#92400e');
}

function webPage(x, y, w, h, title) {
  rect(x, y, w, h, '#fff', '#101828', 10, 1.5);
  rect(x, y, w, 54, '#f8fafc', '#e5e7eb', 10);
  text(x + 24, y + 35, title, 22, '#101828', 800);
}
function table(x, y, w, rows, cols) {
  rect(x, y, w, rows * 46 + 44, '#fff', '#e5e7eb', 8);
  rect(x, y, w, 44, '#f2f4f7', '#e5e7eb', 8);
  for (let i = 1; i < rows + 1; i++) line(x, y + 44 + i * 46, x + w, y + 44 + i * 46);
  const colW = w / cols.length;
  cols.forEach((c, i) => text(x + i * colW + 14, y + 28, c, 14, '#475467', 700));
  for (let r = 0; r < rows; r++) {
    cols.forEach((c, i) => text(x + i * colW + 14, y + 75 + r * 46, r === 0 ? sample(c) : '...', 13, '#344054'));
  }
}
function sample(c) {
  const m = {
    '瓷片位': '主推资源位',
    '封面': '缩略图',
    '内容数': '1-3',
    '跳转': '商品专题',
    '操作': '编辑 / 明细',
    '专题ID': '10086',
    '名称': '618消费券补贴',
    '分类': '热门专题',
    '商品数': '128',
    '状态': '已上架',
    '更新时间': '2026-05-28'
  };
  return m[c] || c;
}
function backendTileConfig(x, y) {
  webPage(x, y, 820, 520, '后台-运营瓷片配置');
  rect(x + 24, y + 76, 772, 58, '#eff6ff', '#bfdbfe', 8);
  multiText(x + 42, y + 103, ['提示：所有瓷片位必填；保存后持续展示；本期仅支持商品专题/小程序路由'], 15, '#1d4ed8');
  table(x + 24, y + 158, 772, 5, ['瓷片位', '封面', '内容数', '跳转', '更新时间', '操作']);
}
function backendTopicManage(x, y) {
  webPage(x, y, 920, 560, '后台-商品专题管理');
  field(x + 24, y + 92, 170, 36, '专题名称/ID');
  field(x + 214, y + 92, 150, 36, '专题分类', '默认不筛选');
  field(x + 384, y + 92, 130, 36, '状态');
  button(x + 608, y + 92, 96, 36, '新增专题', true);
  button(x + 716, y + 92, 132, 36, '专题分类管理');
  table(x + 24, y + 158, 872, 6, ['专题ID', '名称', '封面', '分类', '商品数', '状态', '更新时间', '操作']);
}
function backendTopicEdit(x, y) {
  webPage(x, y, 920, 680, '后台-专题新增/编辑');
  text(x + 24, y + 92, '基础信息', 18, '#101828', 800);
  field(x + 24, y + 126, 240, 38, '专题名称', '618消费券补贴');
  field(x + 286, y + 126, 240, 38, '专题副标题/描述');
  field(x + 548, y + 126, 180, 38, '专题分类', '可为空');
  rect(x + 24, y + 196, 180, 92, '#f2f4f7', '#d0d5dd', 8);
  text(x + 52, y + 247, '专题封面/头图', 16, '#667085', 700);
  field(x + 230, y + 212, 120, 38, '排序');
  text(x + 24, y + 334, '专题货盘区', 18, '#101828', 800);
  button(x + 24, y + 360, 124, 36, '手动选择', true);
  button(x + 160, y + 360, 132, 36, '按条件选择');
  button(x + 304, y + 360, 154, 36, 'Excel导入ID');
  table(x + 24, y + 418, 872, 4, ['商品ID', '名称', '分类', '价格', '7日销量', '佣金率', '标签', '操作']);
  button(x + 624, y + 622, 86, 38, '取消');
  button(x + 724, y + 622, 96, 38, '保存草稿');
  button(x + 832, y + 622, 96, 38, '保存并上架', true);
}
function modalTile(x, y) {
  webPage(x, y, 620, 430, '弹窗-瓷片内容配置');
  field(x + 28, y + 92, 210, 36, '内容名称');
  field(x + 260, y + 92, 160, 36, '跳转类型', '商品专题');
  field(x + 28, y + 168, 250, 36, '跳转目标', '专题ID/名称');
  field(x + 300, y + 168, 120, 36, '排序');
  rect(x + 450, y + 92, 120, 112, '#f2f4f7', '#d0d5dd', 8);
  text(x + 510, y + 154, '封面图', 16, '#667085', 700, 'middle');
  rect(x + 28, y + 238, 540, 64, '#fffbeb', '#fde68a', 8);
  multiText(x + 46, y + 264, ['大瓷片支持1-3条并排序；小瓷片固定1条；不出现H5'], 15, '#92400e');
  button(x + 400, y + 354, 72, 36, '取消');
  button(x + 488, y + 354, 72, 36, '保存', true);
}
function modalCategory(x, y) {
  webPage(x, y, 520, 560, '抽屉-专题分类管理');
  button(x + 370, y + 80, 96, 36, '新增', true);
  for (let i = 0; i < 5; i++) {
    rect(x + 28, y + 136 + i * 58, 452, 46, '#fff', '#e5e7eb', 8);
    text(x + 48, y + 166 + i * 58, '☰', 18, '#667085');
    text(x + 86, y + 166 + i * 58, ['热门专题', '玩具乐器', '服饰内衣', '个护家清', '智能家居'][i], 16, '#344054', 600);
    if (i === 1) text(x + 336, y + 166 + i * 58, '编辑  删除', 14, '#2563eb', 600);
  }
  rect(x + 28, y + 438, 452, 56, '#f8fafc', '#d0d5dd', 8);
  text(x + 48, y + 472, '新增行：输入框 + 取消 + 确定', 15, '#475467', 600);
  text(x + 28, y + 526, '删除弹窗：该专题分类已关联 X 个专题，确认要删除吗？', 14, '#b42318', 700);
}
function modalImport(x, y) {
  webPage(x, y, 740, 430, '弹窗-商品选择/条件选品/Excel导入');
  rect(x + 28, y + 86, 206, 280, '#f8fafc', '#e5e7eb', 8);
  text(x + 48, y + 120, '手动选择商品', 18, '#101828', 800);
  multiText(x + 48, y + 158, ['商品ID/名称搜索', '勾选竞佣成功商品', '确定加入货盘'], 15);
  rect(x + 266, y + 86, 206, 280, '#f8fafc', '#e5e7eb', 8);
  text(x + 286, y + 120, '按条件选择', 18, '#101828', 800);
  multiText(x + 286, y + 158, ['佣金率/价格/7日销量区间', '类目多选', '官方标签多选'], 15);
  rect(x + 504, y + 86, 206, 280, '#f8fafc', '#e5e7eb', 8);
  text(x + 524, y + 120, 'Excel导入ID', 18, '#101828', 800);
  multiText(x + 524, y + 158, ['商品ID列', '成功/失败数量', '失败明细原因'], 15);
}
function statePanel(x, y) {
  webPage(x, y, 920, 520, '状态与标注总览');
  const items = [
    '小程序：首页瓷片接口失败隐藏瓷片区；图片失败展示占位图',
    '专题列表：无分类隐藏筛选区；无专题/分类无专题/接口失败',
    '专题详情：未登录拦截、专题下架、无商品、搜索无结果、复制失败',
    '后台：必填校验、保存失败、上传失败、Excel全部/部分失败',
    '标注：不新增金刚区入口，不改造Banner，瓷片不支持H5',
    '标注：分类默认不选中、单选、再次点击取消选中',
    '标注：批量添加货架在排序行右侧固定，排序区域可横滑',
    '标注：商品卡片复用现有快手商品卡片组件'
  ];
  items.forEach((it, i) => {
    rect(x + 28, y + 86 + i * 48, 864, 36, i % 2 ? '#fff' : '#f8fafc', '#e5e7eb', 8);
    text(x + 48, y + 110 + i * 48, it, 16, '#344054', 600);
  });
}

out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
rect(0, 0, W, H, '#f3f4f6', 'none', 0, 0);
text(60, 76, '快手选品瓷片区与商品专题 - 墨刀原型总览画板', 38, '#101828', 900);
text(60, 116, '中高保真线框稿：小程序页面、管理后台页面、弹窗/抽屉、空状态与异常状态', 20, '#667085', 500);
phoneHome(60, 180);
phoneTopicList(500, 180);
phoneTopicDetail(940, 180);
backendTileConfig(60, 1080);
backendTopicManage(940, 1080);
backendTopicEdit(60, 1710);
modalTile(1040, 1710);
modalCategory(1710, 1710);
modalImport(1040, 2230);
statePanel(60, 2500);
rect(1040, 2700, 1360, 500, '#fff', '#e5e7eb', 14);
text(1080, 2750, '关键流程连线', 26, '#101828', 900);
multiText(1080, 2800, [
  '快手选品首页 → 点击瓷片 → 专题详情 → 搜索/排序 → 商品点击/添加货架/批量添加货架/复制ID口令',
  '专题列表页 → 分类筛选 → 点击专题卡片 → 未登录先登录 → 专题详情',
  '运营瓷片配置 → 编辑瓷片内容 → 保存 → 查看点击明细',
  '商品专题管理 → 分类管理抽屉 → 新增/编辑专题 → 组建货盘 → 保存草稿/保存并上架'
], 18, '#344054', 36, 600);
text(1080, 2990, '必须保留的产品边界', 24, '#101828', 900);
multiText(1080, 3036, [
  '1. 本需求不新增金刚区专题入口，不做Banner功能改动。',
  '2. 专题头图在专题新增/编辑时配置，不使用通用Banner广告位。',
  '3. 瓷片内容后台必填，保存后持续展示，无生效/失效时间。',
  '4. 专题货盘仅来自竞佣成功的快手选品池。',
  '5. 专题商品行为需要归因到来源瓷片内容ID。'
], 18, '#475467', 34);
out.push('</svg>');

fs.writeFileSync('mockitt-prototype-board.svg', out.join('\n'));
console.log('Generated mockitt-prototype-board.svg');
