<script lang="ts">
    import { Text, tooltip, IconButton, Icon } from 'deskblocks';
    import { IconDelete } from 'deskblocks/icons';
    import style from './PanelList.module.css';

    export let id = "";
    export let text = "";
    export let isActive = false;
    export let needDelete = true;
    export let onClick = (e:any, id:string) => {};
    export let onDelete = (e:any, id:string) => {};

    const handleClick = (e:any) => {
        onClick && onClick(e, id);
    }
    const handleDelete = (e:any) => {
        e.stopPropagation();
        onDelete && onDelete(e, id);
    }
</script>

<button 
    class={`${style.container} ${isActive ? style.active : ''} dflex alignCenter`} 
    on:click={handleClick}
>
    <div class="flexible">
        <Text 
            tag="p" 
            class="dotted" 
            size="small"
            weight={isActive ? "medium" : "regular"}
        >
            {text}
        </Text>
    </div>
    {#if needDelete}
        <div class={`${style.deleteBtn} shrink`}>
            <IconButton variant="danger-secondary" on:click={handleDelete}>
                <Icon icon={IconDelete} />
            </IconButton>
        </div>
    {/if}
</button>