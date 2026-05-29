// table.js — indicator table view
// Public API: renderTable(indicators, onIndicatorSelected, onBack)
//   indicators            — array of { id, name, source }
//   onIndicatorSelected   — function(id) called on row click
//   onBack                — function() called on back button click (button is
//                           only rendered when this is a function)
// Renders into the element with id="table-view".

(function (global) {
  'use strict';

  var STYLE_ID = 'table-js-styles';

  var CSS =
    '.tbl-back-row {'                                                       +
    '  display:flex;align-items:center;padding:4px 6px 8px;flex-shrink:0;'  +
    '}'                                                                     +
    '.tbl-back-btn {'                                                       +
    '  background:none;border:none;color:#808080;font-size:18px;'           +
    '  cursor:pointer;padding:4px 8px;border-radius:4px;line-height:1;'     +
    '  transition:color 0.15s, background 0.15s;'                           +
    '}'                                                                     +
    '.tbl-back-btn:hover {'                                                 +
    '  color:#e6e6e6;background:rgba(255,255,255,0.05);'                    +
    '}'                                                                     +
    '.ind-row {'                                                            +
    '  display:flex;align-items:center;justify-content:space-between;'      +
    '  padding:10px 14px;background:#2A2828;border-radius:6px;'             +
    '  cursor:pointer;flex-shrink:0;transition:background 0.12s;'           +
    '  user-select:none;'                                                   +
    '}'                                                                     +
    '.ind-row:hover { background:#363232; }'                                +
    '.ind-row:active { opacity:0.85; }'                                     +
    '.ind-left {'                                                           +
    '  display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;'      +
    '}'                                                                     +
    '.ind-name {'                                                           +
    "  font-family:'Tableau Regular','Helvetica Neue',Arial,sans-serif;"    +
    '  font-size:13px;font-weight:600;color:#E6E6E6;'                       +
    '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'          +
    '}'                                                                     +
    '.ind-source {'                                                         +
    "  font-family:'Tableau Light','Helvetica Neue',Arial,sans-serif;"      +
    '  font-size:11px;color:#808080;'                                       +
    '}'                                                                     +
    '.ind-jump {'                                                           +
    '  display:flex;flex-direction:column;align-items:center;gap:2px;'      +
    '  flex-shrink:0;margin-left:12px;'                                     +
    '}'                                                                     +
    '.ind-jump svg { width:18px;height:18px;opacity:0.5; }'                 +
    '.ind-jump-label {'                                                     +
    "  font-family:'Tableau Light','Helvetica Neue',Arial,sans-serif;"      +
    '  font-size:10px;color:#808080;letter-spacing:0.04em;'                 +
    '}'                                                                     +
    '.tbl-empty-msg {'                                                      +
    '  display:flex;align-items:center;justify-content:center;'             +
    '  height:100%;font-size:11px;'                                         +
    "  font-family:'Tableau Light','Helvetica Neue',Arial,sans-serif;"      +
    '  color:#4D4D4D;padding:16px;text-align:center;'                       +
    '}';

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTable(indicators, onIndicatorSelected, onBack) {
    injectCSS();

    var root = document.getElementById('table-view');
    if (!root) {
      console.warn('table.js: #table-view element not found');
      return;
    }
    root.innerHTML = '';

    if (typeof onBack === 'function') {
      var backRow = document.createElement('div');
      backRow.className = 'tbl-back-row';
      var backBtn = document.createElement('button');
      backBtn.className = 'tbl-back-btn';
      backBtn.title = 'Back';
      backBtn.textContent = '←';
      backBtn.onclick = onBack;
      backRow.appendChild(backBtn);
      root.appendChild(backRow);
    }

    if (!indicators || !indicators.length) {
      var msg = document.createElement('div');
      msg.className = 'tbl-empty-msg';
      msg.textContent = 'No indicators found';
      root.appendChild(msg);
      return;
    }

    indicators.forEach(function (ind) {
      var row = document.createElement('div');
      row.className = 'ind-row';
      row.innerHTML =
        '<div class="ind-left">' +
          '<div class="ind-name">' + escHtml(ind.name) + '</div>' +
          (ind.source
            ? '<div class="ind-source">' + escHtml(ind.source) + '</div>'
            : '') +
        '</div>' +
        '<div class="ind-jump">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="1.5" color="#808080">' +
            '<circle cx="12" cy="12" r="10"/>' +
            '<polyline points="8 12 12 16 16 12"/>' +
            '<line x1="12" y1="8" x2="12" y2="16"/>' +
          '</svg>' +
          '<span class="ind-jump-label">View</span>' +
        '</div>';

      row.addEventListener('click', (function (id) {
        return function () {
          if (typeof onIndicatorSelected === 'function') {
            onIndicatorSelected(id);
          }
        };
      })(ind.id));

      root.appendChild(row);
    });
  }

  global.renderTable = renderTable;

})(window);
