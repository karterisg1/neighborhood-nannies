export function formatDate(date) {
  return new Date(date).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}