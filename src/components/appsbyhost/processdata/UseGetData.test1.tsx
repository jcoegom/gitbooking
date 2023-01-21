import { renderHook, act } from "@testing-library/react-hooks";
import useGetData from "./UseGetData";

jest.mock("axios");

describe("useGetData", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return the correct state values when the hook is first rendered", () => {
    const { result } = renderHook(() => useGetData("/data"));
    expect(result.current[0]).toBe(true);
    expect(result.current[1]).toBe(null);
    expect(result.current[2]).toBe(null);
  });

  /*  it("should return the correct state values when the request is successful", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: { hostname: "localhost", appNameApdexs: [] } },
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetData("/data"));

    await waitForNextUpdate();

    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBe(null);
    expect(result.current[2]).toEqual({
      data: { hostname: "localhost", appNameApdexs: [] },
    });
  });

  it("should return the correct state values when the request is unsuccessful", async () => {
    const error = new Error("error");
    (axios.get as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useGetData("/data"));

    await waitForNextUpdate();

    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBe(error);
    expect(result.current[2]).toBe(null);
  }); */
});
