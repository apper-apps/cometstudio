import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            {[...Array(6)].map((_, j) => (
              <motion.div
                key={j}
                className="h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg flex-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (i + j) * 0.1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="glass rounded-2xl p-6 space-y-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <div className="h-12 w-12 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-50" />
            <div className="space-y-2">
              <div className="h-6 bg-slate-600 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-700 rounded-lg w-full" />
              <div className="h-4 bg-slate-700 rounded-lg w-2/3" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 w-12 h-12 border-4 border-secondary/20 border-b-secondary rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default Loading;