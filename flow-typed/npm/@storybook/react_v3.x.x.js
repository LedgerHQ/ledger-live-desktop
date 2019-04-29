// flow-typed signature: 1aeadf523ef2d96985697463dd71c89d
// flow-typed version: 35108faf5b/@storybook/react_v3.x.x/flow_>=v0.72.x

type NodeModule = typeof module;

declare module '@storybook/react' {
  declare type Context = { kind: string, story: string };
  declare type Renderable = React$Element<*>;
  declare type RenderCallback = (
    context: Context
  ) => Renderable | Array<Renderable>;
  declare type RenderFunction = () => Renderable | Array<Renderable>;

  declare type StoryDecorator = (
    story: RenderFunction,
    context: Context
  ) => Renderable | null;

  declare interface Story {
    +kind: string;
    add(storyName: string, callback: RenderCallback): Story;
    addDecorator(decorator: StoryDecorator): Story;
  }

  declare interface StoryObject {
    name: string;
    render: RenderFunction;
  }

  declare interface StoryBucket {
    kind: string;
    filename: string;
    stories: Array<StoryObject>;
  }

  declare function addDecorator(decorator: StoryDecorator): void;
  declare function configure(fn: () => void, module: NodeModule): void;
  declare function setAddon(addon: Object): void;
  declare function storiesOf(name: string, module: NodeModule): Story;
  declare function storiesOf<T>(name: string, module: NodeModule): Story & T;
  declare function forceReRender(): void;

  declare function getStorybook(): Array<StoryBucket>;
}
