<script lang="ts">   
    import { getContext } from "svelte";
    import { Text, Spinner, Button } from "deskblocks";
    import Band from "../../components/Band/Band.svelte";
    import List from "../../components/List/List.svelte";
    import Textbox from "../../components/Textbox/Textbox.svelte";
    import { CONTEXT_NAME } from "../constants";
    import { setCheckList_ticket } from "../../utils/utils";
    import '../../common/common.css';
    import style from './ListPage.module.css';

    const context_data: any = getContext(CONTEXT_NAME);

    let value:string = '';
    let inputRef:any;
    let isEdited:boolean = false;
    let curEditId:string = "";
    let isSaving:boolean = false;

    let list:any =  [...$context_data.checkListData].map((data)=>{ return {...data} });

    const handleEdit = async (editedValue:any, id:any) => {
        list[id].text = editedValue;
        curEditId = "";
        value = "";
    }

    const handleEnter = (e:any) => {
        if(e.key === "Enter") {
            value = value.trim();
            if(value !== '') {
                if(curEditId !== '') {
                    handleEdit(value, curEditId);
                } else {
                    list = [{ text: value }, ...list];
                    value = '';
                }
                isEdited = true;
            }
        }
    }

    const onEdit = (e:any, id:number) => {
        curEditId = `${id}`;
        value = list[id].text;
        if (inputRef) {
            inputRef.focus();
        }
    }

    const onRemove = (e:any, id:number) => {
        list.splice(id, 1);
        list = [...list];
        isEdited = true;
    }

    const onCheck = async (e:any, id:number, isChecked:boolean) => {
        list[id].isChecked = isChecked;
        await setCheckList_ticket($context_data.ticketId, list);
    }

    const onCancel = () => {
        list = [...$context_data.checkListData].map((data)=>{ return {...data} });
        isEdited = false;
    }

    const onSave = async () => {
        isSaving = true;
        try {
            await setCheckList_ticket($context_data.ticketId, list);
            $context_data.checkListData = [...list];
            ZOHODESK.notify({
                title : "Success",
                content : `Successfully added checklist data in this ticket`,
                icon:"success",
                autoClose: false
            });
        } catch (error) {
            ZOHODESK.notify({
                title : "Error",
                content : `Something went wrong, data cannot be saved`,
                icon:"success",
                autoClose: false
            });
           throw new Error("check the save method"); 
        } finally {
            isSaving = false;
            isEdited = false;
        }
    }

</script> 

<div class={`flexible dflex flexDir`}>
    <div class={style.inputbox}>
        <Textbox
            handleKey={handleEnter}
            handleBlur={""}
            bind:value={value}
            bind:ref={inputRef}
        />
    </div>
    <div class={`${style.content} flexible scrollY`}>
        {#if list.length === 0} 
            <div class={`dflex cover alignBoth`}>
                <Text weight='bold'>No CheckList Added</Text>
            </div>
        {:else}
            {#each list as data, index}
                <List
                    text={data.text}
                    id={index}
                    handleEdit={onEdit}
                    handleDelete={onRemove}
                    isEditable={curEditId === `${index}`}
                    needAction={curEditId === ""}
                    isChecked={data.isChecked}
                    handleCheck={onCheck}
                />
            {/each}
        {/if}
    </div>
    {#if isEdited && curEditId === ""}
        <Band type="footer">
            <div slot="left">
                <Button variant="primary" on:click={onSave} disabled={isSaving}>
                    {#if isSaving}
                    <Spinner slot="left-icon" onbrand /> Saving 
                    {:else} 
                    Save
                    {/if}
                </Button>
                <Button variant="tertiary" on:click={onCancel}>Cancel</Button>
            </div>
        </Band>
    {/if}
</div>