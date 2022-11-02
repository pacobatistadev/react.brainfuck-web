import { useAppSelector } from "../../redux/hooks"
import OutputCell from "./OutputCell"

export default function Output() {
  const output = useAppSelector((state) => state.program.outputBuffer)

  return (
    <div className="flex flex-row flex-wrap gap-4 p-2">
      <OutputCell value={output} />
    </div>
  )
}