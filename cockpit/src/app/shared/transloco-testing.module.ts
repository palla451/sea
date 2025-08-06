import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import en from '../../assets/i18n/en.json';
import it from '../../assets/i18n/it.json';

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { en, it },
    translocoConfig: {
      availableLangs: ['en', 'it'],
      defaultLang: 'en',
    },
    preloadLangs: true,
    ...options,
  });
}
