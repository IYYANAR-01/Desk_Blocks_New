<script lang="ts">
    import { Text } from 'deskblocks';
    import style from './PanelList.module.css';

    export let id = "";
    export let text = "";
    export let isActive = false;
    export let onClick = (e:any, id:string) => {};

    const handleClick = (e:any) => {
        onClick && onClick(e, id);
    }
</script>

<button 
    class={`${style.container} ${isActive ? style.active : ''}`} 
    on:click={handleClick}
>
        <Text 
            tag="p" 
            class="dotted" 
            size="medium"
            weight={isActive ? "medium" : "regular"}
        >
            {text}
        </Text>
</button>