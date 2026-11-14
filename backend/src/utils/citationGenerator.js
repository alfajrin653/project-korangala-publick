/**
 * Menghasilkan format sitasi otomatis dari sebuah artikel.
 * Dipakai oleh corpusController agar logic sitasi tidak diduplikasi di banyak tempat.
 */
const formatDate = (date) => {
  const d = date ? new Date(date) : new Date();
  return {
    year: d.getFullYear(),
    day: d.getDate(),
    monthLong: d.toLocaleString('en-US', { month: 'long' }),
    monthShort: d.toLocaleString('en-US', { month: 'short' }),
  };
};

const generateCitations = (article, siteName = 'Koran Gala 5.0', baseUrl = 'https://korangala.id') => {
  const authorName = article.author?.name || 'Redaksi Koran Gala';
  const { year, day, monthLong, monthShort } = formatDate(article.published_at || article.createdAt);
  const url = `${baseUrl}/artikel/${article.slug}`;
  const title = article.title;

  const apa = `${authorName}. (${year}, ${monthLong} ${day}). ${title}. ${siteName}. ${url}`;
  const harvard = `${authorName}, ${year}. ${title}. [online] ${siteName}. Tersedia di: ${url} [Diakses ${day} ${monthLong} ${year}].`;
  const chicago = `${authorName}. "${title}." ${siteName}, ${monthShort}. ${day}, ${year}. ${url}.`;
  const bibtex = `@online{${(article.slug || 'artikel').replace(/-/g, '_')},
  author = {${authorName}},
  title = {${title}},
  year = {${year}},
  url = {${url}},
  organization = {${siteName}}
}`;

  return { apa, harvard, chicago, bibtex };
};

module.exports = { generateCitations };
