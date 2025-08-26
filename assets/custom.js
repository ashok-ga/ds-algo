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
});
