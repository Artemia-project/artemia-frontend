import { UI_CONSTANTS } from '@/constants';

/**
 * Checks if a message is considered long
 */
export function isLongMessage(content: string): boolean {
  return content.length > UI_CONSTANTS.MESSAGE_PREVIEW_LENGTH;
}

/**
 * Gets a preview of message content with ellipsis
 */
export function getMessagePreview(
  content: string, 
  maxLength: number = UI_CONSTANTS.MESSAGE_PREVIEW_LENGTH
): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}

/**
 * Formats multiple messages for sharing/copying
 */
export function formatMessagesForShare(messages: Array<{ content: string }>): string {
  return messages
    .map((msg, index) => `📝 ${index + 1}. ${msg.content}`)
    .join('\n\n');
}

/**
 * Formats multiple messages for copying (without emojis)
 */
export function formatMessagesForCopy(messages: Array<{ content: string }>): string {
  return messages
    .map((msg, index) => `${index + 1}. ${msg.content}`)
    .join('\n\n');
}