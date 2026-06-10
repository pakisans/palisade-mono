// Minimal ambient declaration for `jsdom` (no @types/jsdom installed).
// Covers only the surface used by scrape-projects.ts.
declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string)
    readonly window: Window & typeof globalThis
  }
}
