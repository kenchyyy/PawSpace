// RefreshContext.ts
import { createContext, useContext } from 'react';

const RefreshContext = createContext({
  refreshRooms: () => {}
});

export const useRefresh = () => useContext(RefreshContext);

export default RefreshContext;