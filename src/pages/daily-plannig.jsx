import { Helmet } from 'react-helmet-async';

import { DailyView } from 'src/sections/daily/view';

// ----------------------------------------------------------------------

export default function DailyPlanningPage() {
  return (
    <>
      <Helmet>
        <title> Daily Planning </title>
      </Helmet>

      <DailyView />
    </>
  );
}
