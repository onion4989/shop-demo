export const THUMB_TITLE_EASE = [0.22, 1, 0.36, 1] as const
export const THUMB_TITLE_SLIDE_OUT_DUR = 0.5
export const THUMB_TITLE_SLIDE_IN_DUR = 1
export const THUMB_TITLE_SLIDE_OFFSET = 8

export function thumbTitleMotionProps(isDialogOpen: boolean) {
  return {
    initial: false as const,
    animate: isDialogOpen
      ? { opacity: 0, y: THUMB_TITLE_SLIDE_OFFSET }
      : { opacity: 1, y: 0 },
    transition: {
      duration: isDialogOpen
        ? THUMB_TITLE_SLIDE_OUT_DUR
        : THUMB_TITLE_SLIDE_IN_DUR,
      ease: THUMB_TITLE_EASE,
    },
    style: { pointerEvents: isDialogOpen ? 'none' : 'auto' } as const,
    'aria-hidden': isDialogOpen,
  }
}
