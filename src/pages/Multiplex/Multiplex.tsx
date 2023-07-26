import { Navigate, useParams } from "@solidjs/router";
import { Show, createEffect, createSignal } from "solid-js";
import { fetchMultiplex } from "../../api/multiplex";

export function Multiplex() {
  const params = useParams<{ id: string }>();
  const [data, setData] = createSignal<any>(null);

  createEffect(async () => {
    setData(null);
    await fetchMultiplex({
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
      id: params.id,
    }).then((res) => setData({ ...res }));
  });

  console.log(data());

  return (
    <Show when={data()}>
      <Navigate
        href={`/${data()
          ?.results?.target?.type?.substring(
            0,
            data()?.results?.target?.type?.length - 1,
          )
          .replace("apple-", "")}/${data()?.results?.target?.id}`}
      />
    </Show>
  );
}
