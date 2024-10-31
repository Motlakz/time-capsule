"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-gray-800 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Memory Fort
        </h1>
        <p className="text-xl mb-8">
          Create time capsules for your most precious memories
        </p>
        <div className="space-x-4">
          <Link href="/register">
            <Button size="lg" variant="default">
              Get Started
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Animated Elements in Top Left Corner */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="absolute w-64 h-64 bg-blue-400 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-400 rounded-full opacity-10"
          animate={{
            x: [0, -150, 0],
            y: [0, -150, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Animated Elements in Bottom Right Corner */}
      <motion.div
        className="absolute w-full h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="absolute bottom-0 right-0 w-48 h-48 bg-green-400 rounded-full opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-400 rounded-full opacity-10"
          animate={{
            x: [0, 150, 0],
            y: [0, 150, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </main>
  );
}
