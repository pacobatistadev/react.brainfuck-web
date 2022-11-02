import { FC, ReactElement } from "react";

type Props = {
  children: ReactElement
}

const Button: FC<Props> = (props) => {
  return (
    <button>
      {props.children}
    </button>
  )
}

export default Button;