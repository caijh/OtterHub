import { Hono } from 'hono';
import { FileMetadata, FileType } from '@shared/types';
import { authMiddleware } from '../../middleware/auth';
import { getFileIdFromKey } from '@utils/file';
import { fail, ok } from '@utils/response';
import {
  isSupportedImage,
  fetchResizedImageBuffer,
  AI_MODEL,
  AI_OUTPUT_PROMPT,
  extractImageDesc,
  normalizeDesc,
} from '@utils/ai/image-analysis';
import type { Env } from '../../types/hono';

export const analyzeRoutes = new Hono<{ Bindings: Env }>();

analyzeRoutes.post(
  '/:key/analyze',
  authMiddleware,
  async (c) => {
    const key = c.req.param('key');
    const kv = c.env.oh_file_url;

    // 1. 验证是否为图片文件
    if (!isSupportedImage(null, key)) {
      return fail(c, 'Not a supported image file', 400);
    }

    const colonIndex = key.indexOf(':');
    const fileType = colonIndex > 0 ? key.substring(0, colonIndex) : null;
    if (fileType !== FileType.Image) {
      return fail(c, 'Not an image file', 400);
    }

    try {
      // 2. 获取文件元数据
      const { metadata } = await kv.getWithMetadata<FileMetadata>(key);
      if (!metadata) {
        return fail(c, `File metadata not found for key: ${key}`, 404);
      }

      // 3. 检查AI环境
      if (!c.env.AI) {
        return fail(c, 'AI service not available', 503);
      }

      // 4. 从key提取fileId
      const { fileId } = getFileIdFromKey(key);
      if (!fileId) {
        return fail(c, 'Invalid file key', 400);
      }

      // 5. 检查Telegram配置
      if (!c.env.TG_BOT_TOKEN) {
        return fail(c, 'Telegram bot token not configured', 503);
      }

      // 6. 利用CF边缘压缩获取图片
      const buffer = await fetchResizedImageBuffer(c.env.TG_BOT_TOKEN, fileId);
      if (!buffer) {
        return fail(c, 'Failed to fetch image from Telegram', 500);
      }

      // 7. 调用AI分析
      const result = await c.env.AI.run(AI_MODEL, {
        image: Array.from(new Uint8Array(buffer)),
        prompt: AI_OUTPUT_PROMPT,
        max_tokens: 100,
      });

      const desc = normalizeDesc(extractImageDesc(result));

      if (!desc) {
        return fail(c, 'AI analysis returned empty result', 500);
      }

      return ok(c, { desc });
    } catch (e: any) {
      console.error('AI analysis error:', e);
      return fail(c, `AI analysis failed: ${e.message}`, 500);
    }
  }
);
