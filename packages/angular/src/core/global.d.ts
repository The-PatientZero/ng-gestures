// Ambient declarations shared across the library's Node/Jest environment.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
    }
  }
}

export {};
