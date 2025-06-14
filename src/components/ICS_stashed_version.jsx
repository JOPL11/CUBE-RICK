'use client'

import { useState, useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { Float, OrbitControls, Html, Text } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import gsap from 'gsap';

const LanguageFloat = ({ children, index, activeLanguage }) => {
  const groupRef = useRef();
  const floatRef = useRef();
  const animationRef = useRef({ pos: null, rot: null });
  
  // Initialize cube positions
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData = {
        baseY: groupRef.current.position.y,
        currentY: groupRef.current.position.y,
        currentRot: { ...groupRef.current.rotation }
      };
    }
    return () => {
      gsap.killTweensOf(animationRef.current.pos);
      gsap.killTweensOf(animationRef.current.rot);
    };
  }, []);

  // Language transition handler
  useEffect(() => {
    if (!groupRef.current) return;
    
    const { baseY } = groupRef.current.userData;
    const pos = groupRef.current.position;
    const rot = groupRef.current.rotation;
    
    // Cancel any ongoing animations
    gsap.killTweensOf(pos);
    gsap.killTweensOf(rot);
    
    // Transition to base position (0.8s)
    animationRef.current.pos = gsap.to(pos, {
      y: baseY,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        // Start language-specific behavior
        if (activeLanguage === 'de') {
          // German - precise lock
          gsap.set(pos, { y: baseY });
          gsap.set(rot, { x: 0, y: 0, z: 0 });
        } 
        else if (activeLanguage === 'fr') {
          // French - elegant wave
          const phase = index * 0.5;
          animationRef.current.pos = gsap.to(pos, {
            y: baseY + 0.5 * Math.sin(phase),
            duration: 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
          });
          animationRef.current.rot = gsap.to(rot, {
            z: 0.025 * Math.sin(phase * 0.23),
            duration: 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
          });
        }
      }
    });
  }, [activeLanguage, index]);

  return (
    <group ref={groupRef}>
      {activeLanguage === 'fr' ? (
        children
      ) : (
        <Float 
          ref={floatRef}
          speed={1.5} 
          rotationIntensity={0.05}
          floatIntensity={0.05}
        >
          {children}
        </Float>
      )}
    </group>
  );
};

import Cube from './Cube'
import WideCube from './WideCube';
import Lightbox from './Lightbox'

import { useThree } from '@react-three/fiber';

const CUBE_SIZE = 2 // Size of each cube
const CUBE_SPACING = 2.1 // Space between cube centers (almost touching)
const CUBE_Y_POSITION = 0 // Consistent Y position for all cubes
const MOBILE_BREAKPOINT = 768 // Width in pixels for mobile/desktop breakpoint
const MOBILE_HORIZONTAL_SPACING = 1.05 // Adjusted horizontal spacing for mobile


