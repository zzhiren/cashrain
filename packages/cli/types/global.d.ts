declare module '*.json' {
  const value: any;
  export default value;
}

declare type Pkg = {
  name: string
  version: string
  description: string
  author: string
  bin: {
    [propName: string]: string
  }
};
