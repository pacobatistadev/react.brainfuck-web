import { useCallback, useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { initialize, step } from "../redux/programSlice"

export default function RawState() {
  const program = useAppSelector((state) => state.program)
  const dispatch = useAppDispatch()

  const [runIntervalId, setRunIntervalId] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(200);

  const handleInitClick = useCallback(() => {
    if (runIntervalId !== null) {
      clearInterval(runIntervalId);
      setRunIntervalId(null)
    }
    dispatch(initialize({
      code: ',[.,]',
      // code: `
      //   >>,[>>,]<<[
      //   [<<]>>>>[
      //   <<[>+<<+>-]
      //   >>[>+<<<<[->]>[<]>>-]
      //   <<<[[-]>>[>+<-]>>[<<<+>>>-]]
      //   >>[[<+>-]>>]<
      //   ]<<[>>+<<-]<<
      //   ]>>>>[.>>]
      // `,
      options: {
        input: 'Esto es un ecoooo',
        eolChar: String.fromCharCode(0)
      }
    }))
  }, [runIntervalId])

  const handleStepClick = useCallback(() => {
    dispatch(step())
  }, [])

  const handleRunClick = useCallback(() => {
    if (runIntervalId === null) {
      const intervalId = setInterval(() => {
        dispatch(step())
      }, speed)
      setRunIntervalId(intervalId);
    } else {
      clearInterval(runIntervalId)
      setRunIntervalId(null)
    }

  }, [runIntervalId])

  useEffect(() => {
    if (['completed', 'error'].includes(program.status) && runIntervalId !== null) {
      clearInterval(runIntervalId)
      setRunIntervalId(null)
    }
  }, [runIntervalId, program.status])
    
  return (
    <div className="flex flex-col">
      <button onClick={handleInitClick}>
        Init program
      </button>
      <button onClick={handleStepClick} disabled={runIntervalId !== null}>
        Step
      </button>
      <button onClick={handleRunClick}>
        {runIntervalId === null ? 'Run' : 'Pause'}
      </button>
      <p>
        {JSON.stringify(program)}
      </p>
    </div>
  )
}