// ═══════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════

let numTablets  = 10;
let numPicks    = 14;
let grid        = [];    // grid[row][col] = colorIndex (0 = empty)
let activeColor = 1;     // 1-indexed; 0 = eraser
let cellSize    = 22;    // px, adjustable via zoom
let isDrawing   = false;
let lastCell    = null;

// Colour palette (user-editable)
let palette = [
  { hex: '#18181a', name: 'Black'   },
  { hex: '#f0ece0', name: 'Natural' },
  { hex: '#ddcda8', name: 'Undyed Wool' },
  { hex: '#3c5a72', name: 'Woad Blue' },
  { hex: '#9c3b2c', name: 'Madder Red' },
  { hex: '#c8a233', name: 'Weld Yellow' },
  { hex: '#6b4a34', name: 'Walnut Brown' },
  { hex: '#26374d', name: 'Deep Indigo' },
  { hex: '#bb7a2e', name: 'Saffron Ochre' },
  { hex: '#2b2622', name: 'Iron-Gall Black' },
  { hex: '#566b3a', name: 'Woad-Weld Green' },
  { hex: '#6a4258', name: 'Orchil Purple' },
  { hex: '#514d47', name: 'Charcoal Grey' },
  { hex: '#b06a5a', name: 'Madder Rose' },
];

// ═══════════════════════════════════════════════════════════════════
//  GRID
// ═══════════════════════════════════════════════════════════════════

function initGrid(tablets, picks) {
  grid = Array.from({ length: picks }, () => Array(tablets).fill(0));
}

function resizeGrid() {
  const t = Math.max(1, Math.min(64,  parseInt(document.getElementById('inp-tablets').value) || numTablets));
  const p = Math.max(1, Math.min(128, parseInt(document.getElementById('inp-picks').value)   || numPicks));
  const newGrid = Array.from({ length: p }, (_, r) =>
    Array.from({ length: t }, (_, c) => (grid[r] && grid[r][c] !== undefined) ? grid[r][c] : 0)
  );
  numTablets = t; numPicks = p; grid = newGrid;
  drawGrid();
}

function clearGrid() {
  initGrid(numTablets, numPicks);
  drawGrid();
  document.getElementById('results').classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════════════
//  CANVAS DRAWING
// ═══════════════════════════════════════════════════════════════════

const canvas = document.getElementById('grid-canvas');
const ctx    = canvas.getContext('2d');
const GAP    = 1; // grid line width in px

function drawGrid() {
  const cs = cellSize;
  const W  = numTablets * (cs + GAP) + GAP;
  const H  = numPicks   * (cs + GAP) + GAP;
  canvas.width  = W;
  canvas.height = H;

  // Background acts as grid lines
  ctx.fillStyle = '#333340';
  ctx.fillRect(0, 0, W, H);

  // Cells
  for (let r = 0; r < numPicks; r++) {
    for (let c = 0; c < numTablets; c++) {
      const ci = grid[r][c];
      ctx.fillStyle = (ci > 0 && palette[ci - 1]) ? palette[ci - 1].hex : (palette[1]?.hex ?? palette[0]?.hex);
      ctx.fillRect(c * (cs + GAP) + GAP, r * (cs + GAP) + GAP, cs, cs);
    }
  }

  // Tablet number labels at top (only when cells are large enough to read)
  if (cs >= 16) {
    ctx.fillStyle = '#555566';
    ctx.font = `${Math.min(cs * 0.45, 10)}px monospace`;
    ctx.textAlign = 'center';
    for (let c = 0; c < numTablets; c++) {
      ctx.fillText(c + 1, c * (cs + GAP) + GAP + cs / 2, -2);
    }
  }
}

function cellAt(e) {
  const rect   = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top)  * scaleY;
  const cs  = cellSize + GAP;
  const col = Math.floor(x / cs);
  const row = Math.floor(y / cs);
  if (col >= 0 && col < numTablets && row >= 0 && row < numPicks) return { row, col };
  return null;
}

