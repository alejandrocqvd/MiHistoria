/**
 * Legal Page Component
 * 
 * This component opens a link to a rick roll lol because I don't know enough legal stuff.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { useEffect } from "react";

const Legal = () => {
  // Open the video in the same window
  useEffect(() => {
    window.location.href = "https://shattereddisk.github.io/rickroll/rickroll.mp4";
  }, []);

  return (
    <div>
      Redirecting to video...
    </div>
  );
};

export default Legal;
