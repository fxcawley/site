# Personal Website Documentation
[![Built with Gatsby](https://img.shields.io/badge/Built%20with-Gatsby-663399.svg)](https://www.gatsbyjs.com)
[![Academic Theme](https://img.shields.io/badge/Theme-Academic-blue.svg)](https://github.com/gcushen/gatsby-theme-academic)

A personal website for Liam Cawley built using Gatsby and gatsby-theme-academic, designed to showcase professional work, research, and blog content. 

Framework design author: https://www.github.com/tc-imba

## Project Structure

The repository is organized into two main directories:

### Website Directory (`my_site/website/`)
Main configuration and content directory:
- `content/`: Markdown files for blog posts, research papers, and tags
- `gatsby-config.js`: Site configuration and plugin settings
- `.eslintrc`: Code style and linting configuration

### Theme Directory (`my_site/gatsby-theme-academic/`)
Core theme components and layouts:
- `components/`: React components for site functionality
- `pages/`: Page templates and layouts

## Installation

1. Clone the Repository:
   ```bash
   git clone https://www.github.com/fxcawley/my_site
   ```

2. Navigate to Project Directory:
   ```bash
   cd my_site
   ```

3. Install Dependencies:
   ```bash
   npm install
   ```

4. Start Development Server:
   ```bash
   npm run develop
   ```
   Access the development site at `http://localhost:8000`

5. Build for Production:
   ```bash
   npm run build
   ```

## Customization

### Content Management
The `content/` directory contains all site content in Markdown format:
```
content/
├── blog/
│   └── posts/
├── research/
│   └── publications/
└── tags/
```

### Style Customization
Modify the site's appearance through:
- Less stylesheets in component directories
- Theme configuration in `gatsby-config.js`
- Component customization in the theme directory

## Development Features

- React-based component system
- Markdown content management
- Built-in SEO optimization
- Academic-focused layouts and components
- Responsive design system
- Integrated blog functionality

## Deployment

The site can be deployed to various platforms:
- Netlify
- Vercel
- Gatsby Cloud
- GitHub Pages

Each platform offers continuous deployment from your repository.

## Technical Documentation

### Required Dependencies
- Node.js (v14+)
- npm or yarn
- Gatsby CLI

### Development Commands
```bash
# Start development server
npm run develop

# Build production site
npm run build

# Serve production build locally
npm run serve

# Clean Gatsby cache
npm run clean
```

### Plugin Configuration
Key plugins include:
- `gatsby-plugin-react-helmet`: SEO management
- `gatsby-plugin-less`: Style processing
- `gatsby-transformer-remark`: Markdown processing
- `gatsby-source-filesystem`: Content management

## Resources

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [gatsby-theme-academic Documentation](https://github.com/gcushen/gatsby-theme-academic)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Support

For technical issues:
1. Check existing issues in the repository
2. Review the Gatsby troubleshooting guide
3. Open a new issue with:
   - Development environment details
   - Steps to reproduce
   - Expected vs. actual behavior

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For questions or collaboration inquiries, please open an issue or contact through the repository.
