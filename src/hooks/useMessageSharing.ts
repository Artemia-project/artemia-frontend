import { useCallback } from 'react';
import { copyToClipboard, shareText } from '@/utils/clipboard';
import { formatMessagesForShare, formatMessagesForCopy } from '@/utils/text';
import { SUCCESS_MESSAGES } from '@/constants';
import { Message } from '@/types';

export function useMessageSharing() {
  const handleShareMessage = useCallback(async (message: Message) => {
    const shareContent = `Artemia AI 추천:\n\n${message.content}\n\n전시 추천 서비스 - Artemia: Art Curator AI`;
    await shareText(shareContent);
  }, []);

  const handleCopyMessage = useCallback(async (message: Message) => {
    await copyToClipboard(message.content);
  }, []);

  const handleShareAllMessages = useCallback(async (messages: Message[]) => {
    if (messages.length === 0) return;
    
    const allMessagesText = formatMessagesForShare(messages);
    const shareContent = `✨ Artemia AI 저장된 전시 추천 ${messages.length}개\n\n${allMessagesText}\n\n🎨 전시 추천 서비스 - Artemia: Art Curator AI`;
    
    await shareText(
      shareContent,
      `Artemia AI 저장된 메시지 ${messages.length}개`,
      SUCCESS_MESSAGES.MESSAGES_COPIED(messages.length) + '✨'
    );
  }, []);

  const handleCopyAllMessages = useCallback(async (messages: Message[]) => {
    if (messages.length === 0) return;
    
    const allMessagesText = formatMessagesForCopy(messages);
    await copyToClipboard(allMessagesText, SUCCESS_MESSAGES.MESSAGES_COPIED(messages.length));
  }, []);

  return {
    handleShareMessage,
    handleCopyMessage,
    handleShareAllMessages,
    handleCopyAllMessages,
  };
}