const initialCubeTexts = [
  { topLeftText: "NEWS", bottomRightText: "LATEST", htmlUrl: "https://www.jopl.de/2/index3.html", description: `Bear with us while we currently migrate to this new Next.js + React 3 Fiber format ÔÇô  
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
  videoUrl: "https://www.jopl.de/videos/Reeler_2025_Fader.mp4" ,
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

Angaben gem├ñ├ƒ ┬º 5 TMG

      Jan Peiro-Lehmann
      Kommunikationsdesigner Dipl.
      Center for Innovation & Technology (TZL)
      Donnersbergweg 1
      67059 Ludwigshafen am Rhein
      
      Kontakt
      
      Telefon: (+49) 01520 - 317 2291
      E-Mail: jan.peiro@protonmail.com
      
      
      Es gelten folgende berufsrechtliche Regelungen:
      Verbraucher┬¡streit┬¡beilegung/
      Universal┬¡schlichtungs┬¡stelle
      
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

      Haftung f├╝r Inhalte
      
      Als Diensteanbieter sind wir gem├ñ├ƒ ┬º 7 Abs.1 TMG f├╝r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach ┬º┬º 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, ├╝bermittelte oder gespeicherte fremde Informationen zu ├╝berwachen oder nach Umst├ñnden zu forschen, die auf eine rechtswidrige T├ñtigkeit hinweisen.

      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber├╝hrt. Eine diesbez├╝gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m├Âglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

      Haftung f├╝r Links
      
      Unser Angebot enth├ñlt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k├Ânnen wir f├╝r diese fremden Inhalte auch keine Gew├ñhr ├╝bernehmen. F├╝r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m├Âgliche Rechtsverst├Â├ƒe ├╝berpr├╝ft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

      Urheberrecht
      
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf├ñltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au├ƒerhalb der Grenzen des Urheberrechtes bed├╝rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f├╝r den privaten, nicht kommerziellen Gebrauch gestattet.

      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

      Datenschutzerkl├ñrung
      
      Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
      
      Jan Peiro-Lehmann
      
      Wir halten uns an die Grunds├ñtze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

      Quelle: e-recht24.de ` },
      
]
const initialCubeTexts2 = [
    { topLeftText: "NEWS", bottomRightText: "NEUIGKEITEN", description: "Derzeit migrieren wir zu diesem neuen Next.js + R3F Format ÔÇô es wird sich alles noch ver├ñndern, insbesonders die Texte. bis es fertig ist, k├Ânnen Sie die alte HTML5-Website besuchen.", externalUrl: "https://www.jopl.de/2/index2.html", videoUrl: "/videos/video2.mp4" },
    { topLeftText: "├£BER MICH", 
      bottomRightText: "SKILLS", 
      description: `Ein multidisziplin├ñrer Kreativer aus Montreal, Kanada, mit Leidenschaft f├╝r Design, 3D, Code und Motion ÔÇô von strengen Markensystemen bis zu grenzsprengenden Ausstellungen.
  
  Studierte Kommunikationsdesign in M├╝nchen, Deutschland. Derzeit in Deutschland ans├ñssig.
  
  Design-Skills:
  Layout, Screen-Design, Print, Illustration, Malerei, Konzeptskizzen, Typografie, CI, Kampagnenpsychologie, Adobe Suite.
  
  Motion-Skills:
  3D-Modellierung, 2D/3D-Animation, Cinema4D, Blender. Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing. Render-Engines: Octane, Redshift, Corona, Media Encoder, Handbrake ÔÇô und eine Menge verwandter Tools, die hier aufzuz├ñhlen den Rahmen sprengen w├╝rde. (Frage: ÔÇ×K├Ânnen Sie Advanced Lighting?ÔÇ£ Antwort: ÔÇ×Ja, kann ich.ÔÇ£) Ich mache Motion ÔÇô vom visuellen Konzept ├╝ber 2D/3D-Asset-Erstellung bis zu Screen-Design, 
  Rendering, Schnitt und Postproduktion.
  
  Code-Skills:
  Next.js, Three.js, React Three Fiber (f├╝r Deutsche: WebGL mit React-Basis), WebXR, AFrame, GSAP, javascript, html5, css, Vite, npm, yarn.
  
  AI-Skills:
  Stable Diffusion mit individuellen Workflows via ComfyUI, LoRAs sowie der strategische Einsatz von LLMs ÔÇô die Technik dient meinen Zielen, nicht umgekehrt.
  
  Sprachen:
  Englisch, Deutsch, Spanisch, Franz├Âsisch. Doppelstaatsb├╝rger (Kanada/EU).
  
  Zur deutschen Sprache:
  Ich kommuniziere direkt und unverschl├╝sselt ÔÇô so, wie es im Duden steht, nicht wie im Wirtschaftsprotokoll.` },
  { topLeftText: "ART-DIRECTION", 
    bottomRightText: "GALERIE", 
    description: `Ich entwickle und setze visuelle Konzepte um ÔÇô von Originaldesigns bis zur Verfeinerung bestehender CI/CD-Systeme ÔÇô mit Expertise in Animation und interaktiver Entwicklung. Mehr als 3 Jahre F├╝hrungserfahrung.
  
  15+ Jahre Zusammenarbeit mit Agenturen, Inhouse-Teams und Startups - immer im Spannungsfeld zwischen 
  Innovation und Markenkonformit├ñt, um visuelle Konsistenz ├╝ber alle Deliverables hinweg zu gew├ñhrleisten. Images coming soon.
  `, videoUrl: "https://www.jopl.de/2/video/reel.mp4", 
  htmlUrl: "https://www.jopl.de/2/portfolio-airbus-berlin3.html"  },
    { topLeftText: "AFTER EFFECTS", bottomRightText: "2D / 3D MOTION DESIGN", description: `Motion-Skills umfassen:
  3D-Modellierung, 2D/3D-Animation, Cinema4D, Blender.
  
  Premiere, After Effects, Expressions, Stardust, Plexus, VideoCopilot, Red Giant, Duik Tools, IK, FK, Lottie, Bodymovin, Audio, Colorgrading, Compositing.
  
  Render-Engines:
  Octane, Redshift, Corona, Media Encoder, Handbrake ÔÇô und jede Menge Zubeh├Âr, das hier aufzulisten den Rahmen sprengen w├╝rde. (Frage: ÔÇ×Beherrschen Sie Advanced Lighting?ÔÇ£ Antwort: ÔÇ×Ja, das beherrsche ich.ÔÇ£)
  
  Ich mache Motion ÔÇô vom visuellen Konzept ├╝ber 2D/3D-Asset-Erstellung bis zu Screen-Design, Rendering, Schnitt und Postproduktion.
  
  .`, videoUrl: "https://www.jopl.de/2/video/reel.mp4" },
    { topLeftText: `CINEMA4D`, bottomRightText: "MOTION REEL", description: `Showreel mit reinem 3D-Motion-Design:
  
      Gezeigte Corporate-Logos kennzeichnen die Unternehmen, f├╝r die die Szenen erstellt wurden.
  
      Zu vielen Projekten wurde eine kurze aber pr├ñgnante Beschreibung hinzugef├╝gt.
  
  ├ûffnet in einem neuen Fenster.`, 
  videoUrl: "https://www.jopl.de/2/video/reel.mp4", 
  htmlUrl: "https://www.jopl.de/2/portfolio-main.html" 
  },
    { topLeftText: `ANIMATION`, bottomRightText: "MOTION REEL 2", description: `Showreel mit 3D-Motion-Design, 2D-Motion-Design, 2D-Textanimation, 2D-Character-Animation in 3D-Umgebungen, IK-Animation ÔÇô kurzum: Das volle Programm (fast).
  
      Corporate-Logos zeigen die Unternehmen, f├╝r die die Szenen erstellt wurden.
  
      Im Grunde ein Motion-Smorgasbord der F├ñhigkeiten, eingesetzt in echten Projekten.
  
  ├ûffnet in einem neuen Fenster.` },
    { topLeftText: `XR/3D DEV`, bottomRightText: "INTERACTIVE", description: `WARNUNG: Dieser Link f├╝hrt zu einem experimentellen Spielplatz.
  
  Eine Sammlung pers├Ânlicher Experimente, die zeigen:
  
      Interaktive WebGL-3D-Experimente
  
      WebXR-Experimente f├╝r die Nutzung mit dem Quest3S-Headset (das ├╝brigens fantastisch ist).
  
  Pur terrain de jeu cr├®atif ÔÇô frei von kommerziellen Zw├ñngen. Nichts f├╝r Corporate-Fanatiker.
  
  ├ûffnet in einem neuen Fenster.`, externalUrl: "https://www.jopl.de/2/experiments.html" },
    { topLeftText: "NEXT.JS", bottomRightText: "COMING SOON", description: "" },
    { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: `IMPRESSUM

Angaben gem├ñ├ƒ ┬º 5 TMG

      Jan Peiro-Lehmann
      Kommunikationsdesigner Dipl.
      Center for Innovation & Technology (TZL)
      Donnersbergweg 1
      67059 Ludwigshafen am Rhein
      
      Kontakt
      
      Telefon: (+49) 01520 - 317 2291
      E-Mail: jan.peiro@protonmail.com
      
      
      Es gelten folgende berufsrechtliche Regelungen:
      Verbraucher┬¡streit┬¡beilegung/
      Universal┬¡schlichtungs┬¡stelle
      
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

      Haftung f├╝r Inhalte
      
      Als Diensteanbieter sind wir gem├ñ├ƒ ┬º 7 Abs.1 TMG f├╝r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach ┬º┬º 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, ├╝bermittelte oder gespeicherte fremde Informationen zu ├╝berwachen oder nach Umst├ñnden zu forschen, die auf eine rechtswidrige T├ñtigkeit hinweisen.

      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber├╝hrt. Eine diesbez├╝gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m├Âglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

      Haftung f├╝r Links
      
      Unser Angebot enth├ñlt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k├Ânnen wir f├╝r diese fremden Inhalte auch keine Gew├ñhr ├╝bernehmen. F├╝r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m├Âgliche Rechtsverst├Â├ƒe ├╝berpr├╝ft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

      Urheberrecht
      
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf├ñltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au├ƒerhalb der Grenzen des Urheberrechtes bed├╝rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f├╝r den privaten, nicht kommerziellen Gebrauch gestattet.

      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

      Datenschutzerkl├ñrung
      
      Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
      
      Jan Peiro-Lehmann
      
      Wir halten uns an die Grunds├ñtze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

      Quelle: e-recht24.de ` },
  ]
  
