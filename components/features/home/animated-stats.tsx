"use client";

import { motion } from "framer-motion";
import { Users, MapIcon, Calendar, Award, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TARGET_MEMBERS } from "@/lib/constants";

interface StatItem {
  label: string;
  value: number;
  icon: "Users" | "MapIcon" | "Calendar" | "Award" | "Lightbulb";
}

const iconMap = {
  Users, MapIcon, Calendar, Award, Lightbulb,
};

const TARGETS: Record<string, number> = {
  Anggota: TARGET_MEMBERS,
  Provinsi: 38,
  Events: 200,
  Inovasi: 100,
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export function AnimatedStats({ stats }: { stats: StatItem[] }) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        const target = TARGETS[stat.label];
        const progress = target ? Math.min(100, (stat.value / target) * 100) : null;

        return (
          <motion.div key={stat.label} variants={fadeIn}>
            <Card className="glass-tech text-center p-6 group overflow-visible">
              <div className="corner-bracket corner-bracket-tl" />
              <div className="corner-bracket corner-bracket-tr" />
              <div className="corner-bracket corner-bracket-bl" />
              <div className="corner-bracket corner-bracket-br" />
              <CardContent className="p-0">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pri-red/20 to-pri-red/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 ring-1 ring-pri-red/20">
                  <Icon className="h-6 w-6 text-pri-red" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-1 group-hover:text-pri-red transition-colors">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-pri-silver mb-2">{stat.label}</div>
                {progress !== null && (
                  <>
                    <div className="h-1.5 rounded-full bg-pri-dark/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-pri-red to-red-400"
                      />
                    </div>
                    <span className="text-[10px] text-pri-silver/40 mt-1 font-mono">
                      {progress.toFixed(0)}% dari target
                    </span>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
