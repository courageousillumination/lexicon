export const envSchema = {
  type: "object",
  properties: {
    NODE_ENV: {
      type: "string",
      enum: ["development", "test", "production"],
      default: "development",
    },
    HOST: {
      type: "string",
      default: "0.0.0.0",
    },
    PORT: {
      type: "number",
      default: 3000,
    },
  },
} as const;

export type Env = {
  NODE_ENV: "development" | "test" | "production";
  HOST: string;
  PORT: number;
};
