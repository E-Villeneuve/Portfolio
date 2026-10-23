// Builds the Skills and Projects sections from js/data.js, runs the hero terminal and the reveals.
(() => {
  const { skills, projects } = window.PORTFOLIO;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'style') node.style.cssText = value;
      else node.setAttribute(key, value);
    }
    for (const child of [].concat(children)) if (child !== null && child !== undefined && child !== false) node.append(child);
    return node;
  };

  const usedIn = (skill) => projects.filter((p) => p.skills.includes(skill));

  // ---------- projects ----------
  const grid = document.getElementById('project-grid');
  const status = document.getElementById('filter-status');
  const filterChips = document.getElementById('filter-chips');
  let activeSkill = null;

  const codeBlock = (fragment) => {
    const code = el('code');
    fragment.lines.forEach((line) => {
      const isCommand = fragment.kind === 'terminal' && /^\S*\$ /.test(line);
      if (isCommand) {
        const [prompt, ...rest] = line.split('$ ');
        code.append(el('span', { class: 'line is-command' }, [el('span', { class: 't-prompt' }, `${prompt}$`), rest.join('$ ')]));
      } else {
        code.append(el('span', { class: 'line' }, line || ' '));
      }
    });
    return el('figure', { class: 'project-code' }, el('pre', {}, code));
  };

  const githubIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16'); svg.setAttribute('width', '16'); svg.setAttribute('height', '16'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z');
    svg.append(path);
    return svg;
  };

  const card = (p) => {
    const links = [];
    if (p.links?.code) links.push(el('a', { class: 'button button-small', href: p.links.code, target: '_blank', rel: 'noopener' }, [githubIcon(), 'Source on GitHub']));
    if (p.links?.demo) links.push(el('a', { class: 'button button-ghost button-small', href: p.links.demo, target: '_blank', rel: 'noopener' }, 'Live demo'));
    const media = p.image
      ? el('figure', { class: 'project-media' }, el('img', { src: p.image, alt: p.imageAlt || p.name, loading: 'lazy' }))
      : p.fragment ? codeBlock(p.fragment) : null;

    return el('article', { class: 'project', id: `project-${p.id}`, 'aria-labelledby': `title-${p.id}` }, [
      el('div', { class: 'project-head' }, [
        el('span', { class: 'project-file mono' }, p.fragment?.title || `${p.id}/`),
        el('span', { class: 'project-context mono' }, p.context),
      ]),
      el('div', { class: 'project-body' }, [
        el('h3', { id: `title-${p.id}` }, p.name),
        p.figure ? el('p', { class: 'project-stat' }, [el('strong', {}, p.figure), el('span', {}, p.figureText)]) : null,
        el('p', { class: 'project-summary' }, p.summary),
        el('ul', { class: 'tags', role: 'list', 'aria-label': 'Built with' }, p.skills.map((s) => el('li', { class: 'tag' }, s))),
        links.length ? el('div', { class: 'project-links' }, links) : null,
      ]),
      media,
    ]);
  };

  const cards = projects.map((p) => card(p));
  cards.forEach((c) => grid.append(c));

  // filter chips: skills used by at least one project, most used first
  const projectSkills = [...new Set(projects.flatMap((p) => p.skills))]
    .sort((a, b) => usedIn(b).length - usedIn(a).length || a.localeCompare(b));
  const filterButtons = new Map();
  const allButton = el('button', { class: 'chip', type: 'button', 'aria-pressed': 'true' }, 'All');
  allButton.addEventListener('click', () => setFilter(null));
  filterChips.append(allButton);
  projectSkills.slice(0, 10).forEach((skill) => {
    const button = el('button', { class: 'chip', type: 'button', 'aria-pressed': 'false' }, skill);
    button.addEventListener('click', () => setFilter(activeSkill === skill ? null : skill));
    filterButtons.set(skill, button);
    filterChips.append(button);
  });

  const skillButtons = new Map(); // filled by the skills section below

  function setFilter(skill) {
    activeSkill = skill;
    let shown = 0;
    cards.forEach((c, i) => {
      const match = !skill || projects[i].skills.includes(skill);
      c.hidden = !match;
      if (match) {
        c.style.setProperty('--i', shown++);
        c.classList.remove('is-entering');
        void c.offsetWidth;
        c.classList.add('is-entering');
      }
    });
    allButton.setAttribute('aria-pressed', String(!skill));
    // a skill outside the top ten still gets a chip while it is the filter
    if (skill && !filterButtons.has(skill)) {
      const button = el('button', { class: 'chip', type: 'button', 'aria-pressed': 'false', 'data-temp': '' }, skill);
      button.addEventListener('click', () => setFilter(null));
      filterButtons.set(skill, button);
      filterChips.append(button);
    }
    for (const [name, button] of filterButtons) {
      if (button.hasAttribute('data-temp') && name !== skill) { button.remove(); filterButtons.delete(name); continue; }
      button.setAttribute('aria-pressed', String(name === skill));
    }
    for (const [name, button] of skillButtons) button.setAttribute('aria-pressed', String(name === skill));
    status.textContent = skill
      ? `${shown} of ${projects.length} projects use ${skill}`
      : `${projects.length} projects`;
  }

  // ---------- skills ----------
  const groupsRoot = document.getElementById('skill-groups');
  skills.forEach((group, g) => {
    const chips = group.items.map((skill) => {
      const count = usedIn(skill).length;
      if (!count) return el('li', {}, el('span', { class: 'chip' }, skill));
      const button = el('button', { class: 'chip', type: 'button', 'aria-pressed': 'false', title: `Show the ${count} project${count > 1 ? 's' : ''} that use ${skill}` }, [
        skill,
        el('span', { class: 'count', 'aria-hidden': 'true' }, String(count)),
      ]);
      button.addEventListener('click', () => {
        setFilter(skill);
        document.getElementById('projects').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      skillButtons.set(skill, button);
      return el('li', {}, button);
    });
    groupsRoot.append(
      el('div', { class: 'skill-group', 'data-reveal': '', style: `--i:${g % 3}` }, [
        el('h3', {}, group.group.toLowerCase().replace(/[^a-z0-9]+/g, '_')),
        el('ul', { class: 'chips', role: 'list' }, chips),
      ])
    );
  });

  setFilter(null);

  // ---------- open one project (used by the terminal) ----------
  const openProject = (id) => {
    const index = projects.findIndex((p) => p.id === id);
    if (index < 0) return false;
    if (cards[index].hidden) setFilter(null);
    cards[index].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    cards[index].classList.add('is-flash');
    setTimeout(() => cards[index].classList.remove('is-flash'), 1600);
    return true;
  };

  // ---------- copy email ----------
  const copy = document.getElementById('copy-email');
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.email);
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Press Ctrl+C';
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.contact-email'));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    }
    setTimeout(() => { copy.textContent = 'Copy'; }, 1800);
  });

  // ---------- terminal ----------
  const out = document.getElementById('terminal-output');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-command');
  const scrollDown = () => { out.scrollTop = out.scrollHeight; };
  const print = (...children) => { out.append(el('p', {}, children)); scrollDown(); };
  const echo = (cmd) => print(el('span', { class: 't-prompt' }, '$'), el('span', { class: 't-cmd' }, cmd));
  const projectButton = (p) => {
    const b = el('button', { type: 'button' }, p.id);
    b.addEventListener('click', () => openProject(p.id));
    return b;
  };

  const commands = {
    help: () => print(
      'commands: ',
      el('span', { class: 't-key' }, 'whoami'), ', ',
      el('span', { class: 't-key' }, 'ls'), ', ',
      el('span', { class: 't-key' }, 'open <project>'), ', ',
      el('span', { class: 't-key' }, 'skills'), ', ',
      el('span', { class: 't-key' }, 'contact'), ', ',
      el('span', { class: 't-key' }, 'clear'),
    ),
    whoami: () => print('Evan Villeneuve, software engineer in Oakville, Ontario.\nHBSc computer science, University of Toronto, 2025.'),
    ls: () => {
      const line = el('p', {});
      projects.forEach((p, i) => { if (i) line.append('   '); line.append(projectButton(p)); });
      out.append(line);
      scrollDown();
    },
    open: (arg) => {
      if (!arg) return print('usage: open <project>   (try ', el('span', { class: 't-key' }, 'ls'), ')');
      const match = projects.find((p) => p.id === arg) || projects.find((p) => p.id.startsWith(arg) || p.name.toLowerCase().includes(arg));
      if (!match) return print(`open: ${arg}: no such project`);
      print(`opening ${match.id}…`);
      openProject(match.id);
    },
    skills: () => print(skills.map((g) => `${g.group}: ${g.items.join(', ')}`).join('\n')),
    contact: () => print(
      'email     ', el('a', { href: 'mailto:evilleneuve23@gmail.com' }, 'evilleneuve23@gmail.com'), '\n',
      'linkedin  ', el('a', { href: 'https://www.linkedin.com/in/evan-villeneuve-691055274/', target: '_blank', rel: 'noopener' }, 'in/evan-villeneuve'),
    ),
    clear: () => { out.textContent = ''; },
  };
  commands.projects = commands.ls;
  commands.about = commands.whoami;
  commands.email = commands.contact;

  const run = (raw) => {
    const text = raw.trim();
    if (!text) return;
    echo(text);
    const [name, ...args] = text.split(/\s+/);
    const command = commands[name.toLowerCase()];
    if (command) command(args.join(' ').toLowerCase());
    else print(`command not found: ${name}. Type `, el('span', { class: 't-key' }, 'help'), '.');
  };

  form.hidden = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    run(input.value);
    input.value = '';
  });
  out.addEventListener('click', (event) => { if (event.target === out) input.focus({ preventScroll: true }); });

  // intro: type `ls` and `help` after the static whoami
  const typeCommand = async (cmd) => {
    const line = el('p', {}, [el('span', { class: 't-prompt' }, '$')]);
    const typed = el('span', { class: 't-cmd' });
    line.append(typed);
    out.append(line);
    for (const ch of cmd) {
      typed.textContent += ch;
      await new Promise((r) => setTimeout(r, 70));
    }
    line.remove();
    run(cmd);
  };
  (async () => {
    if (reduceMotion) { run('ls'); run('help'); return; }
    await new Promise((r) => setTimeout(r, 900));
    await typeCommand('ls');
    await new Promise((r) => setTimeout(r, 500));
    await typeCommand('help');
  })();
})();

// Reveal once when an element enters the viewport
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { targets.forEach((t) => t.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  targets.forEach((t) => io.observe(t));
  // safety net for jumps (anchor links, restored scroll): show anything already on screen
  const showVisible = () => targets.forEach((t) => { const r = t.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) t.classList.add('is-in'); });
  let settle;
  window.addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(showVisible, 200); }, { passive: true });
  window.addEventListener('load', () => setTimeout(showVisible, 1500));
})();
