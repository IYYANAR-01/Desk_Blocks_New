<script lang="ts">
    import { Text } from "deskblocks";
    import style from "./Dropbox.module.css";
    export let position = "leftTop";
    type Options = { text: string; id: string };
    export let options: Options[] = [];
</script>

<div class={`${style.container} ${style[position]} scrollY`}>
    {#each options as data}
        <div class={`${style.list} dotted`}>
            <Text tag="p" size="small">{data.text}</Text>
        </div>
    {/each}
</div>
