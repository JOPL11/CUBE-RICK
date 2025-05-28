// seo-injector.cjs (for Next.js output)
const fs = require('fs');
const path = require('path');

const timestamp = Date.now();

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
    <link type="text/css" rel="stylesheet" href="/_next/static/css/app/layout.css?v=${timestamp}" />
    
    <!--=============== FAVICON ===============-->
    <link rel="shortcut icon" href="/favicon.ico" />
    
    <!--=============== PRELOAD (performance boost) ===============-->
    <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
    <link rel="preload" href="/_next/static/chunks/main-app.js" as="script" />`;

console.log('🔍 Starting SEO injection...');

// Next.js exports to 'out' directory by default
const EXPORT_DIR = 'out';
const INDEX_PATH = path.join(process.cwd(), EXPORT_DIR, 'index.html');

// Create the export directory if it doesn't exist
if (!fs.existsSync(path.dirname(INDEX_PATH))) {
  console.log(`ℹ️  Creating directory: ${path.dirname(INDEX_PATH)}`);
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
}

try {
  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error(`Could not find index.html at ${INDEX_PATH}. Make sure to run 'next build && next export' first.`);
  }
  
  console.log(`📄 Reading file: ${INDEX_PATH}`);
  let html = fs.readFileSync(INDEX_PATH, 'utf8');
  
  // Check if SEO is already injected to avoid duplicates
  if (html.includes('<!--=============== BASIC META ===============-->')) {
    console.log('ℹ️  SEO tags already exist in the file. Skipping injection.');
    process.exit(0);
  }
  
  // Replace <head> or append if missing
  if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>${SEO_HTML}`);
    console.log('✅ Injected SEO tags into existing <head>');
  } else {
    html = `<!DOCTYPE html><head>${SEO_HTML}</head>${html.replace('<!DOCTYPE html>', '')}`;
    console.log('✅ Added <head> with SEO tags');
  }
  
  // Write the modified content back to the file
  fs.writeFileSync(INDEX_PATH, html, 'utf8');
  console.log('✅ Successfully updated index.html with SEO tags');
  
} catch (err) {
  console.error('❌ Error injecting SEO:', err.message);
  process.exit(1);
}