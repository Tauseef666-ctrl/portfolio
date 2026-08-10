import { useContext } from "react";
import { AppContext } from "../context/appContext";

export function useApp() {
  return useContext(AppContext);
}
