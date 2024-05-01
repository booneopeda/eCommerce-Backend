import React from "react";
// Creates a context Object
// A context object is a data type of an object that can be used to store info that can be shared to other components within the app
const UserContext = React.createContext();
//  The provider component that allows other component to consume or use the context object and supply the necessary info needed to the context object
export const UserProvider = UserContext.Provider;

export default UserContext;
