<script lang="ts">
    import { Text, tooltip, IconButton, Icon } from 'deskblocks';
    import { IconDelete } from 'deskblocks/icons';
    import style from './PanelList.module.css';

    export let text = "";
    export let isActive = false;
    export let needDelete = true;
</script>

<div class={`${style.container} ${isActive ? style.active : ''} dflex alignCenter`} use:tooltip={{ content: text }}>
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
            <IconButton variant="danger-secondary">
                <Icon icon={IconDelete} />
            </IconButton>
        </div>
    {/if}
</div>