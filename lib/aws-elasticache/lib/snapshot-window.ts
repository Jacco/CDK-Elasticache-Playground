
/**
 * Properties required for setting up a weekly maintenance time
 */
export interface SnapshotWindowProps {
  /**
   * The hour of the day (from 0-24) for maintenance to be started.
   * 
   * @default 3
   */
  readonly startHour?: number;
  /**
   * The minute of the hour (from 0-59) for maintenance to be started.
   * 
   * @default 0
   */
  readonly startMinute?: number;
  /**
   * Length of the maintenance window in minutes
   * 
   * @default 120
   */
  readonly durationMinutes?: number;
}

/**
 * Class for scheduling a weekly manitenance time.
 */
export class SnapshotWindow {
  /**
   * The hour of the day (from 00-24) for maintenance to be started.
   */
  private readonly startHour: string;
  /**
   * The minute of the hour (from 00-59) for maintenance to be started.
   */
  private readonly startMinute: string;
  /**
   * The hour of the day (from 00-24) for maintenance to be ended.
   */
  private readonly endHour: string;
  /**
   * The minute of the hour (from 00-59) for maintenance to be ended.
   */
  private readonly endMinute: string;
  /**
   * The duration of the snapshot window.
   */
  private readonly durationMinutes: number;

  constructor(props: SnapshotWindowProps) {
    this.validate(props.startHour, props.startMinute, props.durationMinutes);
 
    let startMinute: number = props.startMinute ?? 0;
    let startHour: number = props.startHour ?? 3;
    this.durationMinutes = props.durationMinutes ?? 120;
    // calculate the end timestamp based on the start and duration
    let endMinute: number = startMinute + this.durationMinutes % 60
    let endHour: number = startHour + Math.floor(this.durationMinutes / 60);
    if (endMinute > 59) {
        endMinute -= 59;
        endHour += 1;
    }
    if (endHour > 24) {
        endHour -= 24;
    }
    // store the private values as strings
    this.startHour = this.getTwoDigitString(startHour);
    this.startMinute = this.getTwoDigitString(startMinute);
    this.endHour = this.getTwoDigitString(endHour);
    this.endMinute = this.getTwoDigitString(endMinute);    
  }

  /**
   * Converts a day, hour, and minute into a timestamp as used by FSx for Lustre's weeklyMaintenanceStartTime field.
   */
  public toString(): string {
    // format like sun:23:00-mon:01:30
    return `${this.startHour}:${this.startMinute}-${this.endHour}:${this.endMinute}`;
  }

  /**
   * Pad an integer so that it always contains at least 2 digits. Assumes the number is a positive integer.
   */
  private getTwoDigitString(n: number): string {
    const numberString = n.toString();
    if (numberString.length === 1) {
      return `0${n}`;
    }
    return numberString;
  }

  /**
   * Validation needed for the values of the maintenance time.
   */
  private validate(hour?: number, minute?: number, duration?: number) {
    if (duration && (!Number.isInteger(duration) || duration < 60 || duration > 10080)) {
        throw new Error('Maintenance window duration must be an integer between 60 and 10080');
    }
    if (hour && (!Number.isInteger(hour) || hour < 0 || hour > 24)) {
      throw new Error('Maintenance window starting hour must be an integer between 0 and 24');
    }
    if (minute && (!Number.isInteger(minute) || minute < 0 || minute > 59)) {
      throw new Error('Maintenance window starting minute must be an integer between 0 and 59');
    }
  }
}