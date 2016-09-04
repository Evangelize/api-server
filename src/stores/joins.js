export function eqJoin(leftData, joinData, leftJoinKey, rightJoinKey, mapFun) {
  const leftKeyisFunction = (typeof leftJoinKey) === 'function';
  const rightKeyisFunction = (typeof rightJoinKey) === 'function';
  let leftDataLength = 0;
  let rightData = [];
  let rightDataLength;
  let key;
  let result = [];
  let joinMap = {};
  mapFun = eval(mapFun);

  // get the left data
  leftData = this.data();
  leftDataLength = leftData.length;

  // get the right data
  if (joinData instanceof Resultset) {
    rightData = joinData.data();
  } else if (Array.isArray(joinData)) {
    rightData = joinData;
  } else {
    throw new TypeError('joinData needs to be an array or result set');
  }
  rightDataLength = rightData.length;

  // construct a lookup table

  for (var i = 0; i < rightDataLength; i++) {
    key = rightKeyisFunction ? rightJoinKey(rightData[i]) : rightData[i][rightJoinKey];
    joinMap[key] = rightData[i];
  }

  if (!mapFun) {
    mapFun = function (left, right) {
      return {
        left: left,
        right: right,
      };
    };
  }

  // Run map function over each object in the resultset
  for (let j = 0; j < leftDataLength; j++) {
    key = leftKeyisFunction ? leftJoinKey(leftData[j]) : leftData[j][leftJoinKey];
    result.push(mapFun(leftData[j], joinMap[key] || {}));
  }

  return result;
}
