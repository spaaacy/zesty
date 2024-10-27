import { Alert, AlertTitle } from "../ui/alert";

const ToastDefault = ({ message }) => {
  return (
    <span>
      <Alert>
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    </span>
  );
};

export default ToastDefault;
