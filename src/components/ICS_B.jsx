'use client'

import { useState, useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { Float, OrbitControls, Html } from '@react-three/drei'
import { TextureLoader } from 'three'
import Cube from './Cube'
import WideCube from './WideCube';
import Lightbox from './Lightbox';
import VideoPlane from './VideoPlane';
import { useThree } from '@react-three/fiber';

const CUBE_SIZE = 2 // Size of each cube
const CUBE_SPACING = 2.1 // Space between cube centers (almost touching)
const CUBE_Y_POSITION = 0 // Consistent Y position for all cubes
const MOBILE_BREAKPOINT = 768 // Width in pixels for mobile/desktop breakpoint
const MOBILE_HORIZONTAL_SPACING = 1.05 // Adjusted horizontal spacing for mobile


const initialCubeTexts = [
  { topLeftText: "NEWS", bottomRightText: "LATEST", htmlUrl: "https://www.jopl.de/2/index3.html", description: `Bear with us while we currently migrate to this new Next.js + React 3 Fiber format –  
    there might be some large and small corrections. 
    
    As for the text, it will definitely be updated. 
    
    Until its done, you can check out the old html5 site.` },
  { topLeftText: "ABOUT", 
    bottomRightText: "SKILLS", 
    htmlUrl: "https://www.jopl.de/2/portfolio-main.html",
    description: `A multidisciplinary creator from Montreal Canada, passionate about design, 3D, code, and motion - ranging from strict brand systems to boundary-pushing exhibits.

Studied Communication-Design in Munich Germany. Currently based in Germany.

Design skills include Layout, Screen-Design, Print, Illustration, Painting, Concept Sketches, Typography, CI, Campaign Psychology, Adobe Suite.

Motion skills include 3D Modeling, 2D/3D Animation, Cinema4D, Blender. Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing. Render Engines: Octane, Redshift, Corona, Media Encoder, Handbrake and a ton of related peripheral stuff that, I mean we're gonna be here all day if I have to mention everything. Let's not get ludicrous. Some guy: "Do you do Advanced Lighting?" Me: "Yes, I do Advanced Lighting." I do Motion; From visual & motion concept to 2D / 3D asset-creation to screen-design to render, edit & post-production.

Code skills include Next.js, Three.js, React 3 Fiber (thats React with a 3D WebGL render engine), WebXR, AFrame, GSAP, javascript, html5, css, Vite, npm, yarn.

AI Skills include Stable Diffusion with custom workflows via ComfyUI, LoRAs and leveraging LLM's to achieve my goals, not the other way around.

Spoken languages are English, German, Spanish and French. Canada / EU dual citizen.` },
{ 
  topLeftText: "ART-DIRECTION", 
  bottomRightText: "GALLERY", 
  htmlUrl: "https://www.jopl.de/2/portfolio-main.html",
  videoUrl: "https://www.jopl.de/2/new/Reel2025_A.mp4" ,
  description: `I create and implement visual concepts, from original designs to refining existing CI/CD systems, with expertise in animation and interactive development. 3+ years management experience.

15+ years collaborating with agencies, in-house teams, and startups - balancing innovation with brand 
compliance, ensuring visual consistency across all deliverables.` },
  { topLeftText: "C4D + AE", bottomRightText: "2D / 3D MOTION DESIGN", description: `Motion skills include 3D Modeling, 2D/3D Animation, Cinema4D, Blender. 
    
    Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing. 
    
    Render Engines: Octane, Redshift, Corona, Media Encoder, Handbrake and a ton of related peripheral stuff that, I mean we're gonna be here all day if I have to mention everything. Let's not get ludicrous. 
    
    I do Motion; From visual & motion concept to 2D / 3D asset-creation to screen-design to render, edit & post-production. 
    
    Opens in a new window.`, 
    videoUrl: "https://www.jopl.de/2/video/reel.mp4" },
  { topLeftText: `3D MOTION`, 
    bottomRightText: "SHORT REEL",     
    htmlUrl: "https://www.jopl.de/2/portfolio-main.html", 
    videoUrl: "https://www.jopl.de/2/video/reel.mp4" , description: `Showreel showing pure 3D Motion-design.

    - Corporate Logos showcase the companies the scenes were made for.
    - A short description of the project was added for many projects. 

    Opens in a new window.` },
  { topLeftText: `UI/UX DEVELOPMENT`, 
    bottomRightText: "CASE STUDY", 
    htmlUrl: "https://www.jopl.de/2/portfolio-airbus-berlin3.html", 
    description: `Airbus Berlin headquarters Showroom Exhibit.

    Opens in a new window.` },
  { topLeftText: `XR/3D DEVELOPMENT`, bottomRightText: "INTERACTIVE", 
    htmlUrl: "https://www.jopl.de/2/experiments.html", 
    description: `WARNING: This link leads to an experimental playground. A collection of personal experiments showcasing:

    - Interactive 3D WebGL Experiments
    - WebXR Experiments for use in the Quest3S headset.(Which is awesome by the way.)
    
    Pure creative play - no commercial constraints. Not for the corporately obsessed.`},
    { topLeftText: "NEXT.JS", bottomRightText: "COMING SOON", description: "" },
    { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: `IMPRESSUM

Angaben gemäß § 5 TMG

      Jan Peiro-Lehmann
      Kommunikationsdesigner Dipl.
      Center for Innovation & Technology (TZL)
      Donnersbergweg 1
      67059 Ludwigshafen am Rhein
      
      Kontakt
      
      Telefon: (+49) 01520 - 317 2291
      E-Mail: jan.peiro@protonmail.com
      
      
      Es gelten folgende berufsrechtliche Regelungen:
      Verbraucher­streit­beilegung/
      Universal­schlichtungs­stelle
      
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

      Haftung für Inhalte
      
      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

      Haftung für Links
      
      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

      Urheberrecht
      
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

      Datenschutzerklärung
      
      Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
      
      Jan Peiro-Lehmann
      
      Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

      Quelle: e-recht24.de ` },
      
]
const initialCubeTexts2 = [
    { topLeftText: "NEWS", bottomRightText: "NEUIGKEITEN", description: "Derzeit migrieren wir zu diesem neuen Next.js + React Three Fiber Format – es wird sich alles noch verändern, insbesonders die Texte. bis es fertig ist, können Sie die alte HTML5-Website besuchen.", externalUrl: "https://www.jopl.de/2/index2.html", videoUrl: "/videos/video2.mp4" },
    { topLeftText: "ÜBER MICH", 
      bottomRightText: "SKILLS", 
      description: `Ein multidisziplinärer Kreativer aus Montreal, Kanada, mit Leidenschaft für Design, 3D, Code und Motion – von strengen Markensystemen bis zu grenzsprengenden Ausstellungen.
  
  Studierte Kommunikationsdesign in München, Deutschland. Derzeit in Deutschland ansässig.
  
  Design-Skills:
  Layout, Screen-Design, Print, Illustration, Malerei, Konzeptskizzen, Typografie, CI, Kampagnenpsychologie, Adobe Suite.
  
  Motion-Skills:
  3D-Modellierung, 2D/3D-Animation, Cinema4D, Blender. Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing. Render-Engines: Octane, Redshift, Corona, Media Encoder, Handbrake – und eine Menge verwandter Tools, die hier aufzuzählen den Rahmen sprengen würde. (Frage: „Können Sie Advanced Lighting?“ Antwort: „Ja, kann ich.“) Ich mache Motion – vom visuellen Konzept über 2D/3D-Asset-Erstellung bis zu Screen-Design, Rendering, Schnitt und Postproduktion.
  
  Code-Skills:
  Next.js, Three.js, React Three Fiber (für Deutsche: WebGL mit React-Basis), WebXR, AFrame, GSAP, javascript, html5, css, Vite, npm, yarn.
  
  AI-Skills:
  Stable Diffusion mit individuellen Workflows via ComfyUI, LoRAs sowie der strategische Einsatz von LLMs – die Technik dient meinen Zielen, nicht umgekehrt.
  
  Sprachen:
  Englisch, Deutsch, Spanisch, Französisch. Doppelstaatsbürger (Kanada/EU).
  
  Zur deutschen Sprache:
  Ich kommuniziere direkt und unverschlüsselt – so, wie es im Duden steht, nicht wie im Wirtschaftsprotokoll.` },
  { topLeftText: "ART-DIRECTION", 
    bottomRightText: "GALERIE", 
    description: `Ich entwickle und setze visuelle Konzepte um – von Originaldesigns bis zur Verfeinerung bestehender CI/CD-Systeme – mit Expertise in Animation und interaktiver Entwicklung. Mehr als 3 Jahre Führungserfahrung.
  
  15+ Jahre Zusammenarbeit mit Agenturen, Inhouse-Teams und Startups - immer im Spannungsfeld zwischen 
  Innovation und Markenkonformität, um visuelle Konsistenz über alle Deliverables hinweg zu gewährleisten. Images coming soon.
  `, videoUrl: "https://www.jopl.de/2/video/reel.mp4", 
  htmlUrl: "https://www.jopl.de/2/portfolio-airbus-berlin3.html"  },
    { topLeftText: "AFTER EFFECTS", bottomRightText: "2D / 3D MOTION DESIGN", description: `Motion-Skills umfassen:
  3D-Modellierung, 2D/3D-Animation, Cinema4D, Blender.
  
  Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing.
  
  Render-Engines:
  Octane, Redshift, Corona, Media Encoder, Handbrake – und jede Menge Zubehör, das hier aufzulisten den Rahmen sprengen würde. (Frage: „Beherrschen Sie Advanced Lighting?“ Antwort: „Ja, das beherrsche ich.“)
  
  Ich mache Motion – vom visuellen Konzept über 2D/3D-Asset-Erstellung bis zu Screen-Design, Rendering, Schnitt und Postproduktion.
  
  .`, videoUrl: "https://www.jopl.de/2/video/reel.mp4" },
    { topLeftText: `CINEMA4D & AFTER-EFFECTS`, bottomRightText: "MOTION REEL", description: `Showreel mit reinem 3D-Motion-Design:
  
      Gezeigte Corporate-Logos kennzeichnen die Unternehmen, für die die Szenen erstellt wurden.
  
      Zu vielen Projekten wurde eine kurze aber prägnante Beschreibung hinzugefügt.
  
  Öffnet in einem neuen Fenster.`, 
  videoUrl: "https://www.jopl.de/2/video/reel.mp4", 
  htmlUrl: "https://www.jopl.de/2/portfolio-main.html" 
  },
    { topLeftText: `ANIMATION`, bottomRightText: "MOTION REEL 2", description: `Showreel mit 3D-Motion-Design, 2D-Motion-Design, 2D-Textanimation, 2D-Character-Animation in 3D-Umgebungen, IK-Animation – kurzum: Das volle Programm (fast).
  
      Corporate-Logos zeigen die Unternehmen, für die die Szenen erstellt wurden.
  
      Im Grunde ein Motion-Smorgasbord der Fähigkeiten, eingesetzt in echten Projekten.
  
  Öffnet in einem neuen Fenster.` },
    { topLeftText: `XR/3D Development`, bottomRightText: "INTERACTIVE", description: `WARNUNG: Dieser Link führt zu einem experimentellen Spielplatz.
  
  Eine Sammlung persönlicher Experimente, die zeigen:
  
      Interaktive WebGL-3D-Experimente
  
      WebXR-Experimente für die Nutzung mit dem Quest3S-Headset (das übrigens fantastisch ist).
  
  Pur terrain de jeu créatif – frei von kommerziellen Zwängen. Nichts für Corporate-Fanatiker.
  
  Öffnet in einem neuen Fenster.`, externalUrl: "https://www.jopl.de/2/experiments.html" },
    { topLeftText: "NEXT.JS", bottomRightText: "COMING SOON", description: "" },
    { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: `IMPRESSUM

Angaben gemäß § 5 TMG

      Jan Peiro-Lehmann
      Kommunikationsdesigner Dipl.
      Center for Innovation & Technology (TZL)
      Donnersbergweg 1
      67059 Ludwigshafen am Rhein
      
      Kontakt
      
      Telefon: (+49) 01520 - 317 2291
      E-Mail: jan.peiro@protonmail.com
      
      
      Es gelten folgende berufsrechtliche Regelungen:
      Verbraucher­streit­beilegung/
      Universal­schlichtungs­stelle
      
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

      Haftung für Inhalte
      
      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

      Haftung für Links
      
      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

      Urheberrecht
      
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

      Datenschutzerklärung
      
      Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
      
      Jan Peiro-Lehmann
      
      Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

      Quelle: e-recht24.de ` },
  ]
  
const initialCubeTexts3 = [
    { topLeftText: "VENT NOUVEAU", bottomRightText: "MUTATION", description: "Il va y avoir beaucoup de modifications, surtout pour le texte. Actuellement, nous migrons vers ce nouveau format Next.js + React Three Fiber – en attendant sa finalisation, vous pouvez visiter l'ancien site en HTML5.", htmlUrl: "https://www.jopl.de/2/index3.html" , videoUrl: "/videos/video3.mp4" },
    { topLeftText: "À PROPOS", 
      bottomRightText: "Profil professionnel", 
      description: `Créatif multidisciplinaire né à Barcelone, formé à Montréal et maintenant établi en Allemagne. Passionné par le design, la 3D et le motion, je navigue entre systèmes d'identité rigoureux et créations expérimentales.
  
  QUI SUIS-JE
  Créatif technique quadrilingue (EN/DE/FR/ES) avec un accent québécois édulcoré par 20 ans d'expat' entre Barcelone, Philadelphie, Toronto et Munich. Spécialiste hybrides design/motion/code. 
  
  MES ARSENAUX
  
  DESIGN:
  
      • Layout • UI • Print • Illustration • Peinture • Croquis • Suite Adobe • Typographie • Identité visuelle (CI) • Psychologie des campagnes 
  
  2D / 3D :
  
      De la modélisation procédurale au rigging complexe (IK/FK)
  
      Rendu photoréaliste (Octane/Redshift/Chaos Render) et stylisé
  
      Pipeline Cinema4D/Blender → After Effects oubien Pipeline Blender → React 3 Fiber
  
      Animation traditionelle et assistée (Duik Tools (IK/FK), Lottie, Bodymovin, et plus. )
  
      VFX avancés (Stardust, Plexus, Moccha, VideoCopilot, Red Giant, audio )
  
      Post-prod couleur, étalonnage et compositing
  
  Code Créatif :
  
  1. SEO Technique & Contenu
  
  Architecture Jamstack (Next.js, Gatsby) pour un rendu ultra-rapide.
  
      Audit et optimisation Core Web Vitals (LCP, FID, CLS).
  
      Balisage sémantique (Schema.org, OpenGraph) et stratégie de mots-clés.
  
  2. Expériences 3D/XR Immersives
  
      WebGL/Three.js : Animations interactives, effets visuels "scroll-based".
  
      WebXR : Prototypage rapide d'expériences VR/AR accessibles dans le navigateur.
  
      Intégration React Three Fiber pour une 3D déclarative et réactive.
  
  3. Performance Web Exigeante
  
      Chargement intelligent des assets 3D (GLTF compression, suspense).
  
      Optimisation des shaders et gestion du garbage collection.
  
      Hybridation React + Web Workers pour du calcul lourd sans bloquer l'UI.
  
  4. Automatisation & Micro-Optimisations
  
      Scripts CI/CD (GitHub Actions) pour le déploiement automatisé.
  
      Outils maison (JS/CSS) pour générer des grids, palettes de couleurs, etc.
  
  IA Générative :
  
      Workflows Stable Diffusion optimisés
  
      Fine-tuning avec LoRAs personnalisés
  
      Intégration dans des pipelines pro
  
  POURQUOI MOI
  ✓ 15 ans à résoudre des problèmes complexes
  ✓ Bilingue technique (même si mon "accent est maintenant plus Munichois que Montréalais")
  ✓ Double culture design européen & approche nord-américaine
  ✓ Grand admirateur de la tranquillité interstellaire
  
  CE QU'ON DIT DE MOI
  "Il parle le langage des artistes et des développeurs - et son accent est devenu un charmant mélange transatlantique."` },
  { topLeftText: "ART DIRECTOR", bottomRightText: "GALERIE", description: `Je conçois et implémente des concepts visuels, 
    des créations originales à l'optimisation de systèmes CI/CD existants, avec une expertise en animation et 
    développement interactif. Plus de 3 ans d'expérience en management.
  
  15+ ans de collaboration avec des agences, des équipes internes et des startups - 
  alliant innovation et conformité à l'identité de marque, tout en garantissant une 
  cohérence visuelle sur tous les livrables.`, htmlUrl: "https://www.jopl.de/2/portfolio-main.html",
  videoUrl: "https://www.jopl.de/2/new/Reel2025_A.mp4" },
  { topLeftText: "AFTER EFFECTS / CINEMA4D", bottomRightText: "APERÇU TECHNIQUE", description: `Compétences en Motion :
  
      Modélisation 3D
  
      Animation 2D/3D
  
      Logiciels : Cinema4D, Blender
  
  Postproduction & Effets :
  
      Montage : Premiere
  
      Effets visuels : After Effects (Expressions, Stardust, Plexus)
  
      Outils complémentaires : VideoCopilot, Red Giant, Duik Tools (IK/FK)
  
      Animation web : Lottie, Bodymovin
  
      Traitement audio, étalonnage, compositing
  
  Moteurs de rendu :
  
      Octane, Redshift, Corona
  
      Encodage : Media Encoder, Handbrake
  
      ... et bien d'autres outils trop nombreux à mentionner.
      (« Maîtrisez-vous l'éclairage avancé ? » — « Oui, parfaitement. »)
  
  Je prends en charge l'intégralité du processus motion :
  du concept visuel → création d'assets 2D/3D → design d'interface → rendu → montage → postproduction.
  
  (Ouvre dans une nouvelle fenêtre.)`,  htmlUrl: "https://www.jopl.de/2/portfolio-main.html",
  videoUrl: "https://www.jopl.de/2/new/Reel2025_A.mp4" },
    { topLeftText: `MOTION RAPIDE`, bottomRightText: "(Version courte)", description: `Showreel de motion design 3D pur :
      Ce showreel 3D présente des projets réalisés pour les marques identifiées par leurs logos. Des notices descriptives accompagnent les principaux travaux.
  
      Les logos d'entreprise affichés identifient les sociétés pour lesquelles les scènes ont été créées.
  
      Des descriptions courtes mais percutantes accompagnent de nombreux projets.
  
  (Ouvre dans une nouvelle fenêtre.)`, },
    { topLeftText: `MONTAGE MOTION COMPLET`, bottomRightText: "(Version Longue)", description: `Showreel : Motion Design tout-en-un
  Un concentré de motion design : hybridations 2D/3D, personnages animés en IK, typographie vivante – le tout au service de marques identifiées par leurs logos.
  
      Les logos clients identifient les entreprises pour lesquelles les séquences ont été produites.
  
      Un véritable buffet de compétences motion, déployées sur des projets réels.
  
  (Ouvre dans une nouvelle fenêtre.)`, },
    { topLeftText: `XR/3D Developer`, bottomRightText: "INTERACTIVE", description: `AVERTISSEMENT : Ce lien mène à un laboratoire expérimental.
  
  Une collection de projets personnels explorant :
  
      Expériences interactives WebGL/3D
  
      Prototypes WebXR (optimisés pour Quest 3S – un casque remarquable, soit dit en passant)
  
  Pur terrain de jeu créatif – zéro contrainte commerciale.
  Clairement pas fait pour les adeptes du corporatisme.
  
  (Ouvre dans une nouvelle fenêtre.)`, externalUrl: "https://www.jopl.de/2/experiments.html" },
    { topLeftText: "NEXT.JS", bottomRightText: "PROCHAINEMENT", description: "" },
    { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: `IMPRESSUM

Angaben gemäß § 5 TMG

      Jan Peiro-Lehmann
      Kommunikationsdesigner Dipl.
      Center for Innovation & Technology (TZL)
      Donnersbergweg 1
      67059 Ludwigshafen am Rhein
      
      Kontakt
      
      Telefon: (+49) 01520 - 317 2291
      E-Mail: jan.peiro@protonmail.com
      
      
      Es gelten folgende berufsrechtliche Regelungen:
      Verbraucher­streit­beilegung/
      Universal­schlichtungs­stelle
      
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

      Haftung für Inhalte
      
      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

      Haftung für Links
      
      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

      Urheberrecht
      
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

      Datenschutzerklärung
      
      Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
      
      Jan Peiro-Lehmann
      
      Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

      Quelle: e-recht24.de `},
  ]



const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function CubeLayout({ onCubeSelect }) {
    const [isMobile, setIsMobile] = useState(false)
    const logoTexture = useLoader(TextureLoader, '/images/logo2.png')
    const shadowTexture = useLoader(TextureLoader, '/images/shadows.png')
    const [showImpressum, setShowImpressum] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxContent, setLightboxContent] = useState(null);
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])
  
    const getCubeColor = (index) => {
      return index % 2 === 0 ? "white" : "#3d3d3d"
    }
    const MobileWideCube = ({ position, text, text2, onClick }) => {
      const width = CUBE_SPACING * 2.02;
      const height = CUBE_SIZE * 0.5;
      
      return (
        <group position={position}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.05}>
            {/* Cube Mesh */}
            <mesh onClick={onClick}>
              <boxGeometry args={[width-0.15, height+0.9, height+0.5 ]} />
              <meshStandardMaterial 
                color="white"
                metalness={0.1}
                roughness={0.3}
              />
            </mesh>
            
            {/* Proper Text Component */}
            <Text
              position={[-1.44, height * 1, -0.4]}
              rotation={[-Math.PI/2, 0, 0]}
              fontSize={0.22}
              color="#3d3d3d"
              maxWidth={width * 0.9}
              anchorX="center"
              anchorY="middle"
              font={myFont2} // ← Specify your font
            >
              {text}
            </Text>
            <Text
               position={[1.55, height * 1, 0.5]}
              rotation={[-Math.PI/2, 0, 0]}
              fontSize={0.15}
              color="#3d3d3d"
              maxWidth={width * 0.9}
              anchorX="center"
              anchorY="middle"
              font={myFont} // ← Specify your font
            >
              {text2}
            </Text>
          </Float>
        </group>
      )
    }
  
  
    const WideCube2 = ({ position, text, text2, onClick }) => {
      const width = CUBE_SPACING * 3.05;
      const height = CUBE_SIZE * 0.8;
      
      return (
        <group position={position}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            {/* WideCube Base */}
            <mesh onClick={onClick}>
              <boxGeometry args={[width-0.15, height+0.3, height+0.5]} />
              <meshStandardMaterial 
                color="white"
                metalness={0.1}
                roughness={0.3}
              />
            </mesh>
            {/* Purple Plane on Top Face */}
            <mesh position={[0, (height+0.3)/2 + 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>  {/* VIDEOPLANE HEIGHT */}
              <planeGeometry args={[width-0.15, height+0.5]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Texts */}
            <Text
              position={[-2.4, height * 0.6, -0.65]}
              rotation={[-Math.PI/2, 0, 0]}
              fontSize={0.25}
              color="#3d3d3d"
              maxWidth={width * 0.9}
              anchorX="center"
              anchorY="middle"
              font={myFont2}
            >
              {text}
            </Text>
            <Text
              position={[2.52, height * 0.6, 0.78]}
              rotation={[-Math.PI/2, 0, 0]}
              fontSize={0.15}
              color="#3d3d3d"
              maxWidth={width * 0.9}
              anchorX="center"
              anchorY="middle"
              font={myFont}
            >
              {text2}
            </Text>
          </Float>
        </group>
      );
    };

    
  
    if (isMobile) {
      const Z_OFFSET = -3.0;
      return (
        <>
            {/* Row Zero */}
            <group position={[0, CUBE_Y_POSITION + 2.0, -CUBE_SPACING * 3.95]}>
          {/* ↑ Adjust Y (+1) and Z (-2.5) to fine-tune placement
          <LottieHeader 
          path="/images/data_logo.json"
          position={[0, 0.0005, 1]}
          scale={0.7}
          opacity={0.5}
        />
         */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube
              position={[0, -1, 1]}
              topLeftText="HEADER"
              bottomRightText="VISUALS"
              onClick={() => console.log('Header clicked')}
              color="white"
              scale={[2, 3, 2]} // 3 cubes wide plus 2 gaps
            />
          </Float>
        </group>
          {/* First row       color={getCubeColor(0)} */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[0].topLeftText}
                bottomRightText={initialCubeTexts[0].bottomRightText}
                onClick={() => onCubeSelect(0)}
          
                color="#3d3d3d"
                videoUrl={initialCubeTexts[0].videoUrl}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[1].topLeftText}
                bottomRightText={initialCubeTexts[1].bottomRightText}
                onClick={() => onCubeSelect(1)}
                color="#3d3d3d"
                videoUrl={initialCubeTexts[1].videoUrl}
              />
            </Float>
          </group>
  
          {/* Second row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
        
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[2].topLeftText}
                bottomRightText={initialCubeTexts[2].bottomRightText}
                onClick={() => onCubeSelect(2)}
             color="#3d3d3d"
                videoUrl={initialCubeTexts[2].videoUrl}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[3].topLeftText}
                bottomRightText={initialCubeTexts[3].bottomRightText}
                onClick={() => onCubeSelect(3)}
                color="#3d3d3d"
                videoUrl={initialCubeTexts[3].videoUrl}
              />
            </Float>
          </group>
  
          {/* Third row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[4].topLeftText}
                bottomRightText={initialCubeTexts[4].bottomRightText}
                onClick={() => onCubeSelect(4)}
                color="#3d3d3d"
                videoUrl={initialCubeTexts[4].videoUrl}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[5].topLeftText}
                bottomRightText={initialCubeTexts[5].bottomRightText}
                onClick={() => onCubeSelect(5)}
                color={getCubeColor(5)}
                videoUrl={initialCubeTexts[5].videoUrl}
              />
            </Float>
          </group>
  
          {/* Fourth row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[6].topLeftText}
                bottomRightText={initialCubeTexts[6].bottomRightText}
                onClick={() => onCubeSelect(6)}
               color="#3d3d3d"
                videoUrl={initialCubeTexts[6].videoUrl}
              />
            </Float>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
          
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[7].topLeftText}
                bottomRightText={initialCubeTexts[7].bottomRightText}
                onClick={() => onCubeSelect(7)}
                color="#3d3d3d"
                videoUrl={initialCubeTexts[7].videoUrl}
              />
            </Float>
          </group>
  
          {/* Fifth row (single cube) */}
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING * 3 + Z_OFFSET]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <Cube 
                topLeftText={initialCubeTexts[8].topLeftText}
                bottomRightText={initialCubeTexts[8].bottomRightText}
                onClick={() => onCubeSelect(8)}
                color={"white"}
                videoUrl={initialCubeTexts[8].videoUrl}
              />
            </Float>
          </group>
          <mesh
            position={[0, -1.5, 0]} // adjust Y to match cube base
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
            scale={[6.5, 6.5, 1]} // covers the grid area
          >
            <planeGeometry args={[1.2, 1.2]} />
            <meshBasicMaterial
              map={shadowTexture}
              transparent={true}
              opacity={0.5}
              depthWrite={false}
              polygonOffset={true}
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </mesh>
        </>
      )
    }
  
    return (
      <>
      {/* Row Zero ============================= DESKTOP STARTS HERE ============================================================*/}
          <group position={[0, CUBE_Y_POSITION + 1.0, -CUBE_SPACING * 2.5]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
              <WideCube
                position={[0, -0.1, 1]}
                topLeftText=""
                bottomRightText=""
                onClick={() => {
                  onCubeSelect(0);
                  console.log('WideCube clicked');
                }}
                color="#3d3d3d"
                videoUrl="/videos/sample4N.mp4"
              />
            </Float>
          </group>
        {/* First row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
         
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[0].topLeftText}
              bottomRightText={initialCubeTexts[0].bottomRightText}
              onClick={() => onCubeSelect(0)}
          
              color="#3d3d3d"
              videoUrl={"videos/sample4N.mp4"}
            />
          </Float>
        </group>
        <group position={[0, CUBE_Y_POSITION, -CUBE_SPACING]}>
      
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[1].topLeftText}
              bottomRightText={initialCubeTexts[1].bottomRightText}
              onClick={() => onCubeSelect(1)}
              color="#3d3d3d"
              videoUrl={initialCubeTexts[1].videoUrl}
            />
          </Float>
        </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
  
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[2].topLeftText}
              bottomRightText={initialCubeTexts[2].bottomRightText}
              onClick={() => onCubeSelect(2)}
             color="#3d3d3d"
              videoUrl={initialCubeTexts[2].videoUrl}
            />
          </Float>
        </group>
  
        {/* Second row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, 0]}>
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[3].topLeftText}
              bottomRightText={initialCubeTexts[3].bottomRightText}
              onClick={() => onCubeSelect(3)}
              color={getCubeColor(1)}
              videoUrl={initialCubeTexts[3].videoUrl}
            />
          </Float>
        </group>
        <group position={[0, CUBE_Y_POSITION, 0]}>
    <Float speed={1.7} rotationIntensity={0.3} floatIntensity={0.1}>
      <Cube 
        topLeftText={initialCubeTexts[4].topLeftText}
        bottomRightText={initialCubeTexts[4].bottomRightText}
        onClick={() => onCubeSelect(4)}
        color={getCubeColor(1)}
        videoUrl={initialCubeTexts[4].videoUrl}
        logo={logoTexture}
      />
    </Float>
  </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, 0]}>
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[5].topLeftText}
              bottomRightText={initialCubeTexts[5].bottomRightText}
              onClick={() => onCubeSelect(5)}
              color={getCubeColor(1)}
              videoUrl={initialCubeTexts[5].videoUrl}
            />
          </Float>
        </group>
  
        {/* Third row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
        
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[6].topLeftText}
              bottomRightText={initialCubeTexts[6].bottomRightText}
              onClick={() => onCubeSelect(6)}
              color={getCubeColor(1)}
              videoUrl={initialCubeTexts[6].videoUrl}
            />
          </Float>
        </group>
        <group position={[0, CUBE_Y_POSITION, CUBE_SPACING]}>
      
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[7].topLeftText}
              bottomRightText={initialCubeTexts[7].bottomRightText}
              onClick={() => onCubeSelect(7)}
              color={getCubeColor(1)}
              videoUrl={initialCubeTexts[7].videoUrl}
            />
          </Float>
        </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube 
              topLeftText={initialCubeTexts[8].topLeftText}
              bottomRightText={initialCubeTexts[8].bottomRightText}
              onClick={() => onCubeSelect(8)}
              color={getCubeColor(1)}
              videoUrl={initialCubeTexts[8].videoUrl}
            />
          </Float>
        </group>
        <mesh
          position={[0, -1.5, 0]} // adjust Y to match cube base
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={1}
          scale={[6.5, 6.5, 1]} // covers the grid area
        >
          <planeGeometry args={[3.2, 3.0]} />
          <meshBasicMaterial
            map={shadowTexture}
            transparent={true}
            opacity={0.8}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      </>
    )
  }

  export default function InteractiveCubesScene() {
    const { gl } = useThree();
    const [selectedCube, setSelectedCube] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('de');
    const [iframeUrl, setIframeUrl] = useState(null);
    const [isFrozen, setIsFrozen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // Critical initialization (must exist before use)
    const cubeTexts = 
      activeLanguage === 'de' ? initialCubeTexts2 :
      activeLanguage === 'fr' ? initialCubeTexts3 : 
      initialCubeTexts;

    const handleCubeSelect = (index) => {
      setSelectedCube(index);
      // Lightbox functionality kept but not triggered here
    };
    // iFrame Button handler
    const handleHtmlButtonClick = async () => {
      setIframeUrl(cubeTexts[selectedCube]?.htmlUrl);
    };


        // iFrame Button handler
        const handleVideoButtonClick = async () => {
          setIframeUrl(cubeTexts[selectedCube]?.videoUrl);
        };

    useEffect(() => {
      const mainElement = document.querySelector('.main-scene-container');
      if (iframeUrl) {
        document.body.classList.add('freeze-ui');
        mainElement?.classList.add('scene-blur');
      } else {
        document.body.classList.remove('freeze-ui');
        mainElement?.classList.remove('scene-blur');
      }
      return () => {
        document.body.classList.remove('freeze-ui');
        mainElement?.classList.remove('scene-blur');
      };
    }, [iframeUrl]);

    return (
      <group>
        <group visible={true}>
          <CubeLayout onCubeSelect={handleCubeSelect} />
          {/* ... other scene elements ... */}
          </group>
        
        {/* Simplified Editor UI */}
        {selectedCube !== null && (
          <Html
            className="html-panel"
            calculatePosition={(el, camera, size) => {
              const isMobile = window.innerWidth < MOBILE_BREAKPOINT
              return [isMobile ? size.width / 2 - 230 : size.width / 2 - 235, 20]
            }}
            style={{
              width: '420px',
              pointerEvents: 'auto',
              touchAction: 'auto',
              zIndex: 1000,
            }}
          >
            <div 
              style={{
                position: 'relative',
                top: '0',
                left: '50%',
                transform: 'translate(-50%, 0)',
                width: '420px',
                pointerEvents: 'auto',
                touchAction: 'auto',
                margin: '0 20px',
                padding: '20px',
                zIndex: 1000,
              }}
            >
              <div 
                style={{
                  background: '#15171c',
                  padding: '20px',
                  borderRadius: '11px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                  color: '#e0e0e0',
                  width: '100%',
                  maxHeight: '80vh',
                  display: 'flex',
                  fontFamily: 'InterDisplay-ExtraLight, sans-serif',
                  flexDirection: 'column',
                  pointerEvents: 'auto',
                  touchAction: 'auto',
                  zIndex: 1000,
                  WebkitTapHighlightColor: 'transparent'
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()} 
              >
                {/* Header */}
                <div style={{
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'InterDisplay-Bold, sans-serif'
                }}>
                  <div style={{ fontSize: '1.2em' }}>
                    {cubeTexts[selectedCube]?.topLeftText}
                  </div>
                  <div 
                    onClick={() => setActiveLanguage(prev => 
                      prev === 'en' ? 'de' : 
                      prev === 'de' ? 'fr' : 
                      'en'
                    )}
                    style={{ 
                      fontSize: '0.8em', 
                      color: '#fff', 
                      fontFamily: 'InterDisplay-ExtraLight, sans-serif',
                      marginLeft: '100px',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      touchAction: 'auto',
                      WebkitTapHighlightColor: 'transparent',
                      display: 'flex',
                      gap: '0.5em',
                    }}
                  >
                    {['EN', 'DE', 'FR'].map((lang, idx) => {
                      // Determine language code for comparison
                      const code = lang.toLowerCase();
                      // For cycling order
                      let displayOrder;
                      if (activeLanguage === 'en') displayOrder = ['DE', 'FR', 'EN'];
                      else if (activeLanguage === 'de') displayOrder = ['EN', 'FR', 'DE'];
                      else displayOrder = ['EN', 'DE', 'FR'];
                      const displayLang = displayOrder[idx];
                      const codeForDisplay = displayLang.toLowerCase();
                      return (
                        <span
                          key={displayLang}
                          style={{
                            color: activeLanguage === codeForDisplay ? '#f57500' : '#fff',
                            fontWeight: activeLanguage === codeForDisplay ? 'bold' : 'normal',
                            textShadow: activeLanguage === codeForDisplay ? '0 0 4px #f57500' : undefined
                          }}
                        >
                          {displayLang}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ fontSize: '1.0em', 
                  color: '#aaa', 
                  fontFamily: 'InterDisplay-Bold, sans-serif', 
                  marginBottom: '22px',}}>
                    {cubeTexts[selectedCube]?.bottomRightText}
                  </div>
                 {/* Editor UI */}
     
                {/* Text content with perfect paragraph handling */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  paddingRight: '8px',
                  whiteSpace: 'pre-line',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  fontFamily: 'InterDisplay-ExtraLight, sans-serif',
                  fontSize: '1.2em',
                }}>
                  {cubeTexts[selectedCube]?.description?.split('\n\n').map((paragraph, i) => (
                    <p key={i} style={{ 
                      marginBottom: '1em',
                      lineHeight: '1.5'
                    }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

        {/* the horror.. the horror...  */}
         {selectedCube !== null && (
        <div style={{
          position: 'relative',
          top: '25px',
          right: '20px',
          background: 'transparent',
          padding: '20px',
          borderRadius: '2px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.0)',
          zIndex: 1000,
          color: '#e0e0e0',
          width: '380px',
          maxHeight: '80vh',
          display: 'flex',
          fontFamily: 'InterDisplay-ExtraLight, sans-serif',
          flexDirection: 'column'
        }}>

          {cubeTexts[selectedCube].videoUrl && (
            <button
            onClick={handleVideoButtonClick}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f57500',
                border: 'none',
                borderRadius: '11px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              </svg>
              Watch Video
            </button>
          )}
          
          {cubeTexts[selectedCube].externalUrl && (
            <button
            onClick={handleHtmlButtonClick}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f57500',
                border: 'none',
                borderRadius: '11px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LinkIcon />
              Open URL
            </button>
          )}
          </div>
          )}
                {/* Close button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCube(null);
                  }}
                  style={{ 
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#404040',
                    border: 'none',
                    borderRadius: '11px',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    pointerEvents: 'auto',
                    touchAction: 'auto',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Html>
        )}
        {iframeUrl && (
          <group>
            <VideoPlane url={iframeUrl} />
            <Html>
              <button 
                onClick={() => setIframeUrl(null)}
                style={{
                  position: 'fixed',
                  top: '20px',
                  right: '20px',
                  padding: '12px 24px',
                  background: '#f57500',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  zIndex: 10001
                }}
              >
                CLOSE
              </button>
            </Html>
          </group>
        )}
      </group>
    );
  }