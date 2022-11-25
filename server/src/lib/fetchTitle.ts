import fetch from 'node-fetch';
import metadata from 'metascraper';
import metadata_title from 'metascraper-title';

export const fetchTitle = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();

  const scraper = metadata([metadata_title()]);
  return (await scraper({ url, html })).title;
};
