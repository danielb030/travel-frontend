import { Helmet } from 'react-helmet-async';

import { DriverView } from 'src/sections/driver/view';

// ----------------------------------------------------------------------

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title> Driver Planning </title>
      </Helmet>

      <DriverView />
    </>
  );
}
