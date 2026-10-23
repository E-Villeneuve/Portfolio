/*
  Everything the Skills and Projects sections show comes from this file.

    id         short unique name, used in the URL (#project-<id>). Letters, numbers, dashes.
    name       shown in the project list.
    context    one short line: "Personal project", "Course project", "Aversan internship"...
    figure     the large number at the top of the detail, e.g. "60%". Optional.
    figureText the sentence that explains the number. Optional (needed if figure is set).
    summary    two or three sentences on what it is and what you built.
    skills     names from the `skills` lists below, spelled exactly the same.
               Each skill row then links to this project automatically.
    links      { code: "https://github.com/<you>/<repo>", demo: "https://..." }. Leave "" to hide.
    image      path to a screenshot, e.g. "assets/projects/proxy.png". Optional.
               When set it replaces the code fragment.
    imageAlt   describe the screenshot for screen readers.
    fragment   a small code or terminal sample shown beside the text. Optional.
               { title: "...", kind: "terminal" | "code", lines: ["...", "..."] }
               In a terminal, lines starting with "$ " are shown as commands.
*/
window.PORTFOLIO = {
  skills: [
    {
      group: 'Languages',
      items: ['Python', 'C', 'C#', 'C++', 'Java', 'JavaScript'],
    },
    {
      group: 'Web, APIs and data',
      items: ['HTTP', 'REST', 'SQL', 'PostgreSQL', 'SQLite', 'Redis', 'Django', 'Flask', 'FastAPI', 'React', 'AWS', 'HTML'],
    },
    {
      group: 'Machine learning and AI',
      items: ['PyTorch', 'TensorFlow', 'Neural networks', 'Generative AI', 'Prompt engineering', 'Data analysis'],
    },
    {
      group: 'Systems and testing',
      items: ['Networking', 'Memory management', 'Unit testing'],
    },
    {
      group: 'Management',
      items: ['Technical project management', 'Technical program management', 'Agile'],
    },
  ],

  projects: [
    {
      id: 'proxy-server',
      name: 'Python proxy server',
      context: 'Personal project',
      figure: '60%',
      figureText: 'lower average response time, at best, once pages came from the local cache instead of upstream.',
      summary:
        'A single-threaded HTTP proxy that serves many local connections at once with an event-driven design. Pages are cached locally with a time-to-live you configure, so repeat requests never leave the machine.',
      skills: ['Python', 'HTTP', 'Networking', 'Concurrency'],
      links: { code: '', demo: '' },
      image: '',
      imageAlt: '',
    },
    {
      id: 'c-shell',
      name: 'C shell',
      context: 'Personal project',
      figure: '46%',
      figureText: 'faster command execution once pipes let processes pass data straight to each other.',
      summary:
        'A command-line shell written from the ground up in C, with its own built-in commands and pipes between processes. Every allocation is managed and freed, so long sessions stay fast and leak-free.',
      skills: ['C', 'Memory management', 'Concurrency'],
      links: { code: '', demo: '' },
      image: '',
      imageAlt: '',
      fragment: {
        title: 'mysh',
        kind: 'terminal',
        lines: [
          '$ ./mysh',
          'mysh$ cd src',
          'mysh$ ls | grep .c | wc -l',
          '4',
          'mysh$ cat jobs.txt | sort | uniq',
          'build',
          'test',
          'mysh$ exit',
        ],
      },
    },
    {
      id: 'social-site',
      name: 'Social media site',
      context: 'Team project',
      summary:
        'A full-stack social site built with two other developers. I designed the REST API for profiles and account settings in Django and SQLite, secured it with token authentication and input validation, and connected it to the React front end.',
      skills: ['Python', 'Django', 'REST', 'SQL', 'SQLite', 'React', 'JavaScript', 'Agile'],
      links: { code: 'https://github.com/E-Villeneuve/EasyChef', demo: '' },
      image: '',
      imageAlt: '',
      fragment: {
        title: 'EasyChef',
        kind: 'code',
        lines: [
          'PATCH /api/users/42/profile HTTP/1.1',
          'Authorization: Token 9f3c…e1',
          'Content-Type: application/json',
        ],
      },
    },
    {
      id: 'document-comments',
      name: 'Document comment extractor',
      context: '',
      figure: '50%',
      figureText: 'faster responses to external inquiries and internal reviews, at best.',
      summary:
        'A Python application (with GUI) that reads .pdf and .docx files and gathers every comment into one list, so nobody has to page through documents to find what still needs an answer.',
      skills: ['Python', 'Data analysis'],
      links: { code: 'https://github.com/E-Villeneuve/Comment-Parser', demo: '' },
      image: '',
      imageAlt: '',
      fragment: {
        title: 'extract_comments.py',
        kind: 'terminal',
        lines: [
          '$ python3 main.py',
        ],
      },
    },
    {
      id: 'space-invaders',
      name: 'Space Invaders',
      context: '',
      summary:
        'A recreation of the classic arcade game Space Invaders, written entirely in C++.',
      skills: ['C++', 'Memory management'],
      links: { code: 'https://github.com/E-Villeneuve/Space-Invaders', demo: '' },
      image: 'assets/SpaceInvaders.png',
      imageAlt: '',
      fragment: {
        title: 'extract_comments.py',
        kind: 'terminal',
        lines: [
          '$ ./make.sh',
          '$ ./main',
        ],
      },
    },
    {
      id: 'PDF-Merger',
      name: 'PDF Merger',
      context: '',
      summary:
        'Simple website designed to merge multiple PDFs into a single file.',
      skills: ['JavaScript', 'HTML'],
      links: { code: 'https://github.com/E-Villeneuve/PDF-Merger', demo: '' },
      image: 'assets/PDF_merger.png',
      imageAlt: '',
    },
  ],
};
