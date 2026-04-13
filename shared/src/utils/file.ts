/** MIME type 到常用扩展名的映射 */
export const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'audio/mpeg': '.mp3',
  'audio/ogg': '.ogg',
  'audio/wav': '.wav',
  'application/pdf': '.pdf',
  'application/zip': '.zip',
  'text/plain': '.txt',
};

/** 从 Content-Type 响应头中提取纯 MIME 类型（去除 charset 等参数） */
export function extractMimeType(contentType: string | null): string {
  if (!contentType) return '';
  return contentType.split(';')[0].trim().toLowerCase();
}

/** 从 Content-Disposition 响应头中解析文件名 */
export function extractFileNameFromDisposition(disposition: string | null): string {
  if (!disposition) return '';
  const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\r\n]+)["']?/i);
  return match ? decodeURIComponent(match[1].trim()) : '';
}

/** 从 URL 路径中解析文件名（取最后一段，去除 query/hash） */
export function extractFileNameFromUrl(urlStr: string): string {
  try {
    const { pathname } = new URL(urlStr);
    const segment = pathname.split('/').pop() ?? '';
    return decodeURIComponent(segment);
  } catch {
    return '';
  }
}

/** 判断文件名是否带有扩展名 */
export function hasExtension(name: string): boolean {
  const base = name.split('/').pop() ?? name;
  const dot = base.lastIndexOf('.');
  return dot > 0 && dot < base.length - 1;
}
