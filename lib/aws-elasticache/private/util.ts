/**
 * The default set of characters we exclude from generated passwords for database users.
 * It's a combination of characters that have a tendency to cause problems in shell scripts,
 * some engine-specific characters (for example, Oracle doesn't like '@' in its passwords),
 * and some that trip up other services, like DMS.
 *
 * This constant is private to the RDS module.
 */
 export const DEFAULT_PASSWORD_EXCLUDE_CHARS = " %+~`#$&*()|[]{}:;<>?!'/@\"\\";
