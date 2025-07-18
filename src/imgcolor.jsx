import React, { useEffect } from 'react';
import ColorThief from 'colorthief';

import head1 from '../assets/head1.jpg';

const ColorBG = () => {
  useEffect(() => {
    const img = document.getElementById('mainImage');
    const colorThief = new ColorThief();

    img.onload = () => {
      const color = colorThief.getColor(img);
      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    };
  }, []);

  return (
    <div className="container">
      <img id="mainImage" src={head1} crossOrigin="anonymous" />
    </div>
  );
};

export default ColorBG;
