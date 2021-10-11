export const getPagesArray = (pagesCount) => {
  const tmp = [];
  for (let i = 1; i <= pagesCount; ++i) {
    tmp.push(i);
  }
  return tmp;
};
