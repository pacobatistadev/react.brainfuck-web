import { useAppSelector } from "../../redux/hooks";
import Cell from "../Cell";

export default function Tape() {
  const tape = useAppSelector((state) => ({
    memory: state.program.memory,
    head: state.program.memoryHead,
  }));

  return (
    <div className="flex flex-row flex-wrap gap-4 p-2">
      {tape.memory.map((val, index) => (
        <Cell key={index} value={val} selected={tape.head === index} className="py-1 w-12 text-center">
          {(value: number) => <pre>{value}</pre>}
        </Cell>
      ))}
      <Cell value={0} disableAnimations className="py-1 w-12 text-center">
        {(value: number) => <pre className="text-slate-400">{value}</pre>}
      </Cell>
    </div>
  );
}
