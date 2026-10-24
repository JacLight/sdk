import { twMerge } from 'tailwind-merge';


export const toTitleCase = (str: string) => {
  if (!str) return str;
  if (typeof str !== 'string') return str;

  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const toSentenceCase = (str: string) => {
  if (!str || typeof str !== 'string') return str;

  // Match an uppercase letter that is followed by a lowercase letter or preceded by a lowercase letter.
  const result = str.replace(
    /([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g,
    (_, p1, p2, p3, p4) => {
      return p1 && p2 ? `${p1} ${p2}` : `${p3} ${p4}`;
    }
  );

  // Capitalize the first character and return the result
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const deepCopy = (obj: any) => {
  if (!obj) return obj;
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
};

export const deepCopySimple = (obj: any) => {
  if (!obj) return obj;
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let clonedObj: any = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      clonedObj[key] = deepCopySimple(value);
    }
  }
  return clonedObj;
};

export const isEmpty = (obj: any) => {
  if (obj === undefined || obj === null || obj === '') return true;
  if (typeof obj === 'function') return false;
  if (typeof obj === 'boolean' || typeof obj === 'number') return false;
  if (typeof obj === 'string' && obj.length > 0) return false;
  if (Array.isArray(obj) && obj.length > 0) return false;
  if (typeof obj === 'object' && obj.constructor && obj.constructor.name?.toLowerCase().includes('error')) return false;
  if (typeof obj === 'object' && Object.keys(obj).length > 0) return false;
  return true;
};

export const isNotEmpty = (obj: any) => {
  return !isEmpty(obj);
};

export const validUrl = (url: string) => {
  if (!url) return false;
  var pattern = new RegExp('^https?:\\/\\/'); // fragment locator
  return !!pattern.test(url);
};

export function getRandomNumber(min = 0, max = 999999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomString(length = 20) {
  const chars = 'abcdefghijklmnpqrstuvwxyz';
  const numbers = '0123456789';
  const allChars = chars + numbers;

  let result = chars.charAt(Math.floor(Math.random() * chars.length)); // Start with a character

  for (let i = 1; i < length; i++) {
    // Start loop from 1 since we already have the first character
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return result;
}

export const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export function removeEmpty(obj: any): any {
  if (Array.isArray(obj)) {
    // If it's an array, apply removeEmpty to each element
    return obj.map(removeEmpty).filter(v => v != null);
  } else if (obj !== null && typeof obj === 'object') {
    // If it's an object, apply the original logic
    return Object.entries(obj)
      .filter(([_, v]) => v != null)
      .reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: v === Object(v) ? removeEmpty(v) : v,
        }),
        {}
      );
  }
  // Return the value as is if it's neither an array nor an object
  return obj;
}

export function executeFunctionByName(
  functionName: string,
  context: any /*, args */
) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split('.');
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}

export const getElementByClassName = (className: string) => {
  return document.querySelector(className) as HTMLElement;
};

