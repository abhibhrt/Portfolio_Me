import { useState, useEffect, useCallback } from 'react';

export const useAlert = () => {
  const [alertState, setAlertState] = useState({ 
    message: null, 
    type: 'success', // success, error, warning, info
    visible: false
  });

  useEffect(() => {
    let timer;
    if (alertState.visible) {
      timer = setTimeout(() => {
        setAlertState(prev => ({ ...prev, visible: false }));
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alertState.visible]);

  const showAlert = useCallback((message, type = 'success') => {
    setAlertState({ message, type, visible: true });
  }, []);

  const AlertComponent = useCallback(() => (
    <div className="alert-container">
      {alertState.visible && (
        <div className={`alert-message ${alertState.type}`}>
          {alertState.message}
        </div>
      )}
    </div>
  ), [alertState.message, alertState.type, alertState.visible]);

  return { showAlert, AlertComponent };
};

const Alert = () => {
  const { AlertComponent } = useAlert();
  return <AlertComponent />;
};

export default Alert;