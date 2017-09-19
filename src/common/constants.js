// alias for scarlett constants:
export const CONSTANTS = {
  WEBGL: "webgl",
  EXECUTION_PHASES: {
    WAITING: 0,
    UPDATE: 10,
    SCENE_UPDATE: 11,
    LATE_UPDATE: 12,
    RENDER: 13,
    SCENE_RENDER: 14,
    LATE_RENDER: 15
  },
  CONTENT_EXTENSIONS: {
    ATLAS: ".atl"
  },
  EVENTS: {
    // general:
    CONTENT_ASSET_LOADED: "editor_updatePropertyEditorView",

    // input:
    INPUT: {
      GAMEPAD_CONNECTED: "input_gamepadConnected",
      GAMEPAD_DISCONNECTED: "input_gamepadDisconnected"
    }
  }
};

// function "quickies" holder
//let sc = {};
