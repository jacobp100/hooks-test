/**
 * @jest-environment node
 */

import { mount, update, unmount } from "react";
import useGlobalKeyboardShortcut from "../useGlobalKeyboardShortcut";

jest.mock("react", () => require("../../__fixtures__/react"));

const document = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};
global.document = document;

it("Should attach event and remove listeners to dom", () => {
  jest.resetAllMocks();
  const callback = jest.fn();

  const context = mount(useGlobalKeyboardShortcut, ["Enter", callback]);

  expect(document.addEventListener).toBeCalledTimes(1);
  expect(document.removeEventListener).not.toBeCalled();

  unmount(context);

  expect(document.removeEventListener).toBeCalledTimes(1);
});

it("Should attach at most one event and remove accordingly", () => {
  jest.resetAllMocks();
  const callback1 = jest.fn();
  const callback2 = jest.fn();

  const context1 = mount(useGlobalKeyboardShortcut, ["Enter", callback1]);
  const context2 = mount(useGlobalKeyboardShortcut, ["Escr", callback2]);

  expect(document.addEventListener).toBeCalledTimes(1);
  expect(document.removeEventListener).not.toBeCalled();

  unmount(context1);

  expect(document.removeEventListener).not.toBeCalled();

  unmount(context2);

  expect(document.removeEventListener).toBeCalledTimes(1);
});

it("Should not add or remove event listeners when updating", () => {
  jest.resetAllMocks();
  const callback = jest.fn();

  const context = mount(useGlobalKeyboardShortcut, ["Enter", callback]);

  expect(document.addEventListener).toBeCalledTimes(1);
  expect(document.removeEventListener).not.toBeCalled();

  update(context, ["Esc", callback]);

  expect(document.addEventListener).toBeCalledTimes(1);
  expect(document.removeEventListener).not.toBeCalled();

  unmount(context);
});
