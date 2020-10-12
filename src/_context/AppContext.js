import React, {useState} from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({children}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        title,
        setTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
