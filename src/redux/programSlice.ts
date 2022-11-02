import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrainfuckRunner, BrainfuckRunnerOptions, BrainfuckRunnerState } from "../lib/BrainfuckRunner";
// import { setAutoFreeze } from 'immer';
// setAutoFreeze(false);

export type ProgramInitializePayload = {
  code: string,
  options: Partial<BrainfuckRunnerOptions>
}

const INITIAL_STATE: BrainfuckRunnerState = {
  status: "uninitialized",
  program: '',
  symbols: [],
  pc: 0,
  currentSymbol: '',
  steps: 0,
  memory: [ 0 ],
  memoryHead: 0,
  loopStack: [],
  inputBuffer: '',
  outputBuffer: '',
  options: {
    eolChar: null,
    maxSteps: 10000,
    loopStackLimit: 100,
    maxMemory: Infinity,
    memoryWraps: false,
    input: "",
  },
};

// function assignState(target: BrainfuckRunnerState, source: BrainfuckRunnerState) {
//   target.status = source.status;
//   target.program = source.program;
//   target.pc = source.pc;
//   target.currentSymbol = source.currentSymbol;
//   target.steps = source.steps;
//   target.memory = source.memory;
//   target.memoryHead = source.memoryHead;
//   target.loopStack = source.loopStack;
//   target.inputBuffer = source.inputBuffer;
//   target.outputBuffer = source.outputBuffer;
//   target.options = source.options;
// }

let runner: BrainfuckRunner

const programSlice = createSlice({
  name: "program",
  initialState: INITIAL_STATE,
  reducers: {
    initialize: (state, action: PayloadAction<ProgramInitializePayload>) => {
      const { code, options } = action.payload
      runner = new BrainfuckRunner(code, options)
      Object.assign(state, runner.getCurrentState());
    },
    step: (state) => {
      runner.step();
      Object.assign(state, runner.getCurrentState());
    }
  },
});

export const { initialize, step } = programSlice.actions;
export default programSlice.reducer;