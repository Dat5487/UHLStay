// Minimal compatibility shims for Recharts' redux type usage
declare module 'redux' {
  // Redux v4 exported these; Recharts' d.ts still references them
  export type EmptyObject = Record<string, never>;
  export type CombinedState<S> = S;
}


