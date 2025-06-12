import { Helmet } from 'react-helmet-async';

import { ExcursionView } from 'src/sections/excursion/view';

// ----------------------------------------------------------------------

export default function ExcursionPage() {
  return (
    <>
      <Helmet>
        <title> Excursion </title>
      </Helmet>

      <ExcursionView />
    </>
  );
}
