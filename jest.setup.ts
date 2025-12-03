import "@testing-library/jest-dom";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || (() => false);
Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || (() => undefined);
Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || (() => undefined);
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => undefined);
