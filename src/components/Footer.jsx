const Footer = () => {
  return (
    <footer className="relativ text-white pt-10 pb-6">
      {/* Dotted background effect (you can customize with bg image or animation) */}
      {/* <div/> */}

      {/* Top Line Separator */}
      <div className="border-t border-gray-400 w-full z-10 relative"></div>

      {/* Copyright Text */}
      <div className="text-center text-gray-300 text-xl mt-6 z-10 relative">
        Copyright © 2025. All rights reserved. Designed by <span className="text-blue-100">@masuma</span>
      </div>
    </footer>
  );
};

export default Footer;
