const fecthList = [
  "http://getList1",
  "http://getList2",
  "http://getList3",
  "http://getList4",
  "http://getList5",
  "http://getList6",
  "http://getList7",
  "http://getList8",
  "http://getList9",
  "http://getList10",
];

const customFetch = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`数据为 ${url?.split("//")?.[1]}`);
    }, 1000);
  });
};

function multiRequest(fecthList, fecthCount) {
  const len = fecthList.length;
  const result = new Array(len).fill(false);
  let index = 0;
  return new Promise((resolve, reject) => {
    while (index < fecthCount) {
      next();
    }
    function next() {
      const curIndex = index++;
      // 当前所以大于请求列表，且 result 的值不为空，返回请求回来的的所有值列表
      if (curIndex > len) {
        !result.includes(false) && resolve(result);
        return;
      }
      //  取出当前请求
      const fetchUrl = fecthList[curIndex];
      customFetch(fetchUrl).then((res) => {
        // 请求获取的接口，并拿到数据存入result
        result[curIndex] = res;
        // 成功完成后，将新的接口推入 继续请求
        next();
      });
    }
  });
}

multiRequest(fecthList, 3).then(resultList =>  console.log('请求集合列表————————>',resultList));
/*
请求集合列表————————> [
  '数据为 getList1',   
  '数据为 getList2',   
  '数据为 getList3',   
  '数据为 getList4',   
  '数据为 getList5',   
  '数据为 getList6',   
  '数据为 getList7',   
  '数据为 getList8',   
  '数据为 getList9',   
  '数据为 getList10'   
]
*/