const initialCubeTexts3 = [
    { topLeftText: "VENT NOUVEAU", bottomRightText: "MUTATION", description: "Il va y avoir beaucoup de modifications, surtout pour le texte. Actuellement, nous migrons vers ce nouveau format Next.js + React Three Fiber ÔÇô en attendant sa finalisation, vous pouvez visiter l'ancien site en HTML5.", htmlUrl: "https://www.jopl.de/2/index3.html" , videoUrl: "/videos/video3.mp4" },
    { topLeftText: "├Ç PROPOS", 
      bottomRightText: "Profil professionnel", 
      description: `Cr├®atif multidisciplinaire n├® ├á Barcelone, form├® ├á Montr├®al et maintenant ├®tabli en Allemagne. Passionn├® par le design, la 3D et le motion, je navigue entre syst├¿mes d'identit├® rigoureux et cr├®ations exp├®rimentales.
  
  QUI SUIS-JE
  Cr├®atif technique quadrilingue (EN/DE/FR/ES) avec un accent qu├®b├®cois ├®dulcor├® par 20 ans d'expat' entre Barcelone, Philadelphie, Toronto et Munich. Sp├®cialiste hybrides design/motion/code. 
  
  MES ARSENAUX
  
  DESIGN:
  
      ÔÇó Layout ÔÇó UI ÔÇó Print ÔÇó Illustration ÔÇó Peinture ÔÇó Croquis ÔÇó Suite Adobe ÔÇó Typographie ÔÇó Identit├® visuelle (CI) ÔÇó Psychologie des campagnes 
  
  2D / 3D :
  
      De la mod├®lisation proc├®durale au rigging complexe (IK/FK)
  
      Rendu photor├®aliste (Octane/Redshift/Chaos Render) et stylis├®
  
      Pipeline Cinema4D/Blender ÔåÆ After Effects oubien Pipeline Blender ÔåÆ React 3 Fiber
  
      Animation traditionelle et assist├®e (Duik Tools (IK/FK), Lottie, Bodymovin, et plus. )
  
      VFX avanc├®s (Stardust, Plexus, Moccha, VideoCopilot, Red Giant, audio )
  
      Post-prod couleur, ├®talonnage et compositing
  
  Code Cr├®atif :
  
  1. SEO Technique & Contenu
  
  Architecture Jamstack (Next.js, Gatsby) pour un rendu ultra-rapide.
  
      Audit et optimisation Core Web Vitals (LCP, FID, CLS).
  
      Balisage s├®mantique (Schema.org, OpenGraph) et strat├®gie de mots-cl├®s.
  
  2. Exp├®riences 3D/XR Immersives
  
      WebGL/Three.js : Animations interactives, effets visuels "scroll-based".
  
      WebXR : Prototypage rapide d'exp├®riences VR/AR accessibles dans le navigateur.
  
      Int├®gration React Three Fiber pour une 3D d├®clarative et r├®active.
  
  3. Performance Web Exigeante
  
      Chargement intelligent des assets 3D (GLTF compression, suspense).
  
      Optimisation des shaders et gestion du garbage collection.
  
      Hybridation React + Web Workers pour du calcul lourd sans bloquer l'UI.
  
  4. Automatisation & Micro-Optimisations
  
      Scripts CI/CD (GitHub Actions) pour le d├®ploiement automatis├®.
  
      Outils maison (JS/CSS) pour g├®n├®rer des grids, palettes de couleurs, etc.
  
  IA G├®n├®rative :
  
      Workflows Stable Diffusion optimis├®s
  
      Fine-tuning avec LoRAs personnalis├®s
  
      Int├®gration dans des pipelines pro
  
  POURQUOI MOI
  Ô£ô 15 ans ├á r├®soudre des probl├¿mes complexes
  Ô£ô Bilingue technique (m├¬me si mon "accent est maintenant plus Munichois que Montr├®alais")
  Ô£ô Double culture design europ├®en & approche nord-am├®ricaine
  Ô£ô Grand admirateur de la tranquillit├® interstellaire
  
  CE QU'ON DIT DE MOI
  "Il parle le langage des artistes et des d├®veloppeurs - et son accent est devenu un charmant m├®lange transatlantique."` },
  { topLeftText: "ART DIRECTOR", bottomRightText: "GALERIE", description: `Je con├ºois et impl├®mente des concepts visuels, 
    des cr├®ations originales ├á l'optimisation de syst├¿mes CI/CD existants, avec une expertise en animation et 
    d├®veloppement interactif. Plus de 3 ans d'exp├®rience en management.
  
  15+ ans de collaboration avec des agences, des ├®quipes internes et des startups - 
  alliant innovation et conformit├® ├á l'identit├® de marque, tout en garantissant une 
  coh├®rence visuelle sur tous les livrables.`, htmlUrl: "https://www.jopl.de/2/portfolio-main.html",
  videoUrl: "https://www.jopl.de/videos/Reeler_2025_Fader.mp4" },
  { topLeftText: "AFTER EFFECTS / CINEMA4D", bottomRightText: "APER├çU TECHNIQUE", description: `Comp├®tences en Motion :
  
      Mod├®lisation 3D
  
      Animation 2D/3D
  
      Logiciels : Cinema4D, Blender
  
  Postproduction & Effets :
  
      Montage : Premiere
  
      Effets visuels : After Effects (Expressions, Stardust, Plexus)
  
      Outils compl├®mentaires : VideoCopilot, Red Giant, Duik Tools (IK/FK)
  
      Animation web : Lottie, Bodymovin
  
      Traitement audio, ├®talonnage, compositing
  
  Moteurs de rendu :
  
      Octane, Redshift, Corona
  
      Encodage : Media Encoder, Handbrake
  
      ... et bien d'autres outils trop nombreux ├á mentionner.
      (┬½ Ma├«trisez-vous l'├®clairage avanc├® ? ┬╗ ÔÇö ┬½ Oui, parfaitement. ┬╗)
  
  Je prends en charge l'int├®gralit├® du processus motion :
  du concept visuel ÔåÆ cr├®ation d'assets 2D/3D ÔåÆ design d'interface ÔåÆ rendu ÔåÆ montage ÔåÆ postproduction.
  
  (Ouvre dans une nouvelle fen├¬tre.)`,  htmlUrl: "https://www.jopl.de/2/portfolio-main.html",
  videoUrl: "https://www.jopl.de/videos/Reeler_2025_Fader.mp4" },
    { topLeftText: `MOTION RAPIDE`, bottomRightText: "(Version courte)", description: `Showreel de motion design 3D pur :
      Ce showreel 3D pr├®sente des projets r├®alis├®s pour les marques identifi├®es par leurs logos. Des notices descriptives accompagnent les principaux travaux.
  
      Les logos d'entreprise affich├®s identifient les soci├®t├®s pour lesquelles les sc├¿nes ont ├®t├® cr├®├®es.
  
      Des descriptions courtes mais percutantes accompagnent de nombreux projets.
  
  (Ouvre dans une nouvelle fen├¬tre.)`, },
    { topLeftText: `MONTAGE MOTION COMPLET`, bottomRightText: "(Version Longue)", description: `Showreel : Motion Design tout-en-un
  Un concentr├® de motion design : hybridations 2D/3D, personnages anim├®s en IK, typographie vivante ÔÇô le tout au service de marques identifi├®es par leurs logos.
  
      Les logos clients identifient les entreprises pour lesquelles les s├®quences ont ├®t├® produites.
  
      Un v├®ritable buffet de comp├®tences motion, d├®ploy├®es sur des projets r├®els.
  
  (Ouvre dans une nouvelle fen├¬tre.)`, },
    { topLeftText: `XR/3D DEV`, bottomRightText: "INTERACTIVE", description: `AVERTISSEMENT : Ce lien m├¿ne ├á un laboratoire exp├®rimental.
  
  Une collection de projets personnels explorant :
  
      Exp├®riences interactives WebGL/3D
  
      Prototypes WebXR (optimis├®s pour Quest 3S ÔÇô un casque remarquable, soit dit en passant)
  
  Pur terrain de jeu cr├®atif ÔÇô z├®ro contrainte commerciale.
  Clairement pas fait pour les adeptes du corporatisme.
  
  (Ouvre dans une nouvelle fen├¬tre.)`, externalUrl: "https://www.jopl.de/2/experiments.html" },
    { topLeftText: "NEXT.JS", bottomRightText: "PROCHAINEMENT", description: "" },
    { topLeftText: "FOOTER", bottomRightText: "IMPRESSUM", description: `IMPRESSUM

Angaben gem├ñ├ƒ ┬º 5 TMG

      Jan Peiro-Lehmann
      Kommunikationsdesigner Dipl.
      Center for Innovation & Technology (TZL)
      Donnersbergweg 1
      67059 Ludwigshafen am Rhein
      
      Kontakt
      
      Telefon: (+49) 01520 - 317 2291
      E-Mail: jan.peiro@protonmail.com
      
      
      Es gelten folgende berufsrechtliche Regelungen:
      Verbraucher┬¡streit┬¡beilegung/
      Universal┬¡schlichtungs┬¡stelle
      
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

      Haftung f├╝r Inhalte
      
      Als Diensteanbieter sind wir gem├ñ├ƒ ┬º 7 Abs.1 TMG f├╝r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach ┬º┬º 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, ├╝bermittelte oder gespeicherte fremde Informationen zu ├╝berwachen oder nach Umst├ñnden zu forschen, die auf eine rechtswidrige T├ñtigkeit hinweisen.

      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber├╝hrt. Eine diesbez├╝gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m├Âglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

      Haftung f├╝r Links
      
      Unser Angebot enth├ñlt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k├Ânnen wir f├╝r diese fremden Inhalte auch keine Gew├ñhr ├╝bernehmen. F├╝r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m├Âgliche Rechtsverst├Â├ƒe ├╝berpr├╝ft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

      Urheberrecht
      
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf├ñltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au├ƒerhalb der Grenzen des Urheberrechtes bed├╝rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f├╝r den privaten, nicht kommerziellen Gebrauch gestattet.

      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.

      Datenschutzerkl├ñrung
      
      Verantwortliche Stelle im Sinne der Datenschutzgesetze ist:
      
      Jan Peiro-Lehmann
      
      Wir halten uns an die Grunds├ñtze der Datenvermeidung und Datensparsamkeit. Wir speichern keine personenbezogenen Daten.

      Quelle: e-recht24.de `},
  ]



  const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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
        >
          {text2}
        </Text>
      </Float>
    </group>
  );
};

