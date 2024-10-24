<script lang="ts">
    import { Text, Checkbox, IconButton, Icon, tooltip } from 'deskblocks';
	import { IconEdit, IconDelete } from 'deskblocks/icons';
    import style from './List.module.css';

    export let id;
    export let type = 'list';
    export let text = 'text';
    export let isChecked = false;
    export let handleEdit;
    export let handleDelete;
    export let handleCheck;

    const onEdit = (e:any) => {
        handleEdit && handleEdit(e, id);
    }
    const onDelete = (e:any) => {
        handleDelete && handleDelete(e, id);
    }
    const onCheck = (e:any) => {
        handleCheck && handleCheck(e, id);
    }
</script>

<div class={`${style.container} dflex alignCenter`}>
    {#if type === 'checkList'}
        <Checkbox bind:checked={isChecked} on:change={onCheck}/>
    {/if}
    <div class="flexible">
        <Text 
            weight="medium" 
            tag="p"
            class={`${style.text} dotted`}
        >
            {text}
        </Text>
    </div>
    <div class={`${style.actionBtn}`}>
        <IconButton variant="ghost" on:click={onEdit} class={style.editBtn}>
            <Icon icon={IconEdit}/>
        </IconButton>
        <IconButton variant="danger-secondary" on:click={onDelete} class={style.deleteBtn}>
            <Icon icon={IconDelete}/>
        </IconButton>
    </div>
</div>