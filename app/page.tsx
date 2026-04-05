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
    <div className="relative w-full h-screen flex pt-20 items-center flex-col overflow-hidden ">
      <Particles
        className="absolute inset-0 -z-10 h-full w-full"
        options={{
          fullScreen: { enable: false },
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

      {/* <div className="w-full flex  justify-center items-center flex-col"> */}
      <div className="text-center py-4 text-white">
        <h2 className="text-xl md:text-3xl mb-3 mx-2">
          Dive into the World of Anonymous Feedback
        </h2>
        <p className="text-lg px-3">
          True Feedback - Where your identity remains a secret.
        </p>
      </div>
      <Carousel
        className="relative w-full max-w-[12rem] sm:max-w-xs "
        plugins={[AutyoPlay({ delay: 2000 })]}
      >
        <CarouselContent>
          {message.map((msg, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col h-50 items-center justify-center p-2">
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
    // </div>
  );
}
