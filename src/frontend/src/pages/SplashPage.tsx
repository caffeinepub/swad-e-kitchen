import { useNavigate } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { motion } from "motion/react";

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="app-shell flex flex-col items-center justify-center min-h-dvh bg-gradient-to-b from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
      <div className="absolute top-1/4 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 z-10 px-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl"
        >
          <span className="text-5xl">🌿</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            Swad-E-Kitchen
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Leaf className="w-4 h-4 text-green-200" />
            <span className="text-green-100 text-sm font-semibold uppercase tracking-widest">
              100% Vegetarian
            </span>
            <Leaf className="w-4 h-4 text-green-200" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 text-lg font-medium leading-relaxed"
        >
          Pure Veg. Pure Love.
          <br />
          Delivered Fresh.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 w-full"
        >
          <button
            type="button"
            data-ocid="splash.get_started_button"
            onClick={() => navigate({ to: "/home" })}
            className="w-full bg-white text-green-700 font-display font-bold text-lg py-4 rounded-2xl shadow-xl active:scale-[0.97] transition-transform"
          >
            Get Started 🚀
          </button>
          <p className="text-white/50 text-xs mt-4">
            Fresh • Healthy • Delicious
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent" />
    </div>
  );
}
