export const removeLastOccurrence = function (string, removeFrom, removeTo) {
  const lastIndex = string.lastIndexOf(removeFrom);
  let newString = string.substring(lastIndex);
  newString = newString.replace(removeTo, "%^%");
  newString = newString.split("%^%")[1];
  return string.substring(0, lastIndex) + newString;
};
