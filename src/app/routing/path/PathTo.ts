/** */
export const PathTo: { [key: string]: Function } = {
  /** */
  dflt: () => {
    return PathTo.dashboard();
  },

  /** */
  dashboard: () => {
    return '/dashboard';
  },
}