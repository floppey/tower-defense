export const timeFunction = (name: string, functionToRun: () => void): void => {
  const start = Date.now();
  functionToRun();
  const end = Date.now();
  const duration = end - start;
  if (duration > 5) {
    console.log(`${name} took ${duration}ms`);
  }
};
