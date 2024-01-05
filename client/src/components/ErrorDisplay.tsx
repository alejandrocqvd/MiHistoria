type ErrorProps =  {
  errorMessage?: string;
}

const ErrorDisplay: React.FC<ErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div className="justify-center items-center">
      <p className="text-error text-center">{errorMessage}</p>
    </div>
  )
}

export default ErrorDisplay;
