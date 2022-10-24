import { ZuiTimeLike } from '../../types/time-like';
import { ZuiTimeMode } from '../../types/time-mode';
import { zuiPadStart } from '../../util/format/pad-start';
import { zuiInRange } from '../../util/math/in-range';

import {
  ZUI_HOURS_IN_DAY,
  ZUI_MILLISECONDS_IN_DAY,
  ZUI_MILLISECONDS_IN_HOUR,
  ZUI_MILLISECONDS_IN_MINUTE,
  ZUI_MINUTES_IN_HOUR,
  ZUI_SECONDS_IN_MINUTE,
} from './date-time';

/**
 * Immutable time object with hours, minutes, seconds and ms
 */
export class ZuiTime implements ZuiTimeLike {
    constructor(
        readonly hours: number,
        readonly minutes: number,
        readonly seconds: number = 0,
        readonly ms: number = 0,
    ) {
        console.assert(
            ZuiTime.isValidTime(hours, minutes, seconds, ms),
            `Time must be real, but got:`,
            hours,
            minutes,
            seconds,
            ms,
        );
    }

    /**
     * Checks if time is valid
     */
    public static isValidTime(
        hours: number,
        minutes: number,
        seconds: number = 0,
        ms: number = 0,
    ): boolean {
        return (
            Number.isInteger(hours) &&
            zuiInRange(hours, 0, ZUI_HOURS_IN_DAY) &&
            Number.isInteger(minutes) &&
            zuiInRange(minutes, 0, ZUI_MINUTES_IN_HOUR) &&
            Number.isInteger(seconds) &&
            zuiInRange(seconds, 0, ZUI_SECONDS_IN_MINUTE) &&
            Number.isInteger(ms) &&
            zuiInRange(ms, 0, 1000)
        );
    }

    /**
     * Current UTC time.
     */
    public static current(): ZuiTime {
        return ZuiTime.fromAbsoluteMilliseconds(Date.now() % ZUI_MILLISECONDS_IN_DAY);
    }

    /**
     * Current time in local timezone
     */
    public static currentLocal(): ZuiTime {
        const date = new Date();

        return ZuiTime.fromAbsoluteMilliseconds(
            (Date.now() - date.getTimezoneOffset() * ZUI_MILLISECONDS_IN_MINUTE) %
                ZUI_MILLISECONDS_IN_DAY,
        );
    }

    /**
     * Calculates ZuiTime from milliseconds
     */
    public static fromAbsoluteMilliseconds(milliseconds: number): ZuiTime {
        console.assert(Number.isInteger(milliseconds));
        console.assert(
            zuiInRange(milliseconds, 0, ZUI_MILLISECONDS_IN_DAY),
            `Milliseconds must be below ${ZUI_MILLISECONDS_IN_DAY} (milliseconds in a day).`,
        );

        const hours = Math.floor(milliseconds / ZUI_MILLISECONDS_IN_HOUR);
        const minutes = Math.floor(
            (milliseconds % ZUI_MILLISECONDS_IN_HOUR) / ZUI_MILLISECONDS_IN_MINUTE,
        );
        const seconds =
            Math.floor(
                ((milliseconds % ZUI_MILLISECONDS_IN_HOUR) % ZUI_MILLISECONDS_IN_MINUTE) / 1000,
            ) || 0;
        const ms =
            Math.floor(
                ((milliseconds % ZUI_MILLISECONDS_IN_HOUR) % ZUI_MILLISECONDS_IN_MINUTE) % 1000,
            ) || 0;

        return new ZuiTime(hours, minutes, seconds, ms);
    }

    /**
     * Parses string into ZuiTime object
     */
    public static fromString(time: string): ZuiTime {
        const hours = Number(time.slice(0, 2));
        const minutes = Number(time.slice(3, 5));
        const seconds = Number(time.slice(6, 8)) || 0;
        const ms = Number(time.slice(9, 12)) || 0;

        return new ZuiTime(hours, minutes, seconds, ms);
    }

    /**
     * Converts Date object into ZuiTime
     * @param date
     */
    public static fromLocalNativeDate(date: Date): ZuiTime {
        return new ZuiTime(
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        );
    }

    /**
     * Shifts time by hours and minutes
     */
    public shift({hours = 0, minutes = 0, seconds = 0, ms = 0}: ZuiTimeLike): ZuiTime {
        const newMs = (1000 + this.ms + (ms % 1000)) % 1000;

        const secondsInMs = ms < 0 ? Math.ceil(ms / 1000) : Math.floor(ms / 1000);
        const secondsToAdd = secondsInMs + seconds;
        const newSeconds = (60 + this.seconds + (secondsToAdd % 60)) % 60;

        const minutesInSeconds =
            secondsToAdd < 0
                ? Math.ceil(secondsToAdd / 60)
                : Math.floor(secondsToAdd / 60);
        const minutesToAdd = minutesInSeconds + minutes;
        const newMinutes = (60 + this.minutes + (minutesToAdd % 60)) % 60;

        const hoursInMinutes =
            minutesToAdd < 0
                ? Math.ceil(minutesToAdd / 60)
                : Math.floor(minutesToAdd / 60);
        const hoursToAdd = hoursInMinutes + hours;
        const newHours = (24 + this.hours + (hoursToAdd % 24)) % 24;

        return new ZuiTime(newHours, newMinutes, newSeconds, newMs);
    }

    /**
     * Converts ZuiTime to string
     */
    public toString(mode?: ZuiTimeMode): string {
        const needAddMs = mode === `HH:MM:SS.MSS` || (!mode && this.ms > 0);
        const needAddSeconds =
            needAddMs || mode === `HH:MM:SS` || (!mode && this.seconds > 0);

        return (
            `${this.formatTime(this.hours)}:${this.formatTime(this.minutes)}` +
            `${needAddSeconds ? `:${this.formatTime(this.seconds)}` : ``}` +
            `${needAddMs ? `.${this.formatTime(this.ms, 3)}` : ``}`
        );
    }

    public valueOf(): number {
        return this.toAbsoluteMilliseconds();
    }

    /**
     * Returns the primitive value of the given Date object.
     * Depending on the argument, the method can return either a string or a number.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/@@toPrimitive
     */
    public [Symbol.toPrimitive](hint: string): string | number {
        return Date.prototype[Symbol.toPrimitive].call(this, hint);
    }

    /**
     * Converts ZuiTime to milliseconds
     */
    public toAbsoluteMilliseconds(): number {
        return (
            this.hours * ZUI_MILLISECONDS_IN_HOUR +
            this.minutes * ZUI_MILLISECONDS_IN_MINUTE +
            this.seconds * 1000 +
            this.ms
        );
    }

    private formatTime(time: number, digits: number = 2): string {
        return zuiPadStart(String(time), digits, `0`);
    }

    public isSameTime(time: ZuiTime): boolean {
      return this.ms === time.ms &&
        this.seconds === time.seconds &&
        this.hours === time.hours &&
        this.minutes === time.minutes
    }
}
