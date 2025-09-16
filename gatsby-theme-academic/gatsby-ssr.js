import {
  wrapPageElement as _wrapPageElement,
} from './src/utils/providers';

export const wrapPageElement = _wrapPageElement;

// Prevent requiring heavy PDF/canvas libs during SSR
export const onPreRenderHTML = () => {
  // no-op; SSR stubbing is handled in webpack fallbacks in gatsby-node
};