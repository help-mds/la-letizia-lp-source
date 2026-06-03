/**
 * Camera work prompt builder for Seedance video generation.
 *
 * Faithfully translated from ZIP: lib/prompts/cameraWork.ts
 */

export type BusinessType = 'restaurant' | 'salon';
export type BusinessSubtype = 'cafe' | 'fine_dining' | 'casual' | 'bar' | string;

interface CameraWorkInput {
  businessType: BusinessType;
  businessSubtype?: string;
  ambiancePhrases: string;
}

/**
 * Builds the camera movement description for the video prompt.
 * Restaurant/cafe: forward dolly through space, approaching table/counter.
 */
export function buildCameraWork(input: CameraWorkInput): string {
  const { businessType, businessSubtype } = input;

  if (businessType === 'restaurant') {
    if (businessSubtype === 'cafe') {
      return 'Slow forward dolly at eye level, gliding past the marble counter toward a window seat. Camera maintains steady horizontal movement with subtle parallax on foreground objects. Movement is unhurried and continuous — no cuts, no pans, no tilts.';
    }
    if (businessSubtype === 'fine_dining') {
      return 'Slow forward dolly at seated eye level, moving between tables toward the back of the dining room. Camera maintains steady horizontal movement. Subtle depth-of-field shift as foreground elements pass. Movement is unhurried and continuous — no cuts, no pans, no tilts.';
    }
    // Default restaurant
    return 'Slow forward dolly at eye level, moving through the dining space toward the back. Camera maintains steady horizontal movement with subtle parallax on foreground objects. Movement is unhurried and continuous — no cuts, no pans, no tilts.';
  }

  if (businessType === 'salon') {
    return 'Slow forward dolly at standing eye level, moving through the salon space past styling stations. Camera maintains steady horizontal movement. Soft natural light shifts as camera passes windows. Movement is unhurried and continuous — no cuts, no pans, no tilts.';
  }

  return 'Slow forward dolly at eye level, moving through the space. Camera maintains steady horizontal movement. Movement is unhurried and continuous — no cuts, no pans, no tilts.';
}
