export default () => ({
  db_url: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  port: parseInt(process.env.PORT),
});