function paint(cell, colorIdx) {
  if (!cell) return;
  if (grid[cell.row][cell.col] === colorIdx) return;
  grid[cell.row][cell.col] = colorIdx;
  const cs = cellSize;
  ctx.fillStyle = (colorIdx > 0 && palette[colorIdx - 1]) ? palette[colorIdx - 1].hex : (palette[1]?.hex ?? palette[0]?.hex);
  ctx.fillRect(cell.col * (cs + GAP) + GAP, cell.row * (cs + GAP) + GAP, cs, cs);
}

canvas.addEventListener('mousedown', e => {
  e.preventDefault(); isDrawing = true;
  const cell = cellAt(e);
  const ci = (e.button === 2) ? 0 : activeColor;
  paint(cell, ci); lastCell = cell;
});
canvas.addEventListener('mousemove', e => {
  if (!isDrawing) return;
  const cell = cellAt(e);
  if (cell && (cell.row !== lastCell?.row || cell.col !== lastCell?.col)) {
    paint(cell, e.buttons === 2 ? 0 : activeColor); lastCell = cell;
  }
});
window.addEventListener('mouseup', () => { isDrawing = false; lastCell = null; });
canvas.addEventListener('contextmenu', e => e.preventDefault());

// Touch support
canvas.addEventListener('touchstart', e => {
  e.preventDefault(); isDrawing = true;
  const t = e.touches[0];
  const cell = cellAt({ clientX: t.clientX, clientY: t.clientY });
  paint(cell, activeColor); lastCell = cell;
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!isDrawing) return;
  const t = e.touches[0];
  const cell = cellAt({ clientX: t.clientX, clientY: t.clientY });
  if (cell && (cell.row !== lastCell?.row || cell.col !== lastCell?.col)) {
    paint(cell, activeColor); lastCell = cell;
  }
}, { passive: false });
canvas.addEventListener('touchend', () => { isDrawing = false; });

// Zoom with scroll wheel
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  cellSize = Math.max(10, Math.min(40, cellSize - Math.sign(e.deltaY) * 2));
  drawGrid();
}, { passive: false });

// ═══════════════════════════════════════════════════════════════════
//  PALETTE UI
// ═══════════════════════════════════════════════════════════════════

