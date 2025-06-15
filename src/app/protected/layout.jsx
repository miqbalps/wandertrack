const React = require("react");
const { DeployButton } = require("@/components/deploy-button");
const { EnvVarWarning } = require("@/components/env-var-warning");
const AuthButton = require("@/components/auth-button");
const { ThemeSwitcher } = require("@/components/theme-switcher");
const { hasEnvVars } = require("@/lib/utils");
const Link = require("next/link");
const { default: ClientHeader } = require("@/components/ClientHeader");

function ProtectedLayout(props) {
  const children = props.children;

  return React.createElement(
    "main",
    { className: "min-h-screen flex flex-col items-center" },
    React.createElement(
      "div",
      { className: "flex-1 w-full flex flex-col gap-20 items-center" },
      React.createElement(
        "nav",
        {
          className:
            "w-full flex justify-center border-b border-b-foreground/10 h-16",
        },
        React.createElement(
          "div",
          {
            className:
              "w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm",
          },
          React.createElement(
            "div",
            { className: "flex gap-5 items-center font-semibold" },
            React.createElement(
              Link,
              { href: "/" },
              "Next.js Supabase Starter"
            ),
            React.createElement(
              "div",
              { className: "flex items-center gap-2" },
              React.createElement(DeployButton, null)
            )
          ),
          !hasEnvVars
            ? React.createElement(EnvVarWarning, null)
            : React.createElement(ClientHeader, null)
        )
      ),
      React.createElement(
        "div",
        { className: "flex-1 flex flex-col gap-20 max-w-5xl p-5" },
        children
      ),
      React.createElement(
        "footer",
        {
          className:
            "w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16",
        },
        React.createElement(
          "p",
          null,
          "Powered by ",
          React.createElement(
            "a",
            {
              href: "https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs",
              target: "_blank",
              className: "font-bold hover:underline",
              rel: "noreferrer",
            },
            "Supabase"
          )
        ),
        React.createElement(ThemeSwitcher, null)
      )
    )
  );
}

module.exports = ProtectedLayout;
