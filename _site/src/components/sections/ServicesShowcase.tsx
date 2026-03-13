"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const services = [
  {
    id: "branding",
    label: "Branding",
    title: "Branding",
    description:
      "Crafting distinctive visual identities that resonate with your audience and elevate your brand presence.",
    color: "var(--orga)",
  },
  {
    id: "digital-pr",
    label: "Digital PR",
    title: "Digital PR",
    description:
      "Strategic storytelling and media outreach that amplifies your message across digital channels.",
    color: "#ff4444",
  },
  {
    id: "front-end",
    label: "Front End Dev",
    title: "Front End Development",
    description:
      "Building responsive, performant interfaces with modern web technologies and best practices.",
    color: "#009dff",
  },
  {
    id: "web-design",
    label: "Web Design",
    title: "Web Design",
    description:
      "Designing intuitive, beautiful web experiences that convert visitors into customers.",
    color: "#ffb612",
  },
];

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const activeService = services[activeIndex];

  return (
    <section className="px-8 py-16 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left side */}
        <div>
          <Image
            src="/images/monstera-icon.png"
            alt="Monstera icon"
            width={100}
            height={100}
            className="mb-4 -ml-5"
          />
          <h2 className="text-3xl md:text-4xl font-coolvetica text-333 mb-4">
            Full-Service Digital Marketing That Grows Your Business
          </h2>
          <p className="text-333/70 mb-6">
            From custom web design and SEO to branding and development—we
            deliver comprehensive marketing solutions that drive real results.
            Let&apos;s build something that converts.
          </p>
          <button className="px-6 py-3 bg-orga text-black font-coolvetica rounded hover:bg-orga/90 transition-colors">
            Get Your Free Website Review
          </button>
        </div>

        {/* Right side - Tabs */}
        <div>
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`px-4 py-2 rounded-full font-coolvetica text-sm transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-333 text-white"
                    : "bg-e2 text-333 hover:bg-333/10"
                }`}
                style={{
                  borderColor:
                    activeIndex === index ? service.color : "transparent",
                  borderWidth: "2px",
                  borderStyle: "solid",
                }}
              >
                {service.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 bg-e2 rounded-lg min-h-[150px]">
            <p
              className="text-sm font-coolvetica mb-2"
              style={{ color: activeService.color }}
            >
              {activeService.title}
            </p>
            <p className="text-333/70">{activeService.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
