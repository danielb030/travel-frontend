import { Helmet } from 'react-helmet-async';

import { AgencyView } from 'src/sections/agency/view';

// ----------------------------------------------------------------------

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title> agencies </title>
      </Helmet>

      <AgencyView />
    </>
  );
}
