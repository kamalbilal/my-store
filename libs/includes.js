export const includesInArray = function (array, word) {
  let contain = false;
  array.forEach((element) => {
    // console.log({ element, word });
    if (word.toLowerCase().includes(element)) {
      contain = true;
    }
  });
  return contain;
};
