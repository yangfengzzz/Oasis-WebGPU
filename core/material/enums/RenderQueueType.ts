/**
 * Render queue type.
 */
export enum RenderQueueType {
  /** Opaque queue. */
  Opaque = 1000,
  /** Opaque queue, alpha cutoff. */
  AlphaTest = 2000,
  /** Transparent queue, rendering from back to front to ensure correct rendering of transparent objects. */
  Transparent = 3000
}
