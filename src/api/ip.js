let IP;
if (process.env.NODE_ENV === "development") {
  IP = "/dev";
} else {
  IP = process.env.VUE_APP_API_URL;
}
export default IP;
