import { useAppSelector } from "../../redux/hooks"
import Cell from "../Cell"

const SYMBOL_COLOR: { [symbol: string]: string } = {
  // Minus/less/diminish
  '<': 'pink',
  '-': 'lightcoral',

  // plus/more/augment
  '>': 'violet',
  '+': 'aquamarine',

  // input/output
  ",": 'lemonchiffon',
  '.': 'moccasin',

  // loops
  '[': 'greenyellow',
  ']': 'lightskyblue',

  'disabled': 'crimson'
}

export default function Symbols() {
  const program = useAppSelector((state) => ({
    symbols: state.program.symbols,
    pc: state.program.pc,
  }))

  return (
    <div className="flex flex-row flex-wrap gap-4 p-2">
      {program.symbols.map((val, index) => (
        <Cell changeColor={SYMBOL_COLOR[val]} key={index} value={val} selected={program.pc === index} className="py-1 w-10 text-center">
          {(value: number) => <pre>{value}</pre>}
        </Cell>
      ))}
      <Cell value="end" selected={program.pc === program.symbols.length} className="py-1 w-10 text-center">
        {(value: number) => <pre className="italic text-slate-600">{value}</pre>}
      </Cell>
    </div>
  )
}