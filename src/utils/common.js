export const formatTime = (date) => {
  return window.moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return window.moment(date).format(`DD MMMM`);
};
