import React, { memo } from "react";

const NavBar = () => {
  return (
    <nav className="flex justify-between px-3 py-2 text-white bg-violet-600 text-lg">
      <span className="">iTask</span>
      <ul className="flex gap-3 ">
        <li className="hover:font-bold">Home</li>
        <li className="hover:font-bold">Your Tasks</li>
      </ul>
    </nav>
  );
};

export default memo(NavBar);
