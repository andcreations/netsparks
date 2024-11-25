import * as path from 'path';

/** */
export class Dirs {
  /** */
  private static readonly rootDir = path.join(__dirname, '../../');

  /** */
  static src(...paths: string[]): string {
    return path.join(Dirs.rootDir, 'src', ...paths);
  }

  /** */
  static srcStyles(...paths: string[]): string {
    return this.src('styles', ...paths);
  }

  /** */
  static srcComponentsStyles(...paths: string[]): string {
    return path.join(
      this.rootDir,
      'node_modules/@saltajs/web-components/src/styles',
      ...paths,
    );
  }

  /** */
  static srcThemes(...paths: string[]): string {
    return path.join(
      this.rootDir,
      'node_modules/@saltajs/web-components/src/themes',
      ...paths,
    );
  }

  /** */
  static srcInlineImages(...paths: string[]): string {
    return this.src('inline-images', ...paths);
  }
 
  /** */
  static srcAssets(...paths: string[]): string {
    return path.join(Dirs.rootDir, 'src', 'assets', ...paths);
  }

  /** */
  static srcApp(...paths: string[]): string {
    return this.src('app', ...paths);
  }

  /** */
  static srcComponents(...paths: string[]): string {
    return path.join(
      this.rootDir,
      'node_modules/@saltajs/web-components/build/dist',
      ...paths,
    );
  }

  /** */
  static build(...paths: string[]): string {
    return path.join(Dirs.rootDir, 'build', ...paths);
  }

  /** */
  static buildApp(...paths: string[]): string {
    return Dirs.build('app', ...paths);
  }
}
