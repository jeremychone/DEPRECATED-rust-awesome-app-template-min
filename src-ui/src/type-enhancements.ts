// NOTE - Some TypeScript type enhancements. 
//        Does not have to be imported anywhere, TypeScript will pick it up.

export { }; // to make it a module

declare global {
  // cloning a DocumentFragment returns a DocumentFragment
  interface DocumentFragment {
    cloneNode(deep?: boolean): DocumentFragment;
  }
}
