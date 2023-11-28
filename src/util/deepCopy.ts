export const deepCopy = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item)) as T;
  }
  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepCopy(obj[key]);
    }
  }
  return clonedObj;
};
