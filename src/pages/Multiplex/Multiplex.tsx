import { Navigate, useParams } from "@solidjs/router";
import { Match, Show, Switch, createSignal } from "solid-js";
import { createMultiplexStore } from "../../stores/api-store";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../components/Error/Error";
import { getMultiplexTarget } from "../../util/utils";

export function Multiplex() {
  const params = useParams<{ id: string }>();

  const multiplexStore = createMultiplexStore();
  const multiplexData = multiplexStore(params);

  const multiplex = createSignal(multiplexData()?.target);

  return (
    <Switch fallback={<div>Not found</div>}>
      <Match
        when={
          multiplexData.state === "pending" ||
          multiplexData.state === "unresolved" ||
          multiplexData.state === "refreshing"
        }
      >
        <LoadingSpinner />
      </Match>
      <Match when={multiplexData.state === "errored"}>
        <Error error={multiplexData.error} />
      </Match>
      <Match when={multiplexData.state === "ready"}>
        <Show when={multiplex}>
          <Navigate
            href={`/${getMultiplexTarget(multiplexData())
              ?.type?.substring(
                0,
                getMultiplexTarget(multiplexData())?.type?.length - 1,
              )
              .replace("apple-", "")}/${getMultiplexTarget(multiplexData())
              ?.id}`}
          />
        </Show>
      </Match>
    </Switch>
  );
}
