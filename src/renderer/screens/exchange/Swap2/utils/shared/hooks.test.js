// // @flow
// import { renderHook } from "@testing-library/react-hooks";
// import { useSwapProviders, initialState } from "./hooks";
// import * as mocks from "@ledgerhq/live-common/lib/exchange/swap/mock";
// import { setEnv } from "@ledgerhq/live-common/lib/env";

// describe("exchange/swap/hooks", () => {
//   const OLD_ENV = process.env;

//   beforeEach(() => {
//     jest.resetModules();
//     jest.clearAllMocks();

//     // LLC internal variable
//     setEnv("MOCK", "true");

//     // All env variables including ones setted by LLM/LLD
//     process.env = { ...OLD_ENV };
//   });

//   afterAll(() => {
//     // Restore old environment
//     process.env = OLD_ENV;
//   });

//   test("fetches providers on mount", async () => {
//     const spy = jest.spyOn(mocks, "mockGetProviders");
//     renderHook(() => useSwapProviders());
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   test("returns initial state on mount", async () => {
//     const { result } = renderHook(() => useSwapProviders());

//     expect(result.current).toEqual(initialState);
//   });

//   test("returns providers", async () => {
//     const spy = jest.spyOn(mocks, "mockGetProviders");
//     const { result, waitForNextUpdate } = renderHook(() => useSwapProviders());

//     await waitForNextUpdate();

//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.error).toBeNull();
//     expect(result.current.providers).toHaveLength(2);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   test("returns filtered providers", async () => {
//     const providers = ["bitfinex", "kraken", "bitstamp", "changelly", "wyre"];
//     const pairs = [
//       { from: "bitcoin", to: "ethereum", tradeMethod: "float" },
//       { from: "bitcoin", to: "ethereum", tradeMethod: "fixed" },
//       { from: "ethereum", to: "bitcoin", tradeMethod: "float" },
//       { from: "ethereum", to: "bitcoin", tradeMethod: "fixed" },
//     ];
//     const mockedProviders = providers.map(provider => ({ provider, pairs }));
//     const disabledProviders = providers.filter(provider => provider !== "wyre");

//     process.env.SWAP_DISABLED_PROVIDERS = disabledProviders.join(",");

//     jest.spyOn(mocks, "mockGetProviders").mockReturnValue(mockedProviders);
//     const { result, waitForNextUpdate } = renderHook(() => useSwapProviders());

//     await waitForNextUpdate();

//     expect(result.current.providers).toHaveLength(
//       mockedProviders.length - disabledProviders.length,
//     );
//     expect(result.current.providers[0].provider).toBe("wyre");
//   });

//   test("returns error", async () => {
//     const mockedError = new Error("mocked error");

//     const spy = jest.spyOn(mocks, "mockGetProviders").mockImplementation(
//       () =>
//         new Promise(() => {
//           throw mockedError;
//         }),
//     );

//     const { result, waitForNextUpdate } = renderHook(() => useSwapProviders());

//     await waitForNextUpdate();

//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.error).toEqual(mockedError);
//     expect(result.current.providers).toBeNull();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });
// });
