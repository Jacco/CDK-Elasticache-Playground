/**
 * The name of the cache engine to be used for this cluster.
 */
enum CacheClusterEngineType {
  /**
   * Memcached, a simple in-memory key-value store that can run on large nodes. Supports dynamically 
   * adding or removing nodes. Can also cache objects.
   */
  MEMCACHED  = 'memcached',

  /**
   * Redis, a more sophisticated in-memory key-value store with support for data tiering to SSD (using the r6gd node type),
   * encryption at-rest and in-transit, dynamically adding or removing shards, backup and restore capabilities,
   * pub/sub support, online resharding, geospatial indexing, automatic failover, replication and more.
   */
  REDIS = 'redis',
}

/**
 * Memcached version
 */
export class MemcachedVersion {
  /**
   * Memcached version 1.4.5
   */
  public static readonly V1_4_5 = MemcachedVersion.of('1.4.5');

  /**
   * Memcached version 1.4.14
   */
  public static readonly V1_4_14 = MemcachedVersion.of('1.4.14');

  /**
   * Memcached version 1.4.24
   */
  public static readonly V1_4_24 = MemcachedVersion.of('1.4.24');

  /**
   * Memcached version 1.4.33
   */
  public static readonly V1_4_33 = MemcachedVersion.of('1.4.33');

  /**
   * Memcached version 1.4.34
   */
  public static readonly V1_4_34 = MemcachedVersion.of('1.4.34');

  /**
   * Memcached version 1.5.10
   */
  public static readonly V1_5_10 = MemcachedVersion.of('1.5.10');

  /**
   * Memcached version 1.5.16
   */
  public static readonly V1_5_16 = MemcachedVersion.of('1.5.16');

  /**
   * Memcached version 1.6.6
   */
  public static readonly V1_6_6 = MemcachedVersion.of('1.6.6');

  /**
   * Memcached version 1.6.12
   */
  public static readonly V1_6_12 = MemcachedVersion.of('1.6.12');

  /**
   * Custom Memcached version
   * @param version custom version number
   */
  public static of(version: string) {
    return new MemcachedVersion(version);
  }

  public readonly engineType: string = CacheClusterEngineType.MEMCACHED;

  /**
   *
   * @param version Memcached version number
   */
  private constructor(public readonly version: string) {}
}

/**
 * Redis version
 */
export class RedisVersion {
  /**
   * Redis version 2.6.13
   */
  public static readonly V2_6_13 = RedisVersion.of(2,6,13);

  /**
   * Redis version 2.8.6
   */
  public static readonly V2_8_6 = RedisVersion.of(2,8,6);

  /**
   * Redis version 2.8.19
   */
  public static readonly V2_8_19 = RedisVersion.of(2,8,19);

/*
  /**
   * Redis version 2.8.21
   */
  public static readonly V2_8_21 = RedisVersion.of(2,8,21);
  
  /**
   * Redis version 2.8.22
   */
  public static readonly V2_8_22 = RedisVersion.of(2,8,22);
  
  /**
   * Redis version 2.8.23
   */
  public static readonly V2_8_23 = RedisVersion.of(2,8,23);
  
  /**
   * Redis version 2.8.24
   */
  public static readonly V2_8_24 = RedisVersion.of(2,8,24);
  
  /**
   * Redis version 3.2.4
   */
  public static readonly  V3_2_4 = RedisVersion.of(3,2,4);
  
  /**
   * Redis version 3.2.6
   */
  public static readonly  V3_2_6 = RedisVersion.of(3,2,6);
  
  /**
   * Redis version 3.2.10
   */
  public static readonly V3_2_10 = RedisVersion.of(3,2,10);
  
  /**
   * Redis version 4.0.10
   */
  public static readonly V4_0_10 = RedisVersion.of(4,0,10);
  
  /**
   * Redis version 5.0.0
   */
  public static readonly  V5_0_0 = RedisVersion.of(5,0,0);
  
  /**
   * Redis version 5.0.3
   */
  public static readonly  V5_0_3 = RedisVersion.of(5,0,3);
  
  /**
   * Redis version 5.0.4
   */
  public static readonly  V5_0_4 = RedisVersion.of(5,0,4);
  
  /**
   * Redis version 5.0.5
   */
  public static readonly  V5_0_5 = RedisVersion.of(5,0,5);
  
  /**
   * Redis version 5.0.6
   */
  public static readonly  V5_0_6 = RedisVersion.of(5,0,6);
  
  /**
   * Redis version 6.0
   */
  public static readonly V6_0 = RedisVersion.of(6,0);
  
  /**
   * Redis version 6.2
   */
  public static readonly V6_2 = RedisVersion.of(6,2);

  /**
   * Custom Redis version
   * @param major major version number
   * @param minor minor version number
   * @param patch optional patch version number
   */
  public static of(major: number, minor: number, patch?: number) {
    return new RedisVersion(major, minor, patch);
  }

  public readonly engineType: string = CacheClusterEngineType.REDIS;

  public get supportsEngineLog(): boolean { return ((this.major == 6) && (this.minor >= 2)) || (this.major > 6); }
  public get supportsSlowLog(): boolean { return (this.major >= 6); }
  public readonly supportsAtRestEncryption: boolean;
  public readonly supportsClusterMode: boolean;
  public readonly supportsAutoMinorVersionUpgrade: boolean;
  public readonly supportsDataTiering: boolean;

  public get version(): string { return this.patch ? `${this.major}.${this.minor}.${this.patch}` : `${this.major}.${this.minor}` }
  /**
   *
   * @param major Redis major version number
   * @param minor Redis minor version number
   * @param patch Redis patch version number
   */
  private constructor(public readonly major: number, public readonly minor: number, public readonly patch?: number) {
    this.supportsAtRestEncryption = ((major == 3) && (minor == 2) && (patch == 6) || (major >= 4));
    this.supportsClusterMode = (major >= 3);
    this.supportsAutoMinorVersionUpgrade = (major >= 6);
    this.supportsDataTiering = ((major == 6) && minor >= 2) || (major > 6);
  }

  public isNewerOrSame(version: RedisVersion): boolean {
    return (this.major > version.major) 
      || (this.major == version.major && this.minor > version.minor) 
      || (this.major == version.major && this.minor == version.minor && (this.patch ?? 0) >= (version.patch ?? 0))
  }

  public defaultCacheParameterGroupName(clusterMode?: boolean): string {
    let result = "2.6";
    if (this.isNewerOrSame(RedisVersion.V2_8_19)) {
      result = "2.8"
    } else if (this.isNewerOrSame(RedisVersion.V3_2_10)) {
      result = "3.2"
    } else if (this.isNewerOrSame(RedisVersion.V4_0_10)) {
      result = "4.0"
    } else if (this.isNewerOrSame(RedisVersion.V6_0)) {
      result = "6.x"
    }
    return (clusterMode ?? false) && this.supportsClusterMode ? `default.redis.${result}` : `default.redis.${result}.cluster.on`;
  }
}
