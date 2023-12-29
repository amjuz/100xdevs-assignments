let p = Promise()
function isAnagram(str1, str2) {

  let sortedArray1 = str1.toLowerCase().split('').sort();
  let sortedArray2 = str2.toLowerCase().split('').sort();
  let temp = true;

  if (sortedArray1.length === sortedArray2.length) {

    for (let i = 0; i < sortedArray1.length; i++) {

      if (sortedArray1[i] !== sortedArray2[i]) {
        temp = false;
        break;

      }

    }

  } else {
    temp = false;
  }
  return temp;
}
module.exports = isAnagram;
