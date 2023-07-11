/**
 * 1. 使用递归实现
 */
function flattenRecursion(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenRecursion(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

/**
 * 2. 使用reduce实现
 */
function flattenReduce(arr) {
  return arr.reduce((result,current) => {
    if(Array.isArray(current)) {
      return result.concat(flattenReduce(current))
    } else {
      return result.concat(current)
    }
  }, [])
}

/**
 * 3. 使用扩展运算符
 */

function flattenSpread(arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}