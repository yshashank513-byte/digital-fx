"use client";

import { useEffect } from "react";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

export default function ScrollAnimationManager() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = initGsap();
    const ctx = gsap.context(() => {
      // 1. Text reveals on scroll: fade up smoothly
      const textElems = document.querySelectorAll<HTMLElement>(".gsap-reveal-text");
      textElems.forEach((elem) => {
        gsap.fromTo(
          elem,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 2. Staggered card animations (e.g. service cards, feature grids)
      const cardContainers = document.querySelectorAll<HTMLElement>(".gsap-reveal-cards");
      cardContainers.forEach((container) => {
        const cards = container.children;
        if (!cards.length) return;
        gsap.fromTo(
          cards,
          { y: 45, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 3. Image reveal using clip-path
      const clipElems = document.querySelectorAll<HTMLElement>(".gsap-clip-reveal");
      clipElems.forEach((elem) => {
        gsap.fromTo(
          elem,
          { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.2 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: elem,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 4. Subtle image/background parallax
      const parallaxElems = document.querySelectorAll<HTMLElement>(".gsap-parallax");
      parallaxElems.forEach((elem) => {
        gsap.to(elem, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: elem,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      // 5. Section transitions (subtle opacity and transform)
      const sectionElems = document.querySelectorAll<HTMLElement>(".gsap-section-reveal");
      sectionElems.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0.88, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
