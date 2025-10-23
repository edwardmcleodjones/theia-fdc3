const globalWithDrag = globalThis as Record<string, unknown>;

if (typeof globalWithDrag.DragEvent === "undefined") {
  class DragEventPolyfill extends Event {
    constructor(type: string, eventInitDict?: EventInit) {
      super(type, eventInitDict);
    }
  }

  globalWithDrag.DragEvent = DragEventPolyfill;
}
