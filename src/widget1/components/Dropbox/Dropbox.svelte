<script lang="ts">
    import { Text } from "deskblocks";
    import style from "./Dropbox.module.css";
    export let position = "leftTop";
    type Options = { text: string; id: string, departmentId: string };
    export let options: Options[] = [];
    export let onClick = (e:any, id:string) => {};

</script>

<div class={`${style.container} ${style[position]} scrollY`}>
    {#each options as data}
        <button class={`${style.list} dotted`} on:click={(e)=>onClick(e, data.id)}>
            <Text tag="p" size="small">{data.text}</Text>
        </button>
    {/each}
</div>
