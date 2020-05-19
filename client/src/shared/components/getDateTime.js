import moment from "moment";

export const getDateTime = (date) => {
  if (!date) return '';
  return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
}