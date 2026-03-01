import type { ServiceConfig } from '@/types';

export const SERVICES: ServiceConfig[] = [
  {
    id: 'ocr',
    label: 'Ψηφιοποίηση',
    description: 'Μετατροπή εγγράφων σε κείμενο με AI',
    icon: '/assets/icon-ocr.svg',
  },
  {
    id: 'translate',
    label: 'Μετάφραση',
    description: 'Επαγγελματική μετάφραση με DeepL',
    icon: '/assets/icon-translate.svg',
  },
  {
    id: 'audiobook',
    label: 'Ηχητικό Βιβλίο',
    description: 'Δημιουργία ηχητικού με ElevenLabs',
    icon: '/assets/icon-audiobook.svg',
  },
  {
    id: 'vault',
    label: 'Θησαυροφυλάκιο',
    description: 'Ασφαλής αποθήκευση εγγράφων',
    icon: '/assets/icon-vault.svg',
  },
];
