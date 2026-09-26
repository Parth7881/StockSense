export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export const AUTH_INITIAL_STATE: AuthActionState = {
  status: "idle",
  message: "",
};
