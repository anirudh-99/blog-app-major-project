import React, { createContext } from "react";

//this context is used to track to which message the reply is being given to currently. It ensures the user is giving reply to only one message(not more than one) at a time. A context api is used here so we need not supply this info through props for every "Comment" component.
const CommentContext = createContext({});

export default CommentContext;