export const randomNumber = (length: number) => {
  var arr = [];
  while (arr.length < length) {
    var r = Math.floor(Math.random() * 100) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr.join();
};

export const isArrayString = (str: any) => {
  if (typeof str !== 'string') return false;
  return str && str.startsWith('[') && str.endsWith(']');
};

export const isObjectString = (str: any) => {
  if (typeof str !== 'string') return false;
  return str && str.startsWith('{') && str.endsWith('}');
};

export const isJsonString = (str: any) => {
  return isArrayString(str) || isObjectString(str);
};

export const niceURI = (crappyURI: any) => {
  return crappyURI?.toLowerCase().replace(/[^a-zA-Z0-9-_\/]/g, '-');
};

export function findNestedKey(obj: any, key: string | number): any {
  if (obj && typeof obj === 'object') {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const result = findNestedKey(obj[i], key);
        if (result !== undefined) {
          return result;
        }
      }
    } else {
      for (let prop in obj) {
        const result = findNestedKey(obj[prop], key);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }
  return undefined;
}

export function timeAgo(createdDateTime: string): string {
  const now = new Date();
  const createdDate = new Date(createdDateTime);

  const diffInSeconds = Math.abs(now.getTime() - createdDate.getTime()) / 1000;

  const days = Math.floor(diffInSeconds / (60 * 60 * 24));
  const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(diffInSeconds % 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}

export function getTimePart(date: any) {
  if (typeof date === 'string') date = new Date(date);
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes();
  const amPm = hours24 < 12 ? 'AM' : 'PM';

  const formattedHours = String(hours12).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

export function formatTime(date: any) {
  if (typeof date === 'string') date = new Date(date);
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes();
  const amPm = hours24 < 12 ? 'AM' : 'PM';

  const formattedHours = String(hours12).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

interface AnyObject {
  [key: string]: any;
}

export function combineObjectArray(
  arr1: AnyObject[],
  arr2: AnyObject[],
  uniqueKey: string
): AnyObject[] {
  if (!arr1) return arr2;
  if (!arr2) return arr1;
  return Array.from(
    [...arr1, ...arr2]
      .reduce((acc, obj) => {
        return acc.set(obj[uniqueKey], obj);
      }, new Map<any, any>())
      .values()
  );
}

export function classNames(...classes: any) {
  return twMerge(classes.filter(Boolean).join(' '));
}

export function styleToObject(style: string): { [key: string]: string } {
  if (isEmpty(style)) return null;

  return style
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .reduce<{ [key: string]: string }>((obj, item) => {
      const [property, value] = item.split(':').map(s => s.trim());
      if (property && value) {
        // Convert hyphenated property to camelCase
        const camelCaseProperty = property.replace(/-([a-z])/g, g =>
          g[1].toUpperCase()
        );
        obj[camelCaseProperty] = value;
      }
      return obj;
    }, {});
}

export function stringifyCSSObject(cssObject: any, indent = '') {
  let result = '';
  for (const [key, value] of Object.entries(cssObject)) {
    if (typeof value === 'object') {
      result += `${indent}${key}: {\n${stringifyCSSObject(
        value,
        indent + '  '
      )}${indent}}\n`;
    } else {
      result += `${indent}${key}: ${value};\n`;
    }
  }
  return result;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
}

//camelCase to kebab-case
export const styleObjectToString = (style: { [key: string]: string }) => {
  return Object.keys(style)
    .map(key => {
      const kebabCaseKey = key
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();
      return `${kebabCaseKey}:${style[key]}`;
    })
    .join(';');
};

export const debounce = (func: any, wait: number) => {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const isValidHtmlId = (id: string) => {
  if (!id || typeof id !== 'string') return false;
  const idPattern = /^[A-Za-z][\w\:\-\.]*$/;
  return idPattern.test(id);
};

// ─── Links: hosted video and media kind ───────────────────────────
// One rule for every module that shows a pasted link or a stored file: Content Studio's
// video block, supporting material on a policy (server and staff portal), any viewer.

const parseUrl = (url: string): URL | null => {
  try {
    return new URL(String(url || '').trim());
  } catch {
    return null;
  }
};

/** The YouTube video id in any of its URL shapes (watch, youtu.be, shorts, embed, live). */
export const youtubeId = (url: string): string | null => {
  const u = parseUrl(url);
  if (!u) return null;
  const host = u.hostname.replace(/^www\.|^m\./, '');
  const ok = (id?: string | null) => (id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null);
  if (host === 'youtu.be') return ok(u.pathname.split('/')[1]);
  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'music.youtube.com') {
    if (u.pathname === '/watch') return ok(u.searchParams.get('v'));
    const m = /^\/(embed|shorts|live|v)\/([^/?#]+)/.exec(u.pathname);
    if (m) return ok(m[2]);
  }
  return null;
};

/** The Vimeo video id (vimeo.com/123, vimeo.com/channels/x/123, player.vimeo.com/video/123). */
export const vimeoId = (url: string): string | null => {
  const u = parseUrl(url);
  if (!u) return null;
  const host = u.hostname.replace(/^www\./, '');
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
  const m = /\/(\d{5,12})(?:\/|$)/.exec(u.pathname);
  return m ? m[1] : null;
};

/**
 * A hosted video's player address, or null. Privacy-enhanced YouTube by default;
 * `jsApi` gives the player API address a page listens to for "how much was watched".
 */
export const videoEmbedUrl = (url?: string, opts: { jsApi?: boolean } = {}): string | null => {
  if (!url) return null;
  const y = youtubeId(url);
  if (y) return opts.jsApi ? `https://www.youtube.com/embed/${y}?enablejsapi=1` : `https://www.youtube-nocookie.com/embed/${y}`;
  const v = vimeoId(url);
  return v ? `https://player.vimeo.com/video/${v}` : null;
};

export type MediaLinkType = 'video' | 'pdf' | 'image' | 'audio' | 'document' | 'link';

const MEDIA_EXT: [MediaLinkType, RegExp][] = [
  ['pdf', /\.pdf(\?|#|$)/i],
  ['video', /\.(mp4|m4v|webm|mov|ogv)(\?|#|$)/i],
  ['audio', /\.(mp3|m4a|wav|ogg|aac|flac)(\?|#|$)/i],
  ['image', /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|#|$)/i],
  ['document', /\.(docx?|xlsx?|pptx?|odt|ods|odp|rtf|txt|csv|md)(\?|#|$)/i],
];

/** Company intranets people link to; the name shows on the card. */
const INTRANETS: [RegExp, string][] = [
  [/(^|\.)sharepoint\.com$/i, 'SharePoint'],
  [/(^|\.)sites\.google\.com$/i, 'Google Sites'],
  [/(^|\.)docs\.google\.com$/i, 'Google Docs'],
  [/(^|\.)drive\.google\.com$/i, 'Google Drive'],
  [/(^|\.)notion\.(so|site)$/i, 'Notion'],
  [/(^|\.)atlassian\.net$/i, 'Confluence'],
  [/(^|\.)confluence\./i, 'Confluence'],
  [/(^|\.)dropbox\.com$/i, 'Dropbox'],
  [/(^|\.)box\.com$/i, 'Box'],
  [/(^|\.)onedrive\.live\.com$/i, 'OneDrive'],
];

/**
 * What a link (or a stored file's path) points at, from its shape alone and the
 * file's MIME type when known: a hosted video, a PDF, a video / audio / image file,
 * an office document, an intranet page, or a plain link.
 */
export const detectMediaLink = (url: string, mime?: string): { type: MediaLinkType; provider?: 'youtube' | 'vimeo'; source?: string } => {
  const m = String(mime || '').toLowerCase();
  if (youtubeId(url)) return { type: 'video', provider: 'youtube', source: 'YouTube' };
  if (vimeoId(url)) return { type: 'video', provider: 'vimeo', source: 'Vimeo' };
  const u = parseUrl(url);
  const path = u ? u.pathname : String(url || ''); // a bare path: a stored file
  const host = u ? u.hostname : '';
  if (m === 'application/pdf') return { type: 'pdf' };
  if (m.startsWith('video/')) return { type: 'video' };
  if (m.startsWith('audio/')) return { type: 'audio' };
  if (m.startsWith('image/')) return { type: 'image' };
  const byExt = MEDIA_EXT.find(([, re]) => re.test(path));
  if (byExt) return { type: byExt[0] };
  if (/officedocument|msword|ms-excel|ms-powerpoint|opendocument|text\/(plain|csv)/.test(m)) return { type: 'document' };
  const intranet = INTRANETS.find(([re]) => re.test(host));
  if (intranet) return { type: 'link', source: `Intranet (${intranet[1]})` };
  return { type: 'link' };
};
