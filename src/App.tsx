import React, { useEffect, useState } from 'react';
import Tape from './components/Tape/Tape';
import Output from './components/Output/Output';
import Symbols from './components/Symbols/Symbols';
import Input from './components/Input/Input';
import Cell from './components/Cell';
import RawState from './components/RawState';

type ReactComponent<T = {}> = (props: {children?: React.ReactNode} & T) => React.ReactElement

export const App: ReactComponent = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 2000)
  }, [counter])


  return (
    <div className="container mx-4 py-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="border-black border-2">
            <Tape />
          </div>
        </div>
        <div className="col-span-4 row-span-4">
          <RawState />
        </div>
        <div className="col-span-8">
          <div className="border-black border-2">
            <Input />
          </div>
        </div>
        <div className="col-span-8">
          <div className="border-black border-2">
            <Output />
          </div>
        </div>
        <div className="col-span-8">
          <div className="border-black border-2">
            <Symbols />
          </div>
        </div>
      </div>
    </div>
  )
}