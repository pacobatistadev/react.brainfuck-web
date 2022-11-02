import { cloneDeep } from 'lodash';

export type BrainfuckRunnerOptions = {
  eolChar: string | null,
  maxSteps: number,
  loopStackLimit: number,
  maxMemory: number,
  memoryWraps: boolean,
  input: string,
}

export type BrainfuckRunnerState = {
  status: string,
  program: string,
  symbols: string[],
  pc: number,
  currentSymbol: string,
  steps: number,
  memory: number[],
  memoryHead: number,
  loopStack: {pc: number, enabled: boolean}[],
  inputBuffer: string,
  outputBuffer: string,
  options: BrainfuckRunnerOptions
}

export class BrainfuckRunner {

  // Config options
  private maxSteps = 0;
  private loopStackLimit = 0;
  private maxMemory = 0;
  private memoryWraps = false;
  private eolChar: string | null = null;
  private input: string = "";

  private symbols: string[] = [];
  private pc = 0;
  private steps = 0;
  private loopStack: {pc: number, enabled: boolean}[] = [];
  private memory: number[] = [0];
  private head = 0;
  private status = '';

  private inputBuffer: string[] = [];
  private outputBuffer: string[] = [];
  
  constructor(code: string, options: Partial<BrainfuckRunnerOptions> = {}) {

    this.loopStackLimit = options.loopStackLimit || Infinity;
    this.maxSteps = options.maxSteps || code.length * 10000;
    this.maxMemory = options.maxMemory || Infinity;
    this.memoryWraps = options.memoryWraps || false;
    this.eolChar = options.eolChar ?? null;
    this.input = options.input ?? "";
    this.inputBuffer = options.input?.split('') || [];

    this.symbols = code.replace(/[^\>\<\+\-\.\,\[\]$]/g, '').split('');
    this.status = 'ready';
  }

  execEnabled() {
    const currentLoop = this.loopStack[0];
    return ['[', ']'].includes(this.symbols[this.pc]) || (currentLoop?.enabled ?? true);
  }

  getEolCharByte() {
    if (typeof this.eolChar === 'number' || this.eolChar === null) return this.eolChar
    return this.eolChar.charCodeAt(0);
  }

  'op>'() {
    if (!this.memoryWraps && this.head === this.maxMemory - 1) {
      throw new Error('Memory out of bound (upper limit)')
    }

    this.head = (this.head + 1) % this.maxMemory;

    if (isNaN(this.memory[this.head])) {
      this.memory[this.head] = 0;
    }
  }

  'op<'() {
    if (!this.memoryWraps && this.head === 0) {
      throw new Error('Memory out of bounds (lower limit)')
    }

    if (this.maxMemory === Infinity) {
      this.head -= 1;
    } else { 
      this.head = (this.head + this.maxMemory - 1) % this.maxMemory;
    }

    if (isNaN(this.memory[this.head])) {
      this.memory[this.head] = 0;
    }
  }

  'op+'() {
    this.memory[this.head] = (this.memory[this.head] + 1) % 256;
  }

  'op-'() {
    this.memory[this.head] = (this.memory[this.head] + 255) % 256;
  }

  'op['() {
    if (this.loopStackLimit === this.loopStack.length) {
      throw new Error('Max loop stack exceded')
    }

    const loopStackEntry = {
      pc: this.pc,
      enabled: !!this.memory[this.head]
    }
    this.loopStack.unshift(loopStackEntry)
  }

  'op]'() {
    const loopStackEntry = this.loopStack[0];
    if (!loopStackEntry) {
      throw new Error('Closing unexisting loop, is \'[\' missing?')
    }

    if (loopStackEntry.enabled && !!this.memory[this.head]) {
      this.pc = loopStackEntry.pc;
    } else {
      this.loopStack.shift()
    }
  }

  'op,'() {
    const char = this.inputBuffer.shift()?.charCodeAt(0) ?? this.getEolCharByte();
    if (char === null) {
      throw new Error('EOL char is not defined');
    }
    this.memory[this.head] = char;
  }

  'op.'() {
    this.outputBuffer.push(String.fromCharCode(this.memory[this.head]));
  }

  step() {
    if (!['ready', 'running'].includes(this.status)) {
      throw new Error(`Machine in state ${this.status}, cannot continue`);
    }

    try {
      this.status = 'running';
      const op = this[`op${this.symbols[this.pc]}` as keyof BrainfuckRunner] as Function;
        if (op && this.execEnabled()) {
          op.call(this)
          this.steps += 1;
          if (this.steps > this.maxSteps) {
            throw new Error('Max steps exceeded, maybe an infinite loop?');
          }
        }
        this.pc += 1;
        if (this.pc === this.symbols.length) {
          this.status = 'completed';
        }
        return this.getCurrentState();
    } catch (e) {
      this.status = 'error'
      throw e;
    }
  }

  run() {
    while(this.pc < this.symbols.length) {
      this.step();
    }
    return this.getCurrentState();
  }

  getCurrentState(): BrainfuckRunnerState {
    return {
      status: this.status,
      program: this.symbols.join(''),
      symbols: cloneDeep(this.symbols),
      pc: this.pc,
      currentSymbol: this.symbols[this.pc] || '',
      steps: this.steps,
      memory: cloneDeep(this.memory),
      memoryHead: this.head,
      loopStack: cloneDeep(this.loopStack),
      inputBuffer: this.inputBuffer.join(''),
      outputBuffer: this.outputBuffer.join(''),
      options: {
        eolChar: this.eolChar,
        maxSteps: this.maxSteps,
        loopStackLimit: this.loopStackLimit,
        maxMemory: this.maxMemory,
        memoryWraps: this.memoryWraps,
        input: this.input,
      }
    }
  }
}