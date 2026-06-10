import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const animacionSuave = {
  type: "tween",
  duration: 0.5,
  ease: [0.65, 0, 0.35, 1],
} as const;

export type DireccionPopover =
  | "tl"
  | "tc"
  | "tr"
  | "cl"
  | "c"
  | "cr"
  | "bl"
  | "bc"
  | "br";

interface PopoverAnimadoProps {
  id: string;
  titulo: string | React.ReactNode;
  texto?: string | React.ReactNode;
  direccion: DireccionPopover;
  children?:
    | React.ReactNode
    | ((props: { close: () => void }) => React.ReactNode);
  pWidth?: number;
  pHeight?: number;
  theme?: "light" | "dark" | "hybrid";
  triggerWidth?: number | string;
  triggerHeight?: number | string;
  triggerContent?: React.ReactNode;
  triggerClassName?: string;
}

export default function PopoverAnimado({
  id,
  titulo,
  texto,
  direccion,
  children,
  pWidth = 280,
  pHeight = 180,
  theme = "light",
  triggerWidth = 140,
  triggerHeight = 48,
  triggerContent,
  triggerClassName = "",
}: PopoverAnimadoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isDarkMode = theme === "dark";

  const bWidthNum =
    typeof triggerWidth === "number"
      ? triggerWidth
      : parseInt(String(triggerWidth));
  const bHeightNum =
    typeof triggerHeight === "number"
      ? triggerHeight
      : parseInt(String(triggerHeight));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const vH = window.innerHeight;
      const vW = window.innerWidth;

      let top = 0,
        left = 0;
      let finalDir = direccion;

      const calculatePos = (dir: DireccionPopover) => {
        const cT = rect.top + (bHeightNum - pHeight) / 2;
        const cL = rect.left + (bWidthNum - pWidth) / 2;
        let t = 0,
          l = 0;

        switch (dir) {
          case "tl":
            t = rect.bottom - pHeight;
            l = rect.right - pWidth;
            break;
          case "tc":
            t = rect.bottom - pHeight;
            l = cL;
            break;
          case "tr":
            t = rect.bottom - pHeight;
            l = rect.left;
            break;
          case "cl":
            t = cT;
            l = rect.right - pWidth;
            break;
          case "c":
            t = cT;
            l = cL;
            break;
          case "cr":
            t = cT;
            l = rect.left;
            break;
          case "bl":
            t = rect.top;
            l = rect.right - pWidth;
            break;
          case "bc":
            t = rect.top;
            l = cL;
            break;
          case "br":
            t = rect.top;
            l = rect.left;
            break;
          default:
            t = cT;
            l = cL;
            break;
        }
        return { t, l };
      };

      let pos = calculatePos(finalDir);

      if (pos.t + pHeight > vH && finalDir.startsWith("b")) {
        finalDir = finalDir.replace("b", "t") as DireccionPopover;
        pos = calculatePos(finalDir);
      } else if (pos.t < 0 && finalDir.startsWith("t")) {
        finalDir = finalDir.replace("t", "b") as DireccionPopover;
        pos = calculatePos(finalDir);
      }

      top = Math.max(10, Math.min(pos.t, vH - pHeight - 10));
      left = Math.max(10, Math.min(pos.l, vW - pWidth - 10));

      setCoords({ top, left });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);

    window.addEventListener("resize", handleClose);

    return () => {
      window.removeEventListener("resize", handleClose);
    };
  }, [isOpen]);

  const portalRoot = document.body;

  return (
    <>
      <div
        className={`relative flex items-center justify-center ${triggerClassName}`}
        style={{ width: bWidthNum, height: bHeightNum }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              ref={buttonRef}
              key={`btn-${id}`}
              layoutId={`morph-bg-${id}`}
              onClick={handleOpen}
              className={`absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden shadow-sm transition-colors ${
                isDarkMode
                  ? "bg-zinc-900 hover:bg-zinc-800"
                  : "bg-white hover:bg-gray-50"
              }`}
              style={{ borderRadius: 12 }}
              transition={animacionSuave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`font-bold text-sm tracking-wide whitespace-nowrap ${
                  isDarkMode ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {triggerContent || titulo}
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                key={`portal-root-${id}`}
                className="fixed inset-0 z-[10000] pointer-events-none"
                style={{ isolation: "isolate" }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-auto bg-black/20 backdrop-blur-[2px]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                />

                <motion.div
                  key={`pop-${id}`}
                  layoutId={`morph-bg-${id}`}
                  className={`absolute flex flex-col overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.3)] pointer-events-auto border ${
                    isDarkMode
                      ? "bg-zinc-950/95 border-zinc-900"
                      : "bg-white/95 border-gray-100"
                  } backdrop-blur-3xl`}
                  style={{
                    width: pWidth,
                    height: pHeight,
                    borderRadius: 24,
                    top: coords.top,
                    left: coords.left,
                  }}
                  transition={animacionSuave}
                >
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute top-4 right-4 rounded-full p-2 z-50 transition-colors backdrop-blur-md ${
                      isDarkMode
                        ? "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
                        : "bg-gray-100/80 hover:bg-gray-200 text-gray-400 hover:text-gray-800"
                    }`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                  >
                    <X size={18} strokeWidth={2.5} />
                  </motion.button>

                  <div
                    className={`p-8 relative w-full h-full flex flex-col overflow-y-auto ${titulo != "" ? "" : "p-0"}`}
                  >
                    <motion.div
                      className={` ${titulo != "" ? "font-black whitespace-nowrap tracking-tighter text-3xl w-fit mb-4" : "none"} ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {titulo}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1,
                        ease: "easeOut",
                      }}
                      className="flex-1 flex flex-col"
                    >
                      {children ? (
                        <div className="flex-1">
                          {typeof children === "function"
                            ? (children as Function)({
                                close: () => setIsOpen(false),
                              })
                            : children}
                        </div>
                      ) : (
                        <p
                          className={`text-sm leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
                        >
                          {texto}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          portalRoot,
        )}
    </>
  );
}
