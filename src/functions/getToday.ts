export default function getToday(): Date {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  // Tạo đối tượng Date mới chỉ với thông tin năm, tháng và ngày
  const formattedDate = new Date(Date.UTC(year, month, day));

  return formattedDate;
}
