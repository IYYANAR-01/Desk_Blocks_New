<script lang="ts">
    import { Text, Checkbox, IconButton, Icon, tooltip } from 'deskblocks';
	import { IconEdit, IconDelete } from 'deskblocks/icons';
    import style from './List.module.css';

    export let id;
    export let text = 'text';
    export let needCheckbox = true;
    export let isChecked = false;
    export let handleEdit = (e:any, id:number) => {};
    export let handleDelete = (e:any, id:number) => {};
    export let handleCheck = (e:any, id:number, isChecked:boolean) => {};
    export let isEditable = false;
    export let needAction = true;

    const onEdit = (e:any) => {
        handleEdit && handleEdit(e, id);
    }
    const onDelete = (e:any) => {
        handleDelete && handleDelete(e, id);
    }
    const onCheck = (e:any) => {
        handleCheck && handleCheck(e, id, isChecked);
    }
</script>

<div class={`${style.container} ${isEditable ? style.bg : ''} dflex alignCenter`}>
    {#if needCheckbox}
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
    {#if !isEditable && needAction}
        <div class={`${style.actionBtn}`}>
            <IconButton variant="ghost" on:click={onEdit} class={style.editBtn}>
                <Icon icon={IconEdit}/>
            </IconButton>
            <IconButton variant="danger-secondary" on:click={onDelete} class={style.deleteBtn}>
                <Icon icon={IconDelete}/>
            </IconButton>
        </div>        
    {/if}
</div>