function renderPalette() {
  const el = document.getElementById('palette');
  el.innerHTML = '';

  // Eraser
  const eraser = document.createElement('div');
  eraser.className = 'swatch eraser' + (activeColor === 0 ? ' active' : '');
  eraser.title = 'Eraser (right-click also erases)';
  eraser.textContent = '✕';
  eraser.addEventListener('click', () => { activeColor = 0; renderPalette(); });
  el.appendChild(eraser);

  // Colour swatches
  palette.forEach((col, i) => {
    const sw = document.createElement('div');
    sw.className = 'swatch' + (activeColor === i + 1 ? ' active' : '');
    sw.style.background = col.hex;
    sw.title = col.name + ' (double-click to change colour)';

    const inp = document.createElement('input');
    inp.type = 'color';
    inp.value = col.hex;
    inp.addEventListener('change', e => {
      palette[i].hex = e.target.value;
      renderPalette(); drawGrid();
    });

    // Single click = select; double-click = open colour picker
    let clickTimer = null;
    sw.addEventListener('click', () => {
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; inp.click(); }
      else {
        activeColor = i + 1; renderPalette();
        clickTimer = setTimeout(() => { clickTimer = null; }, 280);
      }
    });
    sw.appendChild(inp);
    el.appendChild(sw);
  });

  // Add colour button
  if (palette.length < 8) {
    const add = document.createElement('div');
    add.className = 'add-swatch';
    add.title = 'Add colour';
    add.textContent = '+';
    add.addEventListener('click', () => {
      palette.push({ hex: '#888888', name: `Color ${palette.length + 1}` });
      activeColor = palette.length;
      renderPalette();
    });
    el.appendChild(add);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  TABLET WEAVING ALGORITHM
// ═══════════════════════════════════════════════════════════════════
//
//  4-hole tablet model
//  ─────────────────────────────────────────────────────────────────
//  Holes A (top-left), B (top-right), C (bottom-right), D (bottom-left)
//  mapped to internal positions 0, 1, 2, 3.
//
//  Threading assignment:
//    Holes A, B (positions 0, 1) → color1 (the "face" color)
//    Holes C, D (positions 2, 3) → color2 (the "back" color)
//
//  Threading direction:
//    Z (⟍): Forward turn → position +1 mod 4  (A→B→C→D)
//    S (⟋): Forward turn → position -1 mod 4  (A→D→C→B)
//  Alternating S/Z on adjacent tablets balances warp twist.
//
//  At any position, the visible color on the face of the fabric:
//    pos 0 or 1 → color1 (hole A or B faces up)
//    pos 2 or 3 → color2 (hole C or D faces up)
//
//  Key property: from any position, exactly one of {F, B} achieves
//  each colour — so the algorithm always finds a valid turn sequence
//  for any 2-colour column pattern.
// ═══════════════════════════════════════════════════════════════════

// TODO: set the direction based on the difference with neighboring columns
//    (move together as many tablets as possible)
//        also set it based on overall torque - all of them can't be Z or S
function analyzeTablet(colColors, dir) {
  // colColors: array of colorIndex per pick (0 = empty)
  // dir: 'Z' or 'S'

  // TODO: color = 0 artifact of 2 colors?
  const nonEmpty = colColors.filter(c => c !== 0);
  let threading = [ 0, 0, 0, 0 ];
  if (nonEmpty.length === 0) {
    return { threading, dir,
             turns: new Array(colColors.length - 1).fill('F'), warning: null };
  }

  const unique = [...new Set(nonEmpty)];
  let warning = null;
  if (unique.length == 1) {
    return { threading: new Array(4).fill(colColors[0]), dir,
             turns: new Array(colColors.length - 1).fill('F'), warning: null };
  }
  if (unique.length > 4) {
    warning = `${unique.length} colors — a 4-hole tablet can't display more than 4"`;
  }
  // now we know we have 2-4 unique colors
  threading[0] = colColors[0];

  // pos → face color
  const face = p => threading[p];

  // Turn effects based on threading direction
  const fwd = p => dir === 'Z' ? (p + 1) % 4 : (p + 3) % 4;
  const bwd = p => dir === 'Z' ? (p + 3) % 4 : (p + 1) % 4;

  let repeating = true; // TODO: make this a param

  function tryTurn(label, idx, newPos) {
    const prevCol = threading[newPos]
    if (prevCol == 0) {
      threading[newPos] = colColors[idx];
    }
    if ( threading[newPos] == colColors[idx] ) {
      turns.push(label);
      if (solveThreading(idx+1, newPos)) {
        return true;
      }
      threading[newPos] = prevCol;
      turns.pop();
    }
    return false;
  }

  function solveThreading(idx, pos) {
    if (idx == colColors.length && (!repeating || pos == 0) ) return true; //TODO: add loop condition
    return tryTurn('F', idx, fwd(pos)) || tryTurn('B', idx, bwd(pos));
  }

  let turns = [];

  const solved = solveThreading(1, 0)
  if(!solved) {
    warning = `no solution found for this tablet`;
  }
  
  return { threading, dir, turns, warning };
}



// ═══════════════════════════════════════════════════════════════════
//  GENERATE & RENDER RESULTS
// ═══════════════════════════════════════════════════════════════════

function generate() {
  const warnings = [];
  const results  = [];
  const bgColor  = palette.length >= 2 ? 2 : 1; // empty cells = Natural (color 2)

  for (let c = 0; c < numTablets; c++) {
    const dir       = c % 2 === 0 ? 'Z' : 'S'; // alternate for balanced twist
    const colColors = grid.map(row => row[c] === 0 ? bgColor : row[c]);
    const r         = analyzeTablet(colColors, dir);
    results.push(r);
    if (r.warning) warnings.push(`Tablet ${c + 1}: ${r.warning}`);
  }

  renderResults(results, warnings);
}

function textColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
    ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)';
}

