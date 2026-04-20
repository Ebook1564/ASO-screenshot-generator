import enUS from './en-US.json';
import fr from './fr.json';
import de from './de.json';
import pt from './pt.json';
import ja from './ja.json';
import zh from './zh.json';
import hiIN from './hi-IN.json';
import ar from './ar.json';

export const localizationFiles: Record<string, Record<string, Record<string, string>>> = {
  'en-US': enUS,
  'en': enUS,
  'fr': fr,
  'de': de,
  'pt': pt,
  'ja': ja,
  'zh': zh,
  'hi-IN': hiIN,
  'hi': hiIN,
  'ar': ar,
};
