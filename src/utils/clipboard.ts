import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

/**
 * Attempts to copy text to clipboard using multiple fallback methods
 */
export async function copyToClipboard(text: string, successMessage?: string): Promise<void> {
  const message = successMessage || SUCCESS_MESSAGES.MESSAGE_COPIED;

  // Try Web Share API first (mobile/PWA)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Artemia AI 전시 추천',
        text
      });
      return; // Success, no need to continue
    } catch (shareErr) {
      console.log('Web Share API failed, falling back to clipboard:', shareErr);
      // Continue to clipboard fallback
    }
  }

  // Fallback: try modern clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      alert(message);
      return;
    } catch (clipboardErr) {
      console.log('Clipboard API failed, using legacy method:', clipboardErr);
      // Continue to legacy fallback
    }
  }

  // Legacy fallback for insecure contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      alert(message);
    } else {
      throw new Error('execCommand failed');
    }
  } catch (legacyErr) {
    console.error('All copy methods failed:', legacyErr);
    // Show the text in a prompt as last resort
    prompt(ERROR_MESSAGES.CLIPBOARD_BLOCKED, text);
  }
}

/**
 * Shares text using Web Share API or falls back to clipboard
 */
export async function shareText(
  text: string, 
  title: string = 'Artemia AI 전시 추천',
  successMessage?: string
): Promise<void> {
  await copyToClipboard(text, successMessage);
}