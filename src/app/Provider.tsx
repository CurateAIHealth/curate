'use client'
import { store } from "@/Redux/store";
import { Provider } from "react-redux";

export default function WrapProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <Provider store={store}>
    {children}
   </Provider>
  );
}