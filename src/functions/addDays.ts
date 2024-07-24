export default function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date); // Tạo một đối tượng Date mới để tránh thay đổi đối tượng ban đầu
  result.setDate(result.getDate() + days); // Thêm số ngày vào ngày hiện tại
  return result;
}
