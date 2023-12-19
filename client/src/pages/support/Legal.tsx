import { useEffect } from "react";

const Legal = () => {
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
