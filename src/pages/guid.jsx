import { Helmet } from 'react-helmet-async';

import { GuidView } from 'src/sections/guid/view';

// ----------------------------------------------------------------------

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title> Guids </title>
      </Helmet>

      <GuidView />
    </>
  );
}
