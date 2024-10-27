"use client";

import { MoonLoader } from "react-spinners";
import { useEffect, useState } from "react";

const Loader = () => {
  const [primaryColor, setPrimaryColor] = useState("#000"); // Default fallback color

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primary = rootStyles.getPropertyValue("--primary").trim();
    setPrimaryColor(`hsl(${primary})`);
  }, []);

  return (
    <div className="flex flex-1 m-auto">
      <div className="m-auto">
        <MoonLoader color={primaryColor} />
      </div>
    </div>
  );
};

export default Loader;
