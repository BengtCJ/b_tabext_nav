// charts.js — copied verbatim from b_tableau_extensions_2/index.html
// Source: https://raw.githubusercontent.com/BengtCJ/b_tableau_extensions_2/main/index.html

  // ─── METRIC → CHART MAPPING ───────────────────────────────────────────────
  const METRIC_CHARTS = {
    tam:   ['ban'],
    cagr:  ['ban'],
    mcon:  ['ban'],

    // Ratio 0–1, per-brand per-month — supports snapshot + trend
    eqr:   ['vbar-stacked', 'hbar', 'scale-figma', 'inset-bubble', 'progress-ring',
            'waffle', 'bubbles', 'treemap', 'treemap-bar', 'donut', 'bans',
            'line-smooth', 'line-straight', 'area-100', 'stream', 'small-multiples', 'slope'],

    ebl:   ['vbar-stacked', 'hbar', 'scale-figma', 'inset-bubble', 'progress-ring',
            'waffle', 'bubbles', 'treemap', 'treemap-bar', 'donut', 'bans',
            'line-smooth', 'line-straight', 'area-100', 'stream', 'small-multiples', 'slope'],

    sstsr: ['vbar-stacked', 'hbar', 'scale-figma', 'inset-bubble', 'progress-ring', 'waffle',
            'bubbles', 'treemap', 'treemap-bar', 'donut', 'bans',
            'line-smooth', 'line-straight', 'area-100', 'stream', 'small-multiples', 'slope'],

    // Compositional share (brands sum ~100%), per-brand per-month
    sov:   ['inset-bubble', 'area-100', 'treemap-bar', 'stream', 'hbar', 'scale-figma', 'bubbles',
            'line-smooth', 'line-straight', 'small-multiples',
            'treemap', 'donut', 'bans'],

    bss:   ['treemap-bar', 'area-100', 'stream', 'hbar', 'scale-figma', 'bubbles',
            'inset-bubble', 'line-smooth', 'line-straight', 'small-multiples',
            'treemap', 'donut', 'bans'],

    // Signed float — trend charts only (negatives break snapshot bars)
    vom:   ['line-smooth', 'line-straight', 'small-multiples', 'slope'],
    svt:   ['line-smooth', 'line-straight', 'small-multiples', 'slope'],

    // Likert 1–5 snapshot — no waffle/arc/progress-ring (not true ratios)
    bt:    ['scale-figma', 'hbar', 'bans', 'slope', 'ban'],
    nps:   ['hbar', 'scale-figma', 'bans', 'slope', 'ban'],
    sop:   ['scale-figma', 'hbar', 'bans', 'slope', 'ban'],
    dvtr:  ['hbar', 'scale-figma', 'bans', 'slope', 'ban'],

    // Unbounded positive snapshot
    cra:   ['hbar', 'scale-figma', 'bans', 'bubbles', 'treemap', 'treemap-bar',
            'donut', 'inset-bubble', 'ban'],

    // Brand attributes — multiscale blocked until multi-attribute data confirmed
    ba:    ['hbar', 'scale-figma', 'bans', 'ban'],
  };

  // ─── AGGREGATION RULES ────────────────────────────────────────────────────
  const INDICATOR_AGGREGATION = {
    sov:   'sum',
    bss:   'sum',
    sstsr: 'sum',
    cra:   'sum',
    vom:   'sum',
    eqr:   'avg',
    ebl:   'avg',
    svt:   'avg',
    bt:    'avg',
    nps:   'avg',
    sop:   'avg',
    dvtr:  'avg',
    tam:   'none',
    cagr:  'none',
    mcon:  'none',
    ba:    'none',
  };

  // ─── DESIGN SYSTEM ────────────────────────────────────────────────────────
  function buildDesign() {
    const sel = CONFIG.selectedColor;
    return {
      donut: {
        banValue:      { font: FONT_TITLE, style: 'italic', color: sel },
        banLabel:      { font: FONT_LIGHT, style: 'normal', color: COL_LIGHT_GREY },
        legendLabel:   { font: FONT_LIGHT, style: 'normal', color: COL_DARK_GREY },
        legendValue:   { font: FONT_LIGHT, style: 'normal', color: COL_LIGHT_GREY },
        legendSelected:{ font: FONT_LIGHT, style: 'normal', color: sel },
      },
      bar: {
        valueLabel:    { font: FONT_LIGHT, style: 'normal', color: COL_LIGHT_GREY },
        valueLabelSel: { font: FONT_BODY,  style: 'normal', color: sel },
        axisLabel:     { font: FONT_LIGHT, style: 'normal', color: COL_DARK_GREY },
        axisLabelSel:  { font: FONT_LIGHT, style: 'normal', color: sel },
      },
      line: {
        axisX:     { font: FONT_LIGHT, style: 'normal', color: COL_DARK_GREY },
        axisY:     { font: FONT_LIGHT, style: 'normal', color: COL_DARK_GREY },
        gridColor: COL_GRID,
      },
      ban: {
        value: { font: FONT_TITLE, style: 'italic', color: sel },
        label: { font: FONT_LIGHT, style: 'normal', color: COL_LIGHT_GREY },
      },
      bans: {
        primaryValue: { font: FONT_TITLE, size: 56, color: sel },
        compValue:    { font: FONT_TITLE, size: 32, color: '#808080' },
      },
      slope:         { lineP: { color: sel, width: 2.5 }, lineC: { color: '#808080', width: 1 } },
      area100:       { primary: sel, comp: '#808080' },
      stream:        { primary: sel, comp: '#808080' },
      treemap:       { primary: sel, comp: '#808080' },
      treemapBar:    { primary: sel, comp: '#808080' },
      bubbles:       { primary: sel, comp: '#808080' },
      insetBubble:   { primary: sel, comp: '#808080' },
      progressRing:  { primary: sel, comp: '#808080' },
      waffle:        { filled: sel, comp: '#808080', empty: '#4D4D4D', neg: '#D73F58' },
      hbar:          { primary: sel, comp: '#808080' },
      vbarStacked:   { primaryActive: sel, primaryPassive: '#E0697D', compActive: '#808080', compPassive: '#4D4D4D' },
      scaleFigma:    { primary: sel, comp: '#808080' },
      multiscale:    { primary: sel, comp: '#808080' },
      dotMatrix:     { filled: sel, comp: '#808080', passive: '#4D4D4D', neg: '#D73F58' },
      smallMultiples:{ primary: sel, comp: '#808080' },
      arc:           { fill: sel },
    };
  }

  // ─── STATE ────────────────────────────────────────────────────────────────
  let _selectedBrand  = null;  // clicked brand — opacity highlight only
  let _chartOverrides = {};    // { metricId: chartType, ... } — persisted to settings
  let _viewMode       = 'monthly'; // 'quarterly' | 'monthly'

  // ─── CHART RENDERERS ──────────────────────────────────────────────────────
  function renderDonut(el, data, selectedBrand, dashboard, D) {
    var rect = el.getBoundingClientRect();
    var W = rect.width  || window.innerWidth  || 480;
    var H = rect.height || window.innerHeight || 300;
    var legendW = Math.min(Math.floor(W * 0.38), 220);
    var available = W - legendW;
    var R = Math.min(H * 0.44, available * 0.5, H < 200 ? 60 : 150);
    var inner = R * 0.46;

    el.style.display        = 'flex';
    el.style.alignItems     = 'center';
    el.style.justifyContent = 'center';
    el.style.gap            = '20px';
    el.style.padding        = '12px';

    var ban = document.createElement('div');
    ban.style.cssText = 'display:flex;flex-direction:column;gap:6px;min-width:110px;';
    var sel = data.find(function(d) { return d.name === selectedBrand; }) || data[0];
    ban.innerHTML =
      '<div style="font-size:' + Math.max(36, R*0.5) + 'px;line-height:1;' +
      'color:' + D.banValue.color + ';font-family:' + D.banValue.font + ';' +
      'font-style:' + D.banValue.style + ';font-weight:400;">' +
      (sel ? sel.value.toFixed(1) : '--') + '</div>' +
      '<div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;' +
      'color:' + D.banLabel.color + ';font-family:' + D.banLabel.font + ';">' +
      (sel ? sel.name : '') + '</div>';
    el.appendChild(ban);

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width',  R * 2 + 24);
    svgEl.setAttribute('height', R * 2 + 24);
    svgEl.style.flexShrink = '0';
    el.appendChild(svgEl);

    var svg = d3.select(svgEl);
    var g   = svg.append('g').attr('transform', 'translate(' + (R+12) + ',' + (R+12) + ')');

    var arc      = d3.arc().innerRadius(inner).outerRadius(R).padAngle(0.028).cornerRadius(2);
    var arcHover = d3.arc().innerRadius(inner).outerRadius(R+7).padAngle(0.028).cornerRadius(2);
    var pie      = d3.pie().value(function(d) { return d.value; }).sort(null);

    var isTransparent = CONFIG.bgColor === 'transparent';
    var holeColor     = isTransparent ? 'transparent' : CONFIG.bgColor;

    g.selectAll('path').data(pie(data)).join('path')
      .attr('d', arc)
      .attr('fill', function(d) { return d.data.name === selectedBrand ? CONFIG.selectedColor : CONFIG.neutralColor; })
      .attr('stroke', holeColor)
      .attr('stroke-width', isTransparent ? 0 : 2)
      .attr('data-brand', function(d) { return d.data.name; })
      .style('cursor', 'pointer')
      .on('mouseover', function() { d3.select(this).attr('d', arcHover); })
      .on('mouseout',  function() { d3.select(this).attr('d', arc); })
      .on('click', async function(e, d) { await selectBrand(d.data.name, dashboard); });

    g.append('circle')
      .attr('r', inner - 2)
      .attr('fill', holeColor)
      .attr('fill-opacity', isTransparent ? 0 : 1);

    var legend = document.createElement('div');
    legend.style.cssText = 'display:flex;flex-direction:column;gap:7px;';
    data.forEach(function(d) {
      var isSelected  = d.name === selectedBrand;
      var labelStyle  = isSelected ? D.legendSelected : D.legendLabel;
      var item = document.createElement('div');
      item.setAttribute('data-brand', d.name);
      item.style.cssText =
        'display:flex;align-items:center;gap:7px;cursor:pointer;' +
        'font-size:11px;text-transform:uppercase;letter-spacing:0.06em;' +
        'color:' + labelStyle.color + ';font-family:' + labelStyle.font + ';';
      item.innerHTML =
        '<span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;' +
        'background:' + (isSelected ? CONFIG.selectedColor : CONFIG.neutralColor) + ';"></span>' +
        '<span style="flex:1;">' + d.name + '</span>' +
        '<span style="color:' + D.legendValue.color + ';font-family:' + D.legendValue.font + ';">' +
        d.value.toFixed(1) + '</span>';
      item.onclick = (function(name) {
        return async function() { await selectBrand(name, dashboard); };
      })(d.name);
      legend.appendChild(item);
    });
    el.appendChild(legend);
  }

  // ─── CHART: BAR ───────────────────────────────────────────────────────────
  function renderBar(el, data, selectedBrand, dashboard, D) {
    var rect = el.getBoundingClientRect();
    var W = rect.width  || 500;
    var H = rect.height || 300;

    var sorted = data.slice().sort(function(a, b) { return b.value - a.value; });
    var svg = d3.select(el).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .style('width', '100%').style('height', '100%').style('display', 'block');

    var isHorizontal = H < 220 || H < W * 0.35;

    if (isHorizontal) {
      var m = { top:8, right:48, bottom:8, left:88 };
      var w = W - m.left - m.right;
      var h = H - m.top  - m.bottom;
      var g = svg.append('g').attr('transform', 'translate(' + m.left + ',' + m.top + ')');

      var y = d3.scaleBand().domain(sorted.map(function(d) { return d.name; })).range([0, h]).padding(0.22);
      var x = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; }) * 1.15]).range([0, w]);

      g.selectAll('rect').data(sorted).join('rect')
        .attr('x', 0).attr('y', function(d) { return y(d.name); })
        .attr('width', function(d) { return x(d.value); })
        .attr('height', y.bandwidth())
        .attr('fill', function(d) { return d.name === selectedBrand ? CONFIG.selectedColor : CONFIG.neutralColor; })
        .attr('rx', 2).style('cursor', 'pointer')
        .on('click', async function(e, d) { await selectBrand(d.name, dashboard); });

      g.selectAll('.vl').data(sorted).join('text').attr('class', 'vl')
        .attr('x', function(d) { return x(d.value) + 4; })
        .attr('y', function(d) { return y(d.name) + y.bandwidth() / 2; })
        .attr('dominant-baseline', 'middle')
        .style('fill',        function(d) { return d.name === selectedBrand ? D.valueLabelSel.color : D.valueLabel.color; })
        .style('font-size',   '10px')
        .style('font-family', function(d) { return d.name === selectedBrand ? D.valueLabelSel.font : D.valueLabel.font; })
        .text(function(d) { return d.value.toFixed(1); });

      g.selectAll('.lbl').data(sorted).join('text').attr('class', 'lbl')
        .attr('x', -6).attr('y', function(d) { return y(d.name) + y.bandwidth() / 2; })
        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
        .style('fill',           function(d) { return d.name === selectedBrand ? D.axisLabelSel.color : D.axisLabel.color; })
        .style('font-size',      '10px')
        .style('font-family',    function(d) { return d.name === selectedBrand ? D.axisLabelSel.font : D.axisLabel.font; })
        .style('text-transform', 'uppercase').style('letter-spacing', '0.06em')
        .text(function(d) { return truncLabel(d.name, W); });
    } else {
      var m2 = { top:24, right:16, bottom:48, left:44 };
      var w2 = W - m2.left - m2.right;
      var h2 = H - m2.top  - m2.bottom;
      var g2 = svg.append('g').attr('transform', 'translate(' + m2.left + ',' + m2.top + ')');

      var x2 = d3.scaleBand().domain(sorted.map(function(d) { return d.name; })).range([0, w2]).padding(0.28);
      var y2 = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; }) * 1.15]).range([h2, 0]);

      g2.selectAll('rect').data(sorted).join('rect')
        .attr('x', function(d) { return x2(d.name); })
        .attr('y', function(d) { return y2(d.value); })
        .attr('width', x2.bandwidth())
        .attr('height', function(d) { return h2 - y2(d.value); })
        .attr('fill', function(d) { return d.name === selectedBrand ? CONFIG.selectedColor : CONFIG.neutralColor; })
        .attr('rx', 2).style('cursor', 'pointer')
        .on('click', async function(e, d) { await selectBrand(d.name, dashboard); });

      g2.selectAll('.vl').data(sorted).join('text').attr('class', 'vl')
        .attr('x', function(d) { return x2(d.name) + x2.bandwidth() / 2; })
        .attr('y', function(d) { return y2(d.value) - 5; })
        .attr('text-anchor', 'middle')
        .style('fill',        function(d) { return d.name === selectedBrand ? D.valueLabelSel.color : D.valueLabel.color; })
        .style('font-size',   '11px')
        .style('font-family', function(d) { return d.name === selectedBrand ? D.valueLabelSel.font : D.valueLabel.font; })
        .text(function(d) { return d.value.toFixed(1); });

      g2.append('g').attr('transform', 'translate(0,' + h2 + ')')
        .call(d3.axisBottom(x2).tickSize(0))
        .call(function(ax) { ax.select('.domain').remove(); })
        .selectAll('text')
        .style('fill',           function(d) { return d === selectedBrand ? D.axisLabelSel.color : D.axisLabel.color; })
        .style('font-size',      '10px')
        .style('font-family',    function(d) { return d === selectedBrand ? D.axisLabelSel.font : D.axisLabel.font; })
        .style('text-transform', 'uppercase').style('letter-spacing', '0.06em')
        .attr('dy', '1.4em')
        .text(function(d) { return truncLabel(d, W); });
    }
  }

  // ─── CHART: LINE ──────────────────────────────────────────────────────────
  function renderLine(el, data, selectedBrand, dashboard, D) {
    var rect = el.getBoundingClientRect();
    var W = rect.width  || 500;
    var H = rect.height || 300;
    var m = { top:20, right:88, bottom:40, left:40 };
    var w = W - m.left - m.right;
    var h = H - m.top  - m.bottom;

    if (!data[0] || !data[0].period) { renderBar(el, data, selectedBrand, dashboard, buildDesign().bar); return; }

    var brands  = [];
    var periods = [];
    data.forEach(function(d) {
      if (brands.indexOf(d.name)   === -1) brands.push(d.name);
      if (periods.indexOf(d.period)=== -1) periods.push(d.period);
    });
    periods.sort();

    var grouped = brands.map(function(brand) {
      return {
        name: brand,
        values: periods.map(function(period) {
          var match = data.find(function(d) { return d.name === brand && d.period === period; });
          return { period: period, value: match ? match.value : null };
        }).filter(function(d) { return d.value !== null; }),
      };
    });

    var svg = d3.select(el).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .style('width', '100%').style('height', '100%').style('display', 'block');
    var g = svg.append('g').attr('transform', 'translate(' + m.left + ',' + m.top + ')');

    var x = d3.scalePoint().domain(periods).range([0, w]).padding(0.1);
    var y = d3.scaleLinear().domain([
      d3.min(data, function(d) { return d.value; }) * 0.95,
      d3.max(data, function(d) { return d.value; }) * 1.1,
    ]).range([h, 0]);

    var line = d3.line().defined(function(d) { return d.value !== null; })
      .x(function(d) { return x(d.period); })
      .y(function(d) { return y(d.value); })
      .curve(d3.curveMonotoneX);

    grouped.filter(function(b) { return b.name !== selectedBrand; }).forEach(function(brand) {
      g.append('path').datum(brand.values)
        .attr('fill', 'none').attr('stroke', CONFIG.neutralColor)
        .attr('stroke-width', 1).attr('opacity', 0.5).attr('d', line)
        .style('pointer-events', 'none');
      g.append('path').datum(brand.values)
        .attr('fill', 'none').attr('stroke', 'transparent')
        .attr('stroke-width', 18).attr('d', line)
        .style('cursor', 'pointer')
        .on('click', (function(b) { return async function() { await selectBrand(b.name, dashboard); }; })(brand));
    });

    var selBrand = grouped.find(function(b) { return b.name === selectedBrand; });
    if (selBrand) {
      g.append('path').datum(selBrand.values)
        .attr('fill', 'none').attr('stroke', CONFIG.selectedColor)
        .attr('stroke-width', 2.5).attr('d', line).style('pointer-events', 'none');
      g.append('path').datum(selBrand.values)
        .attr('fill', 'none').attr('stroke', 'transparent')
        .attr('stroke-width', 18).attr('d', line).style('cursor', 'pointer')
        .on('click', async function() { await selectBrand(selBrand.name, dashboard); });
      g.selectAll('.dot').data(selBrand.values).join('circle').attr('class', 'dot')
        .attr('cx', function(d) { return x(d.period); })
        .attr('cy', function(d) { return y(d.value); })
        .attr('r', 3.5).attr('fill', CONFIG.selectedColor).style('cursor', 'pointer')
        .on('click', async function() { await selectBrand(selBrand.name, dashboard); });
    }

    var placedY = [];
    grouped.forEach(function(brand) {
      var last = brand.values[brand.values.length - 1];
      if (!last) return;
      var ly = y(last.value);
      placedY.forEach(function(py) { if (Math.abs(py - ly) < 12) ly = py + 12; });
      placedY.push(ly);
      g.append('text')
        .attr('x', x(last.period) + 6).attr('y', ly)
        .attr('dominant-baseline', 'middle')
        .style('fill',           brand.name === selectedBrand ? CONFIG.selectedColor : CONFIG.neutralColor)
        .style('font-size',      '10px').style('font-family', FONT_LIGHT)
        .style('text-transform', 'uppercase').style('letter-spacing', '0.06em')
        .style('cursor', 'pointer')
        .text(truncLabel(brand.name, W))
        .on('click', (function(b) { return async function() { await selectBrand(b.name, dashboard); }; })(brand));
    });

    g.append('g').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickSize(3))
      .call(function(ax) { ax.select('.domain').attr('stroke', D.gridColor); })
      .selectAll('text')
      .style('fill', D.axisX.color).style('font-size', '11px')
      .style('font-family', D.axisX.font)
      .style('text-transform', 'uppercase').style('letter-spacing', '0.06em');

    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-w))
      .call(function(ax) {
        ax.select('.domain').remove();
        ax.selectAll('.tick line').attr('stroke', D.gridColor).attr('stroke-dasharray', '3,3');
      })
      .selectAll('text').style('fill', D.axisY.color).style('font-size', '11px')
      .style('font-family', D.axisY.font);
  }

  // ─── CHART: BAN ───────────────────────────────────────────────────────────
  function renderBAN(el, data, selectedBrand, D) {
    var sel = (Array.isArray(data) ? data.find(function(d) { return d.name === selectedBrand; }) || data[0] : null);
    var value = sel ? sel.value : (data && !Array.isArray(data) ? data : null);
    var rect = el.getBoundingClientRect();
    var W = rect.width || window.innerWidth || 200;
    var H = rect.height || window.innerHeight || 200;
    var fontSize = Math.min(Math.max(H * 0.48, 48), 180);

    el.style.display        = 'flex';
    el.style.flexDirection  = 'column';
    el.style.alignItems     = 'center';
    el.style.justifyContent = 'center';
    el.style.height         = '100%';
    el.style.gap            = '8px';

    var displayVal = value !== null && value !== undefined ? parseFloat(value).toFixed(2) : '--';

    el.innerHTML =
      '<div style="font-size:' + fontSize + 'px;font-weight:400;line-height:1;' +
      'color:' + D.value.color + ';font-family:' + D.value.font + ';font-style:' + D.value.style + ';">' +
      displayVal + '</div>';
  }

  // ─── BANs ─────────────────────────────────────────────────────────────────
  function renderBANs(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) { return b.value - a.value; }),
    ];

    var primaryFontSize = Math.min(Math.max(Math.floor(H * 0.52), 48), 160);
    var compFontSize    = Math.min(Math.max(Math.floor(H * 0.30), 28), 100);
    var labelFontSize   = Math.max(Math.floor(H * 0.055), 9);
    var pad             = Math.max(10, Math.floor(Math.min(W, H) * 0.03));

    el.style.display        = 'flex';
    el.style.alignItems     = 'center';
    el.style.flexWrap       = 'wrap';
    el.style.padding        = pad + 'px ' + Math.max(16, pad) + 'px';
    el.style.gap            = Math.max(14, Math.floor(W * 0.025)) + 'px';
    el.style.height         = '100%';
    el.style.boxSizing      = 'border-box';

    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var wrap = document.createElement('div');
      if (isPrimary && sorted.length > 1) {
        var sepPad = Math.max(14, Math.floor(W * 0.025));
        wrap.style.cssText = 'padding-right:' + sepPad + 'px;margin-right:' + sepPad + 'px;border-right:1px solid var(--grey-700);';
      }

      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:' + FONT_LIGHT + ';font-size:' + labelFontSize + 'px;' +
        'text-transform:uppercase;letter-spacing:0.10em;margin-bottom:4px;' +
        'color:' + (isPrimary ? D.primaryValue.color : D.compValue.color) + ';';
      lbl.textContent = d.name;

      var val = document.createElement('div');
      val.setAttribute('data-brand', d.name);
      val.style.cssText = 'font-family:' + D.primaryValue.font + ';font-style:italic;' +
        'font-size:' + (isPrimary ? primaryFontSize : compFontSize) + 'px;' +
        'color:' + (isPrimary ? D.primaryValue.color : D.compValue.color) + ';line-height:0.90;';
      val.textContent = d.value.toFixed(2);

      wrap.appendChild(lbl);
      wrap.appendChild(val);
      el.appendChild(wrap);
    });
  }

  // ─── LINE CHART (straight + smooth) ──────────────────────────────────────
  function renderLineChart(el, data, primary, straight) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var mT = 12, mR = 100, mB = 28, mL = 38;
    var iW = W - mL - mR, iH = H - mT - mB;

    var brands = Object.keys(data[0]).filter(function(k) { return k !== 'period'; });
    var periods = data.map(function(d) { return d.period; });

    var allVals = [];
    brands.forEach(function(b) { data.forEach(function(d) { if (d[b] != null) allVals.push(d[b]); }); });
    var vMin = d3.min(allVals), vMax = d3.max(allVals);
    var yPad = (vMax - vMin) * 0.12 || 1;

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);
    var g = svg.append('g').attr('transform', 'translate(' + mL + ',' + mT + ')');

    var x = d3.scalePoint().domain(periods).range([0, iW]).padding(0.1);
    var y = d3.scaleLinear().domain([vMin - yPad, vMax + yPad]).range([iH, 0]);
    var curve = straight ? d3.curveLinear : d3.curveMonotoneX;
    var lineFn = d3.line()
      .defined(function(d) { return d.v != null; })
      .x(function(d) { return x(d.p); })
      .y(function(d) { return y(d.v); })
      .curve(curve);

    if (y(0) >= 0 && y(0) <= iH) {
      g.append('line').attr('x1',0).attr('x2',iW).attr('y1',y(0)).attr('y2',y(0))
        .attr('stroke','#808080').attr('stroke-width',1).attr('opacity',0.55);
    }

    var sorted = sortWithPrimaryLast(brands.map(function(b) { return { name: b }; }), primary).map(function(d) { return d.name; });
    var placedY = [];

    sorted.forEach(function(b) {
      var vals = data.map(function(d) { return { p: d.period, v: d[b] }; });
      var isPrimary = b === primary;
      var col = isPrimary ? CONFIG.selectedColor : CONFIG.neutralColor;
      var sw  = isPrimary ? 2 : 1;

      var path = g.append('path').datum(vals)
        .attr('fill','none').attr('stroke',col).attr('stroke-width',sw)
        .attr('opacity', isPrimary ? 1 : 0.7).attr('d', lineFn);

      var len = path.node().getTotalLength();
      path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
        .transition().duration(800).ease(d3.easeLinear).attr('stroke-dashoffset', 0);

      [vals[0], vals[vals.length - 1]].forEach(function(pt) {
        if (pt.v == null) return;
        g.append('circle').attr('cx', x(pt.p)).attr('cy', y(pt.v))
          .attr('r', 0).attr('fill', col).attr('data-brand', b).style('cursor','pointer')
          .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(b))
          .transition().duration(400).delay(500).ease(d3.easeBackOut)
          .attr('r', isPrimary ? 3 : 2);
      });

      var lastPt = vals[vals.length - 1];
      if (lastPt.v != null) {
        var labelY = y(lastPt.v) + 4;
        placedY.forEach(function(py) { if (Math.abs(py - labelY) < 12) labelY = py + 12; });
        placedY.push(labelY);
        g.append('text').attr('x', iW + 6).attr('y', labelY)
          .attr('text-anchor','start').attr('dominant-baseline','auto')
          .style('font-size','9px').style('font-family', FONT_LIGHT)
          .style('fill', col).style('text-transform','uppercase')
          .text(b.slice(0,4))
          .attr('opacity',0).transition().duration(300).delay(500).attr('opacity',1);
      }
    });

    g.append('g').attr('transform','translate(0,' + iH + ')')
      .call(d3.axisBottom(x).tickSize(0).tickPadding(6))
      .call(function(ax) { ax.select('.domain').remove(); })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px')
      .style('font-family', FONT_LIGHT).style('text-transform','uppercase');

    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-iW))
      .call(function(ax) {
        ax.select('.domain').remove();
        ax.selectAll('.tick line').attr('stroke', COL_GRID).attr('opacity',0.35).attr('stroke-dasharray','2,3');
      })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px')
      .style('font-family', FONT_LIGHT);

    el.appendChild(svgEl);
  }

  // ─── SLOPE CHART ──────────────────────────────────────────────────────────
  function renderSlope(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    // Support both long format (two periods → derive v1/v2) and explicit v1/v2
    var plotData = data;
    if (data[0] && data[0].period !== undefined && data[0].v1 === undefined) {
      var periods = [];
      data.forEach(function(d) { if (d.period && periods.indexOf(d.period) === -1) periods.push(d.period); });
      periods.sort();
      if (periods.length >= 2) {
        var p1 = periods[0], p2 = periods[periods.length - 1];
        var brands = [];
        data.forEach(function(d) { if (brands.indexOf(d.name) === -1) brands.push(d.name); });
        plotData = brands.map(function(b) {
          var r1 = data.find(function(d) { return d.name === b && d.period === p1; });
          var r2 = data.find(function(d) { return d.name === b && d.period === p2; });
          return { name: b, v1: r1 ? r1.value : null, v2: r2 ? r2.value : null };
        }).filter(function(d) { return d.v1 !== null && d.v2 !== null; });
      }
    }

    var mT = 32, mR = 90, mB = 20, mL = 90;
    var iW = W - mL - mR, iH = H - mT - mB;
    var allVals = plotData.flatMap(function(d) { return [d.v1, d.v2]; });
    var y = d3.scaleLinear().domain([0, d3.max(allVals) * 1.1]).range([iH, 0]);

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var g = d3.select(svgEl).append('g').attr('transform', 'translate(' + mL + ',' + mT + ')');

    [[0,'Period 1'],[iW,'Period 2']].forEach(function(pair) {
      var px = pair[0], lbl = pair[1];
      g.append('line').attr('x1',px).attr('x2',px).attr('y1',0).attr('y2',iH)
        .attr('stroke','var(--grey-700)').attr('stroke-width',0.5);
      g.append('text').attr('x',px).attr('y',-10).attr('text-anchor','middle')
        .style('font-size','9px').style('font-family',FONT_LIGHT)
        .style('text-transform','uppercase').style('fill','var(--grey-300)').text(lbl);
    });

    var sorted = sortWithPrimaryLast(plotData, primary);
    var leftPlaced = [], rightPlaced = [];

    function placeLabel(placed, yVal) {
      var ly = yVal;
      placed.forEach(function(py) { if (Math.abs(py - ly) < 11) ly = py + 11; });
      placed.push(ly);
      return ly;
    }

    sorted.forEach(function(d) {
      var isPrimary = d.name === primary;
      var col = isPrimary ? D.lineP.color : D.lineC.color;
      var sw  = isPrimary ? D.lineP.width : D.lineC.width;
      var r   = isPrimary ? 5 : 4;
      var y1  = y(d.v1), y2 = y(d.v2);

      var ln = g.append('line').attr('x1',0).attr('y1',y1).attr('x2',0).attr('y2',y1)
        .attr('stroke',col).attr('stroke-width',sw).attr('data-brand',d.name)
        .style('cursor','pointer')
        .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name));
      ln.transition().duration(600).ease(d3.easeCubicOut).attr('x2',iW).attr('y2',y2);

      [[0,y1],[iW,y2]].forEach(function(pt) {
        g.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',0)
          .attr('fill',col).attr('data-brand',d.name).style('cursor','pointer')
          .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name))
          .transition().duration(400).delay(300).ease(d3.easeBackOut).attr('r',r);
      });

      var ly1 = placeLabel(leftPlaced, y1);
      g.append('text').attr('x',-9).attr('y',ly1+4).attr('text-anchor','end')
        .style('font-size', isPrimary ? '10px':'8.5px').style('font-family',FONT_LIGHT)
        .style('fill',col).text(d.name.slice(0,4).toUpperCase() + ' ' + d.v1.toFixed(2))
        .attr('opacity',0).transition().duration(300).delay(400).attr('opacity',1);

      var ly2 = placeLabel(rightPlaced, y2);
      g.append('text').attr('x',iW+9).attr('y',ly2+4).attr('text-anchor','start')
        .style('font-size', isPrimary ? '10px':'8.5px').style('font-family',FONT_LIGHT)
        .style('fill',col).text(d.name.slice(0,4).toUpperCase() + ' ' + d.v2.toFixed(2))
        .attr('opacity',0).transition().duration(300).delay(400).attr('opacity',1);
    });

    el.appendChild(svgEl);
  }

  // ─── STACKED 100% AREA ───────────────────────────────────────────────────
  function renderArea100(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var mT = 10, mR = 72, mB = 28, mL = 32;
    var iW = W - mL - mR, iH = H - mT - mB;

    var brands = Object.keys(data[0]).filter(function(k) { return k !== 'period'; });
    var brandOrder = [
      ...brands.filter(function(b) { return b !== primary; }).sort(function(a,b) {
        return d3.mean(data, function(d) { return d[b] || 0; }) - d3.mean(data, function(d) { return d[a] || 0; });
      }),
      primary,
    ];

    var stack  = d3.stack().keys(brandOrder).offset(d3.stackOffsetExpand);
    var series = stack(data);
    var x = d3.scalePoint().domain(data.map(function(d) { return d.period; })).range([0, iW]).padding(0.1);
    var y = d3.scaleLinear().domain([0, 1]).range([iH, 0]);
    var area = d3.area()
      .x(function(d) { return x(d.data.period); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); })
      .curve(d3.curveMonotoneX);

    var opacities = [0.75, 0.60, 0.45, 0.32];
    var compBrands = brandOrder.filter(function(b) { return b !== primary; });

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var g = d3.select(svgEl).append('g').attr('transform', 'translate(' + mL + ',' + mT + ')');

    series.forEach(function(s) {
      var isPrimary = s.key === primary;
      var compRank  = compBrands.indexOf(s.key);
      var fillOp    = isPrimary ? 0.78 : (opacities[compRank] !== undefined ? opacities[compRank] : 0.25);
      g.append('path').datum(s)
        .attr('fill', isPrimary ? D.primary : D.comp)
        .attr('fill-opacity', fillOp)
        .attr('stroke','#1A1A1A').attr('stroke-width',0.5)
        .attr('data-brand', s.key).attr('d', area).style('cursor','pointer')
        .on('click', (function(key) { return async function() { await selectBrand(key, _dashboard); }; })(s.key));
    });

    var placedY = [];
    brandOrder.slice().reverse().forEach(function(b) {
      var lastRow = series.find(function(s) { return s.key === b; });
      if (!lastRow) return;
      var last = lastRow[lastRow.length - 1];
      var midY = y((last[0] + last[1]) / 2);
      if ((last[1] - last[0]) < 0.04) return;
      var ly = midY;
      placedY.forEach(function(py) { if (Math.abs(py - ly) < 12) ly = py + 12; });
      placedY.push(ly);
      g.append('text').attr('x', iW + 5).attr('y', ly + 4).attr('text-anchor','start')
        .style('font-size','9px').style('font-family', FONT_LIGHT)
        .style('fill', b === primary ? D.primary : D.comp)
        .style('text-transform','uppercase').text(b.slice(0,4));
    });

    g.append('g').attr('transform','translate(0,' + iH + ')')
      .call(d3.axisBottom(x).tickSize(0).tickPadding(6))
      .call(function(ax) { ax.select('.domain').remove(); })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px')
      .style('font-family', FONT_LIGHT).style('text-transform','uppercase');

    g.append('g')
      .call(d3.axisLeft(y).ticks(3).tickSize(-iW).tickFormat(d3.format('.0%')))
      .call(function(ax) {
        ax.select('.domain').remove();
        ax.selectAll('.tick line').attr('stroke', COL_GRID).attr('opacity',0.35).attr('stroke-dasharray','2,3');
      })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px')
      .style('font-family', FONT_LIGHT);

    el.appendChild(svgEl);
  }

  // ─── STREAM GRAPH ─────────────────────────────────────────────────────────
  function renderStream(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var mT = 10, mR = 16, mB = 28, mL = 16;
    var iW = W - mL - mR, iH = H - mT - mB;

    var brands = Object.keys(data[0]).filter(function(k) { return k !== 'period'; });
    var brandOrder = [
      ...brands.filter(function(b) { return b !== primary; }).sort(function(a,b) {
        return d3.mean(data, function(d) { return d[b] || 0; }) - d3.mean(data, function(d) { return d[a] || 0; });
      }),
      primary,
    ];

    var stack  = d3.stack().keys(brandOrder).offset(d3.stackOffsetSilhouette);
    var series = stack(data);
    var x = d3.scalePoint().domain(data.map(function(d) { return d.period; })).range([0, iW]).padding(0.1);
    var allY = series.flatMap(function(s) { return s.flatMap(function(d) { return [d[0], d[1]]; }); });
    var y = d3.scaleLinear().domain([d3.min(allY), d3.max(allY)]).range([iH, 0]);
    var area = d3.area()
      .x(function(d) { return x(d.data.period); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); })
      .curve(d3.curveBasis);

    var opacities = [0.75, 0.60, 0.45, 0.32];
    var compBrands = brandOrder.filter(function(b) { return b !== primary; });

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var g = d3.select(svgEl).append('g').attr('transform', 'translate(' + mL + ',' + mT + ')');

    series.forEach(function(s, i) {
      var isPrimary = s.key === primary;
      var compRank  = compBrands.indexOf(s.key);
      var fillOp    = isPrimary ? 0.78 : (opacities[compRank] !== undefined ? opacities[compRank] : 0.25);
      g.append('path').datum(s)
        .attr('fill', isPrimary ? D.primary : D.comp)
        .attr('fill-opacity', 0).attr('data-brand', s.key).attr('d', area).style('cursor','pointer')
        .on('click', (function(key) { return async function() { await selectBrand(key, _dashboard); }; })(s.key))
        .transition().duration(600).delay(i * 80).ease(d3.easeCubicOut).attr('fill-opacity', fillOp);
    });

    var midIdx = Math.floor(data.length / 2);
    series.forEach(function(s) {
      var mid = s[midIdx];
      var bandH = Math.abs(y(mid[0]) - y(mid[1]));
      if (bandH < 20) return;
      var cy = y((mid[0] + mid[1]) / 2);
      g.append('text').attr('x', x(data[midIdx].period)).attr('y', cy + 4)
        .attr('text-anchor','middle')
        .style('font-size','9px').style('font-family', FONT_LIGHT)
        .style('fill', COL_LIGHT_GREY).text(s.key.slice(0,4).toUpperCase());
    });

    g.append('g').attr('transform','translate(0,' + iH + ')')
      .call(d3.axisBottom(x).tickSize(0).tickPadding(6))
      .call(function(ax) { ax.select('.domain').remove(); })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px')
      .style('font-family', FONT_LIGHT).style('text-transform','uppercase');

    el.appendChild(svgEl);
  }

  // ─── TREEMAP ──────────────────────────────────────────────────────────────
  function renderTreemap(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    var root = d3.hierarchy({ children: data }).sum(function(d) { return d.value; });
    d3.treemap().size([W, H]).padding(2).round(true)(root);

    var nodes  = root.leaves();
    var sorted = nodes.slice().sort(function(a,b) { return b.value - a.value; });

    sorted.forEach(function(node, i) {
      var isPrimary = node.data.name === primary;
      var cellW = node.x1 - node.x0, cellH = node.y1 - node.y0;
      var cell = svg.append('g').attr('transform','translate(' + node.x0 + ',' + node.y0 + ')');

      cell.append('rect').attr('width',cellW).attr('height',cellH)
        .attr('fill', isPrimary ? D.primary : D.comp)
        .attr('fill-opacity', isPrimary ? 1 : 0.72)
        .attr('data-brand', node.data.name).style('cursor','pointer')
        .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(node.data.name))
        .attr('transform-origin', (cellW/2) + 'px ' + (cellH/2) + 'px')
        .attr('transform','scale(0)')
        .transition().duration(500).delay(i*30).ease(d3.easeCubicOut).attr('transform','scale(1)');

      if (cellW > 40 && cellH > 20)
        cell.append('text').attr('x',5).attr('y',14)
          .style('font-size', Math.min(11, cellW*0.22) + 'px')
          .style('font-family', FONT_LIGHT).style('text-transform','uppercase')
          .style('fill', COL_LIGHT_GREY).text(node.data.name.slice(0,4));
      if (cellW > 40 && cellH > 30)
        cell.append('text').attr('x',5).attr('y',26)
          .style('font-size', Math.min(10, cellW*0.20) + 'px')
          .style('font-family', FONT_TITLE).style('font-style','italic')
          .style('fill', COL_LIGHT_GREY).text(node.data.value.toFixed(2));
    });

    el.appendChild(svgEl);
  }

  // ─── TREEMAP BAR ──────────────────────────────────────────────────────────
  function renderTreemapBar(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 72;
    if (!data || !data.length) { showEmpty(el); return; }

    H = Math.min(Math.max(Math.floor(H * 0.60), 50), 110);
    var gap = 3;
    var sorted = data.slice().sort(function(a,b) { return b.value - a.value; });
    var total  = d3.sum(sorted, function(d) { return d.value; });
    var usableW = W - gap * (sorted.length - 1);
    var opacities  = [1.0, 0.82, 0.65, 0.50, 0.38];
    var compBrands = sorted.filter(function(d) { return d.name !== primary; });

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    var cx = 0;
    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var segW      = (d.value / total) * usableW;
      var compRank  = compBrands.findIndex(function(c) { return c.name === d.name; });
      var op        = isPrimary ? 1 : (opacities[compRank] !== undefined ? opacities[compRank] : 0.25);

      svg.append('rect')
        .attr('x', cx).attr('y',0).attr('width',0).attr('height',H)
        .attr('rx', (i === 0 || i === sorted.length-1) ? 4 : 0)
        .attr('fill', isPrimary ? D.primary : D.comp)
        .attr('fill-opacity', op).attr('data-brand', d.name).style('cursor','pointer')
        .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name))
        .transition().duration(600).ease(d3.easeCubicOut).attr('width', segW);

      if (segW > 44) {
        var lx = cx + segW / 2;
        svg.append('text').attr('x',lx).attr('y',H/2 - 5).attr('text-anchor','middle')
          .style('font-size', Math.min(11, segW*0.20) + 'px')
          .style('font-family', FONT_LIGHT).style('text-transform','uppercase')
          .style('fill', COL_LIGHT_GREY).text(d.name.slice(0,4));
        svg.append('text').attr('x',lx).attr('y',H/2 + 9).attr('text-anchor','middle')
          .style('font-size', Math.min(12, segW*0.20) + 'px')
          .style('font-family', FONT_TITLE).style('font-style','italic')
          .style('fill', COL_LIGHT_GREY).text(d.value.toFixed(2));
      }
      cx += segW + gap;
    });

    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.appendChild(svgEl);
  }

  // ─── BUBBLES ──────────────────────────────────────────────────────────────
  function renderBubbles(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var primaryData = data.find(function(d) { return d.name === primary; });
    var competitors = data.filter(function(d) { return d.name !== primary; })
      .sort(function(a, b) { return b.value - a.value; });

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    var leftW = Math.floor(W * 0.42);
    var rightW = W - leftW;

    // Subtle divider
    svg.append('line')
      .attr('x1', leftW).attr('y1', H * 0.08)
      .attr('x2', leftW).attr('y2', H * 0.92)
      .attr('stroke', COL_GRID).attr('stroke-width', 1).attr('opacity', 0.4);

    // Primary hero circle
    if (primaryData) {
      var pR = Math.min(leftW / 2 - 14, H / 2 - 28);
      pR = Math.max(pR, 20);
      var pX = leftW / 2, pY = H / 2;
      var pg = svg.append('g').attr('transform', 'translate(' + pX + ',' + pY + ')');
      pg.append('circle').attr('r', 0)
        .attr('fill', D.primary).attr('fill-opacity', 1)
        .attr('data-brand', primaryData.name).style('cursor','pointer')
        .on('click', (function(nm) { return async function() { await selectBrand(nm, _dashboard); }; })(primaryData.name))
        .transition().duration(500).ease(d3.easeBackOut).attr('r', pR);
      if (pR > 16)
        pg.append('text').attr('y', pR > 32 ? -7 : 4).attr('text-anchor','middle')
          .style('font-size', Math.min(13, pR * 0.26) + 'px')
          .style('font-family', FONT_LIGHT).style('text-transform','uppercase')
          .style('fill', COL_LIGHT_GREY).style('pointer-events','none')
          .text(primaryData.name.length > 7 ? primaryData.name.slice(0, 7) : primaryData.name);
      if (pR > 32)
        pg.append('text').attr('y', 10).attr('text-anchor','middle')
          .style('font-size', Math.min(16, pR * 0.28) + 'px')
          .style('font-family', FONT_TITLE).style('font-style','italic')
          .style('fill', COL_LIGHT_GREY).style('pointer-events','none')
          .text(primaryData.value.toFixed(2));
    }

    // Competitor 2-column grid
    var nComp = competitors.length;
    if (nComp > 0) {
      var nCols = 2;
      var nRows = Math.ceil(nComp / nCols);
      var cellW = rightW / nCols;
      var cellH = H / nRows;
      var maxR = Math.min(cellW / 2 - 8, cellH / 2 - 14);
      var primaryVal = primaryData ? Math.abs(primaryData.value) : 1;

      competitors.forEach(function(comp, i) {
        var col = i % nCols;
        var row = Math.floor(i / nCols);
        var cx = leftW + col * cellW + cellW / 2;
        var cy = row * cellH + cellH / 2;
        var ratio = primaryVal > 0 ? Math.sqrt(Math.abs(comp.value) / primaryVal) : 0.5;
        var r = Math.min(maxR, Math.max(6, pR * ratio));

        var cg = svg.append('g').attr('transform', 'translate(' + cx + ',' + cy + ')');
        cg.append('circle').attr('r', 0)
          .attr('fill', D.comp).attr('fill-opacity', 0.72)
          .attr('data-brand', comp.name).style('cursor','pointer')
          .on('click', (function(nm) { return async function() { await selectBrand(nm, _dashboard); }; })(comp.name))
          .transition().duration(400).delay(i * 50 + 100).ease(d3.easeBackOut).attr('r', r);
        if (r > 14)
          cg.append('text').attr('y', r > 22 ? -4 : 4).attr('text-anchor','middle')
            .style('font-size', Math.min(10, r * 0.34) + 'px')
            .style('font-family', FONT_LIGHT).style('text-transform','uppercase')
            .style('fill', COL_LIGHT_GREY).style('pointer-events','none')
            .text(comp.name.slice(0, 4));
        if (r > 22)
          cg.append('text').attr('y', 10).attr('text-anchor','middle')
            .style('font-size', Math.min(9, r * 0.26) + 'px')
            .style('font-family', FONT_TITLE).style('font-style','italic')
            .style('fill', COL_LIGHT_GREY).style('pointer-events','none')
            .text(comp.value.toFixed(2));
      });
    }

    el.appendChild(svgEl);
  }

  // ─── INSET BUBBLE ─────────────────────────────────────────────────────────
  function renderInsetBubble(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var reference = d3.max(data, function(d) { return Math.abs(d.value); }) || 100;

    var primaryData = data.find(function(d) { return d.name === primary; });
    var competitors = data.filter(function(d) { return d.name !== primary; })
      .sort(function(a, b) { return b.value - a.value; });

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    var leftW = Math.floor(W * 0.42);
    var rightW = W - leftW;

    // Subtle divider
    svg.append('line')
      .attr('x1', leftW).attr('y1', H * 0.08)
      .attr('x2', leftW).attr('y2', H * 0.92)
      .attr('stroke', COL_GRID).attr('stroke-width', 1).attr('opacity', 0.4);

    // Reference caption
    svg.append('text').attr('x', W - 4).attr('y', 13).attr('text-anchor', 'end')
      .style('font-size', '8px').style('font-family', FONT_LIGHT).style('fill', COL_DARK_GREY)
      .text('○ = max ' + reference.toFixed(1));

    function drawInset(cx, cy, outerR, d, col, opacity, delay) {
      var rInner = Math.min(outerR * 0.97, Math.max(outerR * Math.sqrt(Math.abs(d.value) / reference), 2.5));
      svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', outerR)
        .attr('fill', 'none').attr('stroke', COL_GRID).attr('stroke-width', 1)
        .attr('data-brand', d.name);
      svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 0)
        .attr('fill', col).attr('fill-opacity', opacity)
        .attr('data-brand', d.name).style('cursor', 'pointer')
        .on('click', (function(nm) { return async function() { await selectBrand(nm, _dashboard); }; })(d.name))
        .transition().duration(450).delay(delay).ease(d3.easeBackOut).attr('r', rInner);
      if (rInner >= 12) {
        svg.append('text').attr('x', cx).attr('y', cy + 4).attr('text-anchor', 'middle')
          .style('font-size', Math.min(14, rInner * 0.38) + 'px')
          .style('font-family', FONT_TITLE).style('font-style', 'italic')
          .style('fill', COL_LIGHT_GREY).style('pointer-events', 'none')
          .text(d.value.toFixed(1));
      } else {
        svg.append('line')
          .attr('x1', cx).attr('y1', cy - rInner - 2)
          .attr('x2', cx).attr('y2', cy - outerR - 8)
          .attr('stroke', col).attr('stroke-width', 0.8)
          .attr('stroke-dasharray', '2,2').attr('opacity', 0.65);
        svg.append('text').attr('x', cx).attr('y', cy - outerR - 11)
          .attr('text-anchor', 'middle')
          .style('font-size', '9px').style('font-family', FONT_TITLE).style('font-style', 'italic')
          .style('fill', col).attr('data-brand', d.name)
          .text(d.value.toFixed(1));
      }
      return rInner;
    }

    // Primary hero inset circle
    if (primaryData) {
      var pR = Math.min(leftW / 2 - 14, H / 2 - 30);
      pR = Math.max(pR, 20);
      var pX = leftW / 2, pY = H / 2;
      drawInset(pX, pY, pR, primaryData, D.primary, 1, 0);
      svg.append('text').attr('x', pX).attr('y', pY + pR + 16)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px').style('font-family', FONT_LIGHT)
        .style('text-transform', 'uppercase').style('fill', D.primary)
        .attr('data-brand', primaryData.name)
        .text(primaryData.name.length > 7 ? primaryData.name.slice(0, 7) : primaryData.name);
    }

    // Competitors in 2-col grid
    var nComp = competitors.length;
    if (nComp > 0) {
      var nCols = nComp <= 2 ? nComp : 2;
      var nRows = Math.ceil(nComp / nCols);
      var cellW = rightW / nCols;
      var cellH = H / nRows;
      var maxR = Math.min(cellW / 2 - 8, cellH / 2 - 18);
      maxR = Math.max(maxR, 10);

      competitors.forEach(function(comp, i) {
        var col = i % nCols;
        var row = Math.floor(i / nCols);
        var cx = leftW + col * cellW + cellW / 2;
        var cy = row * cellH + cellH / 2;
        var cR = Math.max(maxR * 0.80, 10);
        drawInset(cx, cy, cR, comp, D.comp, 0.78, i * 50 + 100);
        svg.append('text').attr('x', cx).attr('y', cy + cR + 13)
          .attr('text-anchor', 'middle')
          .style('font-size', '9px').style('font-family', FONT_LIGHT)
          .style('text-transform', 'uppercase').style('fill', D.comp)
          .attr('data-brand', comp.name)
          .text(comp.name.slice(0, 4));
      });
    }

    el.style.overflow = 'hidden';
    el.appendChild(svgEl);
  }

  // ─── PROGRESS RING ────────────────────────────────────────────────────────
  function renderProgressRing(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var reference = 1; // eqr/ebl values are 0–1
    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) { return b.value - a.value; }),
    ];
    var n = sorted.length;
    var slotW = W / n;
    var R  = Math.min(H < 200 ? 40 : 70, slotW / 2 - 10);
    var sw = Math.max(8, R * 0.22);
    var cy = Math.max(R + 8, Math.min(H / 2, H - R - 22));

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    var arcTrack = d3.arc().innerRadius(R-sw).outerRadius(R).startAngle(-Math.PI).endAngle(Math.PI);
    var arcFill  = d3.arc().innerRadius(R-sw).outerRadius(R).cornerRadius(sw/2);

    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var cx  = slotW * i + slotW / 2;
      var col = isPrimary ? D.primary : D.comp;
      var frac = Math.min(Math.abs(d.value) / reference, 1);
      var endAngle = -Math.PI / 2 + frac * 2 * Math.PI;
      var g = svg.append('g').attr('transform','translate(' + cx + ',' + cy + ')');

      g.append('path').attr('d', arcTrack()).attr('fill','var(--grey-700)').attr('opacity',0.30);

      var fillPath = g.append('path')
        .attr('fill',col).attr('fill-opacity', isPrimary ? 1 : 0.80)
        .attr('data-brand', d.name).style('cursor','pointer')
        .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name));
      fillPath.transition().duration(700).ease(d3.easeCircleOut)
        .attrTween('d', function() {
          var interp = d3.interpolate(-Math.PI/2, endAngle);
          return function(t) { return arcFill.startAngle(-Math.PI/2).endAngle(interp(t))(); };
        });

      g.append('text').attr('y',4).attr('text-anchor','middle')
        .style('font-size', Math.min(13, R*0.28) + 'px')
        .style('font-family', FONT_TITLE).style('font-style','italic')
        .style('fill',col).text(d.value.toFixed(2));

      svg.append('text').attr('x',cx).attr('y',cy+R+16).attr('text-anchor','middle')
        .style('font-size', isPrimary ? '10px':'9px').style('font-family', FONT_LIGHT)
        .style('text-transform','uppercase').style('fill',col).attr('data-brand', d.name)
        .text(d.name.slice(0,4));
    });

    el.style.overflow = 'hidden';
    el.appendChild(svgEl);
  }

  // ─── WAFFLE CHART ─────────────────────────────────────────────────────────
  function renderWaffle(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) { return b.promoterFraction - a.promoterFraction; }),
    ];
    var n = sorted.length;
    var cols = 10, labelH = 22;
    var maxBlockW = n > 1 ? Math.floor((W - (n-1) * 10) / n) : Math.floor(W * 0.8);
    var availH = Math.max(H - labelH - 8, 40);
    var step = Math.max(4, Math.min(Math.floor(availH / cols), Math.floor(maxBlockW / cols)));
    var r = Math.max(1.2, step * 0.34);
    var blockW = cols * step + 2, blockH = cols * step + 2;
    var svgH = blockH + labelH;
    var brandGap = Math.max(6, (W - n * blockW) / Math.max(n-1,1));

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + svgH); svgEl.style.width='100%'; svgEl.style.height=svgH+'px'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    sorted.forEach(function(d, bi) {
      var isPrimary = d.name === primary;
      var bx = bi * (blockW + brandGap);
      var nPromote = Math.round((d.promoterFraction || 0) * 100);
      var nPassive = Math.round((d.passiveFraction  || 0) * 100);
      var col = isPrimary ? D.filled : D.comp;

      var g = svg.append('g').attr('opacity',0).attr('data-brand', d.name).style('cursor','pointer');
      g.on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name));
      g.transition().duration(500).delay(bi*80).ease(d3.easeCubicOut).attr('opacity',1);

      for (var i = 0; i < 100; i++) {
        var c = i % cols, rw = Math.floor(i / cols);
        var cxd = bx + c * step + r, cyd = rw * step + r;
        var fill, op;
        if (i < nPromote)                  { fill = col;    op = isPrimary ? 1 : 0.78; }
        else if (i < nPromote + nPassive)  { fill = D.passive; op = 0.50; }
        else                               { fill = D.neg;   op = 0.85; }
        g.append('circle').attr('cx',cxd).attr('cy',cyd).attr('r',r)
          .attr('fill',fill).attr('opacity',op);
      }

      svg.append('text').attr('x', bx + blockW/2).attr('y', blockH+16).attr('text-anchor','middle')
        .style('font-size', isPrimary ? '10px':'9px').style('font-family', FONT_LIGHT)
        .style('text-transform','uppercase').style('fill',col).attr('data-brand', d.name)
        .text(d.name.slice(0,4));
    });

    el.style.overflow = 'hidden';
    el.appendChild(svgEl);
  }

  // ─── HORIZONTAL BAR ───────────────────────────────────────────────────────
  function renderHBar(el, data, primary, dashboard, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var mT = 12, mR = 72, mB = 22, mL = Math.max(80, Math.min(Math.floor(W * 0.20), 130));
    var iW = W - mL - mR, iH = H - mT - mB;

    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) { return b.value - a.value; }),
    ];

    var allVals = data.map(function(d) { return d.value; });
    var vMin = d3.min(allVals), vMax = d3.max(allVals);
    var xDomain = vMin < 0 ? [vMin * 1.1, vMax * 1.1] : [0, vMax * 1.1];

    var band = d3.scaleBand().domain(sorted.map(function(d) { return d.name; })).range([0, iH]).padding(0.22);
    var bandwidth = Math.min(band.bandwidth(), 44);
    var x = d3.scaleLinear().domain(xDomain).range([0, iW]);

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var g = d3.select(svgEl).append('g').attr('transform','translate(' + mL + ',' + mT + ')');

    // zero line if needed
    if (vMin < 0) {
      g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1',0).attr('y2',iH)
        .attr('stroke', CONFIG.neutralColor).attr('stroke-width',1).attr('opacity',0.5);
    }

    g.append('g').attr('transform','translate(0,' + iH + ')')
      .call(d3.axisBottom(x).ticks(4).tickSize(-iH))
      .call(function(ax) {
        ax.select('.domain').remove();
        ax.selectAll('.tick line').attr('stroke', COL_GRID).attr('opacity',0.35).attr('stroke-dasharray','2,3');
      })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px').style('font-family', FONT_LIGHT);

    var primaryRow = sorted.findIndex(function(d) { return d.name === primary; });
    if (primaryRow >= 0 && primaryRow < sorted.length - 1) {
      var sepY = band(sorted[primaryRow].name) + band.bandwidth() + band.step() * 0.13;
      g.append('line').attr('x1',-mL).attr('x2',iW+mR).attr('y1',sepY).attr('y2',sepY)
        .attr('stroke','var(--grey-700)').attr('stroke-width',0.5);
    }

    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var col = isPrimary ? D.primary : D.comp;
      var rowY = band(d.name);
      var barY = rowY + (band.bandwidth() - bandwidth) / 2;
      var barH = bandwidth;
      var barX = vMin < 0 ? x(Math.min(d.value, 0)) : 0;
      var barW = Math.abs(x(d.value) - x(0));

      g.append('rect').attr('x',barX).attr('y',barY).attr('height',barH)
        .attr('width',0).attr('rx',2)
        .attr('fill',col).attr('data-brand',d.name).style('cursor','pointer')
        .on('click', (function(name) { return async function() { await selectBrand(name, dashboard); }; })(d.name))
        .transition().duration(600).delay(i*50).ease(d3.easeCubicOut).attr('width', barW);

      g.append('text').attr('x',-8).attr('y', rowY + band.bandwidth()/2 + 4).attr('text-anchor','end')
        .style('font-size', isPrimary ? '10px':'9px').style('font-family', FONT_LIGHT)
        .style('text-transform','uppercase').style('fill',col).text(d.name);

      var valX = d.value >= 0 ? x(d.value) + 8 : x(d.value) - 8;
      var valAnchor = d.value >= 0 ? 'start' : 'end';
      g.append('text').attr('x',valX).attr('y', rowY + band.bandwidth()/2 + 4)
        .attr('text-anchor',valAnchor)
        .style('font-size','11px').style('font-family', FONT_TITLE).style('font-style','italic')
        .style('fill',col).text(d.value.toFixed(3))
        .attr('opacity',0).transition().duration(300).delay(i*50+600).attr('opacity',1);
    });

    el.appendChild(svgEl);
  }

  // ─── VERTICAL BAR STACKED ─────────────────────────────────────────────────
  function renderVBarStacked(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var mT = 10, mR = 8, mB = 26, mL = 30;
    var iW = W - mL - mR, iH = H - mT - mB;

    // Support explicit active/passive or a ratio value (0–1 or 0–100)
    var plotData = data.map(function(d) {
      if (d.active !== undefined) return d;
      var v = d.value > 1 ? d.value / 100 : d.value;
      return { name: d.name, active: v, passive: 1 - v };
    });

    var sorted = sortWithPrimaryLast(plotData, primary);
    var band = d3.scaleBand().domain(sorted.map(function(d) { return d.name; })).range([0, iW]).padding(0.28);
    var y = d3.scaleLinear().domain([0, 1]).range([iH, 0]);

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var g = d3.select(svgEl).append('g').attr('transform','translate(' + mL + ',' + mT + ')');

    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-iW).tickFormat(function(d) { return Math.round(d*100) + '%'; }))
      .call(function(ax) {
        ax.select('.domain').remove();
        ax.selectAll('.tick line').attr('stroke', COL_GRID).attr('opacity',0.35).attr('stroke-dasharray','2,3');
      })
      .selectAll('text').style('fill', COL_DARK_GREY).style('font-size','9px').style('font-family', FONT_LIGHT);

    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var delay = isPrimary ? sorted.length * 40 + 80 : i * 40;
      var bx = band(d.name);
      var bw = band.bandwidth();
      var yActive = y(d.active);

      g.append('rect').attr('x',bx).attr('y',0).attr('width',bw).attr('height',0).attr('rx',0)
        .attr('fill', isPrimary ? D.primaryPassive : D.compPassive)
        .attr('data-brand', d.name)
        .transition().duration(600).delay(delay).ease(d3.easeCubicOut).attr('height', yActive);

      g.append('rect').attr('x',bx).attr('y',iH).attr('width',bw).attr('height',0).attr('rx',0)
        .attr('fill', isPrimary ? D.primaryActive : D.compActive)
        .attr('data-brand', d.name).style('cursor','pointer')
        .on('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name))
        .transition().duration(600).delay(delay).ease(d3.easeCubicOut).attr('y',yActive).attr('height', iH-yActive);

      g.append('line').attr('x1',bx).attr('x2',bx+bw).attr('y1',yActive).attr('y2',yActive)
        .attr('stroke','#1A1A1A').attr('stroke-width',2).attr('pointer-events','none');
    });

    g.append('g').attr('transform','translate(0,' + iH + ')')
      .call(d3.axisBottom(band).tickSize(0).tickPadding(6))
      .call(function(ax) { ax.select('.domain').remove(); })
      .selectAll('text')
      .style('fill', function(d) { return d === primary ? D.primaryActive : '#E6E6E6'; })
      .style('font-size','9px').style('font-family', FONT_LIGHT).style('text-transform','uppercase');

    el.appendChild(svgEl);
  }

  // ─── SCALE · FIGMA ────────────────────────────────────────────────────────
  function renderScaleFigma(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) { return b.value - a.value; }),
    ];

    var nRows    = sorted.length;
    var padV     = 10;
    var axisH    = 20;
    var rowH     = Math.max(22, Math.floor((H - padV * 2 - axisH) / nRows));
    var labelSz  = Math.min(10, Math.max(7,  Math.floor(rowH * 0.22)));
    var labelMb  = Math.max(2,  Math.floor(rowH * 0.07));
    var rowGap   = Math.max(2,  Math.floor(rowH * 0.08));
    var trackH   = Math.max(14, rowH - labelSz - labelMb - rowGap);
    var barH     = Math.max(8,  Math.floor(trackH * 0.72));
    var scoreSz  = Math.min(18, Math.max(10, Math.floor(rowH * 0.38)));
    var scoreW   = Math.ceil(scoreSz * 3.8);
    var trackW   = W - scoreW;

    var allVals  = data.map(function(d) { return d.value; });
    var vMin = d3.min(allVals), vMax = d3.max(allVals);
    var domain = [vMin < 0 ? vMin * 1.1 : vMin * 0.95, vMax * 1.05];
    var xScale = d3.scaleLinear().domain(domain).range([0, trackW]);
    var xZero  = xScale(Math.max(domain[0], 0));

    el.style.padding = padV + 'px 0';
    el.style.overflowY = 'hidden';

    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var col = isPrimary ? D.primary : D.comp;

      var row = document.createElement('div');
      row.style.cssText = 'margin-bottom:' + rowGap + 'px;cursor:pointer;';
      row.setAttribute('data-brand', d.name);
      row.addEventListener('click', (function(name) { return async function() { await selectBrand(name, _dashboard); }; })(d.name));
      if (isPrimary && i < sorted.length-1) {
        row.style.borderBottom = '0.5px solid var(--grey-700)';
        row.style.paddingBottom = rowGap + 'px';
        row.style.marginBottom  = rowGap + 'px';
      }

      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:' + FONT_LIGHT + ';font-size:' + (isPrimary ? labelSz : Math.max(6, labelSz - 1)) + 'px;' +
        'text-transform:uppercase;letter-spacing:0.10em;color:' + col + ';margin-bottom:' + labelMb + 'px;';
      lbl.textContent = d.name;
      row.appendChild(lbl);

      var flex = document.createElement('div');
      flex.style.cssText = 'display:flex;align-items:center;';

      var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svgEl.setAttribute('width', trackW); svgEl.setAttribute('height', trackH);
      var svg = d3.select(svgEl);

      svg.append('rect').attr('x',0).attr('y',0).attr('width',trackW).attr('height',trackH)
        .attr('fill','#1A1A1A').attr('rx',4);

      if (vMin < 0) {
        svg.append('line').attr('x1',xZero).attr('x2',xZero).attr('y1',0).attr('y2',trackH)
          .attr('stroke', CONFIG.neutralColor).attr('stroke-width',1).attr('opacity',0.5);
      }

      var barStart = vMin < 0 ? Math.min(xZero, xScale(d.value)) : 0;
      var barWidth = Math.abs(xScale(d.value) - xZero);

      svg.append('rect').attr('x',barStart).attr('y',(trackH-barH)/2).attr('height',barH)
        .attr('width',0).attr('rx',4)
        .attr('fill',col).attr('data-brand',d.name)
        .transition().duration(600).delay(i*60).ease(d3.easeCubicOut).attr('width', barWidth);

      flex.appendChild(svgEl);

      var score = document.createElement('div');
      score.style.cssText = 'width:' + scoreW + 'px;padding-left:8px;' +
        'font-family:' + FONT_TITLE + ';font-style:italic;font-size:' +
        (isPrimary ? scoreSz : Math.max(9, scoreSz - 1)) + 'px;color:' + col + ';';
      score.textContent = d.value.toFixed(3);
      flex.appendChild(score);

      row.appendChild(flex);
      el.appendChild(row);
    });

    var axisSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    axisSvg.setAttribute('width', trackW); axisSvg.setAttribute('height', 18);
    d3.select(axisSvg).append('g')
      .call(d3.axisBottom(xScale).ticks(5).tickSize(0).tickPadding(4))
      .call(function(ax) { ax.select('.domain').remove(); })
      .selectAll('text').style('fill','var(--grey-700)').style('font-size','8px')
      .style('font-family', FONT_LIGHT);
    el.appendChild(axisSvg);
  }

  // ─── MULTI-SCALE DOTS ────────────────────────────────────────────────────
  function renderMultiScale(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!guardBaAttributes(data)) {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;' +
        'height:100%;font-size:11px;font-family:\'Tableau Light\',Arial,sans-serif;' +
        'color:var(--grey-700)">Attribute data unavailable — pipeline error</div>';
      return;
    }

    var attrs = ['Trust','Innovation','Value','Style','Heritage'];
    var mT = 30, mR = 12, mB = 12, mL = 88;
    var ROW = 28;
    var iW  = W - mL - mR;
    var svgH = data.length * ROW + mT + mB;

    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) {
        return d3.mean(attrs, function(k) { return b[k]; }) - d3.mean(attrs, function(k) { return a[k]; });
      }),
    ];

    var allVals = data.flatMap(function(d) { return attrs.map(function(k) { return d[k]; }); });
    var x = d3.scaleLinear().domain([d3.min(allVals)*0.95, d3.max(allVals)*1.05]).range([0, iW]);

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + svgH); svgEl.style.width='100%'; svgEl.style.height=svgH+'px'; svgEl.style.display='block';
    var g = d3.select(svgEl).append('g').attr('transform','translate(' + mL + ',' + mT + ')');

    var primaryData = sorted.find(function(d) { return d.name === primary; });
    if (primaryData) {
      attrs.forEach(function(k) {
        g.append('text').attr('x', x(primaryData[k])).attr('y',-10).attr('text-anchor','middle')
          .style('font-size','7.5px').style('font-family', FONT_LIGHT)
          .style('fill','var(--grey-700)').text(k.slice(0,3).toUpperCase());
      });
    }

    sorted.forEach(function(d, i) {
      var isPrimary = d.name === primary;
      var col = isPrimary ? D.primary : D.comp;
      var cy  = i * ROW + ROW / 2;
      var attrVals = attrs.map(function(k) { return d[k]; }).filter(function(v) { return v != null; });
      var minV = d3.min(attrVals), maxV = d3.max(attrVals);

      g.append('line').attr('x1',x(minV)).attr('x2',x(maxV)).attr('y1',cy).attr('y2',cy)
        .attr('stroke','var(--grey-700)').attr('stroke-width',0.5).attr('opacity',0.6);
      g.append('line').attr('x1',x(minV)).attr('x2',x(maxV)).attr('y1',cy).attr('y2',cy)
        .attr('stroke',col).attr('stroke-width',1).attr('opacity',0.20);

      attrs.forEach(function(k, ki) {
        if (d[k] == null) return;
        g.append('circle').attr('cx',x(d[k])).attr('cy',cy).attr('r',0)
          .attr('fill',col).attr('stroke','#2A2828').attr('stroke-width',1.5)
          .attr('fill-opacity', isPrimary ? 1 : 0.85).attr('data-brand',d.name)
          .transition().duration(400).delay(i*60+ki*20).ease(d3.easeBackOut)
          .attr('r', isPrimary ? 6 : 5);
      });

      g.append('text').attr('x',-8).attr('y',cy+4).attr('text-anchor','end')
        .style('font-size', isPrimary ? '10px':'9px').style('font-family', FONT_LIGHT)
        .style('text-transform','uppercase').style('fill',col).attr('data-brand',d.name)
        .text(d.name);
    });

    g.append('g').attr('transform','translate(0,' + (sorted.length*ROW+4) + ')')
      .call(d3.axisBottom(x).ticks(4).tickSize(-(sorted.length*ROW+4)).tickFormat(d3.format('.1f')))
      .call(function(ax) {
        ax.select('.domain').remove();
        ax.selectAll('.tick line').attr('stroke','#4D4D4D').attr('opacity',0.30);
      })
      .selectAll('text').style('fill','var(--grey-700)').style('font-size','9px')
      .style('font-family', FONT_LIGHT);

    el.appendChild(svgEl);
  }

  // ─── DOT MATRIX ───────────────────────────────────────────────────────────
  function renderDotMatrix(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var sorted = [
      ...data.filter(function(d) { return d.name === primary; }),
      ...data.filter(function(d) { return d.name !== primary; }).sort(function(a,b) { return b.promoterFraction - a.promoterFraction; }),
    ];
    var n = sorted.length;
    var cols = 10, topLabelH = 24;
    var maxBlockW = n > 1 ? Math.floor((W - (n-1) * 8) / n) : Math.floor(W * 0.8);
    var availH = Math.max(H - topLabelH - 4, 40);
    var step = Math.max(4, Math.min(Math.floor(availH / cols), Math.floor(maxBlockW / cols)));
    var r = Math.max(1.2, step * 0.34);
    var blockW = cols * step + 2, blockH = cols * step + 2;
    var svgH = blockH + topLabelH;
    var brandGap = Math.max(6, (W - n * blockW) / Math.max(n-1,1));

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + svgH); svgEl.style.width='100%'; svgEl.style.height=svgH+'px'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    sorted.forEach(function(d, bi) {
      var isPrimary = d.name === primary;
      var bx = bi * (blockW + brandGap);
      var nPromote = Math.round((d.promoterFraction || 0) * 100);
      var nPassive = Math.round((d.passiveFraction  || 0) * 100);
      var col = isPrimary ? D.filled : D.comp;

      svg.append('text').attr('x', bx + blockW/2).attr('y',12).attr('text-anchor','middle')
        .style('font-size', isPrimary ? '9.5px':'8.5px').style('font-family', FONT_LIGHT)
        .style('text-transform','uppercase').style('fill',col).attr('data-brand',d.name)
        .text(d.name.slice(0,4));

      var g = svg.append('g').attr('opacity',0);
      g.transition().duration(400).delay(bi*80).ease(d3.easeCubicOut).attr('opacity',1);

      for (var i = 0; i < 100; i++) {
        var c = i % cols, rw = Math.floor(i / cols);
        var cxd = bx + c * step + r, cyd = 16 + rw * step + r;
        var fill, op;
        if (i < nPromote)                  { fill = col;    op = isPrimary ? 1 : 0.78; }
        else if (i < nPromote + nPassive)  { fill = D.passive; op = 0.50; }
        else                               { fill = D.neg;   op = 0.85; }
        g.append('circle').attr('cx',cxd).attr('cy',cyd).attr('r',r)
          .attr('fill',fill).attr('opacity',op);
      }
    });

    el.style.overflow = 'hidden';
    el.appendChild(svgEl);
  }

  // ─── SMALL MULTIPLES ──────────────────────────────────────────────────────
  function renderSmallMultiples(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!data || !data.length) { showEmpty(el); return; }

    var brands  = Object.keys(data[0]).filter(function(k) { return k !== 'period'; });
    var periods = data.map(function(d) { return d.period; });
    var n = brands.length;
    var panelW = Math.floor(W / n);
    var cellH  = Math.min(Math.max(Math.floor(H * 0.72), 40), 140);
    var labelH = 18;
    var svgH   = cellH + labelH;
    var iW = panelW - 8, iH = cellH - 4;

    var allVals = brands.flatMap(function(b) { return data.map(function(d) { return d[b] || 0; }); });
    var globalMin = d3.min(allVals), globalMax = d3.max(allVals);
    var y = d3.scaleLinear().domain([globalMin, globalMax]).range([iH, 0]);
    var x = d3.scalePoint().domain(periods).range([0, iW]).padding(0.1);

    var lineFn = d3.line()
      .x(function(d) { return x(d.period); })
      .y(function(d) { return y(d.v || 0); })
      .curve(d3.curveMonotoneX);
    var areaFn = d3.area()
      .x(function(d) { return x(d.period); })
      .y0(iH).y1(function(d) { return y(d.v || 0); })
      .curve(d3.curveMonotoneX);

    var sorted = sortWithPrimaryLast(brands.map(function(b) { return { name:b }; }), primary).map(function(d) { return d.name; });

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + svgH); svgEl.style.width='100%'; svgEl.style.height=svgH+'px'; svgEl.style.display='block';
    var svg = d3.select(svgEl);

    sorted.forEach(function(b, i) {
      var isPrimary = b === primary;
      var col = isPrimary ? D.primary : D.comp;
      var px = i * panelW;
      var vals = data.map(function(d) { return { period: d.period, v: d[b] }; });

      svg.append('rect').attr('x', px+4).attr('y',2).attr('width',iW).attr('height',iH)
        .attr('fill','#1A1A1A').attr('rx',3);

      var g = svg.append('g').attr('transform','translate(' + (px+4) + ',2)');

      g.append('path').datum(vals).attr('fill',col)
        .attr('fill-opacity', isPrimary ? 0.50 : 0.28).attr('d', areaFn)
        .attr('data-brand',b);

      var path = g.append('path').datum(vals).attr('fill','none')
        .attr('stroke',col).attr('stroke-width', isPrimary ? 1.5 : 1).attr('d', lineFn)
        .attr('data-brand',b).style('cursor','pointer');
      var len = path.node().getTotalLength();
      path.attr('stroke-dasharray',len).attr('stroke-dashoffset',len)
        .transition().duration(600).ease(d3.easeLinear).attr('stroke-dashoffset',0);

      svg.append('text').attr('x', px + panelW/2).attr('y', cellH+14).attr('text-anchor','middle')
        .style('font-size', isPrimary ? '9.5px':'8.5px').style('font-family', FONT_LIGHT)
        .style('text-transform','uppercase').style('fill',col).attr('data-brand',b)
        .text(b.slice(0,4));
    });

    el.appendChild(svgEl);
  }

  // ─── ARC (NPS CALLOUT) ────────────────────────────────────────────────────
  function renderArc(el, data, primary, D) {
    var rect = el.getBoundingClientRect(); var W = rect.width || 500, H = rect.height || 300;
    if (H < 120) { showTooSmall(el); return; }
    if (!guardNpsRecalculated(data)) {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;' +
        'height:100%;font-size:11px;font-family:\'Tableau Light\',Arial,sans-serif;' +
        'color:var(--grey-700)">NPS recalculation pending</div>';
      return;
    }

    var illyNps     = data.illy ? data.illy.nps : 0;
    var competitors = data.competitors || [];

    var cx = (W >= 400 && competitors.length > 0) ? W * 0.40 : W * 0.48;
    var cy = H * 0.85;
    var R  = Math.min(cx, cy * 0.70);
    var sw = Math.max(20, R * 0.18);

    var arcTrack = d3.arc().innerRadius(R-sw).outerRadius(R).startAngle(-Math.PI).endAngle(Math.PI);
    var arcFill  = d3.arc().innerRadius(R-sw).outerRadius(R).cornerRadius(sw/2);

    var svgEl = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svgEl.style.width='100%'; svgEl.style.height='100%'; svgEl.style.display='block';
    var svg = d3.select(svgEl);
    var g = svg.append('g').attr('transform','translate(' + cx + ',' + cy + ')');

    g.append('path').attr('d', arcTrack()).attr('fill','var(--grey-700)').attr('opacity',0.28);

    var endAngle = -Math.PI/2 + ((illyNps + 100) / 200) * Math.PI;
    g.append('path').attr('fill', D.fill).attr('fill-opacity',1)
      .transition().duration(800).ease(d3.easeCircleOut)
      .attrTween('d', function() {
        var interp = d3.interpolate(-Math.PI/2, endAngle);
        return function(t) { return arcFill.startAngle(-Math.PI/2).endAngle(interp(t))(); };
      });

    g.append('text').attr('y',-10).attr('text-anchor','middle')
      .style('font-size','52px').style('font-family', FONT_TITLE).style('font-style','italic')
      .style('fill', D.fill).text(illyNps);
    g.append('text').attr('y',14).attr('text-anchor','middle')
      .style('font-size','10px').style('font-family', FONT_LIGHT).style('letter-spacing','0.08em')
      .style('fill','#808080').text('ILLY COFFEE');

    svg.append('text').attr('x', cx-R-12).attr('y',cy).attr('text-anchor','end')
      .style('font-size','9px').style('font-family', FONT_LIGHT).style('fill','#808080').text('−100');
    svg.append('text').attr('x', cx+R+12).attr('y',cy).attr('text-anchor','start')
      .style('font-size','9px').style('font-family', FONT_LIGHT).style('fill','#808080').text('+100');

    if (W >= 400) {
      var xOrig = W*0.64, yOrig = cy - R*0.65;
      competitors.forEach(function(c, i) {
        var ry = yOrig + i*22;
        svg.append('circle').attr('cx',xOrig).attr('cy',ry).attr('r',4).attr('fill','#808080');
        svg.append('text').attr('x',xOrig+12).attr('y',ry+4)
          .style('font-size','10px').style('font-family', FONT_LIGHT).style('fill','#B3B3B3')
          .text(c.name);
        svg.append('text').attr('x',W-16).attr('y',ry+4).attr('text-anchor','end')
          .style('font-size','12px').style('font-family', FONT_TITLE).style('font-style','italic')
          .style('fill','#808080').text(c.nps);
      });
    }

    el.appendChild(svgEl);
  }