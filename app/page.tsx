"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import message from "@/message.json";
import AutyoPlay from "embla-carousel-autoplay";

export default function Dashboard() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine); // ✅ FIXED
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div className="relative w-full min-h-screen  overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          background: { color: "#0f172a" },
          particles: {
            number: { value: 90 },
            color: { value: "#ffffff" },
            size: { value: { min: 0.3, max: 0.8 } },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              random: true,
              outModes: { default: "out" },
            },
            // ⭐ GLOW EFFECT
            shadow: {
              enable: true,
              color: "#ffffff",
              blur: 8,
            },
          },
        }}
      />

      <div className="w-full h-screen flex justify-center items-center flex-col">
        <div className="text-center py-4 text-white">
          <h2 className="text-xl md:text-3xl mb-3">
            Dive into the World of Anonymous Feedback
          </h2>
          <p className="text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </div>
        <Carousel
          className="w-full max-w-[12rem] sm:max-w-xs"
          plugins={[AutyoPlay({ delay: 2000 })]}
        >
          <CarouselContent>
            {message.map((msg, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <h2 className="text-2xl font-semibold py-4 text-center">
                        {msg.title}
                      </h2>
                      <p className="text-lg pb-3 text-center">{msg.content}</p>
                      <span className="text-blue-600 ">{msg.received}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* <div className="flex flex-col items-center justify-center h-screen relative z-10">
        <h1 className="text-white text-4xl font-bold mb-8">CipherTalk</h1>

        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl mb-4">
          Create Link
        </button>

        <button className="px-8 py-3 border rounded-xl text-white">
          Go to Inbox
        </button>
      </div> */}
    </div>
  );
}
