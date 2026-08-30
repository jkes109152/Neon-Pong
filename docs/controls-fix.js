(() => {
  'use strict';

  const canvas = document.querySelector('#game-canvas');
  if (!canvas) return;

  let dragging = false;
  let activePointerId = null;
  const movementKeys = new Set(['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS']);

  function clearLegacyPointerTarget() {
    canvas.dispatchEvent(new Event('pointerleave'));
  }

  function endDrag(event) {
    if (!dragging) return;
    if (event && activePointerId !== null && event.pointerId !== activePointerId) return;
    dragging = false;
    activePointerId = null;
    canvas.classList.remove('is-dragging');
    queueMicrotask(clearLegacyPointerTarget);
  }

  // The original game follows every pointer hover. Intercept hover movement so
  // the paddle only follows a deliberate press-and-drag gesture.
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging || (activePointerId !== null && event.pointerId !== activePointerId)) {
      event.stopImmediatePropagation();
    }
  }, true);

  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      event.stopImmediatePropagation();
      return;
    }
    dragging = true;
    activePointerId = event.pointerId;
    canvas.classList.add('is-dragging');
  }, true);

  window.addEventListener('pointerup', endDrag, true);
  window.addEventListener('pointercancel', endDrag, true);

  // Keyboard input becomes the sole source immediately, preventing the paddle
  // from snapping back to the last mouse position after a key is released.
  window.addEventListener('keydown', (event) => {
    if (!movementKeys.has(event.code)) return;
    dragging = false;
    activePointerId = null;
    canvas.classList.remove('is-dragging');
    queueMicrotask(clearLegacyPointerTarget);
  }, true);

  window.addEventListener('blur', () => {
    dragging = false;
    activePointerId = null;
    canvas.classList.remove('is-dragging');
    clearLegacyPointerTarget();
  });
})();
