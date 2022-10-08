import { RedisVersion } from "../lib/enigine";

describe('engine', () => {
  test('check redis slowLog and engineLog support', () => {
    // WHEN
    const v1 = RedisVersion.V2_6_13;
    const v2 = RedisVersion.V6_0;
    const v3 = RedisVersion.V6_2;
    // THEN
    expect(v1.supportsEngineLog).toEqual(false);
    expect(v1.supportsSlowLog).toEqual(false);
    expect(v2.supportsSlowLog).toEqual(true);
    expect(v2.supportsEngineLog).toEqual(false);
    expect(v3.supportsSlowLog).toEqual(true);
    expect(v3.supportsEngineLog).toEqual(true);
  });

  test('check custom redis version', () => {
    // WHEN
    const v1 = RedisVersion.of(8,8,8);
    const v2 = RedisVersion.of(8,8);
    // THEN
    expect(v1.version).toEqual('8.8.8');
    expect(v2.version).toEqual('8.8');
  });
});