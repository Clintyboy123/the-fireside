import { site } from '../content/site';

// The GitHub Pages preview has no backend, so the forms say so plainly instead of failing with a network error.
export const previewOnly = () => {
  const error = new Error(`This is a preview of the new website, so forms aren't sent yet. Please email ${site.email} or call ${site.phone}.`);
  error.status = 0;
  error.fields = {};
  return Promise.reject(error);
};
