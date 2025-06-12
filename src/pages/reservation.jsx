import { Helmet } from 'react-helmet-async';

import { ResaView } from 'src/sections/resa/view';

// ----------------------------------------------------------------------

export default function ReservationPage() {
  return (
    <>
      <Helmet>
        <title> Reservations </title>
      </Helmet>

      <ResaView />
    </>
  );
}
