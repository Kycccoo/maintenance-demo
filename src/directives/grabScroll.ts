// src/directives/grabScroll.ts
import type { Directive } from 'vue';

export const grabScroll: Directive<HTMLElement, void> = {
  mounted(el) {
    const THRESHOLD = 8; // 提高一點，避免微動作被誤判
    let isDown = false;
    let moved = false;
    let suppressClick = false;
    let startX = 0;
    let startScrollLeft = 0;

    // 初始游標，平常可選字、可點擊
    el.classList.add('cursor-grab');

    const isInteractive = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      t.closest('button, a, input, textarea, select, [contenteditable="true"]');

    const onPointerDown = (e: PointerEvent) => {
      // 如果點在互動元素上，就不要進入拖動模式，交給元素自己處理
      if (isInteractive(e.target)) return;

      isDown = true;
      moved = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
      // 先不關 user-select，等確認有拖動才加（避免選字被破壞）
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;

      if (!moved && Math.abs(dx) >= THRESHOLD) {
        // 確認“真的要拖動了”時再切手感＆關選取
        moved = true;
        el.classList.remove('cursor-grab');
        el.classList.add('cursor-grabbing', 'select-none');
        el.style.userSelect = 'none';
      }

      if (moved) {
        el.scrollLeft = startScrollLeft - dx;
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      el.releasePointerCapture?.(e.pointerId);

      if (moved) {
        // 剛剛確實有拖過，抑制緊接而來的那次 click
        suppressClick = true;
      }

      // 還原手感/選取
      el.classList.remove('cursor-grabbing', 'select-none');
      el.classList.add('cursor-grab');
      el.style.userSelect = ''; // 還原預設
      moved = false;
    };

    // 把垂直滾輪轉成水平（可留可拿掉）
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaY;
      }
    };

    // 只在剛結束拖動的那一次 click 阻擋，其他一律放行
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointerleave', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('click', onClick, true);
    (el as any)._grabScrollCleanup = () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointerleave', endDrag);
      el.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('click', onClick, true);
    };
  },
  unmounted(el) {
    (el as any)._grabScrollCleanup?.();
  }
};
