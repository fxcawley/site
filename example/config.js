module.exports = {
  //pathPrefix: '/site',
  siteUrl: 'https://www.cawley.dev',
  title: 'Liam Cawley',
  description: 'Personal Website of Liam Cawley',
  author: 'Liam Cawley',
  authorAlternative: '连姆·考利',
  introduction: [
    'I am an undergraduate student at the <href="https://www.umich.edu"> University of Michigan. I am interested in pre-doctoral programs in machine learning.',
  ],
  avatar: 'headshot.png',
  professions: [
    'Research Engineer',
    'Student',
  ],
  tocMaxDepth: 2,
  excerptMaxLength: 500,
  birthday: 'Some day',
  location: 'New York, NY',
  email: 'cawleyl@umich.edu',
  postsForArchivePage: 3,
  defaultLanguage: 'en',
  disqusScript: process.env.DISQUS_SCRIPT
    || 'https://tc-imba.disqus.com/embed.js',
  pages: {
    home: '/',
    posts: 'posts',
    contact: 'contact',
    resume: 'resume',
    tags: 'tags',
    research: 'research',
  },
  social: [
    {
      url: '/LiamCawleyResume.pdf',
      icon: ['ai', 'cv'],
    }, {
      url: 'https://github.com/cawley',
      icon: ['fab', 'github'],
    }, {
      url: 'https://github.com/fxcawley',
      icon: ['fab', 'github'],
    }, {
      url: 'https://scholar.google.com/',
      icon: ['fab', 'google-scholar'],
    },
  ],
  // facebook: 'https://www.facebook.com/rolwin.monteiro',
  // instagram: 'https://www.instagram.com/reevan100/',
  // rss: '/rss.xml',
  wakatime: {
    username: 'tcimba',
    activity: '7add4047-08f9-4da8-b649-aa114503678f',
    language: '460a84ab-722a-4b80-b896-cabaa13ad7eb',
    editor: 'd851639a-28d8-4884-949f-d338a858f7e9',
    os: 'caf7d0d1-8fd2-4595-a991-363c8583fea9',
  },
  contactFormUrl: process.env.CONTACT_FORM_ENDPOINT
    || 'https://getform.io/f/09a3066f-c638-40db-ad59-05e4ed71e451',
  googleAnalyticTrackingId: process.env.GA_TRACKING_ID || 'G-ZK3P43DY6M',
  education: [
    {
      date: 'Sept 2021 - Present',
      icon: 'university',
      title: 'B.S.E. in Computer Science',
      location: 'University of Michigan',
    }, {
      date: 'Sept 2017 - May 2021',
      icon: 'school',
      title: 'High School',
      location: 'Bronx High School of Science',
    }],
  interests: [
    {
      icon: 'cubes',
      title: 'Machine Learning',
    }, {
      icon: 'layer-group',
      title: 'Mechanistic Interpretability',
    }, {
      icon: 'linux',
      title: 'Open Source Community',
    }],
    experience: [
      {
        title: 'Work',
        position: 'left',
        data: [
          {
            date: 'May 2024 - August 2024',
            title: 'High Performance Computing Intern',
            location: 'KLA Corporation, San Jose, CA',
            description: 'Developed novel image processing CNNs for semiconductor manufacturing. Collaborated with cross-functional teams to optimize algorithms for high-performance computing environments. Conducted performance benchmarking and analysis of machine learning models.',
          },
          {
            date: 'May 2023 - August 2023',
            title: 'Machine Learning Intern',
            location: 'EMAG Technologies, Ann Arbor, MI',
            description: 'Developed novel calibration algorithms for phased array systems.',
          },
          {
            date: 'May 2022 - August 2022',
            title: 'Software Engineering Intern',
            location: 'RTX Fintech & Research, New York, NY',
            description: 'Built full-stack features for interest rate derivatives platform.',
          },
          {
            date: 'June 2022 - August 2022',
            title: 'Line Cook/Handyman',
            location: "Little Frankie's, Manhattan, NY",
            description: 'Worked night shifts, built out shelving, painted and cooked for the late night extension of Little Frankies.',
          },
        ],
      },
      {
        title: 'Teaching',
        position: 'right',
        data: [
          {
            date: 'January 2022 - May 2022',
            title: 'Math Lab Tutor',
            location: 'University of Michigan',
            description: 'Teaching Assistant for Math 216: Introduction to Differential Equations. Assisted students with problem sets and exam preparation in the Math LAB.',
          },
        ],
      },
      {
        title: 'Volunteer',
        position: 'right',
        data: [
          {
            date: 'December 2019 - August 2021',
            title: 'Meals on Wheels Volunteer',
            location: 'Harlem, NY',
            description: 'Supported meal delivery service for seniors and disabled residents.',
          },
          {
            date: 'June 2023 - August 2023',
            title: 'Get Out Stay Out Volunteer',
            location: 'New York, NY',
            description: 'Assisted with community outreach and support programs to end recidivism in the East Harlem.',
          },
          {
            date: 'June 2022 - August 2022',
            title: 'Carnegie Hill Neighbors Volunteer',
            location: 'New York, NY',
            description: 'Participated in community development and neighborhood improvement initiatives.',
          },
        ],
      },
    ],
  awards: [
    {
      date: 'December 2020',
      title: 'USA Computing Olympiad Silver',
    },
    {
      date: 'February 2020',
      title: 'AIME Qualification',
    }, {
      date: 'February 2019',
      title: 'AMC 10 8th Place in School',
    }
  ],
  tagColors: [
    'magenta', 'red', 'volcano', 'orange', 'gold',
    'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
  ],
  tags: [
    {
      id: 'javascript',
      name: 'javascript',
      description: 'JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.',
      color: '#f0da50',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'Node.js is a tool for executing JavaScript in a variety of environments.',
      color: '#90c53f',
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      description: 'RxJS is a library for reactive programming using Observables, for asynchronous operations.',
      color: '#eb428e',
    },
    {
      id: 'typescript',
      name: 'typescript',
      description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
      color: '#257acc',
    },
    {
      id: 'reactjs',
      name: 'reactjs',
      description: 'React is an open source JavaScript library used for designing user interfaces.',
      color: '#61dbfa',
    },
    {
      id: 'gatsby',
      name: 'Gatsby.js',
      description: 'A framework built over ReactJS to generate static page web application.  ',
      color: '#6f309f',
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'A markup language that powers the web. All websites use HTML for structuring the content.',
      color: '#dd3431',
    },
    {
      id: 'css',
      name: 'css',
      description: 'CSS is used to style the HTML element and to give a very fancy look for the web application.',
      color: '#43ace0',
    },
    {
      id: 'python',
      name: 'python',
      description: 'A general purpose programming language that is widely used for developing various applications.',
      color: '#f9c646',
    },
  ],
};
