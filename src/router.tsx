import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const staticBuildPrefix = "/rubric-wise-feed/dist";
  const basepath = window.location.pathname.startsWith(`${staticBuildPrefix}/`) || window.location.pathname === staticBuildPrefix
    ? staticBuildPrefix
    : "/";

  const router = createRouter({
    routeTree,
    basepath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
