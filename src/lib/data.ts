export const siteConfig = {
  title: 'Liam Cawley',
  description: 'Personal Website of Liam Cawley',
  siteUrl: 'https://www.cawley.dev',
  author: 'Liam Cawley',
  email: 'cawleyl@umich.edu',
  location: 'New York, NY',
  avatar: '/headshot.png',
  resumeUrl: '/LiamCawley__Resume.pdf',
  introduction: [
    'I am an undergraduate student at the University of Michigan. I am interested in pre-doctoral programs in machine learning.',
  ],
  professions: ['Research Engineer', 'Student'],
  social: [
    { name: 'GitHub (cawley)', url: 'https://github.com/cawley', icon: 'github' as const },
    { name: 'GitHub (fxcawley)', url: 'https://github.com/fxcawley', icon: 'github' as const },
    { name: 'Google Scholar', url: 'https://scholar.google.com/', icon: 'graduation-cap' as const },
    { name: 'Resume', url: '/LiamCawley__Resume.pdf', icon: 'file-text' as const },
  ],
  googleAnalyticsId: 'G-ZK3P43DY6M',
};

export const education = [
  {
    date: 'Sept 2021 - Present',
    title: 'B.S.E. in Computer Science',
    location: 'University of Michigan, College of Engineering',
  },
  {
    date: 'Sept 2017 - May 2021',
    title: 'High School',
    location: 'Bronx High School of Science',
  },
];

export const interests = [
  { title: 'Machine Learning', icon: 'brain' as const },
  { title: 'Mechanistic Interpretability', icon: 'layers' as const },
  { title: 'Open Source Community', icon: 'code' as const },
];

export const experience = [
  {
    category: 'Work',
    items: [
      {
        date: 'May 2024 - August 2024',
        title: 'High Performance Computing Intern',
        location: 'KLA Corporation, San Jose, CA',
        description:
          'Developed novel image processing CNNs for semiconductor manufacturing. Collaborated with cross-functional teams to optimize algorithms for high-performance computing environments. Conducted performance benchmarking and analysis of machine learning models.',
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
    ],
  },
  {
    category: 'Teaching',
    items: [
      {
        date: 'January 2022 - May 2022',
        title: 'Math Lab Tutor',
        location: 'University of Michigan',
        description:
          'Teaching Assistant for Math 216: Introduction to Differential Equations. Assisted students with problem sets and exam preparation in the Math LAB.',
      },
    ],
  },
  {
    category: 'Volunteer',
    items: [
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
        description:
          'Assisted with community outreach and support programs to end recidivism in the East Harlem.',
      },
      {
        date: 'June 2022 - August 2022',
        title: 'Carnegie Hill Neighbors Volunteer',
        location: 'New York, NY',
        description: 'Participated in community development and neighborhood improvement initiatives.',
      },
    ],
  },
];

export const awards = [
  { date: 'December 2020', title: 'USA Computing Olympiad Silver' },
  { date: 'February 2020', title: 'AIME Qualification' },
  { date: 'February 2019', title: 'AMC 10 8th Place in School' },
];
