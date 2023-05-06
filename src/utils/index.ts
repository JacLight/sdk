export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const toSentenceCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const deepCopy = (source: any) => {
  return JSON.parse(JSON.stringify(source));
};

export const isEmpty = (obj: any) => {
  if (typeof obj === 'function') return false;
  if (typeof obj === 'boolean' || typeof obj === 'number') return false;
  if (typeof obj === 'string' && obj.length > 0) return false;
  if (Array.isArray(obj) && obj.length > 0) return false;
  if (obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0)
    return false;
  return true;
};

export const validUrl = (url: string) => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(url);
};

export function getRandomString(length = 20) {
  var randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

export function removeEmpty(obj: any): any {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
      {}
    );
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
  return crappyURI.replace(/[^a-zA-Z0-9-_]/g, '-');
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
