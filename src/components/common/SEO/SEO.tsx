import { Helmet } from 'react-helmet-async';

export type SEOProps = {
  title: string;
  description: string;
  url: string;
  ogTitle?: string;
  ogImage?: string;
};

// Really useless but not so useless for SPA, just for practice
export function SEO({
  title = 'Pomofocus | An Online Pomodoro App',
  description,
  url,
  ogTitle = 'Pomofocus | An Online Pomodoro App',
  ogImage,
}: SEOProps) {
  return (
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <title>{title}</title>
      <meta property="og:title" content={ogTitle ?? title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

export default SEO;
