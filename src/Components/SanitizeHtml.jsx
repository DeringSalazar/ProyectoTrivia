import DOMPurify from 'dompurify';

export const SanitizeHtml = (html) => {
  return DOMPurify.sanitize(html);
};
