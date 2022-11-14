export const replaceAll = function (string, replace, replaceWith) {
  return string.replace(new RegExp(replace, "g"), replaceWith);
};

export const replaceLastOccurrence = function (string, replace, replaceWith) {
  return string.replace(new RegExp(replace, "g"), replaceWith);
};
