/**
 * File based routes of /search for Algolia search page
 */
import Layout from '../components/Layout.server';
import AlgoliaSearch from '../components/search/AlgoliaSearch.client';

export default function Search({request}) {
  const url = new URL(request.normalizedUrl);
  const initialQuery = url.searchParams.get('q'); // workaround for react hooks routing issue to get initial query
  return (
    <Layout>
      <AlgoliaSearch initialQuery={initialQuery}></AlgoliaSearch>
    </Layout>
  );
}
