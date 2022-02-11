export const measurePerformanceInMs: any = async (fn, actionTaken) => {
  const start = Date.now();
  await fn;
  const duration = Date.now() - start;
  console.log(`-------> Time taken for ${actionTaken} to complete: ${duration}ms`);
  return { actionTaken, duration };
};
