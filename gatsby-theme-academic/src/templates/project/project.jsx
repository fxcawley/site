import { graphql } from 'gatsby';
import React from 'react';
import SEO from '../../components/Seo';

const Project = ({ data: { githubRepo } }) => {
  const r = githubRepo;
  return (
    <>
      <SEO title={r.name} description={r.description || ''} path={r.fields.path} />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">{r.name}</h1>
      </div>
      <p style={{ color: 'var(--rs-text-tertiary)' }}>{r.description}</p>
      <ul>
        <li>Stars: {r.stargazers_count}</li>
        <li>Language: {r.language}</li>
        <li><a href={r.html_url} target="_blank" rel="noreferrer">GitHub</a></li>
      </ul>
    </>
  );
};

export const pageQuery = graphql`
  query($id: String!) {
    githubRepo(id: { eq: $id }) {
      id
      name
      description
      html_url
      stargazers_count
      language
      fields { path }
    }
  }
`;

export default Project;


