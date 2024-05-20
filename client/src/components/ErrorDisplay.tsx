/**
 * Error Display Component
 * 
 * This component is responsible for displaying error messages. It is used to inform users of any errors that may occur, 
 * such as failed network requests or invalid user inputs. The component will only render if an error message is provided; 
 * otherwise, it returns null.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

/**
 * Interface for the properties of the Error Display component
 * 
 * @property {string} [errorMessage] - Optional string that contains the error message to be displayed.
 */
type ErrorProps =  {
  errorMessage: string;
}

// Error Display Component
const ErrorDisplay: React.FC<ErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div className="justify-center items-center">
      <p className="text-error text-center">{errorMessage}</p>
    </div>
  )
}

export default ErrorDisplay;
