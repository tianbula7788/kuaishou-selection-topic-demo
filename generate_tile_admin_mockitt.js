const fs = require('fs');

const W = 1440;
const H = 900;
const out = [];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function tag(name, attrs, body = '') {
  const a = Object.entries(attrs || {})
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
  out.push(`<${name}${a ? ' ' + a : ''}>${body}</${name}>`);
}
function rect(x, y, w, h, fill = '#fff', stroke = '#d0d5dd', r = 8, sw = 1) {
  tag('rect', { x, y, width: w, height: h, rx: r, ry: r, fill, stroke, 'stroke-width': sw });
}
function line(x1, y1, x2, y2, stroke = '#e5e7eb') {
  tag('line', { x1, y1, x2, y2, stroke, 'stroke-width': 1 });
}
function text(x, y, s, size = 14, fill = '#344054', weight = 400, anchor = 'start') {
  tag('text', {
    x, y,
    'font-family': 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
    'font-size': size,
    fill,
    'font-weight': weight,
    'text-anchor': anchor
  }, esc(s));
}
function btn(x, y, w, h, s, primary = false) {
  rect(x, y, w, h, primary ? '#165dff' : '#fff', primary ? '#165dff' : '#d0d5dd', 4);
  text(x + w / 2, y + h / 2 + 5, s, 14, primary ? '#fff' : '#344054', 600, 'middle');
}
function pill(x, y, s, color = '#eff6ff', fg = '#165dff') {
  const w = s.length * 14 + 22;
  rect(x, y, w, 28, color, color, 14);
  text(x + w / 2, y + 19, s, 13, fg, 600, 'middle');
  return w;
}
function input(x, y, w, s) {
  rect(x, y, w, 36, '#fff', '#d0d5dd', 4);
  text(x + 12, y + 23, s, 14, '#98a2b3');
}
function tableRow(y, data, muted = false) {
  const x = 248;
  const widths = [138, 116, 108, 128, 176, 142, 172, 150];
  const xs = widths.reduce((arr, w, i) => {
    arr.push((arr[i] || x) + w);
    return arr;
  }, [x]);
  rect(248, y, 1062, 72, muted ? '#fafafa' : '#fff', 'none', 0);
  line(248, y + 72, 1310, y + 72);
  data.forEach((v, i) => {
    if (i === 1) {
      rect(xs[i] + 14, y + 14, 62, 44, muted ? '#f2f4f7' : '#fff7ed', muted ? '#d0d5dd' : '#fdba74', 6);
      text(xs[i] + 45, y + 42, v, 12, muted ? '#98a2b3' : '#c2410c', 600, 'middle');
    } else if (i === 4) {
      text(xs[i] + 14, y + 30, v[0], 13, muted ? '#98a2b3' : '#344054', 500);
      text(xs[i] + 14, y + 52, v[1], 12, '#98a2b3');
    } else if (i === 7) {
      text(xs[i] + 14, y + 30, '编辑', 14, '#165dff', 600);
      text(xs[i] + 58, y + 30, '点击明细', 14, '#165dff', 600);
    } else {
      text(xs[i] + 14, y + 42, v, 14, muted ? '#98a2b3' : '#344054', i === 0 ? 600 : 400);
    }
  });
}

out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
rect(0, 0, W, H, '#f5f7fa', 'none', 0, 0);

rect(0, 0, 216, H, '#101828', '#101828', 0);
text(28, 48, '抖老板后台', 22, '#fff', 800);
['首页', '快手选品管理', '商品管理', '订单管理', '数据中心', '系统设置'].forEach((m, i) => {
  const y = 96 + i * 52;
  rect(16, y, 184, 40, i === 1 ? '#1d2939' : '#101828', i === 1 ? '#344054' : '#101828', 6);
  text(40, y + 26, m, 15, i === 1 ? '#fff' : '#cbd5e1', i === 1 ? 700 : 400);
});
text(58, 158, '运营瓷片配置', 13, '#93c5fd', 700);

