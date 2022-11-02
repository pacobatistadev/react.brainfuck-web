import { useAppSelector } from "../../redux/hooks";
import Cell from "../Cell";

export default function Input() {
  const input = useAppSelector((state) => ({
    original: state.program.options.input,
    buffer: state.program.inputBuffer,
  }));

  return (
    <div className="flex flex-row flex-wrap gap-4 p-2">
      <Cell value={input.buffer} changeColor="lemonchiffon" className="w-full p-1 h-8 bg-white">
        {() => (
          <div
            className={`${!input.original?.length ? "italic text-slate-400" : ""}`}
          >
            <pre className="text-slate-400 inline">
              {input.original.substring(
                0,
                input.original.length - input.buffer.length
              )}
            </pre>
            <pre className="inline">
              {input.original.length ? input.buffer : "No input provided"}
            </pre>
          </div>
        )}
      </Cell>
    </div>
  );
}
