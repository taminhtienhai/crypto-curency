export class StringUtils {

  constructor() {}

  public static castJsonObject(input: object) {
    return JSON.stringify(input);
  }

  public static castBufferToString(input: Buffer, encode: string = 'hex'): string {
    return input.toString(encode);
  }
}
