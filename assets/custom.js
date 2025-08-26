// Smooth scroll for all anchor links
window.addEventListener('DOMContentLoaded', function() {
  /* Smooth scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        history.replaceState(null, '', id);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Add copy buttons to code blocks */
  document.querySelectorAll('pre > code').forEach(code => {
    const pre = code.parentElement;
    const btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.type = 'button';
    btn.innerText = 'Copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.innerText).then(() => {
        btn.innerText = 'Copied!';
        code.classList.add('highlighted');
        setTimeout(() => { btn.innerText = 'Copy'; code.classList.remove('highlighted'); }, 1600);
      });
    });
    pre.style.position = 'relative';
    btn.style.position = 'absolute';
    btn.style.top = '6px';
    btn.style.right = '8px';
    btn.style.padding = '4px 8px';
    btn.style.fontSize = '12px';
    pre.appendChild(btn);
  });

  /* Scroll to top button */
  const topBtn = document.createElement('button');
  topBtn.id = 'scrollTopBtn';
  topBtn.innerText = '↑';
  Object.assign(topBtn.style, {
    position: 'fixed', bottom: '24px', right: '24px', width:'40px', height:'40px',
    borderRadius:'50%', border:'none', background:'#3f51b5', color:'#fff', cursor:'pointer',
    boxShadow:'0 2px 6px rgba(0,0,0,0.3)', fontSize:'18px', display:'none', zIndex: '999'
  });
  topBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth'}));
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 280 ? 'block' : 'none';
  document.body.classList.toggle('scrolled', window.scrollY > 8);
  });

  /* Collapsible callout sections: any element with data-collapsible */
  document.querySelectorAll('[data-collapsible] h2, [data-collapsible] h3').forEach(h => {
    h.style.cursor = 'pointer';
    h.addEventListener('click', () => {
      const parent = h.closest('[data-collapsible]');
      parent.classList.toggle('collapsed');
    });
  });

  /* Enhance top navigation tabs with icons (emoji-based) */
  const iconMap = {
    'Home': '🏠',
    'Topics': '📚',
    'Interview Prep': '🧠',
    'Prev Questions': '💼',
    'Projects': '🛠️'
  };
  document.querySelectorAll('.md-tabs__link').forEach(link => {
    const label = link.textContent.trim();
    if (iconMap[label] && !link.querySelector('.nav-emoji')) {
      const span = document.createElement('span');
      span.className = 'nav-emoji';
      span.textContent = iconMap[label];
      link.prepend(span);
    }
  });

  /* Ensure left sidebar second-level items keep first-letter capitalization (failsafe) */
  document.querySelectorAll('.md-sidebar .md-nav__link').forEach(link => {
    const txt = link.textContent.trim();
    if (txt && txt[0] === txt[0].toLowerCase()) {
      link.textContent = txt[0].toUpperCase() + txt.slice(1);
    }
  });

  /* Enhanced Table & Badge Decoration */
  const badgeKeywords = [
    { match: /\bO\([^)]+\)/g, cls: 'big-o' },
    { match: /\bDFS\b/g, cls: 'badge badge-pattern auto-badge' },
    { match: /\bBFS\b/g, cls: 'badge badge-pattern auto-badge' },
    { match: /\bHeap\b/gi, cls: 'badge badge-ds auto-badge' },
    { match: /\bTrie\b/gi, cls: 'badge badge-ds auto-badge' },
    { match: /\bDP\b/g, cls: 'badge badge-pattern auto-badge' },
    { match: /\bGreedy\b/gi, cls: 'badge badge-pattern auto-badge' },
    { match: /\bBit\b/gi, cls: 'badge badge-pattern auto-badge' }
  ];

  function decorateTable(table){
    if(table.dataset.enhanced) return; table.dataset.enhanced='1';
    const wrapper=document.createElement('div');
    wrapper.className='table-responsive';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    table.querySelectorAll('th,td').forEach(cell=>{
      let html=cell.innerHTML;
      badgeKeywords.forEach(rule=>{
        html = html.replace(rule.match, m=>`<span class="${rule.cls}">${m}</span>`);
      });
      cell.innerHTML=html;
    });
    // Assign column header attributes for multi-color
    const heads = table.querySelectorAll('thead th');
    heads.forEach(h => {
      const txt = h.textContent.trim().toLowerCase();
      if(/operation|op/.test(txt)) h.setAttribute('col-type','operation');
      else if(/average|avg/.test(txt)) h.setAttribute('col-type','avg');
      else if(/worst/.test(txt)) h.setAttribute('col-type','worst');
      else if(/notes?/.test(txt)) h.setAttribute('col-type','notes');
    });
    // Complexity badge coloring
    table.querySelectorAll('.big-o').forEach(span => {
      const t = span.textContent;
      const map = [
        {re:/O\(1\)/, cls:'complexity-o1'},
        {re:/O\(log ?n\)/i, cls:'complexity-ologn'},
        {re:/O\(n\)/i, cls:'complexity-on'},
        {re:/O\(n ?log ?n\)/i, cls:'complexity-onlogn'},
        {re:/O\(n\^?2|O\(n ?\* ?n\)/i, cls:'complexity-on2'},
        {re:/O\(2\^n\)/i, cls:'complexity-exp'},
        {re:/O\(n!\)/i, cls:'complexity-onfact'}
      ];
      for(const r of map){ if(r.re.test(t)){ span.classList.add(r.cls); break; } }
    });
  }
  document.querySelectorAll('.md-typeset table').forEach(decorateTable);

  const observer = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if(n.nodeType===1){
        if(n.matches && n.matches('.md-typeset table')) decorateTable(n);
        n.querySelectorAll && n.querySelectorAll('.md-typeset table').forEach(decorateTable);
      }
    }));
  });
  observer.observe(document.body,{childList:true,subtree:true});

  /* Problem list filtering (basic) */
  const problemsTable = document.getElementById('problems-table');
  if (problemsTable) {
    const bar = document.createElement('div');
    bar.style.display='flex';
    bar.style.flexWrap='wrap';
    bar.style.gap='12px';
    bar.style.margin='12px 0 4px';
    bar.innerHTML = `
      <input id="filter-text" placeholder="Search title / tag / pattern" style="padding:6px 10px;flex:1;min-width:240px;border:1px solid #ccc;border-radius:6px" />
      <select id="filter-diff" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px">
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <select id="filter-status" style="padding:6px 10px;border:1px solid #ccc;border-radius:6px">
        <option value="">All Status</option>
        <option value="Unseen">Unseen</option>
        <option value="Attempted">Attempted</option>
        <option value="Solved">Solved</option>
        <option value="Review">Review</option>
      </select>
      <button id="reset-problems" style="padding:6px 14px;background:#3f51b5;color:#fff;border:none;border-radius:6px;cursor:pointer">Reset</button>`;
    problemsTable.parentNode.insertBefore(bar, problemsTable);

    function loadProgress(){
      try { return JSON.parse(localStorage.getItem('problemProgress')||'{}'); } catch { return {}; }
    }
    function saveProgress(p){ localStorage.setItem('problemProgress', JSON.stringify(p)); }
    function applyProgress(){
      const prog = loadProgress();
      problemsTable.querySelectorAll('tbody tr').forEach(tr => {
        const id = tr.dataset.problemId;
        const status = prog[id] || 'Unseen';
        const cell = tr.querySelector('[data-status]');
        cell.textContent = status;
        cell.className = 'status-cell status-'+status.toLowerCase();
      });
    }
    applyProgress();

    function applyFilters(){
      const q = document.getElementById('filter-text').value.trim().toLowerCase();
      const diff = document.getElementById('filter-diff').value;
      const stat = document.getElementById('filter-status').value;
      problemsTable.querySelectorAll('tbody tr').forEach(tr => {
        const txt = tr.innerText.toLowerCase();
        const d = tr.dataset.difficulty;
        const id = tr.dataset.problemId;
        const cellStatus = tr.querySelector('[data-status]').textContent.trim();
        const okQ = !q || txt.includes(q);
        const okD = !diff || d === diff;
        const okS = !stat || cellStatus === stat;
        tr.style.display = (okQ && okD && okS) ? '' : 'none';
      });
    }
    bar.addEventListener('input', applyFilters);
    bar.addEventListener('change', applyFilters);
    document.getElementById('reset-problems').addEventListener('click', () => {
      document.getElementById('filter-text').value='';
      document.getElementById('filter-diff').value='';
      document.getElementById('filter-status').value='';
      applyFilters();
    });

    // Click to cycle status
    problemsTable.addEventListener('click', e => {
      const cell = e.target.closest('[data-status]');
      if(!cell) return;
      const order = ['Unseen','Attempted','Solved','Review'];
      const current = cell.textContent.trim();
      const next = order[(order.indexOf(current)+1)%order.length];
      const tr = cell.closest('tr');
      const prog = loadProgress();
      prog[tr.dataset.problemId] = next;
      saveProgress(prog);
      applyProgress();
      applyFilters();
    });
  }

  // Per-problem progress component
  const progressRoot = document.getElementById('problem-progress-root');
  if(progressRoot){
    const pid = progressRoot.dataset.problemId;
    function lp(){ try{return JSON.parse(localStorage.getItem('problemProgress')||'{}');}catch{return{};} }
    function sp(p){ localStorage.setItem('problemProgress', JSON.stringify(p)); }
    const statuses=['Unseen','Attempted','Solved','Review'];
    const wrap = document.createElement('div');
    wrap.style.display='flex'; wrap.style.gap='8px'; wrap.style.flexWrap='wrap'; wrap.style.alignItems='center';
    wrap.innerHTML = '<strong>Status:</strong>' + statuses.map(s=>`<button data-set-status="${s}" style="padding:4px 10px;border:1px solid #ccc;border-radius:18px;background:#f5f7fa;cursor:pointer;font-size:.7rem">${s}</button>`).join('');
    const noteArea = document.createElement('textarea');
    noteArea.placeholder='Notes / pitfalls...';
    Object.assign(noteArea.style,{width:'100%',minHeight:'80px',marginTop:'8px',padding:'6px 8px',border:'1px solid #ccc',borderRadius:'6px',fontSize:'.75rem'});
    const stored = lp();
    if(stored[pid+'_notes']) noteArea.value = stored[pid+'_notes'];
    wrap.addEventListener('click', e => {
      const btn = e.target.closest('[data-set-status]');
      if(!btn) return;
      const prog = lp(); prog[pid]=btn.dataset.setStatus; sp(prog); refresh();
    });
    noteArea.addEventListener('input', () => { const prog=lp(); prog[pid+'_notes']=noteArea.value; sp(prog); });
    progressRoot.appendChild(wrap); progressRoot.appendChild(noteArea);
    function refresh(){ const prog=lp(); wrap.querySelectorAll('[data-set-status]').forEach(b=>{ b.style.background = (prog[pid]===b.dataset.setStatus)?'#3f51b5':'#f5f7fa'; b.style.color = (prog[pid]===b.dataset.setStatus)?'#fff':'#222'; }); }
    refresh();
  }

  // Discuss page enhancements (basic)
  if (document.querySelector('h1') && /Discuss & Compensation Archive/i.test(document.querySelector('h1').innerText)) {
    // Make tables horizontally scrollable if wide
    document.querySelectorAll('.md-typeset table').forEach(t => {
      if(!t.parentElement.classList.contains('table-responsive')){
        const wrap = document.createElement('div');
        wrap.className='table-responsive';
        t.parentNode.insertBefore(wrap, t); wrap.appendChild(t);
      }
    });
  }
});
