import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  dateFormat: 'gregorian' | 'hijri';
  currency: string;
  theme: 'light' | 'dark';
  setLanguage: (language: 'en' | 'ar') => void;
  setDirection: (direction: 'ltr' | 'rtl') => void;
  setDateFormat: (format: 'gregorian' | 'hijri') => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      direction: 'ltr',
      dateFormat: 'gregorian',
      currency: 'USD',
      theme: 'light',
      
      setLanguage: (language) => {
        set({ 
          language,
          direction: language === 'ar' ? 'rtl' : 'ltr'
        });
      },
      
      setDirection: (direction) => {
        set({ direction });
      },
      
      setDateFormat: (format) => {
        set({ dateFormat: format });
      },
      
      setCurrency: (currency) => {
        set({ currency });
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: 'settings-store',
    }
  )
);

export default useSettingsStore;