import { Alert, AlertTitle } from "../ui/alert";

const ToastError = ({ message }) => {
  return (
    <span>
      <Alert variant="destructive">
        <AlertTitle>Oops, something went wrong...</AlertTitle>
      </Alert>
    </span>
  );
};

export default ToastError;
