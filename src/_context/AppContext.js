import React, {useState} from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({children}) => {
  const [loading, setLoadingState] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [title, setTitle] = useState('');

  const setLoading = (loading = false, text = '') => {
    setLoadingState(loading);
    setLoadingText(text);
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        loadingText,
        setLoading,
        title,
        setTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
