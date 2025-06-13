const { clsx } = require("clsx");
const { twMerge } = require("tailwind-merge");

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

module.exports = {
  cn,
  hasEnvVars,
};
