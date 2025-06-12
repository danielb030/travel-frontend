import { Helmet } from 'react-helmet-async';

import { DriverListView } from 'src/sections/driver-list/view';

// ----------------------------------------------------------------------

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title> Drivers </title>
      </Helmet>

      <DriverListView />
    </>
  );
}
