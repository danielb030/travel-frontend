import { Helmet } from 'react-helmet-async';

import { VehicleView } from 'src/sections/vehicle/view';

// ----------------------------------------------------------------------

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title> Vehicles </title>
      </Helmet>

      <VehicleView />
    </>
  );
}
