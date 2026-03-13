"use client";

import { useState } from "react";
import Link from "next/link";
import gsap from "gsap";

const adventures = [
  {
    id: "branding",
    title: "I need a brand mark or identity.",
    headline:
      "Your logo is sometimes all consumers have when deciding to use your business.",
    link: "/branding",
    linkText: "Learn more about custom branding",
    content: [
      {
        left: "If all you have is an idea (that's ok) or you're already doing business without an official mark, I can help you bring your vision to life.",
        right:
          "Not having a logo, or hanging on to an old/outdated one could negatively impact how the market sees your business.",
      },
      {
        center: "It's time to let go.",
      },
      {
        left: "I can make logos, profile pictures, social graphics, & typography that align with your dream and your brand. I'm a dreamer myself.",
        right:
          "Don't like the first draft? No problem, I can scrap it. I'll do infinite versions until we get it perfect (if I like you).",
      },
    ],
    cta: "Schedule a branding call",
  },
  {
    id: "website",
    title: "I need a website.",
    headline:
      "Your website can be either a powerful asset that converts visitors - or just something to look at.",
    link: "/web-design",
    linkText: "Learn more",
    content: [
      {
        left: "Many business owners think they can get by without a website. Or they just don't have the time to keep up with it.",
        right:
          "Others just see it as a hassle, or they can't get why their competitors are doing so much better on the web.",
      },
      {
        center: "That's where I come in.",
      },
      {
        left: "I design custom websites that stand out above simple templates. I create and manage your website while you focus on you.",
        right:
          "Let's make pages that WOW your target audience into booking more leads, calls, whatever.",
      },
    ],
    cta: "Schedule a quick call",
  },
  {
    id: "seo",
    title: "I need organic traffic.",
    headline:
      "Generating traffic on your website isn't luck. It goes hand-in-hand with what's on your pages.",
    link: "/seo",
    linkText: "Learn more about SEO",
    content: [
      {
        left: "On one hand, you could have the coolest website in the world, but if no one sees it, what's the point?",
        right:
          "On the other hand, your website could have thousands of visitors. But if it functions poorly, or doesn't convert any visitors to sales, what's the point?",
      },
      {
        center: "That's where I come in.",
      },
      {
        left: "Let's do SEO right. It's implementing the right keywords on your service pages, then creating a blog with resources and tools.",
        right:
          "It's basically a combination of content marketing, digital PR, & making sure a website functions properly.",
      },
    ],
    cta: "Book a free SEO call",
  },
];

export function ChooseAdventure() {
  const [activeAdventure, setActiveAdventure] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    if (activeAdventure === id) {
      setActiveAdventure(null);
    } else {
      setActiveAdventure(id);
    }
  };

  const activeData = adventures.find((a) => a.id === activeAdventure);

  return (
    <section className="px-8 py-16 bg-e2">
      <h3 className="text-3xl md:text-4xl font-coolvetica text-333 text-center mb-12">
        Choose your adventure
      </h3>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {adventures.map((adventure) => (
          <button
            key={adventure.id}
            onClick={() => handleCardClick(adventure.id)}
            className={`p-6 rounded-lg text-left transition-all duration-300 ${
              activeAdventure === adventure.id
                ? "bg-orga text-black scale-105"
                : "bg-white text-333 hover:bg-333 hover:text-white"
            }`}
          >
            <h4 className="text-lg font-coolvetica">{adventure.title}</h4>
          </button>
        ))}
      </div>

      {/* Expanded Content */}
      {activeData && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 animate-fadeIn">
          <h3 className="text-2xl md:text-3xl font-coolvetica text-333 text-center mb-6">
            {activeData.headline}
          </h3>

          <div className="text-center mb-8">
            <Link
              href={activeData.link}
              className="inline-block px-6 py-3 bg-orga text-black font-coolvetica rounded hover:bg-orga/90 transition-colors"
            >
              {activeData.linkText}
            </Link>
          </div>

          {activeData.content.map((block, index) => (
            <div key={index} className="mb-8">
              {"center" in block ? (
                <h3 className="text-2xl font-coolvetica text-333 text-center">
                  {block.center}
                </h3>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {"left" in block && (
                    <p className="text-333/70">{block.left}</p>
                  )}
                  {"right" in block && (
                    <p className="text-333/70">{block.right}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="text-center mt-8">
            <p className="text-333/70 mb-4">
              One of my passions is to help turn ideation into creation without
              breaking the bank.
            </p>
            <button className="px-6 py-3 bg-orga text-black font-coolvetica rounded hover:bg-orga/90 transition-colors">
              {activeData.cta}
            </button>
          </div>

          <button
            onClick={() => setActiveAdventure(null)}
            className="block mx-auto mt-6 text-sm text-333/50 hover:text-orga transition-colors"
          >
            Return to Choose Your Adventure
          </button>
        </div>
      )}
    </section>
  );
}
