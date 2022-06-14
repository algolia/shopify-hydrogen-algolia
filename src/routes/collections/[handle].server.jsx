/**
 * Replace hydrogen collection page
 */
import Layout from '../../components/Layout.server';
import AlgoliaSearch from '../../components/search/AlgoliaSearch.client';

export default function Collections({params}) {
  const {handle} = params;
  return (
    <Layout>
      <AlgoliaSearch collection={handle}></AlgoliaSearch>
    </Layout>
  );
}
