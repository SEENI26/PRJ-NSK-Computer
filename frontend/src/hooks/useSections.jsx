import { createContext, useContext, useEffect, useState } from 'react';
import { sections as sectionsApi } from '@/services/api';
import { withFallback } from '@/services/api';

/**
 * Editable section copy, layered over what is compiled into the site.
 *
 * The contract that matters: **the bundled copy is the source of truth until
 * someone edits it.** Every page passes its own defaults to `useSection`, and
 * only the fields actually saved in the admin panel override them. So a fresh
 * database, an unreachable API and a fully edited site all render correctly —
 * the site never depends on MySQL being up to show its own words.
 *
 * Fetched once at the root rather than per section: it is one small request
 * for the whole site, and doing it per component would mean thirty of them.
 */

const SectionContext = createContext({ values: {}, ready: false });

export function SectionProvider({ children }) {
  const [values, setValues] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;

    // withFallback swallows the error and returns {} when the API is down,
    // which is exactly the behaviour the public site wants.
    withFallback(sectionsApi.all(), {}).then((data) => {
      if (!live) return;
      setValues(data && typeof data === 'object' ? data : {});
      setReady(true);
    });

    return () => { live = false; };
  }, []);

  return (
    <SectionContext.Provider value={{ values, ready }}>
      {children}
    </SectionContext.Provider>
  );
}

/**
 * Section copy for `key`, with the caller's compiled text as the floor.
 *
 * @param {string} key      e.g. 'home.hero'
 * @param {object} defaults the copy that ships in the bundle
 */
export function useSection(key, defaults = {}) {
  const { values } = useContext(SectionContext);
  const edited = values[key];

  if (!edited) return defaults;

  // Only non-empty saved fields win. The API already drops blanks, but a
  // defensive filter here means a half-written row cannot blank a heading.
  const merged = { ...defaults };
  for (const [field, value] of Object.entries(edited)) {
    if (typeof value === 'string' && value.trim() !== '') {
      merged[field] = value;
    }
  }
  return merged;
}

/** True once the fetch has settled — for anything that must not flash. */
export function useSectionsReady() {
  return useContext(SectionContext).ready;
}
