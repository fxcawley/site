import { graphql, Link } from 'gatsby';
import React from 'react';
import Panel from '../../components/Panel';
import SEO from '../../components/Seo';

const Projects = ({ data }) => {
  const repos = data.allGithubRepo.nodes || [];
  return (
    <>
      <SEO title="Projects" description="Open-source projects from GitHub." path="projects" />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">Projects</h1>
      </div>
      <div>
        {repos.map((r) => (
          <div key={r.id} style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>
              <Link to={`/${r.fields.path}/`}>{r.name}</Link>
            </h3>
            <div style={{ color: 'var(--rs-text-tertiary)' }}>
              {r.description}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const query = graphql`
  {
    allGithubRepo(sort: {stargazers_count: DESC}) {
      nodes {
        id
        name
        description
        html_url
        stargazers_count
        language
        fields { path }
      }
    }
  }
`;

export default Projects;


