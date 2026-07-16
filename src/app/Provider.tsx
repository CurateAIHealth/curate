'use client'
import { store } from "@/Redux/store";
import { Provider } from "react-redux";
import GlobalSync from "./GlobalSync";

export default function WrapProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <Provider store={store}>
    {/* <GlobalSync /> */}
    {children}
</Provider>
  );
}