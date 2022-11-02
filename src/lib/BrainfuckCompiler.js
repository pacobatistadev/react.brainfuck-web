import { minify } from 'uglify-js'

const MINIFY_OPTIONS = {
  mangle: {
      toplevel: true,
  },
  compress: {},
  nameCache: {}
};

const HEADER = `
var memory = [0];
var memHead = 0;
var inputBuffer = process.argv[2]?.split('') ?? [];
var outputBuffer = [];

var next = () => {
  memHead += 1;
  if (!memory[memHead]) {
    memory[memHead] = 0
  }
}

var prev = () => {
  memHead -= 1;
  if (memHead < 0) {
    process.exit(1);
  }
}

var inc = () => {
  memory[memHead] = (memory[memHead] + 1) % 256
}

var dec = () => {
  memory[memHead] = (memory[memHead] + 255) % 256
}

var read = () => {
  memory[memHead] = inputBuffer.length ? inputBuffer.shift().toString().charCodeAt(0) : 255; 
}

var write = () => {
  outputBuffer.push(String.fromCharCode(memory[memHead]));
}
`;

const FOOTER = `
  console.log(outputBuffer.join(''));
`;

const OPS = {
  '>': 'next();',
  '<': 'prev();',
  '+': 'inc();',
  '-': 'dec();',
  '[': 'while (memory[memHead]) {',
  ']': '}',
  '.': 'write();',
  ',': 'read();',
}

export function compile(code) {
  const symbols = code.replace(/[^\>\<\+\-\.\,\[\]$]/g, '').split('');
  let finalCode = HEADER;

  const generatedCode = symbols.reduce((acc, sym) => {
    return acc += `${OPS[sym]}\n`;
  }, '')

  finalCode += generatedCode;
  finalCode += FOOTER;

  return(minify(finalCode, MINIFY_OPTIONS))
}