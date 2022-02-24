import { addDays, format, isAfter, isBefore, subDays } from 'date-fns';

export class Clock {
  static now(): Date {
    return new Date();
  }

  static format(date: Date | number, formatStr: string) {
    return format(date, formatStr);
  }

  static addDays(date: Date | number, amount: number) {
    return addDays(date, amount);
  }

  static subtractDays(date: Date | number, amount: number) {
    return subDays(date, amount);
  }

  static isAfter(date: Date | number, dateToCompare: Date | number) {
    return isAfter(date, dateToCompare);
  }

  static isAfterNow(dateToCompare: Date | number) {
    return isAfter(dateToCompare, this.now());
  }

  static isBefore(date: Date | number, dateToCompare: Date | number) {
    return isBefore(date, dateToCompare);
  }
}
