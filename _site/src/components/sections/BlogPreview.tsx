"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const blogPosts = [
  {
    slug: "what-is-seo",
    category: "Marketing",
    categoryClass: "",
    title: "What is SEO?",
    date: "Updated April 17, 2024",
    excerpt:
      "Ranking on search engines isn't luck. The average person makes 3-4 searches on Google per day. Learn how to answer them.",
  },
  {
    slug: "webflow-launch-checklist",
    category: "Design",
    categoryClass: "design",
    title: "Webflow Launch Checklist",
    date: "September 5, 2024",
    excerpt:
      "Launching a website on Webflow can be terrifying, especially if it's your first time. Many things can go wrong.",
  },
  {
    slug: "branding-basics",
    category: "Branding",
    categoryClass: "branding",
    title: "Basics of Branding: How to Build Your Own Brand",
    date: "June 6, 2024",
    excerpt:
      "Deciding on an original name, colors, logo, and website that speak to you are big commitments.",
  },
  {
    slug: "webflow-vs-figma",
    category: "Design",
    categoryClass: "design",
    title: "Webflow vs. Figma",
    date: "July 12, 2023",
    excerpt:
      "In today's shifting tides of creative design and development programs, selecting the right tools can significantly impact your creative journey.",
  },
  {
    slug: "ai-art",
    category: "Creative",
    categoryClass: "creative",
    title: "What is AI Art? And Will It Replace Artists?",
    date: "July 12, 2023",
    excerpt:
      "AI's threat to jobs and humanity as a whole jeopardizes life as we know it. Exploring the intersection of technology and creativity.",
  },
];

export function BlogPreview() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 300;
  const gap = 16;

  useEffect(() => {
    if (!trackRef.current || typeof Draggable === "undefined") return;

    const ctx = gsap.context(() => {
      Draggable.create(trackRef.current, {
        type: "x",
        bounds: {
          minX: -((blogPosts.length - 1) * (cardWidth + gap)),
          maxX: 0,
        },
        inertia: true,
        edgeResistance: 0.85,
        snap: {
          x: (endValue) => {
            const snapPoints = blogPosts.map(
              (_, i) => -i * (cardWidth + gap)
            );
            let closest = snapPoints[0];
            let minDistance = Math.abs(endValue - closest);

            snapPoints.forEach((point, i) => {
              const distance = Math.abs(endValue - point);
              if (distance < minDistance) {
                minDistance = distance;
                closest = point;
                setCurrentIndex(i);
              }
            });

            return closest;
          },
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const navigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentIndex - 1)
        : Math.min(blogPosts.length - 1, currentIndex + 1);

    setCurrentIndex(newIndex);

    gsap.to(trackRef.current, {
      x: -newIndex * (cardWidth + gap),
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section className="px-8 py-16 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-end justify-between mb-8">
        <Link href="/blog" className="flex items-center gap-3">
          <Image
            src="/images/coffee-asset.png"
            alt="Coffee icon"
            width={50}
            height={50}
            className="opacity-90"
          />
          <h5 className="text-xl font-coolvetica text-333">Coffee Break</h5>
        </Link>

        {/* Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate("prev")}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full border border-333/20 flex items-center justify-center text-333 hover:bg-333 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr;
          </button>
          <button
            onClick={() => navigate("next")}
            disabled={currentIndex === blogPosts.length - 1}
            className="w-10 h-10 rounded-full border border-333/20 flex items-center justify-center text-333 hover:bg-333 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto overflow-visible">
        <div
          ref={trackRef}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          style={{ width: "fit-content" }}
        >
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block w-[300px] flex-shrink-0 p-6 bg-e2 rounded-lg hover:bg-333 group transition-colors duration-300"
            >
              {/* Category */}
              <span
                className={`inline-block px-3 py-1 text-xs font-coolvetica rounded-full mb-4 ${
                  post.categoryClass === "design"
                    ? "bg-blue/20 text-blue"
                    : post.categoryClass === "branding"
                    ? "bg-orga/20 text-orga"
                    : post.categoryClass === "creative"
                    ? "bg-compl/20 text-compl"
                    : "bg-333/10 text-333"
                } group-hover:bg-white/20 group-hover:text-white`}
              >
                {post.category}
              </span>

              {/* Title */}
              <h3 className="text-lg font-coolvetica text-333 mb-2 group-hover:text-white">
                {post.title}
              </h3>

              {/* Date */}
              <p className="text-xs text-333/50 mb-3 group-hover:text-white/50">
                {post.date}
              </p>

              {/* Excerpt */}
              <p className="text-sm text-333/70 line-clamp-3 group-hover:text-white/70">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
