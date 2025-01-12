export function formatDate(date) {
  return new Date(date).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
export function generateChatId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}-${sortedIds[1]}`;
}