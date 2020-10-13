export interface obj<T=any>{
  [any : string]: T
}

declare module '*.scss' {
  const style: {[className: string]: string};
  export default style;
}

declare module "*.svg" {
  const content: any;
  export default content;
}
