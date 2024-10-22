<script>
    import { Text, tooltip } from 'deskblocks';
    import style from './PanelList.module.css';

    export let text = "";
    export let isActive = false;
</script>

<div class={`${style.container} ${isActive ? style.active : ''}`} use:tooltip={{ content: text }}>
    <Text 
        tag="p" 
        class="dotted" 
        size="small"
        weight={isActive ? "medium" : "regular"}
    >
        {text}
    </Text>
</div>