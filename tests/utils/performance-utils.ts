export const measurePerformanceInMs: any = async (fn, methodString) => {
  const start = Date.now();
  await fn;
  const duration = Date.now() - start;
  console.log(`-------> Time taken for ${methodString} to complete: ${duration}ms`);
};
