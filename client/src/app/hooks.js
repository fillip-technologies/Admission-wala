import { useDispatch, useSelector } from "react-redux";

// Thin wrappers so every component imports hooks from one place.
// If you migrate to TypeScript later, type them here once.
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
