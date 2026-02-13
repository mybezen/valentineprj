export type Phase = 'intro' | 'game' | 'transition' | 'gallery' | 'gift' | 'drowned_transition' | 'flashback' | 'memory' | 'ending';

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
}
