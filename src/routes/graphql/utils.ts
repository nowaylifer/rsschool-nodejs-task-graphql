export const groupBy = <T>(arr: T[], fn: (item: T) => string) =>
  arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});

export const keyBy = <T>(arr: T[], fn: (item: T) => string) =>
  Object.fromEntries(arr.map((item) => [fn(item), item]));
