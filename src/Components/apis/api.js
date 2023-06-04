const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const stdDeviation = numbers => {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiff = numbers.map(num => (num - mean) * (num - mean));
  const variance =
    squaredDiff.reduce((sum, sqDiff) => sum + sqDiff, 0) / numbers.length;
  return Math.sqrt(variance);
};

const findSmallest = (objs, coords) => {
  let list = [];

  for (const obj of objs) {
    const arr = [];
    for (const coord of coords) {
      arr.push(getDistance(obj, coord));
    }
    list.push(stdDeviation(arr));
  }

  let smallestValue = list[0];
  let smallestIndex = 0;

  for (let i = 1; i < list.length; i++) {
    if (list[i] < smallestValue) {
      smallestValue = list[i];
      smallestIndex = i;
    }
  }

  return smallestIndex;
};

export const equidistantPoint = coords => {
  if (coords.length < 2) {
    throw new Error('최소 두 지점을 출발지로 설정해주세요');
  }
  let sumX = 0;
  let sumY = 0;
  let n = coords.length;

  for (let i = 0; i < n; i++) {
    sumX += coords[i].x;
    sumY += coords[i].y;
  }

  let centroidX = sumX / n;
  let centroidY = sumY / n;

  // ↑ 무게중심 구하기
  //--------------
  // ↓ 페르마 점 구하기

  let currentX = 0;
  let currentY = 0;

  for (let iteration = 0; iteration < 1000; iteration++) {
    let newX = 0;
    let newY = 0;
    let totalWeight = 0;

    for (const coord of coords) {
      const distance = getDistance({ x: currentX, y: currentY }, coord);
      const weight = 1 / distance;
      newX += coord.x * weight;
      newY += coord.y * weight;
      totalWeight += weight;
    }

    newX /= totalWeight;
    newY /= totalWeight;

    const diffX = Math.abs(newX - currentX);
    const diffY = Math.abs(newY - currentY);

    if (diffX < 0.00001 && diffY < 0.00001) {
      console.log(iteration);
      break;
    }

    currentX = newX;
    currentY = newY;
  }

  //------- 세 결과 중 출발지로부터 편차가 가장 작은 지점 선택

  const centObj = { x: centroidX, y: centroidY };

  const currObj = { x: currentX, y: currentY };

  const thirdObj = {
    x: (centroidX + currentX) / 2,
    y: (centroidY + currentY) / 2,
  };

  const nom = [centObj, currObj, thirdObj];

  return nom[findSmallest(nom, coords)];
};
