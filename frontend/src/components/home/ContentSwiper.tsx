import { useState, useCallback, type ReactNode } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useResponsiveItemsPerPage } from "../../hooks/useResponsiveItemsPerPage";
import { cn } from "../../lib/utils";

interface ContentSwiperProps {
  children: ReactNode[];
  itemsPerPage?: number;
  showArrows?: boolean;
  className?: string;
}

export default function ContentSwiper({
  children,
  itemsPerPage = 3,
  showArrows = true,
  className = "",
}: ContentSwiperProps) {
  const [page, setPage] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const visibleItems = useResponsiveItemsPerPage(itemsPerPage);
  const total = children.length;
  const maxPage = Math.max(0, Math.ceil(total / visibleItems) - 1);
  const activePage = Math.min(page, maxPage);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(maxPage, p + 1));
  }, [maxPage]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    // 不再根据拖动距离自动翻页，仅保留拖动平移的视觉反馈
    void info;
  }, []);

  if (total === 0) return null;

  const itemWidthPercent = 100 / visibleItems;
  const translateX = -(activePage * 100);

  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <div className="relative min-h-0 flex-1 px-7">
        {/* 左箭头 */}
        {showArrows && maxPage > 0 && (
          <button
            type="button"
            onClick={goPrev}
            disabled={activePage === 0}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/60 bg-white/50 p-1 text-muted-foreground shadow-[0_8px_24px_rgba(125,211,252,0.2)] backdrop-blur-xl transition hover:bg-white/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-0 dark:bg-white/10 dark:hover:bg-white/20"
            aria-label="上一页"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        )}

        {/* 右箭头 */}
        {showArrows && maxPage > 0 && (
          <button
            type="button"
            onClick={goNext}
            disabled={activePage === maxPage}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/60 bg-white/50 p-1 text-muted-foreground shadow-[0_8px_24px_rgba(125,211,252,0.2)] backdrop-blur-xl transition hover:bg-white/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-0 dark:bg-white/10 dark:hover:bg-white/20"
            aria-label="下一页"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}

        <div className="h-full overflow-x-hidden">
          <motion.div
            className="flex h-full cursor-grab touch-pan-y active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            animate={{ x: `${translateX}%` }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
          >
            {children.map((child, idx) => {
              const activeItemIndex =
                activePage * visibleItems + Math.floor(visibleItems / 2);
              const isActive = idx === activeItemIndex;
              const isSide =
                idx >= activePage * visibleItems &&
                idx < (activePage + 1) * visibleItems &&
                !isActive;
              return (
                <div
                  key={idx}
                  className={cn(
                    "h-full min-w-0 shrink-0 px-1.5 transition-all duration-300",
                    isActive && "is-active z-20 scale-100 opacity-100",
                    isSide && "is-side z-10 scale-90 opacity-100",
                    isSide && idx % 2 === 0 && "-rotate-2",
                    isSide && idx % 2 === 1 && "rotate-2",
                  )}
                  style={{ width: `${itemWidthPercent}%` }}
                >
                  {child}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
