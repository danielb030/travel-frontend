import { Helmet } from 'react-helmet-async';

import { ServiceView } from 'src/sections/service/view';

// ----------------------------------------------------------------------

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title> Services </title>
      </Helmet>

      <ServiceView />
    </>
  );
}
