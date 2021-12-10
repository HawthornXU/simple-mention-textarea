// learn more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
export class CookiesHelper {

  static getItem(key: string) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  };

  static setItem(key: string, value: string, end?: number | string | Date, path?: string, domain?: string, secure?: string): boolean {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false;
    }
    let expires = "";
    if (end) {
      switch (end.constructor) {
        case Number:
          expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
          break;
        case String:
          expires = "; expires=" + end;
          break;
        case Date:
          expires = "; expires=" + (end as Date).toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
    return true;
  }

  static removeItem(key: string, path?: string, domain?: string): boolean {
    if (!key || !this.hasItem(key)) {
      return false;
    }
    document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");
    return true;
  }

  static hasItem(key: string): boolean {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }

  static keys(): Array<string> {
    const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (let idx = 0; idx < aKeys.length; idx++) {
      aKeys[idx] = decodeURIComponent(aKeys[idx]);
    }
    return aKeys;
  }
}
