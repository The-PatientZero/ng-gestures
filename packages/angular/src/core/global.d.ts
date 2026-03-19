// This file is an ambient module declaration
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
    }
  }
}

export {};
