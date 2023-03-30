import type { FC } from "react"

type ValidationErrorProps = {
  msg?: string
}

export const ValidationError: FC<ValidationErrorProps> = ({ msg }) => {
  if (!msg) {
    return null
  }

  return (<em className="text-red-600">{msg}</em>)
}
