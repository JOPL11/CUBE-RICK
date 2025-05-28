// seo-injector.js (for Next.js outputting to ./out)
import fs from 'fs';
import path from 'path';

const SEO_HTML = `<!--=============== BASIC META ===============-->
    <meta charset="UTF-8" />
    <title>Jan Peiro | Art Director, Coder & 3D Motion Designer | C4D, WebGL & Three.js</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="robots" content="index, follow" />
    <meta name="keywords" content="3D Motion Design, Art Direction, Three.js, WebGL Animation, Interactive Design, Generative Art, Creative Coding, Brand Identity" />
    <meta name="description" content="Art-directed 3D motion design and interactive experiences. Combining cinematic animation, WebGL, and Three.js to craft immersive brand storytelling." />
    
    <!--=============== OPEN GRAPH / SOCIAL ===============-->
    <meta property="og:title" content="Jan Peiro | Art Director, Coder & 3D Motion Designer | WebGL & Three.js" />
    <meta property="og:description" content="Art-directed 3D motion design and interactive experiences. C4D cinematic animation, WebGL, and Three.js for immersive brand storytelling." />
    <meta property="og:image" content="https://www.jopl.de/images/ChromaLogo2.jpg" />
    <meta property="og:url" content="https://www.jopl.de" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Jan Peiro Portfolio" />
    
    <!--=============== TWITTER CARD (optional) ===============-->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Jan Peiro | Art Director & 3D Motion Designer" />
    <meta name="twitter:description" content="Bridging cinematic 3D animation and interactive WebGL experiences." />
    <meta name="twitter:image" content="https://www.jopl.de/images/ChromaLogo2.jpg" />
    
    <!--=============== CSS ===============-->
    <link type="text/css" rel="stylesheet" href="css/plugins.css" />
    <link type="text/css" rel="stylesheet" href="css/style.css?version=<?php echo time(); ?>" />
    <link type="text/css" rel="stylesheet" href="css/color.css" />
    
    <!--=============== FAVICON ===============-->
    <link rel="shortcut icon" href="images/favicon.ico" />
    
    <!--=============== PRELOAD (performance boost) ===============-->
    <link rel="preload" href="css/style.css" as="style" />
    <link rel="preload" href="js/main.js" as="script" />`;
    const INDEX_PATH = path.join(__dirname, 'out', 'index.html');

    try {
      let html = fs.readFileSync(INDEX_PATH, 'utf8');
      
      // Replace <head> or append if missing
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${SEO_HTML}`);
      } else {
        html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html><head>${SEO_HTML}</head>`);
      }
    
      fs.writeFileSync(INDEX_PATH, html, 'utf8');
      console.log('✅ SEO injected into ./out/index.html');
    } catch (err) {
      console.error('❌ Error injecting SEO:', err);
    }