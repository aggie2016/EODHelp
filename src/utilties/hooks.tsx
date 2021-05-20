import { useState } from 'react';
import { atom } from 'jotai';

/**
 * Defines the information required for each user.
 */
export interface IUserInfo {
    phoneNumber?: string;
}

/**
 * Atom that retrieves the user information saved in local storage if it exists.
 */
const initialUserInfoAtom = atom(JSON.parse(localStorage.getItem('userInformation') ?? '{}'));

/**
 * Atoms that allows the application to save user information in local storage.
 */
export const userInfoAtom = atom(
    (get) => get(initialUserInfoAtom),
    (get, set, update: any) => {
        try {
            // Save to local storage
            window.localStorage.setItem('userInformation', JSON.stringify(update));

            // Allow value to be a function so we have same API as useState
            // Save state
            set(initialUserInfoAtom, update);
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    }
);

/**
 * React hook that provides a getter and setter for a specific property in
 * local storage. The usage of this hook is similar to React.useState.
 *
 * <code>
 * <pre>
 * const [userList, setUserList] = useLocalStorage<string[]>("userList", []);
 * </pre>
 * </code>
 * @param key the property name in local storage to be read/written.
 * @param initialValue the default value to use if the property does not exist.
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };
    return [storedValue, setValue] as const;
};
