// import { Outlet } from "react-router-dom";
// import Nav from "./components/Nav";
// import Footer from "./components/Footer";
// import "./index.css";
// import { useState, useEffect, useRef } from "react";
// import { products } from "./data/products";
// import ColorThief from "colorthief";

// function App() {
//   const [index, setIndex] = useState(0);
//   const product = products[index];
//   const imgRef = useRef(null);
//   const [gradientStyle, setGradientStyle] = useState({
//     backgroundColor: "#0F172A",
//     minHeight: "100vh",
//   });

//   useEffect(() => {
//     const img = imgRef.current;
//     if (!img) return;

//     const colorThief = new ColorThief();

//     const handleLoad = () => {
//       try {
//         const [r, g, b] = colorThief.getColor(img);
//         const imageColor = `rgb(${r}, ${g}, ${b})`;

//         // Create gradient background
//        const style = {
//   backgroundImage: `
//     radial-gradient(
//       circle at center,
//       rgba(${r}, ${g}, ${b}, 0.02) 5%,
//       rgba(${r}, ${g}, ${b}, 0.01) 10%,
//       transparent 20%
//     ),

//     radial-gradient(
//       circle at bottom right,
//       #0F172A 10%,
//       transparent 60%
//     ),

//     linear-gradient(to bottom right, #0F172A, ${imageColor}),
//     linear-gradient(to bottom left, #0F172A, ${imageColor}),
//     linear-gradient(to top right, #0F172A, ${imageColor}),
//     linear-gradient(to top left, #0F172A, ${imageColor}),
//     linear-gradient(to bottom, #0F172A, ${imageColor}),
//     linear-gradient(to top, #0F172A, ${imageColor}),
//     linear-gradient(to right, #0F172A, ${imageColor}),
//     linear-gradient(to left, #0F172A, ${imageColor})
//   `,
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "100% 100%",
//   minHeight: "100vh",
//   transition: "background 0.6s ease",
// };


//         setGradientStyle(style);
//       } catch (error) {
//         console.error("ColorThief error:", error);
//       }
//     };

//     if (img.complete) {
//       handleLoad();
//     } else {
//       img.addEventListener("load", handleLoad);
//       return () => img.removeEventListener("load", handleLoad);
//     }
//   }, [product]);

//   return (
//     <div style={gradientStyle}>
//       <Nav />
//       <Outlet context={{ index, setIndex, product, imgRef }} />
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./index.css";
import { useState, useEffect, useRef } from "react";
import ColorThief from "colorthief";

function App() {
  const [index, setIndex] = useState(0);
  const [product, setProduct] = useState({});
  const imgRef = useRef(null);
  const [gradientStyle, setGradientStyle] = useState({
    backgroundColor: "#0F172A",
    minHeight: "100vh",
  });

  // 🟩 UseEffect to extract color from image and apply gradient
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const colorThief = new ColorThief();

    const handleLoad = () => {
      try {
        const [r, g, b] = colorThief.getColor(img);
        const imageColor = `rgb(${r}, ${g}, ${b})`;

        const style = {
          backgroundImage: `
            radial-gradient(circle at center, rgba(${r}, ${g}, ${b}, 0.05) 5%, transparent 25%),
            linear-gradient(to bottom right, #0F172A, ${imageColor}),
            linear-gradient(to top left, #0F172A, ${imageColor})
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          minHeight: "100vh",
          transition: "background 0.6s ease",
        };

        setGradientStyle(style);
      } catch (error) {
        console.error("ColorThief error:", error);
      }
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [product]);

  return (
    <div style={gradientStyle}>
      <Nav />
      {/* 🟦 Passing image ref and state via context */}
      <Outlet context={{ index, setIndex, product, setProduct, imgRef }} />
      <Footer />
    </div>
  );
}

export default App;
