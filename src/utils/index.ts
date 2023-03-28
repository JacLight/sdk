export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function(txt) {
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
