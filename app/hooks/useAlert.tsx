'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertPayload {
    message: string;
    type: AlertType;
}

interface AlertContextValue {
    alert: AlertPayload | null;
    show: boolean;
    showAlert: (
        message: string,
        type?: AlertType,
        duration?: number
    ) => void;
    hideAlert: () => void;
}

interface AlertProviderProps {
    children: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                 Context                                    */
/* -------------------------------------------------------------------------- */

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                                Provider                                    */
/* -------------------------------------------------------------------------- */

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alert, setAlert] = useState<AlertPayload | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const hideAlert = useCallback((): void => {
        setShow(false);

        // Allow exit animation before unmounting alert
        setTimeout(() => {
            setAlert(null);
        }, 300);
    }, []);

    const showAlert = useCallback(
        (
            message: string,
            type: AlertType = 'info',
            duration: number = 5000
        ): void => {
            setAlert({ message, type });
            setShow(true);

            if (duration > 0) {
                setTimeout(hideAlert, duration);
            }
        },
        [hideAlert]
    );

    const value: AlertContextValue = {
        alert,
        show,
        showAlert,
        hideAlert,
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};

/* -------------------------------------------------------------------------- */
/*                                   Hook                                     */
/* -------------------------------------------------------------------------- */

export const useAlert = (): AlertContextValue => {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }

    return context;
};