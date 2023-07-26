import { useParams } from "@solidjs/router";
import styles from "./Multiroom.module.scss";
import { For, Show, createEffect, createSignal } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { replaceSrc } from "../../util/utils";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { fetchMultiroom } from "../../api/multiroom";

export function Multiroom() {
  const params = useParams<{ id: string }>();
  const [data, setData] = createSignal(null);
  createEffect(() => {
    multiRoom.scrollTop = 0;
    setData(null);
    fetchMultiroom({
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
      id: params.id,
    }).then((res) => setData({ ...res }));
  });

  let multiRoom: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.multiroom} ref={multiRoom}>
      <Show when={!data()}>
        <LoadingSpinner />
      </Show>
      <Show when={data()}>
        <div class={styles.multiroom__header}>
          <div
            class={styles.multiroom__header__image}
            style={{
              "background-color": `#${data()?.data?.[0].attributes?.uber
                ?.masterArt?.bgColor}`,
            }}
          >
            <img
              loading="lazy"
              decoding="async"
              src={replaceSrc(
                data()?.data?.[0].attributes?.uber?.masterArt?.url,
                Math.floor(
                  data()?.data?.[0].attributes?.uber?.masterArt?.width / 2,
                ),
              )}
              alt="Album Art"
              class={styles.multiroom__header__image__img}
            />
          </div>
        </div>
        <h1 class={styles.multiroom__title}>
          {data()?.data[0].attributes?.title}
        </h1>
        <div class={styles.multiroom__content}>
          <div class={styles.multiroom__content__description}>
            {data()?.data[0].attributes?.plainEditorialNotes?.standard}
          </div>
          <For each={data()?.data[0].relationships?.children?.data}>
            {(item) => (
              <MediaSelector
                type={item.relationships?.contents?.data?.[0]?.type}
                children={item.relationships?.contents?.data}
                editorialElementKind={item.attributes?.editorialElementKind}
                links={item.attributes?.links}
                displayKind="list"
                artistId={item.attributes?.artistId}
                title={item.attributes?.title}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
