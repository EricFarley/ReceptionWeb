const getFormatedDay = (day: number): string => {
  if (day >= 10) {
    return `${day}`;
  } else {
    return `0${day}`;
  }
}

const getFormatedMonth = (month: number): string => {
  if (month >= 10) {
    return `${month}`;
  } else {
    return `0${month}`;
  }
}

const formatDatetime = (date: Date) => {
  return [
    getFormatedDay(date.getDate()),
    getFormatedMonth(date.getMonth() + 1),
    date.getFullYear()].join('/') + ' ' +
    [getFormatedDay(date.getHours()),
    getFormatedDay(date.getMinutes()),
    getFormatedDay(date.getSeconds())].join(':');
}

export { formatDatetime }