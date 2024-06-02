import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Store } from "@eduardoac-skimlinks/webext-redux";

import App from "./containers/app/App";
import { OptionsProvider } from "./contexts/OptionsContext";

const proxyStore = new Store();

const anchor = document.createElement("div");
anchor.id = "rcr-anchor";

const isGitlabPage = function() {
  const headList = Array.from(document.head.querySelectorAll('script'));
  const gonEl = headList.find(item => item.innerHTML.includes('gon.gitlab_url'));
  if (gonEl) {
    return true;
  }
  return document.querySelectorAll('[aria-label="Loading"]').length === 0;
}

const mount = () => {
  if (document.querySelector(".layout-page") !== null) {
    document
      .querySelector(".layout-page")
      .insertBefore(
        anchor,
        document.querySelector(".layout-page").childNodes[0],
      );
    proxyStore.ready().then(() => {
      render(
        <Provider store={proxyStore}>
          <OptionsProvider>
            <App />
          </OptionsProvider>
        </Provider>,
        document.getElementById("rcr-anchor"),
      );
    });
  }
};

if (isGitlabPage()) {
  mount();
} else {
  let intervalId = null;
  intervalId = setInterval(() => {
    if (isGitlabPage()) {
      clearInterval(intervalId);
      mount();
    }
  }, 500);
}

export default proxyStore;
