/** */
export class Log {
  /** */
  static d(msg: string): void {
    console.log(`DBUG ${msg}`);
  }

  /** */
  static i(msg: string): void {
    console.log(`INFO ${msg}`);
  }

  /** */
  static e(msg: string, error?: any): void {
    let errorMsg = error ? 'Unknown error' : '';
    if (error instanceof Error) {
      errorMsg = '\n' + error.stack;
    }
    console.log(`EROR ${msg}${errorMsg}`);
  }
}