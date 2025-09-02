import { Outlet } from 'react-router-dom';

import FirstNavbar from './FirstNavbar';
import SecNavbar from './secondnavbar-home';
export default function Home() {


  return (
    <div>
      {/* better naming or use one Navbar */}
      <FirstNavbar />
      <SecNavbar />
      <Outlet />
      {/* secnavbar will be present and the nested will be displayed here */}

    </div>
  );
}