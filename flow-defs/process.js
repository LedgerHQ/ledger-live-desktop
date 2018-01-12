declare var process: {
  send(args: any): void,
  on(event: string, args: any): void,
  title: string,
  env: Object,
}