function dot(ci, size) {
  const sz = size ?? 14;
  if (!ci || !palette[ci - 1]) return `<span style="color:var(--dim)">—</span>`;
  return `<span class="dot" style="width:${sz}px;height:${sz}px;background:${palette[ci-1].hex}" title="${palette[ci-1].name}"></span>`;
}

function holeName(pos) { return 'ABCD'[pos] ?? 'A'; }

function renderResults(results, warnings) {
  const panel = document.getElementById('results');
  panel.classList.remove('hidden');

  let h = '<div class="results-head"><h2>Threading &amp; Turning Sequence</h2></div>';

  // Warnings
  if (warnings.length) {
    h += '<div class="warning-box"><strong>⚠ Warnings</strong><ul>';
    warnings.forEach(w => { h += `<li>${w}</li>`; });
    h += '</ul></div>';
  }

  // Legend
  h += '<div class="legend">';
  palette.forEach((c, i) => {
    h += `<div class="legend-item">${dot(i + 1, 14)} Color ${i + 1}: ${c.name}</div>`;
  });
  h += `<div class="legend-item" style="margin-left:auto">
    <span style="color:var(--green);font-weight:700">F</span>&nbsp;= Forward (away from you)
    &nbsp;·&nbsp;
    <span style="color:var(--red);font-weight:700">B</span>&nbsp;= Backward (toward you)
  </div>`;
  h += '</div>';

  h += '<div class="result-cols">';

  // ── Section 1: Warp Threading Setup ────────────────────────────
  h += '<div class="result-col">';
  h += '<h3>1 — Warp Threading Setup</h3>';
  h += '<div class="tbl-wrap"><table>';

  h += '<tr><th>Hole</th>';
  for (let c = 0; c < numTablets; c++) h += `<th>T${c + 1}</th>`;
  h += '</tr>';

  ['A', 'B', 'C', 'D'].forEach((hole, hi) => {
    h += `<tr><th class="row-head">${hole}</th>`;
    for (let c = 0; c < numTablets; c++) {
      const ci = hi <= 1 ? results[c].color1 : results[c].color2;
      h += `<td>${dot(ci, 16)}</td>`;
    }
    h += '</tr>';
  });

  h += '<tr><th style="color:var(--dim)">Dir</th>';
  for (let c = 0; c < numTablets; c++) {
    const d = results[c].dir;
    h += `<td class="dir-${d.toLowerCase()}" title="${d}-threading">${d === 'Z' ? '⟍' : '⟋'} ${d}</td>`;
  }
  h += '</tr>';

  h += '<tr><th style="color:var(--dim)">Start↑</th>';
  for (let c = 0; c < numTablets; c++) {
    h += `<td style="color:var(--dim);font-size:0.72rem">${holeName(results[c].initialPos)}</td>`;
  }
  h += '</tr>';

  h += '</table></div>';

  // Tablet visual diagrams (up to 16)
  const show = Math.min(numTablets, 16);
  h += '<div class="tablet-diagrams">';
  for (let c = 0; c < show; c++) {
    const r  = results[c];
    const c1 = (r.color1 && palette[r.color1 - 1]) ? palette[r.color1 - 1].hex : '#333';
    const c2 = (r.color2 && palette[r.color2 - 1]) ? palette[r.color2 - 1].hex : '#222';
    const t1 = textColor(c1), t2 = textColor(c2);
    h += `
    <div class="tablet-card">
      <div class="tnum">T${c + 1}</div>
      <div class="tablet-holes">
        <div class="hole" style="background:${c1};color:${t1}">A</div>
        <div class="hole" style="background:${c1};color:${t1}">B</div>
        <div class="hole" style="background:${c2};color:${t2}">D</div>
        <div class="hole" style="background:${c2};color:${t2}">C</div>
      </div>
      <div class="dir-tag">${r.dir === 'Z' ? '⟍' : '⟋'} ${r.dir}</div>
      <div class="start-tag">↑${holeName(r.initialPos)}</div>
    </div>`;
  }
  if (numTablets > 16) {
    h += `<div style="color:var(--dim);font-size:0.75rem;align-self:center">+${numTablets - 16} more…</div>`;
  }
  h += '</div>';
  h += '</div>'; // result-col

  // ── Section 2: Turning Sequence ─────────────────────────────────
  h += '<div class="result-col">';
  h += '<h3>2 — Turning Sequence per Pick</h3>';
  h += '<div class="tbl-wrap"><table>';

  h += '<tr><th>Pick</th>';
  for (let c = 0; c < numTablets; c++) h += `<th>T${c + 1}</th>`;
  h += '</tr>';

  // Pick 1: no turn — tablets are at their initial position
  h += `<tr><td class="pick-num">1 ★</td>`;
  for (let c = 0; c < numTablets; c++) h += `<td style="color:var(--dim)">—</td>`;
  h += '</tr>';

  // Picks 2..N: turn applied after the previous pick
  for (let r = 0; r < numPicks - 1; r++) {
    h += `<tr><td class="pick-num">${r + 2}</td>`;
    for (let c = 0; c < numTablets; c++) {
      const turn = results[c].turns[r] ?? '—';
      const cls  = turn === 'F' ? 'turn-F' : (turn === 'B' ? 'turn-B' : '');
      h += `<td class="${cls}">${turn}</td>`;
    }
    h += '</tr>';
  }

  h += '</table></div>';

  h += `<div class="note-box">
    <strong>★ Pick 1</strong>: Thread tablets and set each starting hole (see Setup table) before weaving.<br>
    <strong>Pick 2 onwards</strong>: After weaving each pick, turn every tablet F or B as shown in the next row, then weave.<br>
    <strong>Twist note</strong>: Alternating ⟍Z / ⟋S threading on adjacent tablets keeps the band flat.
    Long runs of only F or only B build twist — reverse direction periodically to release it.
  </div>`;

  h += '</div>'; // result-col
  h += '</div>'; // result-cols

  panel.innerHTML = h;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════════════════════════════
//  EXAMPLE PATTERN
// ═══════════════════════════════════════════════════════════════════

function loadExample() {
  numTablets = 10; numPicks = 14;
  document.getElementById('inp-tablets').value = numTablets;
  document.getElementById('inp-picks').value   = numPicks;

  // 2-colour diamond / zigzag motif  (1 = Black, 2 = Natural)
  grid = [
    [1,1,1,1,2,2,1,1,1,1],
    [1,1,1,2,2,2,2,1,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,2,2,1,1,1,1,2,2,1],
    [2,2,1,1,1,1,1,1,2,2],
    [1,2,2,1,1,1,1,2,2,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,1,2,2,2,2,1,1,1],
    [1,1,1,1,2,2,1,1,1,1],
    [1,1,1,2,2,2,2,1,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,2,2,1,1,1,1,2,2,1],
    [2,2,1,1,1,1,1,1,2,2],
    [1,2,2,1,1,1,1,2,2,1],
  ];

  if (palette.length < 2) palette.push({ hex: '#f0ece0', name: 'Natural' });
  activeColor = 1;
  renderPalette();
  drawGrid();
  generate();
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

document.getElementById('btn-generate').addEventListener('click', generate);
document.getElementById('btn-example').addEventListener('click', loadExample);
document.getElementById('btn-clear').addEventListener('click', clearGrid);
document.getElementById('btn-resize').addEventListener('click', resizeGrid);

initGrid(numTablets, numPicks);
renderPalette();
drawGrid();