rect(216, 0, 1224, 64, '#fff', '#e5e7eb', 0);
text(248, 40, '快手选品管理 / 运营瓷片配置', 15, '#667085');
text(1320, 40, '甜不辣', 14, '#344054', 600);

text(248, 112, '运营瓷片配置', 28, '#101828', 800);
text(248, 142, '配置快手选品首页金刚区下方、商品分类 Tab 上方的 1 大 + 4 小运营瓷片区。', 15, '#667085');

rect(248, 166, 1062, 72, '#eff6ff', '#bfdbfe', 8);
text(272, 195, '配置说明', 16, '#1d4ed8', 800);
text(272, 220, '所有瓷片位均为必填；保存后持续展示，直到运营替换；本期仅支持跳转商品专题、小程序路由，不支持 H5。', 14, '#1d4ed8');
btn(1198, 184, 88, 36, '保存配置', true);

rect(248, 266, 1062, 514, '#fff', '#e5e7eb', 8);
text(272, 302, '瓷片位列表', 18, '#101828', 800);
text(374, 302, '固定 5 个瓷片位，不支持新增或删除', 14, '#98a2b3');
btn(1154, 282, 62, 32, '刷新');
btn(1226, 282, 62, 32, '预览');

const x = 248;
const widths = [138, 116, 108, 128, 176, 142, 172, 150];
let cur = x;
rect(248, 326, 1062, 46, '#f2f4f7', 'none', 0);
['瓷片位', '封面图', '内容数量', '跳转类型', '内容信息', '最近更新人', '最近更新时间', '操作'].forEach((h, i) => {
  text(cur + 14, 355, h, 13, '#475467', 700);
  cur += widths[i];
});
line(248, 372, 1310, 372);

tableRow(372, ['主推资源位', '大瓷片', '3 条', '商品专题', ['618大促主推', '按排序轮播 1/2/3'], '运营A', '2026-05-28 12:30', '']);
tableRow(444, ['次级资源位 1', '小瓷片', '1 条', '商品专题', ['低价好物', '固定展示'], '运营B', '2026-05-28 11:20', '']);
tableRow(516, ['次级资源位 2', '小瓷片', '1 条', '小程序路由', ['爆品榜单入口', '/pages/rank/index'], '运营B', '2026-05-27 19:40', '']);
tableRow(588, ['次级资源位 3', '小瓷片', '1 条', '商品专题', ['端午粽情', '固定展示'], '运营C', '2026-05-27 18:12', '']);
tableRow(660, ['次级资源位 4', '待配置', '0 条', '待配置', ['待配置', '保存前必须补齐'], '-', '-', ''], true);

rect(248, 804, 520, 56, '#fff7ed', '#fed7aa', 8);
text(272, 829, '空状态示例', 15, '#c2410c', 800);
text(272, 852, '首次进入时仍展示 5 个固定瓷片位，未配置内容显示“待配置”。', 13, '#c2410c');
rect(790, 804, 520, 56, '#fef2f2', '#fecaca', 8);
text(814, 829, '异常状态示例', 15, '#b42318', 800);
text(814, 852, '列表接口失败时展示错误态和重试；保存失败保留当前配置。', 13, '#b42318');

rect(1040, 94, 270, 134, '#fff', '#e5e7eb', 8);
text(1064, 124, '首页展示预览', 16, '#101828', 800);
rect(1064, 146, 92, 64, '#fff7ed', '#fdba74', 8);
text(1110, 184, '大瓷片', 13, '#c2410c', 700, 'middle');
[[1168,146],[1230,146],[1168,181],[1230,181]].forEach(([px, py], i) => {
  rect(px, py, 50, 29, '#eef2ff', '#818cf8', 6);
  text(px + 25, py + 20, `小${i + 1}`, 11, '#4338ca', 700, 'middle');
});

out.push('</svg>');
fs.writeFileSync('后台-运营瓷片配置页.svg', out.join('\n'));
console.log('Generated 后台-运营瓷片配置页.svg');