function CubeLayout({ onCubeSelect, activeLanguage }) {
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
      return () => {
        window.removeEventListener('resize', checkMobile)
        // Clean up any other resources if needed
      };
    }, [])
  
    const cubeTexts = activeLanguage === 'de' ? initialCubeTexts2 : 
                     activeLanguage === 'fr' ? initialCubeTexts3 : 
                     initialCubeTexts;

    if (isMobile) {
      const Z_OFFSET = -3.0;
      return (
        <>
            {/* Row Zero WIDECUBE */}
            <group position={[0, CUBE_Y_POSITION + 2.0, -CUBE_SPACING * 3.95]}>
          {/* Ôåæ Adjust Y (+1) and Z (-2.5) to fine-tune placement
          <LottieHeader 
          path="/images/data_logo.json"
          position={[0, 0.0005, 1]}
          scale={0.7}
          opacity={0.5}
        />
         */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
            <Cube
              key={`cube-0-${activeLanguage}-0`}
              position={[0, -2, 1]}
              topLeftText="HEADER"
              bottomRightText="VISUALS"
              onClick={() => console.log('Header clicked')}
              color="white"
              scale={[2, 3, 2]} // 3 cubes wide plus 2 gaps
              rotation={[0, 0, 0]}
            />
          </Float>
        </group>
          {/* First row       color={getCubeColor(0)} */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            
            <LanguageFloat index={0} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${0}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[0].topLeftText}
                bottomRightText={cubeTexts[0].bottomRightText}
                onClick={() => onCubeSelect(0)}
          
                color="#3d3d3d"
                videoUrl={cubeTexts[0].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, -CUBE_SPACING + Z_OFFSET]}>
            <LanguageFloat index={1} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${1}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[1].topLeftText}
                bottomRightText={cubeTexts[1].bottomRightText}
                onClick={() => onCubeSelect(1)}
                color="#3d3d3d"
                videoUrl={cubeTexts[1].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Second row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
        
            <LanguageFloat index={2} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${2}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[2].topLeftText}
                bottomRightText={cubeTexts[2].bottomRightText}
                onClick={() => onCubeSelect(2)}
             color="#3d3d3d"
                videoUrl={cubeTexts[2].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, 0 + Z_OFFSET]}>
            <LanguageFloat index={3} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${3}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[3].topLeftText}
                bottomRightText={cubeTexts[3].bottomRightText}
                onClick={() => onCubeSelect(3)}
                color="#3d3d3d"
                videoUrl={cubeTexts[3].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Third row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <LanguageFloat index={4} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${4}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[4].topLeftText}
                bottomRightText={cubeTexts[4].bottomRightText}
                onClick={() => onCubeSelect(4)}
                color="#3d3d3d"
                videoUrl={cubeTexts[4].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING + Z_OFFSET]}>
            <LanguageFloat index={5} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${5}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[5].topLeftText}
                bottomRightText={cubeTexts[5].bottomRightText}
                onClick={() => onCubeSelect(5)}
                color={getCubeColor(5)}
                videoUrl={cubeTexts[5].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Fourth row */}
          <group position={[-MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
            <LanguageFloat index={6} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${6}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[6].topLeftText}
                bottomRightText={cubeTexts[6].bottomRightText}
                onClick={() => onCubeSelect(6)}
               color="#3d3d3d"
                videoUrl={cubeTexts[6].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
          <group position={[MOBILE_HORIZONTAL_SPACING, CUBE_Y_POSITION, CUBE_SPACING * 2 + Z_OFFSET]}>
          
            <LanguageFloat index={7} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${7}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[7].topLeftText}
                bottomRightText={cubeTexts[7].bottomRightText}
                onClick={() => onCubeSelect(7)}
                color="#3d3d3d"
                videoUrl={cubeTexts[7].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
          </group>
  
          {/* Fifth row (single cube) */}
          <group position={[0, CUBE_Y_POSITION, CUBE_SPACING * 3 + Z_OFFSET]}>
            <LanguageFloat index={8} activeLanguage={activeLanguage}>
              <Cube 
                key={`cube-${8}-${activeLanguage}`}
                position={[0, 0, 0]}
                topLeftText={cubeTexts[8].topLeftText}
                bottomRightText={cubeTexts[8].bottomRightText}
                onClick={() => onCubeSelect(8)}
                color={"white"}
                videoUrl={cubeTexts[8].videoUrl}
                scale={[1, 1, 1]}
                rotation={[0, 0, 0]}
              />
            </LanguageFloat>
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
          <group position={[0, CUBE_Y_POSITION + 0.0, -CUBE_SPACING * 2.5]}>
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
         
          <LanguageFloat index={0} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${0}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[0].topLeftText}
              bottomRightText={cubeTexts[0].bottomRightText}
              onClick={() => onCubeSelect(0)}
          
              color="#3d3d3d"
              videoUrl={cubeTexts[0].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[0, CUBE_Y_POSITION, -CUBE_SPACING]}>
      
          <LanguageFloat index={1} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${1}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[1].topLeftText}
              bottomRightText={cubeTexts[1].bottomRightText}
              onClick={() => onCubeSelect(1)}
              color="#3d3d3d"
              videoUrl={cubeTexts[1].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, -CUBE_SPACING]}>
  
          <LanguageFloat index={2} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${2}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[2].topLeftText}
              bottomRightText={cubeTexts[2].bottomRightText}
              onClick={() => onCubeSelect(2)}
             color="#3d3d3d"
              videoUrl={cubeTexts[2].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
  
        {/* Second row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, 0]}>
          
          <LanguageFloat index={3} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${3}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[3].topLeftText}
              bottomRightText={cubeTexts[3].bottomRightText}
              onClick={() => onCubeSelect(3)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[3].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[0, CUBE_Y_POSITION, 0]}>
    <LanguageFloat index={4} activeLanguage={activeLanguage}>
      <Cube 
        key={`cube-${4}-${activeLanguage}`}
        position={[0, 0, 0]}
        topLeftText={cubeTexts[4].topLeftText}
        bottomRightText={cubeTexts[4].bottomRightText}
        onClick={() => onCubeSelect(4)}
        color={getCubeColor(1)}
        videoUrl={cubeTexts[4].videoUrl}
        scale={[1, 1, 1]}
        rotation={[0, 0, 0]}
        logo={logoTexture}
      />
    </LanguageFloat>
  </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, 0]}>
          
          <LanguageFloat index={5} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${5}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[5].topLeftText}
              bottomRightText={cubeTexts[5].bottomRightText}
              onClick={() => onCubeSelect(5)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[5].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
  
        {/* Third row */}
        <group position={[-CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
        
          <LanguageFloat index={6} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${6}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[6].topLeftText}
              bottomRightText={cubeTexts[6].bottomRightText}
              onClick={() => onCubeSelect(6)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[6].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[0, CUBE_Y_POSITION, CUBE_SPACING]}>
      
          <LanguageFloat index={7} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${7}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[7].topLeftText}
              bottomRightText={cubeTexts[7].bottomRightText}
              onClick={() => onCubeSelect(7)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[7].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
        </group>
        <group position={[CUBE_SPACING, CUBE_Y_POSITION, CUBE_SPACING]}>
          <LanguageFloat index={8} activeLanguage={activeLanguage}>
            <Cube 
              key={`cube-${8}-${activeLanguage}`}
              position={[0, 0, 0]}
              topLeftText={cubeTexts[8].topLeftText}
              bottomRightText={cubeTexts[8].bottomRightText}
              onClick={() => onCubeSelect(8)}
              color={getCubeColor(1)}
              videoUrl={cubeTexts[8].videoUrl}
              scale={[1, 1, 1]}
              rotation={[0, 0, 0]}
            />
          </LanguageFloat>
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
    const [initialAnimTrigger, setInitialAnimTrigger] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxContent, setLightboxContent] = useState(null)
    const [lightboxType, setLightboxType] = useState('image')
    const [videoReadyToShow, setVideoReadyToShow] = useState(false);
    const videoRefCallback = useRef(null);
    const videoRefForPause = useRef(null);
    const cubeRefs = useRef([]);

    const handleCubeSelect = (index) => {
      setSelectedCube(index);
      // Lightbox functionality kept but not triggered here
    };

    const handleCloseEditor = () => {
      setSelectedCube(null)
    }

    const handleLanguageSwitch = () => {
      setActiveLanguage(prev => 
        prev === 'en' ? 'de' : 
        prev === 'de' ? 'fr' : 
        'en'
      );
    }
const openLightbox = (content, type = 'image') => {
    setLightboxContent(content)
    setLightboxType(type)
    setLightboxOpen(true)
    setSelectedCube(null) // Close editor panel when opening lightbox
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxContent(null)
    setLightboxType(null)
  }

  useEffect(() => {
    const video = videoRefCallback.current;
    if (video) {
      video.addEventListener('canplaythrough', () => {
        setVideoReadyToShow(true);
      });
    }
  }, [videoRefCallback]);

  useEffect(() => {
    cubeRefs.current.forEach(cube => {
      if (cube) cube.triggerAnimation();
    });
  }, [activeLanguage]);

  useEffect(() => {
    setInitialAnimTrigger(1);
    const timer = setTimeout(() => setInitialAnimTrigger(0), 100);
    return () => clearTimeout(timer);
  }, []);

  const getCubeTextsForLanguage = (lang) => {
    if (lang === 'de') return initialCubeTexts2;
    if (lang === 'fr') return initialCubeTexts3;
    return initialCubeTexts;
  };

  const cubeTexts = getCubeTextsForLanguage(activeLanguage);

    return (
      <group>
    
          <CubeLayout onCubeSelect={handleCubeSelect} activeLanguage={activeLanguage} />

          {/* Editor UI */}
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
                transition: 'opacity 1.5s ease-in-out',
                opacity: lightboxOpen ? 0 : 1
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
                   WebkitTapHighlightColor: 'transparent',
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
                        {cubeTexts[selectedCube].topLeftText}
                      </div>
                      <div 
                        onClick={handleLanguageSwitch}
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
                    <div style={{ fontSize: '1.0em', color: '#aaa', fontFamily: 'InterDisplay-Bold, sans-serif', marginBottom: '22px',}}>
                        {cubeTexts[selectedCube].bottomRightText}
                      </div>
                    
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
                      {cubeTexts[selectedCube].description.split('\n\n').map((paragraph, i) => (
                        <p key={i} style={{ 
                          marginBottom: '1em',
                          lineHeight: '1.5'
                        }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  
                    {cubeTexts[selectedCube].images && (
                      <button
                        onClick={() => openLightbox(cubeTexts[selectedCube].images, 'image')}
                        style={{
                          width: '100%',
                          padding: '15px',
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
                          gap: '8px',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                        </svg>
                        View Gallery
                      </button>
                    )}
                    
                    {(cubeTexts[selectedCube].htmlUrl || cubeTexts[selectedCube].externalUrl) && (
                      <button
                        onClick={() => {
                          const url = cubeTexts[selectedCube].htmlUrl || cubeTexts[selectedCube].externalUrl;
                          setLightboxContent(url);
                          setLightboxType('iframe');
                          setLightboxOpen(true);
                        }}
                        style={{
                          width: '100%',
                          padding: '15px',
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
                          gap: '8px',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.5309C19.552 2.60389 18.2979 2.078 16.9869 2.0666C15.6759 2.0552 14.4129 2.55921 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05888 10.3534 9.00766C9.63821 8.95644 8.92042 9.05966 8.24866 9.3102C7.5769 9.56074 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.0452 15.6661 2.0566 16.977C2.068 18.288 2.59389 19.5421 3.5209 20.4691C4.44791 21.3961 5.70198 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Open URL
                      </button>
                    )}
                    
                    {cubeTexts[selectedCube].videoUrl && (
                      <button
                        onClick={() => openLightbox(cubeTexts[selectedCube].videoUrl, 'video')}
                        style={{
                          width: '100%',
                          padding: '15px',
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
                          gap: '8px',
                          pointerEvents: 'auto',
                          touchAction: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                        </svg>
                        View Video
                      </button>
                    )}
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseEditor();
                      }}
                      style={{ 
                        marginTop: '15px',
                        padding: '15px',
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
      {/* Lightbox */}
      {lightboxOpen && (
        <Html
          fullscreen
          portal="lightbox-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'auto',
            zIndex: 999999
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click-through
        >
          <Lightbox 
            content={lightboxContent}
            onClose={closeLightbox}
            type={lightboxType}
            isOpen={lightboxOpen}
          />
        </Html>
      )}
       
      </group>
    );
  }
